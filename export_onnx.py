from ultralytics import YOLO

print("Loading the PyTorch model...")
model = YOLO("best.pt")

# التحويل لـ ONNX 
print("Exporting to ONNX format...")
model.export(format="onnx", dynamic=False, half=True) # half=True بيقلل الحجم جداً

print("✅ Export complete!")