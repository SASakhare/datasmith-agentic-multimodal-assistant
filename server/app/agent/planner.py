from pydantic import BaseModel
from typing import List
from prompts.planner_prompt import PLANNER_PROMPT
from services.llm_service import llm  # type: ignore
from fastapi import HTTPException


class PlanStep(BaseModel):
    tool: str
    reason: str


class ExecutionPlan(BaseModel):
    intent: str
    need_rag: bool
    need_human_approval: bool
    need_clarification: bool
    clarification_question: str | None = None
    steps: List[PlanStep]


llm_with_ExecutionPlan = llm.with_structured_output(ExecutionPlan)


async def create_plan(query: str, available_knowledge: list[str]):
    try:

        available_knowledges = "\n".join(available_knowledge)

        prompt = f"""
            {
                PLANNER_PROMPT.format(available_knowledge=available_knowledges)
            }
            
            User Query :
            {query}
            """

        response = llm_with_ExecutionPlan.invoke(prompt)

        return response

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Plan Creating Agent Failed",
                "error": str(e),
            },
        )
