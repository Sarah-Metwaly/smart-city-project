import cv2
import time
import json
import os
import subprocess
import shlex
import threading
import numpy as np
from datetime import datetime, timezone
from picamera2 import Picamera2

import paho.mqtt.client as mqtt
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from ultralytics import YOLO

print("MODEL LOADING...")

load_dotenv()
CLOUD_NAME = os.getenv("CLOUD_NAME")
API_KEY    = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")

cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET,
    secure=True
)

broker = "i5111178.ala.eu-central-1.emqxsl.com"
port   = 8883
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set("sce_2026", "362026@sce")
client.tls_set()
client.connect(broker, port)
TOPIC = "ai/fullDetection"

MODEL_PATH     = "/home/sce_2026/GraduationProject/SmartCityModel/best_s_ncnn_model"
IMGSZ          = 480
CONF_THRESHOLD = 0.4

model = YOLO(MODEL_PATH, task="detect")

WEAPON_CLASS_IDS = {0: "senjata_api", 1: "senjata_tajam"}
FIRE_CLASS_ID    = 2

print("MODEL LOADED:", model.names)

latest_frame = None
frame_lock   = threading.Lock()

# Separate lock + frame for the annotated/display stream
latest_display_frame = None
display_lock         = threading.Lock()

picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration(main={"size": (640, 480)}))
picam2.start()
print("Camera Started...")

os.makedirs("/home/sce_2026/GraduationProject/detections", exist_ok=True)

def upload_image(path):
    res = cloudinary.uploader.upload(path, folder="smart_city")
    return res["secure_url"]

def build_json(weapon_detected, weapon_confidence, weapon_type, weapon_image_url,
               fire_detected, fire_confidence, fire_image_url):
    detections = {
        "fire":   {"detected": fire_detected,   "conf": fire_confidence},
        "weapon": {"detected": weapon_detected, "conf": weapon_confidence},
        "theft":  {"detected": False,           "conf": 0.0},
        "fall":   {"detected": False,           "conf": 0.0},
    }
    notification_map = {
        "fire":   ["Security_Team", "Fire_Station"],
        "weapon": ["Security_Team", "Police"],
        "theft":  ["Security_Team", "Police"],
        "fall":   ["Security_Team", "Ambulance"],
    }
    priority_map = {"fire": 9, "weapon": 8, "theft": 8, "fall": 7}

    active_incidents    = []
    notification_target = set()
    priority_score      = 0

    for k, v in detections.items():
        if v["detected"]:
            active_incidents.append(k)
            notification_target.update(notification_map.get(k, []))
            priority_score = max(priority_score, priority_map.get(k, 0))

    return {
        "header": {
            "device_id": "camera_zone_01",
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "location": {"name": "Main Square - Gate 4", "coordinates": [31.200092, 29.918738]}
        },
        "detections": {
            "fire_analysis": {
                "detected":           fire_detected,
                "confidence":         fire_confidence,
                "priority":           "HIGH" if fire_detected else "LOW",
                "danger_level":       "Critical" if fire_detected else "Safe",
                "incident_image_url": fire_image_url if fire_detected else None
            },
            "weapon_analysis": {
                "detected":           weapon_detected,
                "confidence":         weapon_confidence,
                "priority":           "HIGH" if weapon_detected else "LOW",
                "items":              [weapon_type] if weapon_detected else [],
                "incident_image_url": weapon_image_url if weapon_detected else None
            },
            "behavior_analysis": {
                "theft_detection":   {"alert": False, "confidence": 0.0, "priority": "LOW", "incident_image_url": None},
                "medical_emergency": {"person_down": False, "status": "All persons standing", "priority": "LOW", "incident_image_url": None}
            }
        },
        "system_action": {
            "priority_score":      priority_score,
            "trigger_alarm":       priority_score > 0,
            "active_incidents":    active_incidents,
            "notification_target": list(notification_target)
        }
    }

# =======================
# Camera Capture Thread (runs at full speed, ~30fps)
# =======================
def capture_loop():
    global latest_frame
    while True:
        frame = picam2.capture_array()
        frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)
        with frame_lock:
            latest_frame = frame

# =======================
# RTSP Stream Thread
# =======================
RTSP_URL = "rtsp://20.233.89.255:8554/camera"

# =======================
# RTSP Stream Thread
# =======================
RTSP_URL = "rtsp://20.233.89.255:8554/camera"

