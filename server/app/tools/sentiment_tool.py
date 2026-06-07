from services.llm_service import llm
from prompts.sentiment_prompt import sentiment_prompt


from fastapi import HTTPException

from agent.state import Message


async def analyze_sentiment(
    content: str,
    query: str,
    available_knowledge: list[str],
    history: list[Message],
    summary: str,
    web_context:str
) -> str:

    try:

        available_knowledge_text = "\n".join(available_knowledge)

        history_text = "\n".join(
            [f"{msg.role.upper()}: {msg.content}" for msg in history]
        )

        prompt = sentiment_prompt.format(
            content=content,
            query=query,
            available_knowledge=available_knowledge_text,
            summary=summary,
            history=history_text,
        )

        response = llm.invoke(prompt)

        return response.content # type: ignore

    except Exception as e:

        print(e)

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Sentiment Analysis Tool Failed",
                "error": str(e),
            },
        )
