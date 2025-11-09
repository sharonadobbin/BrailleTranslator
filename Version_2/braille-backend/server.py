# server.py (or app.py)

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from PIL import Image
import io
import os
import tempfile

from BrailleToText import braille_to_text

# Configure Tesseract path
import pytesseract

# 👇 Add this line right after importing pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# NLP Integration
from nlp_processor import preprocess_text_for_braille, postprocess_braille_to_text

# Translation Modules
from Grade1Translation import translate_grade1
from Grade2Translation import translate_grade2

app = Flask(__name__)
CORS(app)  # Allow frontend to talk to this backend


# =========================================
# TEXT → BRAILLE (Grade 1)
# =========================================
@app.route('/api/translate/grade1', methods=['POST'])
def handle_grade1_translation():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"message": "Missing 'text' in request body"}), 400

        input_text = data['text']

        # NLP preprocessing before translation
        processed_text = preprocess_text_for_braille(input_text)

        # Perform Grade 1 translation
        braille_output = translate_grade1(processed_text)

        return jsonify({"braille": braille_output})

    except Exception as e:
        app.logger.error(f"Error during Grade 1 translation: {e}")
        return jsonify({"message": "Internal Server Error during translation"}), 500


# =========================================
# TEXT → BRAILLE (Grade 2)
# =========================================
@app.route('/api/translate/grade2', methods=['POST'])
def handle_grade2_translation():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"message": "Missing 'text' in request body"}), 400

        input_text = data['text']

        # NLP preprocessing before translation
        processed_text = preprocess_text_for_braille(input_text)

        # Perform Grade 2 translation
        braille_output = translate_grade2(processed_text)

        return jsonify({"braille": braille_output})

    except Exception as e:
        app.logger.error(f"Error during Grade 2 translation: {e}")
        return jsonify({"message": "Internal Server Error during translation"}), 500


# =========================================
# BRAILLE → TEXT
# =========================================
@app.route('/api/braille-to-text', methods=['POST'])
def handle_braille_to_text():
    try:
        data = request.get_json()
        if not data or 'braille' not in data:
            return jsonify({"message": "Missing 'braille' in request body"}), 400

        braille_input = data['braille']
        translated_text = braille_to_text(braille_input)

        # Optional NLP postprocessing
        clean_text = postprocess_braille_to_text(translated_text)

        return jsonify({"text": clean_text})

    except Exception as e:
        app.logger.error(f"Error during Braille-to-Text translation: {e}")
        return jsonify({"message": "Internal Server Error during Braille-to-Text"}), 500


# =========================================
# OCR IMAGE → TEXT (Improved Version)
# =========================================
@app.route('/api/ocr', methods=['POST'])
def ocr_image():
    try:
        if 'file' not in request.files:
            return jsonify({'message': 'No file uploaded'}), 400

        file = request.files['file']

        if file.filename == "":
            return jsonify({'message': 'Empty filename'}), 400

        # ✅ Save to a temporary file regardless of format
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        # ✅ Open and convert image safely
        img = Image.open(tmp_path)

        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGB")

        # ✅ Convert to grayscale and binarize for better OCR accuracy
        img = img.convert("L")
        img = img.point(lambda x: 0 if x < 140 else 255, "1")

        # ✅ Run OCR
        extracted_text = pytesseract.image_to_string(img, lang="eng")

        # ✅ Clean up temporary file
        os.remove(tmp_path)

        text_cleaned = extracted_text.strip()

        return jsonify({'text': text_cleaned})

    except Exception as e:
        app.logger.error(f"OCR error: {e}")
        return jsonify({'message': f'OCR failed: {str(e)}'}), 500


# =========================================
# RUN APP
# =========================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)
