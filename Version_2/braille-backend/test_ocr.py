from PIL import Image
import pytesseract

# Set path to tesseract.exe
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe"

# Load an image and extract text
image_path = "sample.jpg"  # put any image file with text here
text = pytesseract.image_to_string(Image.open(image_path))

print("Extracted Text:")
print(text)
