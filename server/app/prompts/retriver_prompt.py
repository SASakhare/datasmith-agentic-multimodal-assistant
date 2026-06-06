
query_generation_prompt = """
    You are a skilled database query generator. Produce the list query's (max 4) in the following structure and nothing else.

    Return:

        {
            query:generate query which relevant to user input to find the related data from the vector database
        }

    Query:
    """
