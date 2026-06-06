from pydantic import BaseModel


class CreateConversationRequest(BaseModel):
    title: str


class UpdateConversationRequest(BaseModel):
    title:str
    