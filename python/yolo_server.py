from flask import Flask, request, jsonify
from PIL import Image
import io
import base64
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect():
    data = request.get_json()
    if 'image' not in data:
        return jsonify({'error': 'No image data'}), 400

    image_data = base64.b64decode(data['image'])
    image = Image.open(io.BytesIO(image_data))

    results = model.predict(image)
    objects = [r.name for r in results[0].boxes.data]

    return jsonify({'objects': objects})

app.run(host='0.0.0.0', port=5000)
