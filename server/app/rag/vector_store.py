from langchain_qdrant import QdrantVectorStore, RetrievalMode  # type: ignore
from qdrant_client import QdrantClient, models  # type: ignore
from qdrant_client.http.models import Distance, SparseVectorParams, VectorParams  # type: ignore
from .embeddings import embeddings_model
from dotenv import load_dotenv  # type: ignore
from langchain_core.documents import Document  # type: ignore
import os


load_dotenv()


# sparse_embeddings = FastEmbedSparse(model_name="Qdrant/bm25")
client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
    timeout=500,
)
collection_name = os.getenv("QDRANT_COLLECTION_NAME")


# if not client.has_collection(collection_name):
#     client.create_collection(
#         collection_name=collection_name,
#         vectors_config={
#             "dense": VectorParams(
#                 size=os.getenv("EMBEDDINGS_MODEL_DIMENSION"), distance=Distance.COSINE
#             ),
#         },
#         sparse_vectors_config={
#             "sparse": SparseVectorParams(index=models.SparseIndexParams(on_disk=False))
#         },
#     )

if not client.collection_exists(collection_name):
    client.create_collection(
        collection_name=collection_name,
        vectors_config={
            "dense": VectorParams(
                size=os.getenv("EMBEDDINGS_MODEL_DIMENSION"), distance=Distance.COSINE
            ),
        },
    )


qdrant = QdrantVectorStore(
    client=client,
    collection_name=collection_name,
    embedding=embeddings_model,
    retrieval_mode=RetrievalMode.DENSE,
    vector_name="dense",
)


async def add_text_to_vector_store(text: str, metadata: dict):

    doc = Document(page_content=text, metadata=metadata)

    qdrant.add_documents(documents=[doc])

    return {"message": "Text added to vector store successfully."}


async def add_document_to_vector_store(document: dict):

    qdrant.add_documents(documents=[document])

    return {"message": "Document added to vector store successfully."}


async def add_documents_to_vector_store(documents: list[dict]):

    BATCH_SIZE = 10

    print(f"total doc length {len(documents)}")

    for i in range(0, len(documents), BATCH_SIZE):
        print(f"Bath {i} doc adding ")
        batch = documents[i : i + BATCH_SIZE]
        qdrant.add_documents(documents=batch)

    return {"message": "Documents added to vector store successfully."}


async def search_vector_store(query: str, top_k: int = 5):

    results = qdrant.similarity_search(query, k=top_k)

    return results


async def search_vector_store_with_score(query: str, top_k: int = 5):

    results = qdrant.similarity_search_with_score(query, k=top_k)

    return results