def stream_loop():
    while True:
        try:
            ffmpeg_cmd = shlex.split(
                f"ffmpeg -f rawvideo -pix_fmt bgr24 -s 640x480 -r 15 -i pipe:0 "
                f"-pix_fmt yuv420p "
                f"-c:v libx264 -tune zerolatency -preset ultrafast "
                f"-g 15 -keyint_min 15 -sc_threshold 0 "
                f"-x264-params bframes=0:force-cfr=1 "
                f"-bufsize 256k -maxrate 1500k "
                f"-flush_packets 1 "
                f"-f rtsp -rtsp_transport tcp {RTSP_URL}")

            ffmpeg_proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
            print(f"[STREAM] Started ? {RTSP_URL}")

            while True:
                # Prefer annotated frame if available, fallback to raw
                with display_lock:
                    frame = latest_display_frame.copy() if latest_display_frame is not None else None

                if frame is None:
                    with frame_lock:
                        frame = latest_frame.copy() if latest_frame is not None else None

                if frame is None:
                    time.sleep(0.01)
                    continue

                # But if colors appear inverted on the viewer side, swap here:
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                try:
                    ffmpeg_proc.stdin.write(frame.tobytes())
                    time.sleep(1 / 20)  # Throttle to 15fps instead of spinning
                except BrokenPipeError:
                    break

            ffmpeg_proc.terminate()
        except Exception as e:
            print(f"[STREAM] Error: {e}")

        print("[STREAM] Restarting in 3 seconds...")
        time.sleep(3)


# =======================
# AI Detection Thread (runs every 2s, doesn't block streaming)
# =======================
def detection_loop():
    global latest_display_frame

    while True:
        with frame_lock:
            if latest_frame is None:
                time.sleep(0.1)
                continue
            frame = latest_frame.copy()

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results   = model.predict(frame_rgb, imgsz=IMGSZ, conf=CONF_THRESHOLD, verbose=False)
        r         = results[0]

        weapon_detected   = False
        weapon_confidence = 0.0
        weapon_type       = None
        weapon_image_url  = None
        fire_detected     = False
        fire_confidence   = 0.0
        fire_image_url    = None

        if len(r.boxes) > 0:
            weapon_boxes = [b for b in r.boxes if int(b.cls.item()) in WEAPON_CLASS_IDS]
            fire_boxes   = [b for b in r.boxes if int(b.cls.item()) == FIRE_CLASS_ID]
            timestamp    = datetime.now().strftime("%Y%m%d_%H%M%S")
            annotated    = None

            if weapon_boxes:
                best_weapon       = max(weapon_boxes, key=lambda b: float(b.conf))
                cls_id            = int(best_weapon.cls.item())
                weapon_confidence = float(best_weapon.conf.item())
                weapon_type       = WEAPON_CLASS_IDS.get(cls_id, "unknown")
                weapon_detected   = True

                if annotated is None:
                    annotated = r.plot()
                img_path         = f"/home/sce_2026/GraduationProject/detections/weapon_{timestamp}.jpg"
                cv2.imwrite(img_path, annotated)
                weapon_image_url = upload_image(img_path)
                print(f"ALERT! weapon={weapon_type} conf={weapon_confidence:.2f}")

            if fire_boxes:
                best_fire       = max(fire_boxes, key=lambda b: float(b.conf))
                fire_confidence = float(best_fire.conf.item())
                fire_detected   = True

                if annotated is None:
                    annotated = r.plot()
                img_path       = f"/home/sce_2026/GraduationProject/detections/fire_{timestamp}.jpg"
                cv2.imwrite(img_path, annotated)
                fire_image_url = upload_image(img_path)
                print(f"ALERT! fire conf={fire_confidence:.2f}")

            #  Push annotated frame to stream
            if annotated is not None:
                annotated_bgr = cv2.cvtColor(annotated, cv2.COLOR_RGB2BGR)
                with display_lock:
                    latest_display_frame = annotated_bgr

            time.sleep(0.5)
            with display_lock:
                latest_display_frame = None

        json_payload = build_json(
            weapon_detected, weapon_confidence, weapon_type, weapon_image_url,
            fire_detected, fire_confidence, fire_image_url
        )
        client.publish(TOPIC, json.dumps(json_payload))
        print(json.dumps(json_payload, indent=2))

        time.sleep(2)

# =======================
# MAIN
# =======================
capture_thread   = threading.Thread(target=capture_loop,   daemon=True)
stream_thread    = threading.Thread(target=stream_loop,    daemon=True)
detection_thread = threading.Thread(target=detection_loop, daemon=True)

capture_thread.start()
stream_thread.start()
detection_thread.start()

print("System Started...")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Shutting down...")
    picam2.stop()
