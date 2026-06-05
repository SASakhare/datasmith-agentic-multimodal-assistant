from langchain_core.prompts import ChatPromptTemplate  # type: ignore


intent_detector_prompt = ChatPromptTemplate.from_template(
    """You are a classifier that maps a user's question to one canonical intent.
    Respond with exactly one intent token (lowercase, no extra text) chosen from the list below.

    Available intents / choices (pick exactly one):
    - summarization
    - question_answering
    - sentiment_analysis
    - code_explanation
    - compare_documents
    - general_qa

    Intent definitions:
    - summarization: user asks for a concise summary of a document or text.
    - question_answering: user asks a specific question about facts or details in a document or text.
    - sentiment_analysis: user asks for the emotional tone or sentiment of text.
    - code_explanation: user asks to explain, annotate, or clarify code.
    - compare_documents: user asks to compare, contrast, or identify differences between documents.
    - general_qa: user asks general knowledge or domain questions not tied to a specific document.

    If multiple intents apply, pick the most specific. If uncertain, choose "other".

    Return only one token exactly matching one of the choices above (lowercase, no quotes, no extra text).

    User's question: {question}
    Intent:"""
)
