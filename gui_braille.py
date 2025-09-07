import tkinter as tk
from tkinter import filedialog, ttk
import sounddevice as sd
import soundfile as sf
import speech_recognition as sr
import threading

# Maps English characters and digits to Braille Unicode.
braille_map = {
    'a': '\u2801', 'b': '\u2803', 'c': '\u2809', 'd': '\u2819', 'e': '\u2811',
    'f': '\u280b', 'g': '\u281b', 'h': '\u2813', 'i': '\u280a', 'j': '\u281a',
    'k': '\u2805', 'l': '\u2807', 'm': '\u280d', 'n': '\u281d', 'o': '\u2815',
    'p': '\u280f', 'q': '\u281f', 'r': '\u2817', 's': '\u280e', 't': '\u281e',
    'u': '\u2825', 'v': '\u2827', 'w': '\u283a', 'x': '\u282d', 'y': '\u283d',
    'z': '\u2835', ' ': '\u2800', '\n': '\n',
    ',': '\u2802', '.': '\u2832', '!': '\u2816', '?': '\u2826',
    '\'': '\u2804', '"': '\u2836',
    '-': '\u2824', '–': '\u2824', '—': '\u2824',
    '+': '\u2816', '=': '\u2836', '*': '\u2822',
    '(': '\u2837', ')': '\u2838',
    '[': '\u2828', ']': '\u2834',
    '{': '\u2829', '}': '\u2833'
}

digit_map = {
    '1': '\u2801', '2': '\u2803', '3': '\u2809', '4': '\u2819', '5': '\u2811',
    '6': '\u280b', '7': '\u281b', '8': '\u2813', '9': '\u280a', '0': '\u281a'
}

# Converts a string of text to Braille representation.
def text_to_braille(text):
    braille_output = ''
    i = 0
    while i < len(text):
        char = text[i]
        if char.isupper():
            braille_output += '\u2820' + braille_map.get(char.lower(), '?')
            i += 1
        elif char.isdigit():
            braille_output += '\u283c'
            while i < len(text) and text[i].isdigit():
                braille_output += digit_map.get(text[i], '?')
                i += 1
            braille_output += '\u2800'
        elif char == '\n':
            braille_output += '\n'
            i += 1
        else:
            braille_output += braille_map.get(char, '?')
            i += 1
    return braille_output.strip()

# Reads text input and translates it to Braille.
def translate():
    input_text = entry.get("1.0", tk.END).strip()
    braille = text_to_braille(input_text)
    output_label.config(text=braille)
    status_var.set("Translated.")

# Clears the input and output text areas.
def clear_text():
    entry.delete("1.0", tk.END)
    output_label.config(text="")
    status_var.set("Cleared input and output.")

# Copies the Braille text to the system clipboard.
def copy_to_clipboard():
    braille_text = output_label.cget("text")
    if braille_text:
        root.clipboard_clear()
        root.clipboard_append(braille_text)
        status_var.set("Braille copied to clipboard.")

# Event handler for real-time translation.
def translate_event(event):
    translate()

# Saves the Braille output to a text file.
def save_to_file():
    braille_text = output_label.cget("text")
    if braille_text:
        file_path = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
        )
        if file_path:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(braille_text)
            status_var.set(f"Saved to file: {file_path}")

# Loads a text file and translates its content.
def load_text_file():
    file_path = filedialog.askopenfilename(
        filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
    )
    if file_path:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        entry.delete("1.0", tk.END)
        entry.insert(tk.END, content)
        translate()
        status_var.set(f"Loaded and translated file: {file_path}")

# Records voice, transcribes it, and then translates the text.
def record_and_transcribe():
    threading.Thread(target=_record_and_transcribe_thread, daemon=True).start()

# The core logic for voice recording and transcription.
def _record_and_transcribe_thread():
    fs = 44100
    seconds = 5
    filename = "output.wav"

    status_var.set("Recording voice input...")
    root.update()

    try:
        recording = sd.rec(int(seconds * fs), samplerate=fs, channels=1)
        sd.wait()
        sf.write(filename, recording, fs, format='WAV', subtype='PCM_16')

        status_var.set("Recording complete. Transcribing...")

        recognizer = sr.Recognizer()
        with sr.AudioFile(filename) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
            entry.delete("1.0", tk.END)
            entry.insert(tk.END, text)
            translate()
            status_var.set("Voice translated to Braille.")
    except Exception as e:
        status_var.set(f"Error: {str(e)}")

# --- GUI setup ---
root = tk.Tk()
root.title("AI-Powered Braille Translator")
root.geometry("800x600")

# Sets up the input text area and its label.
input_frame = tk.Frame(root, padx=10, pady=10)
input_frame.pack(fill=tk.BOTH, expand=True)

tk.Label(input_frame, text="Enter text to convert to Braille:", font=("Helvetica", 12)).pack(pady=5)
entry = tk.Text(input_frame, height=10, width=80, font=("Helvetica", 12), relief=tk.GROOVE, bd=2)
entry.pack(pady=5, fill=tk.BOTH, expand=True)
entry.bind('<KeyRelease>', translate_event)

# Sets up the output label for the Braille text.
output_frame = tk.Frame(root, padx=10, pady=10)
output_frame.pack(fill=tk.BOTH, expand=True)

tk.Label(output_frame, text="Braille Output:", font=("Helvetica", 12)).pack(pady=5)
output_label = tk.Label(
    output_frame, text="", font=("Segoe UI Symbol", 24),
    wraplength=780, justify="left", relief=tk.GROOVE, bd=2, bg="#f0f0f0"
)
output_label.pack(pady=10, fill=tk.BOTH, expand=True)

# Contains all the control buttons for the app.
button_frame = tk.Frame(root, pady=10)
button_frame.pack()

load_button = ttk.Button(button_frame, text="Load Text File", command=load_text_file)
load_button.grid(row=0, column=0, padx=5, pady=5)

copy_button = ttk.Button(button_frame, text="Copy Braille", command=copy_to_clipboard)
copy_button.grid(row=0, column=1, padx=5, pady=5)

clear_button = ttk.Button(button_frame, text="Clear", command=clear_text)
clear_button.grid(row=0, column=2, padx=5, pady=5)

save_button = ttk.Button(button_frame, text="Save Braille to File", command=save_to_file)
save_button.grid(row=0, column=3, padx=5, pady=5)

speak_button = ttk.Button(button_frame, text="Speak & Transcribe", command=record_and_transcribe)
speak_button.grid(row=0, column=4, padx=5, pady=5)

# Displays the current status of the application.
status_var = tk.StringVar()
status_var.set("Ready")
status_label = tk.Label(root, textvariable=status_var, bd=1, relief=tk.SUNKEN, anchor="w", font=("Helvetica", 10))
status_label.pack(side=tk.BOTTOM, fill=tk.X)

root.mainloop()
