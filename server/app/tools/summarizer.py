from fastapi import HTTPException
from agent.state import Message
from services.llm_service import llm
from prompts.summarization_prompt import summarization_prompt


async def summarize_content(content: str, query: str,available_knowledge: list[str], history: list[Message], summary: str) -> str:
    """
    Summarizes the given content using a language model.

    Args:
        content (str): The text content to summarize.

    Returns:
        str: A structured summary of the content.
    """
    # Generate the prompt with the provided content
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

        prompt = summarization_prompt.format(
                    content=content,
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
                "message": "Summarizer Tool Failed",
            },
        )
