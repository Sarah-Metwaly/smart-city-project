"""
Aman Smart City — Intelligent Surveillance System
==================================================
Real-time video analysis using YOLO for detecting security incidents
(fire, weapons, theft, falls, crowd surges) with cloud alert delivery.

Usage:
    python surveillance_system.py

Configuration:
    Copy .env.example to .env and fill in your credentials.
"""

from __future__ import annotations

import json
import logging
import os
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import cv2
import cloudinary
import cloudinary.uploader
from ultralytics import YOLO

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("surveillance.log", encoding="utf-8"),
    ],
)
logger = logging.getLogger("aman.surveillance")


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class CameraConfig:
    device_id: str = "camera_zone_01"
    location_name: str = "Main Square - Gate 4"
    coordinates: tuple[float, float] = (31.200092, 29.918738)
    video_source: str = "9667219-hd_1080_1920_25fps.mp4"   # 0 for webcam
    crowd_threshold: int = 10


@dataclass(frozen=True)
class ModelConfig:
    weights_path: str = "best.pt"
    confidence_threshold: float = 0.25
    # Class names that count as a person present in the scene
    person_classes: frozenset[str] = frozenset(
        {"normal", "fight", "theft", "fall", "weapon"}
    )


@dataclass(frozen=True)
class CloudinaryConfig:
    cloud_name: str = field(default_factory=lambda: os.environ["CLOUDINARY_CLOUD_NAME"])
    api_key: str = field(default_factory=lambda: os.environ["CLOUDINARY_API_KEY"])
    api_secret: str = field(default_factory=lambda: os.environ["CLOUDINARY_API_SECRET"])
    upload_folder: str = "aman_smart_city"


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------

INCIDENT_TYPES = ("fire", "weapon", "theft", "fall", "crowd")

# Maps incident type → emergency services to notify
NOTIFICATION_MAP: dict[str, list[str]] = {
    "fire":   ["Security_Team", "Fire_Station"],
    "weapon": ["Security_Team", "Police"],
    "theft":  ["Security_Team", "Police"],
    "fall":   ["Security_Team", "Ambulance"],
    "crowd":  ["Security_Team"],
}

# Maps incident type → priority score (higher = more urgent)
PRIORITY_MAP: dict[str, int] = {
    "fire":   9,
    "weapon": 8,
    "theft":  8,
    "fall":   7,
    "crowd":  5,
}


@dataclass
class IncidentState:
    """Tracks whether an incident was already saved to avoid duplicate uploads."""
    cloud_url: Optional[str] = None
    local_path: Optional[str] = None

    @property
    def saved(self) -> bool:
        return self.cloud_url is not None or self.local_path is not None

    @property
    def url(self) -> Optional[str]:
        return self.cloud_url or self.local_path


@dataclass
class FrameDetections:
    fire:   dict = field(default_factory=lambda: {"detected": False, "conf": 0.0})
    weapon: dict = field(default_factory=lambda: {"detected": False, "conf": 0.0})
    theft:  dict = field(default_factory=lambda: {"detected": False, "conf": 0.0})
    fall:   dict = field(default_factory=lambda: {"detected": False, "conf": 0.0})
    people_count: int = 0

    def update(self, class_name: str, conf: float, person_classes: frozenset[str]) -> None:
        if class_name in ("fire", "weapon", "theft", "fall"):
            entry = getattr(self, class_name)
            entry["detected"] = True
            entry["conf"] = max(entry["conf"], conf)
        if class_name in person_classes:
            self.people_count += 1

    def is_crowded(self, threshold: int) -> bool:
        return self.people_count > threshold


# ---------------------------------------------------------------------------
# Cloud uploader
# ---------------------------------------------------------------------------

