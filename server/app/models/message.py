from pydantic import BaseModel
from datetime import datetime


class Message(BaseModel):

    message_id:str 
    
    conversation_id: str

    role: str

    content: str

    timestamp: datetime












