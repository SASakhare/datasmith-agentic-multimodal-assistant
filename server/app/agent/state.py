from pydantic import BaseModel
from agent.planner import ExecutionPlan
from typing import List


class Message(BaseModel):

    role: str
    content: str


class AgentState(BaseModel):

    query: str

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
