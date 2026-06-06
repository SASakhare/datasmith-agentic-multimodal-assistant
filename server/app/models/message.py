from pydantic import BaseModel
from datetime import datetime


class Message(BaseModel):

    id:str | None = None
    
    conversation_id: str

    role: str

    content: str

    timestamp: datetime












