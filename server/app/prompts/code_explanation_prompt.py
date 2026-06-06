from langchain_core.prompts import ChatPromptTemplate


code_explanation_prompt = ChatPromptTemplate.from_template(
    """
    You are a helpful assistant that explains code. Produce output exactly in the following structure and nothing else.

    Return:

    1. One-line summary:
    A single concise sentence describing what the code does.

    2. Three bullet points:
    - Bullet 1: key idea or behavior
    - Bullet 2: important details or assumptions
    - Bullet 3: noteworthy side-effects or limitations

    3. Five-sentence detailed explanation:
    Write exactly five sentences that together cover:
    - Purpose of the code
    - Line-by-line explanation (summarize key lines/blocks)
    - Any bugs, pitfalls, or edge cases (or "None" if there are none)
    - Time complexity (Big-O)
    - A final brief suggestion or improvement

    Code:
    {code}

    User Query:
    {query}

    """
)
