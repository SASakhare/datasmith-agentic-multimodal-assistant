from pydantic import BaseModel
from typing import List
from app.agent.state import *
from app.prompts.planner_prompt import PLANNER_PROMPT
from app.services.llm_service import llm  # type: ignore
from fastapi import HTTPException
from app.agent.state import Message

llm_with_ExecutionPlan = llm.with_structured_output(ExecutionPlan)

from fastapi import HTTPException


async def create_plan(
    query: str, available_knowledge: list[str], history: list[Message], summary: str
):

    try:
        is_first_message = len(history) <= 1

        available_knowledge_text = "\n".join(available_knowledge)

        history_text = "\n".join([f"{msg.role}: {msg.content}" for msg in history])

        prompt = f"""
                    {PLANNER_PROMPT.format(
                        available_knowledge=available_knowledge_text
                    )}

                    Conversation Summary:
                    {summary if summary else "No previous conversation summary available."}

                    Recent Conversation History:
                    {history_text if history_text else "No recent conversation history available."}

                    Current User Query:
                    {query}

                    \n\nis_first_message = {str(is_first_message).lower()}

                    """

        response = llm_with_ExecutionPlan.invoke(prompt)

        return response

    except Exception as e:

        print(e)

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Plan Creating Agent Failed",
                "error": str(e),
            },
        )
