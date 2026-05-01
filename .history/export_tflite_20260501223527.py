from ultralytics import YOLO

# 1. تحميل الموديل الأساسي بتاعك
print("Loading the PyTorch model...")
model = YOLO("best.pt")

# 2. تحويل الموديل لـ TFLite
# استخدمنا int8=True عشان نصغر حجم الموديل لأقصى درجة ونسرعه جداً على الراسبيري باي
print("Exporting to TFLite format (this might take a few minutes)...")
model.export(format="tflite", int8=True)

print("✅ Export complete!")