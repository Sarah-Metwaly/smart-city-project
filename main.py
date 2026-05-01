import cv2
import json
import os
from datetime import datetime
from ultralytics import YOLO

# 1. إنشاء فولدر لحفظ صور الحوادث
os.makedirs('alerts', exist_ok=True)

print("Loading model...")
model = YOLO('best.pt') # أو 'best_ncnn_model' لو بتستخدمي NCNN

video_path = '9667219-hd_1080_1920_25fps.mp4'
cap = cv2.VideoCapture(video_path)

print("System is running... Press 'q' to stop.")

# 2. قاموس لحفظ مسارات الصور (عشان نصور أول مرة بس لكل نوع حادثة)
saved_image_urls = {
    "fire": None,
    "weapon": None,
    "theft": None,
    "fall": None,
    "crowd": None
}

crowd_threshold = 10 # الحد الأقصى المسموح للزحام

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("Video ended or connection lost.")
        break

    # إدخال الفريم للموديل
    results = model(frame)
    annotated_frame = results[0].plot()

    # 3. متغيرات لتسجيل حالة الفريم الحالي
    detections = {
        "fire": {"detected": False, "conf": 0.0},
        "weapon": {"detected": False, "conf": 0.0},
        "theft": {"detected": False, "conf": 0.0},
        "fall": {"detected": False, "conf": 0.0}
    }
    people_count = 0
    
    # 4. تحليل المخرجات من الموديل
    for box in results[0].boxes:
        class_id = int(box.cls[0])
        conf = float(box.conf[0])
        class_name = model.names[class_id]

        # تحديث حالة الحوادث
        if class_name in detections:
            detections[class_name]["detected"] = True
            # نحتفظ بأعلى نسبة ثقة (Confidence)
            if conf > detections[class_name]["conf"]:
                detections[class_name]["conf"] = conf

        # عد الأشخاص (أي فئة بتدل على شخص بنعدها للزحام)
        if class_name in ['normal', 'fight', 'theft', 'fall', 'weapon']:
            people_count += 1

    is_crowded = people_count > crowd_threshold

    # 5. دالة صغيرة لحفظ الصورة لو دي أول مرة نكتشف فيها الحادثة
    timestamp_str = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
    
    def save_alert_image(incident_type):
        if saved_image_urls[incident_type] is None: # لو لسه متصورتش
            path = f"alerts/{incident_type}_incident_{timestamp_str}.jpg"
            cv2.imwrite(path, annotated_frame)
            saved_image_urls[incident_type] = path # حفظ المسار
            print(f"\n🚨 ALERT: {incident_type.upper()} detected! Image saved: {path}\n")

    # فحص وحفظ الصور إذا لزم الأمر
    if detections["fire"]["detected"]: save_alert_image("fire")
    if detections["weapon"]["detected"]: save_alert_image("weapon")
    if detections["theft"]["detected"]: save_alert_image("theft")
    if detections["fall"]["detected"]: save_alert_image("fall")
    if is_crowded: save_alert_image("crowd")

    # 6. تجهيز قرارات النظام (System Actions)
    targets = set()
    priority_score = 0
    
    if detections["fire"]["detected"]:
        targets.update(["Security_Team", "Fire_Station"])
        priority_score = max(priority_score, 9)
    if detections["weapon"]["detected"] or detections["theft"]["detected"]:
        targets.update(["Security_Team", "Police"])
        priority_score = max(priority_score, 8)
    if detections["fall"]["detected"]:
        targets.update(["Security_Team", "Ambulance"])
        priority_score = max(priority_score, 7)
    if is_crowded:
        targets.add("Security_Team")
        priority_score = max(priority_score, 5)

    # 7. بناء الـ JSON الشامل
    output_data = {
        "header": {
            "device_id": "camera_zone_01",
            "timestamp": datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
            "location": {
                "name": "Main Square - Gate 4",
                "coordinates": [31.200092, 29.918738]
            }
        },
        "detections": {
            "fire_analysis": {
                "detected": detections["fire"]["detected"],
                "priority": "HIGH" if detections["fire"]["detected"] else "LOW",
                "incident_image_url": saved_image_urls["fire"] if detections["fire"]["detected"] else None,
                "confidence": round(detections["fire"]["conf"], 2),
                "danger_level": "Critical" if detections["fire"]["detected"] else "Safe"
            },
            "weapon_analysis": {
                "detected": detections["weapon"]["detected"],
                "priority": "HIGH" if detections["weapon"]["detected"] else "LOW",
                "incident_image_url": saved_image_urls["weapon"] if detections["weapon"]["detected"] else None,
                "items": ["weapon"] if detections["weapon"]["detected"] else [],
                "confidence": round(detections["weapon"]["conf"], 2)
            },
            "behavior_analysis": {
                "theft_detection": {
                    "alert": detections["theft"]["detected"],
                    "priority": "HIGH" if detections["theft"]["detected"] else "LOW",
                    "incident_image_url": saved_image_urls["theft"] if detections["theft"]["detected"] else None,
                    "confidence": round(detections["theft"]["conf"], 2)
                },
                "crowd_management": {
                    "is_crowded": is_crowded,
                    "priority": "MEDIUM" if is_crowded else "LOW",
                    "incident_image_url": saved_image_urls["crowd"] if is_crowded else None,
                    "count": people_count,
                    "threshold": crowd_threshold
                },
                "medical_emergency": {
                    "person_down": detections["fall"]["detected"],
                    "priority": "HIGH" if detections["fall"]["detected"] else "LOW",
                    "incident_image_url": saved_image_urls["fall"] if detections["fall"]["detected"] else None,
                    "status": "Person down detected" if detections["fall"]["detected"] else "All persons standing"
                }
            }
        },
        "system_action": {
            "priority_score": priority_score,
            "trigger_alarm": priority_score > 0,
            "notification_target": list(targets)
        }
    }

    # طباعة الـ JSON وعرض الفيديو
    print(json.dumps(output_data, indent=2))
    cv2.imshow("Aman Smart City - Live Feed", annotated_frame)

    if cv2.waitKey(30) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()