from langchain_ollama import OllamaEmbeddings  # type: ignore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import os

load_dotenv()

# embeddings_model = OllamaEmbeddings(
#     model="llama3.2",
# )


# def create_embedding(text: str):

#     return embeddings_model.embed_query(text)

# embeddings.py
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings

embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY"), # type: ignore
    task_type="RETRIEVAL_DOCUMENT",  # for storing chunks
)

def create_embedding(text: str):
    return embeddings_model.embed_query(text)