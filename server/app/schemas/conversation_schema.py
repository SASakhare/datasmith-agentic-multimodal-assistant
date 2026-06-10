from pydantic import BaseModel


class CreateConversationRequest(BaseModel):
    title: str


class UpdateConversationRequest(BaseModel):
    title:str


class CreateMessageRequest(BaseModel):
    query:str
    conversation_id:str
    role:str