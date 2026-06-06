from pydantic import BaseModel


class CreateConversationRequest(BaseModel):
    conversation_id: str
    title: str
    user_id: str


class UpdateConversationRequest(BaseModel):
    conversation_id: str
    user_id: str
