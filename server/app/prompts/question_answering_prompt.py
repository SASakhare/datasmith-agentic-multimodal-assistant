from langchain_core.prompts import ChatPromptTemplate # type: ignore

question_answer_prompt = ChatPromptTemplate.from_template(
    """
    You are a helpful assistant that answers questions using the provided context. Please answer the following question:
    Return:

    1. Direct answer (one concise sentence)

    2. Three bullet points supporting the answer

    3. Five-sentence detailed explanation that references the context

    Question:
    {question}

    Context:
    {context}
    """
)
