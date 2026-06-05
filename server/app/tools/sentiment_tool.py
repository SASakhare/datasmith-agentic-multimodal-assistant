from services.llm_service import llm
from prompts.sentiment_prompt import sentiment_prompt


async def analyze_sentiment(content: str) -> str:
    """
    Analyzes the sentiment of the given content using a language model.



    Returns:
        str: The sentiment analysis result.
    """
    # Generate the prompt with the provided content
    prompt = sentiment_prompt.format(content=content)

    # Use the language model to generate a sentiment analysis based on the prompt
    sentiment = llm.invoke([prompt])

    return sentiment.content






