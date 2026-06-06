from tools.summarizer import summarize_content
from tools.code_explainer import explain_code
from tools.sentiment_tool import analyze_sentiment
from tools.question_answering_tool import answer_question


async def execute_tool(intent_given: str, content: str, query: str = "") -> str:
    intent = (intent_given or "").lower()

    if intent in ("summarization", "summarize"):
        return await summarize_content(content)
    elif intent in ("code_explanation", "explain_code"):
        return await explain_code(content)  
    elif intent in ("sentiment_analysis", "analyze_sentiment"):
        return await analyze_sentiment(content)
    elif intent in ("question_answering", "answer_question", "general_qa"):
        return await answer_question(content=content, question=query)
    else:
        return "Unknown intent"
