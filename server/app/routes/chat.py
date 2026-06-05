from fastapi import APIRouter, Form
from fastapi import UploadFile, File
from agent.intent_detector import detect_intent
from tools.summarizer import summarize_content
from services.file_processor import process_file
from typing import List, Optional


router = APIRouter()



@router.post("/")
async def chat(
    query: str = Form(...), files: Optional[List[UploadFile]] = File(default=None)
):
    process_file_info = []
    for file in files or []:
        info = await process_file(file)
        process_file_info.append(info)

    # combine_context = "\n\n".join(
    #     f"""src :{file['filename']} \n type:{file['type']} \n content:{file["content"]}"""
    #     for file in process_file_info
    # )

    intent = await detect_intent(query)

    return {
        "query": query,
        "intent": intent
    }
