from uuid import uuid4
from fastapi import APIRouter, Form, HTTPException
from fastapi import UploadFile, File
from agent.intent_detector import detect_intent
from agent.planner import create_plan
from agent.state import AgentState
from nodes.retriever_node import retriever_node
from rag.chunker import chunk_text
from rag.key_word_extraction import extract_keywords
from rag.retriever import retrieve_relevant_chunks
from rag.vector_store import add_documents_to_vector_store
from repositories.conversation_repository import build_agent_memory
from repositories.message_repository import get_conversation_history
from services.chat_history_service import store_chat
from tools.retriver_prompt_generator import get_relevant_queries
from tools.summarizer import summarize_content
from services.file_processor import process_file
from typing import List, Optional
from agent.graph import app_graph
from dependencies.auth_dependency import get_current_user
from fastapi import Depends

router = APIRouter()


@router.post("/{conversation_id}")
async def chat(
    conversation_id: str,
    query: str = Form(...),
    files: Optional[List[UploadFile]] = File(default=None),
    current_user=Depends(get_current_user),
):

    try:

        agent_memory = await build_agent_memory(conversation_id)

        process_file_info = []
        for file in files or []:
            info = await process_file(file)
            process_file_info.append(info)

        available_knowledge = []

        if len(process_file_info) > 0:

            combine_context = "\n\n".join(
                f"""src :{file['filename']} \n type:{file['type']} \n content:{file["content"]}"""
                for file in process_file_info
            )

            for f in process_file_info:
                keyword = extract_keywords(f["content"])
                keyword_sentence = " ".join(keyword)
                preview = f["content"][:300]
                word_count = len(f["content"].split(" "))
                text = f"filename:{f['filename']} , type : {f['type']} , keyword :[{keyword_sentence}] , preview(first 300 words) : {preview} , word_count : {word_count} "
                available_knowledge.append(text)

            chunk_docs = await chunk_text(combine_context)

            await add_documents_to_vector_store(chunk_docs)

        state = AgentState(
            query=query,
            conversation_id=str(uuid4()),
            current_step=0,
            conversation_history=agent_memory["messages"],
            plan=None,
            retrieved_context="",
            final_answer="",
            need_human_approval=False,
            human_approved=False,
            available_knowledge=available_knowledge,
            conversation_summary=agent_memory["summary"],
            web_context="",
            need_web_search=False,
        )

        response = await app_graph.ainvoke(state.model_dump())  # type: ignore

        await store_chat(
            conversation_id=conversation_id,
            user_message=query,
            assistant_message=response["final_answer"],
        )

        return {
            "query": query,
            "response": response,
            "conversation_id": conversation_id,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
