from langchain_core.prompts import ChatPromptTemplate # type: ignore



sentiment_prompt = ChatPromptTemplate.from_template(
    """
    You are a helpful assistant that analyzes the sentiment of text. Please analyze the sentiment of the following text:
    Return:
    
    1. Overall sentiment (positive, negative, neutral)
    
    2. Three bullet points explaining the sentiment
    
    3. Five-sentence detailed analysis of the sentiment
    
    Content:
    {content}
    """
)





















