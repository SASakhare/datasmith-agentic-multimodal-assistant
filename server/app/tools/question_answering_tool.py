from fastapi import HTTPException
from services.llm_service import llm
from prompts.question_answering_prompt import question_answer_prompt  # type: ignore


async def answer_question(content: str, question: str) -> str:
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
        prompt = question_answer_prompt.format(content=content, question=question)

        # Invoke the language model (support synchronous or awaitable results)
        response = llm.invoke([prompt])
        # Return the content of the model response (fallback to string conversion)
        return response.content

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Question Answer Tool Failed",
            },
        )
