from fastapi import HTTPException
from qdrant_client.models import Filter, FieldCondition, MatchValue
from app.tools.retriver_prompt_generator import Query
from app.rag.vector_store import get_qdrant


async def retrieve_relevant_chunks_with_queries(
    queries: list[Query],
    conversation_id: str,
    user_id: str,
):
    try:
        qdrant = get_qdrant()
        relevant_chunks = []

        qdrant_filter = Filter(
            must=[
                FieldCondition(
                    key="conversation_id",
                    match=MatchValue(value=str(conversation_id))  # ← force string
                ),
                FieldCondition(
                    key="user_id",
                    match=MatchValue(value=str(user_id))  # ← force string
                ),
            ]
        )
        print(queries)
        for query in queries:
            # use similarity_search directly instead of as_retriever
            chunks = qdrant.similarity_search(
                query=query.query,
                k=4,
                filter=qdrant_filter,
            )
            relevant_chunks.extend(chunks)

        # deduplicate
        seen = set()
        unique_chunks = []
        for chunk in relevant_chunks:
            if chunk.page_content not in seen:
                seen.add(chunk.page_content)
                unique_chunks.append(chunk)

        print(f"Retrieved {len(unique_chunks)} unique chunks from {len(relevant_chunks)} total")
        return unique_chunks

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail={"success": False, "message": "Retriever Chunks Tool Failed"},
        )


async def retrieve_relevant_chunks(query: str, conversation_id: str, user_id: str):
    try:
        qdrant = get_qdrant()

        qdrant_filter = Filter(
            must=[
                FieldCondition(
                    key="conversation_id",
                    match=MatchValue(value=str(conversation_id))
                ),
                FieldCondition(
                    key="user_id",
                    match=MatchValue(value=str(user_id))
                ),
            ]
        )

        chunks = qdrant.similarity_search(
            query=query,
            k=4,
            filter=qdrant_filter,
        )
        return chunks

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail={"success": False, "message": "Retriever Chunks Tool Failed"},
        )