import sys

sys.path.insert(0, "/home/sce_2026/ncnn/build/python")

import cv2
import time
import json
import os
import asyncio
import threading
import aiohttp
import av
import numpy as np
from datetime import datetime, timezone
from picamera2 import Picamera2

import ncnn.ncnn as ncnn
import paho.mqtt.client as mqtt
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

from aiortc import (
    RTCPeerConnection,
    RTCConfiguration,
    RTCIceServer,
    RTCSessionDescription,
    VideoStreamTrack
)

print("NCNN LOADED")

# =======================
# CONFIG
# =======================
SERVER_IP = "mediamtx-7w2t.onrender.com"
SERVER_PORT = "443"
MTX_ENDPOINT = "cam1"
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
FRAME_RATE = 15

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
net = ncnn.Net()
net.load_param("/home/sce_2026/GraduationProject/SmartCityModel/model.ncnn.param")
net.load_model("/home/sce_2026/GraduationProject/SmartCityModel/model.ncnn.bin")

names = {
    0: "fall",
    1: "fight",
    2: "fire",
    3: "normal",
    4: "theft",
    5: "weapon"
}

# =======================
# Shared Frame (??? ??? AI ???? Stream)
# =======================
latest_frame = None
frame_lock = threading.Lock()

# =======================
# Camera
# =======================
picam2 = Picamera2()
picam2.configure(picam2.create_video_configuration(
    main={"size": (FRAME_WIDTH, FRAME_HEIGHT)},
    controls={"FrameRate": FRAME_RATE}
))
picam2.start()
print("Camera Started...")


# =======================
# Upload image
# =======================
def upload_image(path):
    res = cloudinary.uploader.upload(path, folder="smart_city")
    return res["secure_url"]


# =======================
# JSON Builder
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
        "fire": 9, "weapon": 8, "theft": 8, "fall": 7,
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
# WebRTC Video Track
# =======================
class PiCameraVideoStreamTrack(VideoStreamTrack):
    kind = "video"

    async def recv(self):
        pts, time_base = await self.next_timestamp()

        with frame_lock:
            frame = latest_frame.copy() if latest_frame is not None else np.zeros((FRAME_HEIGHT, FRAME_WIDTH, 3),
                                                                                  dtype=np.uint8)

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        video_frame = av.VideoFrame.from_ndarray(frame_rgb, format="rgb24")
        video_frame.pts = pts
        video_frame.time_base = time_base
        return video_frame


# =======================
# WebRTC Streaming
# =======================
async def publish_stream():
    print("[INFO] Connecting to MediaMTX...")
    config = RTCConfiguration(
        iceServers=[RTCIceServer(urls=["stun:stun.l.google.com:19302"])]
    )
    pc = RTCPeerConnection(configuration=config)
    pc.addTrack(PiCameraVideoStreamTrack())

    offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    whip_url = f"https://{SERVER_IP}/{MTX_ENDPOINT}/whip"
    print(f"[INFO] Sending to: {whip_url}")

    async with aiohttp.ClientSession() as session:
        async with session.post(
                whip_url,
                data=pc.localDescription.sdp,
                headers={"Content-Type": "application/sdp"}
        ) as resp:
            if resp.status != 201:
                print(f"[ERROR] WHIP failed: HTTP {resp.status}")
                print(await resp.text())
                return
            answer_sdp = await resp.text()
            await pc.setRemoteDescription(
                RTCSessionDescription(sdp=answer_sdp, type="answer")
            )
            print("[SUCCESS] WebRTC Stream is Live!")

    try:
        await asyncio.sleep(86400)
    except Exception:
        pass
    finally:
        await pc.close()


def start_webrtc():
    asyncio.run(publish_stream())


# =======================
# AI Detection Loop
# =======================
def detection_loop():
    global latest_frame
    print("System Started...")

    while True:
        frame = picam2.capture_array()
        frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

        with frame_lock:
            latest_frame = frame.copy()

        img = cv2.resize(frame, (640, 640))
        img = np.ascontiguousarray(img, dtype=np.uint8)
        mat = ncnn.Mat.from_pixels(img, ncnn.Mat.PixelType.PIXEL_BGR, 640, 640)

        with net.create_extractor() as ex:
            ex.input("in0", mat)
            _, out = ex.extract("out0")
            output = np.array(out)

        detected_class = None
        confidence = 0

        if output is not None and len(output) > 0:
            scores = output[:, -6:]
            best_row = np.argmax(np.max(scores, axis=1))
            cls_id = int(np.argmax(scores[best_row]))
            confidence = float(np.max(scores[best_row]))

            if confidence > 0.5 and cls_id in names:
                detected_class = names[cls_id]

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        image_url = None

        if detected_class and detected_class != "normal":
            img_path = f"/home/sce_2026/GraduationProject/detections/detection_{timestamp}.jpg"
            cv2.imwrite(img_path, frame)
            image_url = upload_image(img_path)
            print("ALERT SENT!")
        else:
            detected_class = None
            confidence = 0

        json_payload = build_json(detected_class, confidence, image_url, timestamp)
        client.publish(TOPIC, json.dumps(json_payload))
        print(json.dumps(json_payload, indent=2))

        time.sleep(2)


# =======================
# MAIN
# =======================
if __name__ == "__main__":
    # ???? ??? WebRTC ?? thread ?????
    webrtc_thread = threading.Thread(target=start_webrtc, daemon=True)
    webrtc_thread.start()

    # ???? ??? AI Detection ?? ??? main thread
    try:
        detection_loop()
    except KeyboardInterrupt:
        print("Stopped.")
    finally:
        picam2.stop()
