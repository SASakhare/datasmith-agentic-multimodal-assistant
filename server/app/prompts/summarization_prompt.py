from langchain_core.prompts import ChatPromptTemplate # type: ignore


summarization_prompt = ChatPromptTemplate.from_template(
    """
    You are a helpful assistant that summarizes text. Please summarize the following text:
    Return:

    1. One-line summary

    2. Three bullet points

    3. Five-sentence detailed summary

    Content:
    {content}
    """
)



