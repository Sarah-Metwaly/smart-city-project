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
# Point this at the NCNN export FOLDER (not individual .param/.bin files)
MODEL_PATH = "/home/sce_2026/GraduationProject/SmartCityModel/best_s_ncnn_model"
IMGSZ = 480  # must match whatever size you exported with
CONF_THRESHOLD = 0.4  # tune per-class if needed -- see note at bottom of file

model = YOLO(MODEL_PATH, task="detect")

# REAL class names from THIS model -- 3 classes now, not 2.
# {0: 'senjata_api', 1: 'senjata_tajam', 2: 'fire'} = firearm, sharp weapon, fire.
# 0 and 1 both map to "weapon"; 2 maps to "fire" -- these are now handled as
# SEPARATE, INDEPENDENT detections (a frame could have either, neither, or both).
WEAPON_CLASS_IDS = {0: "senjata_api", 1: "senjata_tajam"}
FIRE_CLASS_ID = 2

print("MODEL LOADED:", model.names)


# =======================
# Upload image
# =======================
def upload_image(path):
    res = cloudinary.uploader.upload(path, folder="smart_city")
    return res["secure_url"]


# =======================
# JSON Builder -- now handles weapon AND fire independently
# =======================
def build_json(weapon_detected, weapon_confidence, weapon_type, weapon_image_url,
               fire_detected, fire_confidence, fire_image_url):
    detections = {
        "fire": {"detected": fire_detected, "conf": fire_confidence},
        "weapon": {"detected": weapon_detected, "conf": weapon_confidence},
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
                "detected": fire_detected,
                "confidence": fire_confidence,
                "priority": "HIGH" if fire_detected else "LOW",
                "danger_level": "Critical" if fire_detected else "Safe",
                "incident_image_url": fire_image_url if fire_detected else None
            },
            "weapon_analysis": {
                "detected": weapon_detected,
                "confidence": weapon_confidence,
                "priority": "HIGH" if weapon_detected else "LOW",
                "items": [weapon_type] if weapon_detected else [],
                "incident_image_url": weapon_image_url if weapon_detected else None
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

    results = model.predict(frame, imgsz=IMGSZ, conf=CONF_THRESHOLD, verbose=False)
    r = results[0]

    weapon_detected = False
    weapon_confidence = 0.0
    weapon_type = None
    weapon_image_url = None

    fire_detected = False
    fire_confidence = 0.0
    fire_image_url = None

    if len(r.boxes) > 0:
        weapon_boxes = [b for b in r.boxes if int(b.cls.item()) in WEAPON_CLASS_IDS]
        fire_boxes = [b for b in r.boxes if int(b.cls.item()) == FIRE_CLASS_ID]

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        annotated = None  # compute once, reuse for whichever incident(s) fire this frame

        if weapon_boxes:
            best_weapon = max(weapon_boxes, key=lambda b: float(b.conf))
            cls_id = int(best_weapon.cls.item())
            weapon_confidence = float(best_weapon.conf.item())
            weapon_type = WEAPON_CLASS_IDS.get(cls_id, "unknown")
            weapon_detected = True

            if annotated is None:
                annotated = r.plot()
            img_path = f"/home/sce_2026/GraduationProject/detections/weapon_{timestamp}.jpg"
            cv2.imwrite(img_path, annotated)
            weapon_image_url = upload_image(img_path)
            print(f"ALERT SENT! weapon={weapon_type} conf={weapon_confidence:.2f}")

        if fire_boxes:
            best_fire = max(fire_boxes, key=lambda b: float(b.conf))
            fire_confidence = float(best_fire.conf.item())
            fire_detected = True

            if annotated is None:
                annotated = r.plot()
            img_path = f"/home/sce_2026/GraduationProject/detections/fire_{timestamp}.jpg"
            cv2.imwrite(img_path, annotated)
            fire_image_url = upload_image(img_path)
            print(f"ALERT SENT! fire conf={fire_confidence:.2f}")

    json_payload = build_json(
        weapon_detected, weapon_confidence, weapon_type, weapon_image_url,
        fire_detected, fire_confidence, fire_image_url)
    client.publish(TOPIC, json.dumps(json_payload))
    print(json.dumps(json_payload, indent=2))

    cv2.imshow("Smart City", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    time.sleep(2)

picam2.stop()
cv2.destroyAllWindows()

# NOTE on CONF_THRESHOLD:
# We found this model has very different real-world reliability per class on
# medium/large objects: firearm ~75% hit rate, fire ~70%, knife only ~30%.
# A single shared threshold of 0.4 is a compromise across very different
# classes. If you want to tune per-class, switch to checking
# best_weapon.conf / best_fire.conf against separate thresholds (e.g. a
# lower knife-specific threshold to catch more real knives, accepting more
# false positives in trade) instead of relying on the single CONF_THRESHOLD
# passed into model.predict().