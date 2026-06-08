from fastapi import UploadFile, File
from app.services.pdf_service import extract_text_from_pdf
from app.services.image_service import extract_text_from_image
from app.services.audio_service import transcribe_audio


async def process_file(file: UploadFile):

    content = await file.read()

    if file.content_type == "application/pdf":

        text = extract_text_from_pdf(content)

        return {
            "filename": file.filename,
            "type": "pdf",
            "content": text,
        }

    if file.content_type.startswith("image/"): # type: ignore

        text = extract_text_from_image(content)

        return {
            "filename": file.filename,
            "type": "image",
            "content": text,
        }

    if file.content_type.startswith("audio/"): # type: ignore
        text = transcribe_audio(content)

        return {
            "filename": file.filename,
            "type": "audio",
            "content": (
                "Audio appears to contain little or no spoken content."
                if (not text or len(text.split()) < 3)
                else text
            ),
        }

    return {
        "filename": file.filename,
        "type": "unknown",
        "content": "",
    }