class AlertUploader:
    """Handles saving alert frames locally and uploading them to Cloudinary."""

    def __init__(self, cfg: CloudinaryConfig, alerts_dir: Path = Path("alerts")) -> None:
        self._cfg = cfg
        self._alerts_dir = alerts_dir
        self._alerts_dir.mkdir(exist_ok=True)

        cloudinary.config(
            cloud_name=cfg.cloud_name,
            api_key=cfg.api_key,
            api_secret=cfg.api_secret,
            secure=True,
        )
        logger.info("Cloudinary configured (cloud: %s)", cfg.cloud_name)

    def save_and_upload(
        self,
        incident_type: str,
        frame,
        timestamp: str,
    ) -> IncidentState:
        state = IncidentState()
        local_path = self._alerts_dir / f"{incident_type}_incident_{timestamp}.jpg"

        cv2.imwrite(str(local_path), frame)
        state.local_path = str(local_path)
        logger.info("Alert frame saved locally → %s", local_path)

        try:
            response = cloudinary.uploader.upload(
                str(local_path),
                folder=self._cfg.upload_folder,
            )
            state.cloud_url = response["secure_url"]
            logger.info("✅ Uploaded to cloud → %s", state.cloud_url)
        except Exception as exc:
            logger.warning("❌ Cloud upload failed (%s). Using local path as fallback.", exc)

        return state


# ---------------------------------------------------------------------------
# JSON report builder
# ---------------------------------------------------------------------------

def build_report(
    camera: CameraConfig,
    detections: FrameDetections,
    incident_states: dict[str, IncidentState],
    crowd_threshold: int,
) -> dict:
    """Assembles the structured JSON payload for downstream consumers."""

    is_crowded = detections.is_crowded(crowd_threshold)
    active_incidents = [
        inc for inc in ("fire", "weapon", "theft", "fall")
        if detections.__dict__[inc]["detected"]
    ] + (["crowd"] if is_crowded else [])

    # Aggregate notifications and priority
    targets: set[str] = set()
    priority_score = 0
    for inc in active_incidents:
        targets.update(NOTIFICATION_MAP.get(inc, []))
        priority_score = max(priority_score, PRIORITY_MAP.get(inc, 0))

    def _url(key: str) -> Optional[str]:
        return incident_states[key].url if incident_states[key].saved else None

    return {
        "header": {
            "device_id": camera.device_id,
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "location": {
                "name": camera.location_name,
                "coordinates": list(camera.coordinates),
            },
        },
        "detections": {
            "fire_analysis": {
                "detected": detections.fire["detected"],
                "confidence": round(detections.fire["conf"], 2),
                "priority": "HIGH" if detections.fire["detected"] else "LOW",
                "danger_level": "Critical" if detections.fire["detected"] else "Safe",
                "incident_image_url": _url("fire"),
            },
            "weapon_analysis": {
                "detected": detections.weapon["detected"],
                "confidence": round(detections.weapon["conf"], 2),
                "priority": "HIGH" if detections.weapon["detected"] else "LOW",
                "items": ["weapon"] if detections.weapon["detected"] else [],
                "incident_image_url": _url("weapon"),
            },
            "behavior_analysis": {
                "theft_detection": {
                    "alert": detections.theft["detected"],
                    "confidence": round(detections.theft["conf"], 2),
                    "priority": "HIGH" if detections.theft["detected"] else "LOW",
                    "incident_image_url": _url("theft"),
                },
                "crowd_management": {
                    "is_crowded": is_crowded,
                    "count": detections.people_count,
                    "threshold": crowd_threshold,
                    "priority": "MEDIUM" if is_crowded else "LOW",
                    "incident_image_url": _url("crowd"),
                },
                "medical_emergency": {
                    "person_down": detections.fall["detected"],
                    "confidence": round(detections.fall["conf"], 2),
                    "priority": "HIGH" if detections.fall["detected"] else "LOW",
                    "status": (
                        "Person down detected"
                        if detections.fall["detected"]
                        else "All persons standing"
                    ),
                    "incident_image_url": _url("fall"),
                },
            },
        },
        "system_action": {
            "priority_score": priority_score,
            "trigger_alarm": priority_score > 0,
            "active_incidents": active_incidents,
            "notification_targets": sorted(targets),
        },
    }


# ---------------------------------------------------------------------------
# Main surveillance loop
# ---------------------------------------------------------------------------

