from fastapi import HTTPException
from services.llm_service import llm
from prompts.code_explanation_prompt import code_explanation_prompt


async def explain_code(code: str, query: str) -> str:
    """
    Explains the given code using a language model.

    Args:
        code (str): The code to explain.

    Returns:
        str: A detailed explanation of the code.
    """
    # Generate the prompt with the provided code
    try:
        prompt = code_explanation_prompt.format(code=code, query=query)

        # Use the language model to generate an explanation based on the prompt
        explanation = llm.invoke([prompt])

        return explanation.content

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Explain Code Tool Failed",
            },
        )
