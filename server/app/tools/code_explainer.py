from fastapi import HTTPException
from agent.state import Message
from services.llm_service import llm
from prompts.code_explanation_prompt import code_explanation_prompt

from fastapi import HTTPException

from agent.state import Message


async def explain_code(
    code: str,
    query: str,
    available_knowledge: list[str],
    history: list[Message],
    summary: str,
) -> str:

    try:

        available_knowledge_text = "\n".join(
            available_knowledge
        )

        history_text = "\n".join(
            [
                f"{msg.role.upper()}: {msg.content}"
                for msg in history
            ]
        )

        prompt = code_explanation_prompt.format(
            code=code,
            query=query,
            available_knowledge=available_knowledge_text,
            summary=summary,
            history=history_text,
        )

        response = llm.invoke(
            prompt
        )

        return response.content # type: ignore

    except Exception as e:


        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Explain Code Tool Failed",
                "error": str(e),
            },
        )