class SurveillanceSystem:
    """
    Orchestrates video capture, YOLO inference, alert management,
    and JSON report generation.
    """

    def __init__(
        self,
        camera_cfg: CameraConfig,
        model_cfg: ModelConfig,
        cloud_cfg: CloudinaryConfig,
    ) -> None:
        self._camera_cfg = camera_cfg
        self._model_cfg = model_cfg
        self._uploader = AlertUploader(cloud_cfg)

        # One IncidentState per type — upload only once per incident lifecycle
        self._incident_states: dict[str, IncidentState] = {
            t: IncidentState() for t in INCIDENT_TYPES
        }

        logger.info("Loading YOLO model from '%s' …", model_cfg.weights_path)
        self._model = YOLO(model_cfg.weights_path)
        logger.info("Model loaded successfully.")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _process_frame(self, frame) -> tuple[FrameDetections, any]:
        """Run inference on a single frame and return detections + annotated image."""
        results = self._model(frame, conf=self._model_cfg.confidence_threshold, verbose=False)
        annotated = results[0].plot()

        detections = FrameDetections()
        for box in results[0].boxes:
            class_name = self._model.names[int(box.cls[0])]
            conf = float(box.conf[0])
            detections.update(class_name, conf, self._model_cfg.person_classes)

        return detections, annotated

    def _handle_alerts(
        self,
        detections: FrameDetections,
        annotated_frame,
        timestamp: str,
    ) -> None:
        """Save & upload alert images for any newly detected incidents."""
        triggers = {
            "fire":   detections.fire["detected"],
            "weapon": detections.weapon["detected"],
            "theft":  detections.theft["detected"],
            "fall":   detections.fall["detected"],
            "crowd":  detections.is_crowded(self._camera_cfg.crowd_threshold),
        }
        for incident_type, triggered in triggers.items():
            if triggered and not self._incident_states[incident_type].saved:
                logger.warning("🚨 ALERT: %s detected!", incident_type.upper())
                self._incident_states[incident_type] = self._uploader.save_and_upload(
                    incident_type, annotated_frame, timestamp
                )

    # ------------------------------------------------------------------
    # Public entry point
    # ------------------------------------------------------------------

    def run(self) -> None:
        """Open the video source and start the main processing loop."""
        source = self._camera_cfg.video_source
        cap = cv2.VideoCapture(int(source) if source.isdigit() else source)

        if not cap.isOpened():
            logger.error("Cannot open video source: %s", source)
            sys.exit(1)

        logger.info("System running — press 'q' in the preview window to stop.")

        try:
            while cap.isOpened():
                success, frame = cap.read()
                if not success:
                    logger.info("End of stream or connection lost.")
                    break

                timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
                detections, annotated_frame = self._process_frame(frame)

                self._handle_alerts(detections, annotated_frame, timestamp)

                report = build_report(
                    self._camera_cfg,
                    detections,
                    self._incident_states,
                    self._camera_cfg.crowd_threshold,
                )
                logger.debug("Report:\n%s", json.dumps(report, indent=2))

                # Only log to stdout when something is happening
                if report["system_action"]["trigger_alarm"]:
                    print(json.dumps(report, indent=2))

                cv2.imshow("Aman Smart City — Live Feed", annotated_frame)
                if cv2.waitKey(30) & 0xFF == ord("q"):
                    logger.info("User requested shutdown.")
                    break

        finally:
            cap.release()
            cv2.destroyAllWindows()
            logger.info("Resources released. System stopped.")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    # Load .env file if python-dotenv is installed (optional but recommended)
    try:
        from dotenv import load_dotenv
        load_dotenv()
        logger.info(".env file loaded.")
    except ImportError:
        pass  # dotenv is optional; credentials can come from the environment directly

    camera_cfg  = CameraConfig()
    model_cfg   = ModelConfig()
    cloud_cfg   = CloudinaryConfig()

    system = SurveillanceSystem(camera_cfg, model_cfg, cloud_cfg)
    system.run()


if __name__ == "__main__":
    main()
