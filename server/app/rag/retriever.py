from .vector_store import qdrant
from .embeddings import create_embedding


retriever = qdrant.as_retriever(search_kwargs={"k": 5})


async def retrieve_relevant_chunks(query: str):

    relevant_chunks = retriever.invoke(query)

    return relevant_chunks


