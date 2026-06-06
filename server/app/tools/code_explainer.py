from services.llm_service import llm
from prompts.code_explanation_prompt import code_explanation_prompt


async def explain_code(code: str) -> str:
    """
    Explains the given code using a language model.

    Args:
        code (str): The code to explain.

    Returns:
        str: A detailed explanation of the code.
    """
    # Generate the prompt with the provided code
    prompt = code_explanation_prompt.format(code=code)

    # Use the language model to generate an explanation based on the prompt
    explanation = llm.invoke([prompt])

    return explanation.content
