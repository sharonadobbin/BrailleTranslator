This repository contains the Phase 1 implementation of our Final Year Project titled "AI Powered Automatic Braille Translation".

🎯 Project Objective
To develop an intelligent system that automatically translates text (typed or spoken) into Braille script for visually impaired users.

🚧 Phase 1 Highlights
✅ Text-to-Braille Conversion Logic:

Converts normal text (including alphabets, digits, and common punctuation) to Unicode Braille script.

Handles capitalization and numeric values following Braille formatting rules.

✅ Simple GUI using Tkinter:

Text input area for users to type or load text files.

Braille output display area with real-time translation.

Utility buttons: Load Text, Copy Braille, Save Output, Clear, and Speak.

✅ Basic Voice Input Feature:

Records 5 seconds of audio input.

Uses Google's Speech Recognition API to transcribe speech to text.

Converts the transcribed text to Braille automatically.

❗ Note:
AI modules (e.g., for intelligent context-aware translation or OCR-based input) are NOT implemented in this phase. These will be integrated in future phases.

This is a foundational version focusing purely on functional Python logic and a prototype GUI.

🔧 Tech Stack
Python 3.x

Tkinter (GUI)

SpeechRecognition (for voice-to-text)

SoundDevice & SoundFile (for audio recording)

📂 Files in this Phase
gui_braille.py: Complete Python script with GUI, text-to-Braille logic, and voice input.

💡 Future Plans (Phase 2+)
Integration of AI models for smarter language processing.

Optical Character Recognition (OCR) for image-to-Braille conversion.

Enhanced user interface and cross-platform support.
