from langchain_ollama import OllamaEmbeddings  # type: ignore


embeddings_model=OllamaEmbeddings(
    model="llama3.2",
)




def create_embedding(text:str):

    return embeddings_model.embed_query(text)





























