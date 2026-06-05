from fastapi import APIRouter, Form
from fastapi import UploadFile, File
from services.file_processor import process_file
from typing import List,Optional


router = APIRouter()


# @router.post("/")
# async def chat(file: UploadFile = File(...)):

#     pdf_bytes = await file.read()
#     text = extract_text_from_pdf(pdf_bytes)

#     return {"filename": file.filename, "content": text}


@router.post("/")
async def chat(
    query: str = Form(...),
    files: Optional[List[UploadFile]] = File(default=None)
):
    file_info = []
    for file in (files or []):
        info = await process_file(file)
        file_info.append(info)

    return {
        "query": query,
        "files": file_info
    }