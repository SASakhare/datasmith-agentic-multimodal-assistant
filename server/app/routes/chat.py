from fastapi import APIRouter, Form
from fastapi import UploadFile, File
from agent.intent_detector import detect_intent
from agent.tool_router import execute_tool
from rag.chunker import chunk_text
from rag.retriever import retrieve_relevant_chunks
from rag.vector_store import add_documents_to_vector_store
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

    combine_context = "\n\n".join(
        f"""src :{file['filename']} \n type:{file['type']} \n content:{file["content"]}"""
        for file in process_file_info
    )

    # intent = await detect_intent(query)

    # result = await execute_tool(
    #     intent_given=intent, content=combine_context, query=query
    # )

    chunks = await chunk_text(combine_context)

    print("total chunks created : ", len(chunks))

    # await add_documents_to_vector_store(chunks)

    relevant_chunks = await retrieve_relevant_chunks(query)

    print("total relevant chunks found : ", len(relevant_chunks))

    return {
        "query": query,
        # "intent": intent,
        # "result": result,
        # "chunks": chunks,
        # "context": combine_context,
        "relevant_chunks": relevant_chunks,
    }
