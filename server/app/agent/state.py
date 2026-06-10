from pydantic import BaseModel
from typing import List

class PlanStep(BaseModel):
    tool: str
    reason: str


class ExecutionPlan(BaseModel):
    title:str | None
    intent: str
    need_rag: bool
    need_human_approval: bool
    need_clarification: bool
    clarification_question: str | None = None
    steps: List[PlanStep]


class Message(BaseModel):

    role: str
    content: str


class AgentState(BaseModel):

    query: str

    user_id:str

    conversation_id: str

    need_web_search: bool

    web_context:str

    current_step: int

    conversation_history: List[Message]

    conversation_summary: str

    plan: ExecutionPlan | None

    retrieved_context: str

    final_answer: str

    need_human_approval: bool

    human_approved: bool

    available_knowledge: list[str] = []




