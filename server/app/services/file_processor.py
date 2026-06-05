from fastapi import UploadFile, File
from .pdf_service import extract_text_from_pdf
from .image_service import extract_text_from_image


async def process_file(file: UploadFile):

    content = await file.read()

    if file.content_type == "application/pdf":

        text = extract_text_from_pdf(content)

        return {
            "filename": file.filename,
            "type": "pdf",
            "content": text,
        }

    if file.content_type.startswith("image/"):

        text = extract_text_from_image(content)

        return {
            "filename": file.filename,
            "type": "image",
            "content": text,
        }

    return {
        "filename": file.filename,
        "type": "unknown",
    }
