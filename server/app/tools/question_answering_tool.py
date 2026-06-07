from fastapi import HTTPException
from agent.state import Message
from services.llm_service import llm
from prompts.question_answering_prompt import question_answer_prompt  # type: ignore


async def answer_question(content: str, question: str, available_knowledge: list[str], history: list[Message], summary: str) -> str:
    """
    Answers a question about the given content using a language model.

    Args:
        content (str): The text content to consult.
        question (str): The question to answer.

    Returns:
        str: The model's answer.
    """
    # Build the prompt with the provided content and question
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

        prompt = question_answer_prompt.format(
                    content=content,
                    question=question,
                    available_knowledge=available_knowledge_text,
                    summary=summary,
                    history=history_text,
                )

        response = llm.invoke(
                    prompt
                )
        
        # Return the content of the model response (fallback to string conversion)
        return response.content # type: ignore

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Question Answer Tool Failed",
            },
        )
