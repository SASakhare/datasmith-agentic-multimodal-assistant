from services.llm_service import llm
from prompts.summarization_prompt import summarization_prompt


async def summarize_content(content: str) -> str:
    """
    Summarizes the given content using a language model.

    Args:
        content (str): The text content to summarize.

    Returns:
        str: A structured summary of the content.
    """
    # Generate the prompt with the provided content
    prompt = summarization_prompt.format(content=content)

    # Use the language model to generate a summary based on the prompt
    summary = llm.invoke([prompt])


    return summary.content
