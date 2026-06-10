import os
from PIL import Image
import pytesseract
import io


pytesseract.pytesseract.tesseract_cmd = os.getenv(
    "TESSERACT_PATH"
)  # Set the path to tesseract executable


def extract_text_from_image(image_bytes: bytes) -> str:
    # print(os.getenv("TESSERACT_PATH"))
    
    # image = Image.open(io.BytesIO(image_bytes))
    # text = pytesseract.image_to_string(image)
    return "image text"
