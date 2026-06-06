from langchain_text_splitters import RecursiveCharacterTextSplitter  # type: ignore


async  def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 80) -> list[dict]:
    """
    Chunk the input text into smaller pieces using RecursiveCharacterTextSplitter.

    Args:
        text (str): The input text to be chunked.
        chunk_size (int): The maximum size of each chunk. Default is 500 characters.
        chunk_overlap (int): The number of characters to overlap between chunks. Default is 80 characters.

    Returns:
        list[str]: A list of text chunks.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    chunks = text_splitter.create_documents([text])

    return chunks
