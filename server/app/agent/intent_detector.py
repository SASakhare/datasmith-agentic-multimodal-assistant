from services.llm_service import llm
from prompts.intent_detector_prompt import intent_detector_prompt


async def detect_intent(question: str) -> str:
    """
    Detect the user's intent based on their question.

    Args:
        question (str): The user's input question.

    Returns:
        str: The detected intent, one of:
            - summarization
            - question_answering
            - sentiment_analysis
            - code_explanation
            - compare_documents
            - general_qa
    """
    prompt = intent_detector_prompt.format(question=question)
    response = llm.invoke([prompt])
    return response.content
