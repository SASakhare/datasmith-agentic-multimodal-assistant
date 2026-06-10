from fastapi import HTTPException
from langchain_qdrant import QdrantVectorStore, RetrievalMode
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PayloadSchemaType
from app.rag.embeddings import embeddings_model
from dotenv import load_dotenv
from langchain_core.documents import Document
import os

load_dotenv()

client = None
qdrant = None


def get_qdrant():
    global client, qdrant
    if qdrant is not None:
        return qdrant

    collection_name = os.getenv("QDRANT_COLLECTION_NAME")

    client = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY"),
        timeout=500,
    )

    if not client.collection_exists(collection_name): # type: ignore
        client.create_collection(
            collection_name=collection_name, # type: ignore
            vectors_config={
                "dense": VectorParams(
                    size=os.getenv("EMBEDDINGS_MODEL_DIMENSION"), # type: ignore
                    distance=Distance.COSINE,
                ),
            },
        )

    # ← create payload indexes for filtering
    client.create_payload_index(
        collection_name=collection_name, # type: ignore
        field_name="conversation_id",
        field_schema=PayloadSchemaType.KEYWORD,
    )

    client.create_payload_index(
        collection_name=collection_name, # type: ignore
        field_name="user_id",
        field_schema=PayloadSchemaType.KEYWORD,
    )

    print("Qdrant payload indexes created")

    qdrant = QdrantVectorStore(
        client=client,
        collection_name=collection_name, # type: ignore
        embedding=embeddings_model,
        retrieval_mode=RetrievalMode.DENSE,
        vector_name="dense",
    )
    return qdrant


async def add_documents_to_vector_store(
    documents: list[dict],
    conversation_id: str,
    user_id: str,
):
    store = get_qdrant()
    BATCH_SIZE = 10

    for doc in documents:
        doc.metadata["conversation_id"] = conversation_id # type: ignore
        doc.metadata["user_id"] = user_id # type: ignore

    print(f"total doc length {len(documents)}")
    for i in range(0, len(documents), BATCH_SIZE):
        print(f"Bath {i} doc adding ")
        batch = documents[i : i + BATCH_SIZE]
        store.add_documents(documents=batch) # type: ignore

    return {"message": "Documents added to vector store successfully."}


async def add_text_to_vector_store(text: str, metadata: dict):
    store = get_qdrant()
    doc = Document(page_content=text, metadata=metadata)
    store.add_documents(documents=[doc])
    return {"message": "Text added to vector store successfully."}


async def add_document_to_vector_store(document: dict):
    store = get_qdrant()
    store.add_documents(documents=[document]) # type: ignore
    return {"message": "Document added to vector store successfully."}


async def search_vector_store(query: str, top_k: int = 5):
    store = get_qdrant()
    return store.similarity_search(query, k=top_k)


async def search_vector_store_with_score(query: str, top_k: int = 5):
    store = get_qdrant()
    return store.similarity_search_with_score(query, k=top_k)