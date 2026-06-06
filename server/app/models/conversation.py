from pydantic import BaseModel
from datetime import datetime


class RagFile(BaseModel):
    filename: str
    file_type: str
    file_content: str


class Conversation(BaseModel):

    conversation_id: str

    user_id: str

    title: str

    message_count: int = 0

    created_at: datetime

    updated_at: datetime

    rag_content: list[str]
