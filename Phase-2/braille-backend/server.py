# server.py (or app.py)

from flask import Flask, request, jsonify
from flask_cors import CORS
import json

# Import the specific translation modules
# NOTE: Ensure Grade1Translation.py and Grade2Translation.py are in the same directory as this file.
from Grade1Translation import translate_grade1
from Grade2Translation import translate_grade2

app = Flask(__name__)
# IMPORTANT: This enables CORS, allowing your React frontend on one port (e.g., 3000) 
# to talk to this Python server on another port (e.g., 5000).
CORS(app) 

# --- API Endpoints ---

@app.route('/api/translate/grade1', methods=['POST'])
def handle_grade1_translation():
    try:
        # Get JSON data from the request body
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"message": "Missing 'text' in request body"}), 400
            
        input_text = data['text']
        
        # Call the dedicated Grade 1 translation module
        braille_output = translate_grade1(input_text)
        
        # Return the result in the format the frontend expects: { "braille": "..." }
        return jsonify({"braille": braille_output})

    except Exception as e:
        app.logger.error(f"Error during Grade 1 translation: {e}")
        return jsonify({"message": "Internal Server Error during translation"}), 500


@app.route('/api/translate/grade2', methods=['POST'])
def handle_grade2_translation():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"message": "Missing 'text' in request body"}), 400
            
        input_text = data['text']
        
        # Call the dedicated Grade 2 translation module
        braille_output = translate_grade2(input_text)
        
        return jsonify({"braille": braille_output})

    except Exception as e:
        app.logger.error(f"Error during Grade 2 translation: {e}")
        return jsonify({"message": "Internal Server Error during translation"}), 500


if __name__ == '__main__':
    # Flask runs on port 5000 by default, matching the BASE_URL in your React code
    app.run(debug=True, port=5000)
