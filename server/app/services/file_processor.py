from fastapi import UploadFile, File
from .pdf_service import extract_text_from_pdf


async def process_file(file: UploadFile):

    content = await file.read()

    if file.content_type == "application/pdf":

        text = extract_text_from_pdf(content)

        return {
            "filename": file.filename,
            "type": "pdf",
            "content": text,
        }

    return {
        "filename": file.filename,
        "type": "unknown",
    }
