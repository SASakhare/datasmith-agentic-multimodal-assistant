from fastapi import HTTPException
from services.llm_service import llm
from prompts.summarization_prompt import summarization_prompt


async def summarize_content(content: str, query: str) -> str:
    """
    Summarizes the given content using a language model.

    Args:
        content (str): The text content to summarize.

    Returns:
        str: A structured summary of the content.
    """
    # Generate the prompt with the provided content
    try:
        prompt = summarization_prompt.format(content=content, query=query)

        # Use the language model to generate a summary based on the prompt
        summary = llm.invoke([prompt])

        return summary.content

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Summarizer Tool Failed",
            },
        )
