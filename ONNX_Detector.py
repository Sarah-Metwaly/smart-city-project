import cv2
import time
import json
import os
from datetime import datetime, timezone

import onnxruntime as ort
import numpy as np
import paho.mqtt.client as mqtt
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

print("ONNX LOADED")

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
sess = ort.InferenceSession(
    "/home/sce_2026/GraduationProject/SmartCityModel/best.onnx"
)

names = {
    0: "fall",
    1: "fight",
    2: "fire",
    3: "normal",
    4: "theft"
}


# =======================
# Upload image
# =======================
def upload_image(path):
    res = cloudinary.uploader.upload(path, folder="smart_city")
    return res["secure_url"]


# =======================
# JSON Builder (BACK FORMAT)
# =======================
def build_json(detected_class, confidence, image_url, timestamp):
    detections = {
        "fire": {"detected": False, "conf": 0.0},
        "weapon": {"detected": False, "conf": 0.0},
        "theft": {"detected": False, "conf": 0.0},
        "fall": {"detected": False, "conf": 0.0},
    }

    if detected_class in detections:
        detections[detected_class]["detected"] = True
        detections[detected_class]["conf"] = confidence

    notification_map = {
        "fire": ["Security_Team", "Fire_Station"],
        "weapon": ["Security_Team", "Police"],
        "theft": ["Security_Team", "Police"],
        "fall": ["Security_Team", "Ambulance"],
    }

    priority_map = {
        "fire": 9,
        "weapon": 8,
        "theft": 8,
        "fall": 7,
    }

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
            "location": {
                "name": "Main Square - Gate 4",
                "coordinates": [31.200092, 29.918738]
            }
        },

        "detections": {
            "fire_analysis": {
                "detected": detections["fire"]["detected"],
                "confidence": detections["fire"]["conf"],
                "priority": "HIGH" if detections["fire"]["detected"] else "LOW",
                "danger_level": "Critical" if detections["fire"]["detected"] else "Safe",
                "incident_image_url": image_url if detected_class == "fire" else None
            },

            "weapon_analysis": {
                "detected": detections["weapon"]["detected"],
                "confidence": detections["weapon"]["conf"],
                "priority": "HIGH" if detections["weapon"]["detected"] else "LOW",
                "items": ["weapon"] if detections["weapon"]["detected"] else [],
                "incident_image_url": image_url if detected_class == "weapon" else None
            },

            "behavior_analysis": {
                "theft_detection": {
                    "alert": detections["theft"]["detected"],
                    "confidence": detections["theft"]["conf"],
                    "priority": "HIGH" if detections["theft"]["detected"] else "LOW",
                    "incident_image_url": image_url if detected_class == "theft" else None
                },

                "medical_emergency": {
                    "person_down": detections["fall"]["detected"],
                    "status": "Person down detected" if detections["fall"]["detected"] else "All persons standing",
                    "priority": "HIGH" if detections["fall"]["detected"] else "LOW",
                    "incident_image_url": image_url if detected_class == "fall" else None
                }
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
# Preprocess
# =======================
def preprocess(frame):
    img = cv2.resize(frame, (480, 480))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img.astype(np.float32) / 255.0
    img = np.transpose(img, (2, 0, 1))
    img = np.expand_dims(img, axis=0)
    return img


# =======================
# MAIN LOOP
# =======================
from picamera2 import Picamera2

picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration(main={"size": (640, 640)}))
picam2.start()

print("System Started...")

while True:
    frame = picam2.capture_array()
    frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

    # ONNX Inference
    input_tensor = preprocess(frame)
    output = sess.run(None, {"images": input_tensor})[0][0]  # shape: [300, 6]

    detected_class = None
    confidence = 0

    if len(output) > 0:
        best_idx = np.argmax(output[:, 4])
        best = output[best_idx]
        conf = float(best[4])
        cls_id = int(best[5])

        if conf > 0.5 and cls_id in names:
            detected_class = names[cls_id]
            confidence = conf

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    if detected_class and detected_class != "normal":
        img_path = f"/home/sce_2026/GraduationProject/detections/detection_{timestamp}.jpg"
        cv2.imwrite(img_path, frame)
        image_url = upload_image(img_path)
        print("ALERT SENT!")
    else:
        detected_class = None
        confidence = 0
        image_url = None

    cv2.imshow("Smart City", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    json_payload = build_json(detected_class, confidence, image_url, timestamp)
    client.publish(TOPIC, json.dumps(json_payload))
    print(json.dumps(json_payload, indent=2))
    time.sleep(2)

picam2.stop()
cv2.destroyAllWindows()