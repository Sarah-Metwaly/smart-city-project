import sys
import cv2
import time
import json
import os
from datetime import datetime, timezone
import numpy as np
import paho.mqtt.client as mqtt
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from ultralytics import YOLO  # <-- handles NCNN loading + proper box decoding/NMS internally

print("MODEL LOADING...")

# =======================
# ENV
# =======================
load_dotenv()
CLOUD_NAME = os.getenv("CLOUD_NAME")
API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")

# =======================
# Cloudinary
# =======================
cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET,
    secure=True
)

# =======================
# MQTT
# =======================
broker = "i5111178.ala.eu-central-1.emqxsl.com"
port = 8883
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set("sce_2026", "362026@sce")
client.tls_set()
client.connect(broker, port)
TOPIC = "ai/fullDetection"

# =======================
# Model
# =======================
# Point this at the NCNN export FOLDER (not individual .param/.bin files) --
# the folder Ultralytics created, e.g. "best_ncnn_model_640"
MODEL_PATH = "/home/sce_2026/GraduationProject/SmartCityModel/best_ncnn_model_640"
IMGSZ = 640  # must match whatever size you exported with
CONF_THRESHOLD = 0.4  # tune this -- see note at bottom of file

model = YOLO(MODEL_PATH, task="detect")

# REAL class names from THIS model -- do not substitute a different scheme here.
# {0: 'senjata_api', 1: 'senjata_tajam'} = firearm, sharp weapon.
# Both map to your system's "weapon" incident category.
WEAPON_CLASS_NAMES = {0: "senjata_api", 1: "senjata_tajam"}

print("MODEL LOADED:", model.names)


# =======================
# Upload image
# =======================
def upload_image(path):
    res = cloudinary.uploader.upload(path, folder="smart_city")
    return res["secure_url"]


# =======================
# JSON Builder (same structure as before, weapon-focused)
# =======================
def build_json(weapon_detected, confidence, weapon_type, image_url):
    detections = {
        "fire": {"detected": False, "conf": 0.0},
        "weapon": {"detected": weapon_detected, "conf": confidence},
        "theft": {"detected": False, "conf": 0.0},
        "fall": {"detected": False, "conf": 0.0},
    }

    notification_map = {
        "fire": ["Security_Team", "Fire_Station"],
        "weapon": ["Security_Team", "Police"],
        "theft": ["Security_Team", "Police"],
        "fall": ["Security_Team", "Ambulance"],
    }
    priority_map = {"fire": 9, "weapon": 8, "theft": 8, "fall": 7}

    active_incidents = []
    notification_target = set()
    priority_score = 0
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
                "detected": False, "confidence": 0.0, "priority": "LOW",
                "danger_level": "Safe", "incident_image_url": None
            },
            "weapon_analysis": {
                "detected": weapon_detected,
                "confidence": confidence,
                "priority": "HIGH" if weapon_detected else "LOW",
                "items": [weapon_type] if weapon_detected else [],
                "incident_image_url": image_url if weapon_detected else None
            },
            "behavior_analysis": {
                "theft_detection": {"alert": False, "confidence": 0.0, "priority": "LOW", "incident_image_url": None},
                "medical_emergency": {"person_down": False, "status": "All persons standing", "priority": "LOW",
                                      "incident_image_url": None}
            }
        },
        "system_action": {
            "priority_score": priority_score,
            "trigger_alarm": priority_score > 0,
            "active_incidents": active_incidents,
            "notification_target": list(notification_target)
        }
    }


# =======================
# MAIN LOOP
# =======================
from picamera2 import Picamera2

picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration(main={"size": (IMGSZ, IMGSZ)}))
picam2.start()

os.makedirs("/home/sce_2026/GraduationProject/detections", exist_ok=True)
print("System Started...")

while True:
    frame = picam2.capture_array()
    frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)  # 4 channels -> 3 channels
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Proper object detection inference -- Ultralytics handles NCNN box decoding + NMS internally
    results = model.predict(frame, imgsz=IMGSZ, conf=CONF_THRESHOLD, verbose=False)
    r = results[0]

    weapon_detected = False
    confidence = 0.0
    weapon_type = None
    image_url = None

    if len(r.boxes) > 0:
        # If multiple weapons detected in frame, report the highest-confidence one
        best_box = max(r.boxes, key=lambda b: float(b.conf))
        cls_id = int(best_box.cls.item())
        confidence = float(best_box.conf.item())
        weapon_type = WEAPON_CLASS_NAMES.get(cls_id, "unknown")
        weapon_detected = True

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        img_path = f"/home/sce_2026/GraduationProject/detections/detection_{timestamp}.jpg"

        # Save annotated frame (boxes drawn) so you can visually verify what triggered the alert
        annotated = r.plot()
        cv2.imwrite(img_path, annotated)
        image_url = upload_image(img_path)
        print(f"ALERT SENT! {weapon_type} conf={confidence:.2f}")

    json_payload = build_json(weapon_detected, confidence, weapon_type, image_url)
    client.publish(TOPIC, json.dumps(json_payload))
    print(json.dumps(json_payload, indent=2))

    cv2.imshow("Smart City", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    time.sleep(2)

picam2.stop()
cv2.destroyAllWindows()

# NOTE on CONF_THRESHOLD:
# We found this model misses small/distant weapons (especially under ~20x20px
# in frame) and has weaker knife recall than firearm recall on truly unseen
# footage (validation mAP was optimistic due to train/val frame leakage --
# see earlier discussion). At 0.4 you'll get fewer false alarms but may miss
# more real weapons; lower it (e.g. 0.25) if you're testing and want to see
# what it's catching, raise it if you're getting too many false alerts in
# real deployment.