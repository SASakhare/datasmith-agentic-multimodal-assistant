from fastapi import HTTPException
from app.agent.state import Message
from app.services.llm_service import llm
from app.prompts.retriver_prompt import query_generation_prompt
from pydantic import BaseModel, Field
from typing import List



class Query(BaseModel):

    query: str


class QueryList(BaseModel):

    queries: List[Query]


llm_with_QueryList = llm.with_structured_output(QueryList)


async def get_relevant_queries(
    query: str, available_knowledge: list[str], history: list[Message], summary: str
):

    try:

        available_knowledge_text = "\n".join(available_knowledge)

        history_text = "\n".join(
            [f"{msg.role.upper()}: {msg.content}" for msg in history]
        )

        prompt = f"""
        {query_generation_prompt}

        Available Knowledge:
        {available_knowledge_text if available_knowledge_text else "No uploaded knowledge available."}

        Conversation Summary:
        {summary if summary else "No conversation summary available."}

        Recent Conversation History:
        {history_text if history_text else "No recent conversation history available."}

        Current User Query:
        {query}
        """

        response = llm_with_QueryList.invoke([prompt])

        return response.queries  # type: ignore

    except Exception as e:
        print(e)

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Retriever query generation Agent Failed",
            },
        )
