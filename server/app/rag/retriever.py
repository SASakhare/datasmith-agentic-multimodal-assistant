from fastapi import HTTPException

from tools.retriver_prompt_generator import Query
from .vector_store import qdrant
from .embeddings import create_embedding


retriever = qdrant.as_retriever(search_kwargs={"k": 5})


async def retrieve_relevant_chunks(query: str):
    try:

        relevant_chunks = retriever.invoke(query)

        return relevant_chunks

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Retriever Chunks Tool Failed",
            },
        )


async def retrieve_relevant_chunks_with_queries(queries: list[Query]):

    try:
        relevant_chunks = []
        retriever = qdrant.as_retriever(search_kwargs={"k": 2})

        for query in queries:

            chunks = retriever.invoke(query.query)
            # print(query.query)
            relevant_chunks.extend(chunks)

        return relevant_chunks

    except Exception as e:

        print(e)

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Retriever Chunks Tool Failed",
            },
        )
