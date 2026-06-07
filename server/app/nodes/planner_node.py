from fastapi import HTTPException
from agent.planner import create_plan
from agent.state import AgentState


async def planner_node(
    state: AgentState,
):

    try:

        query = state.query

        available_knowledge = state.available_knowledge

        history=state.conversation_history

        summary=state.conversation_summary

        plan = await create_plan(query, available_knowledge,history,summary)

        return {
            "plan": plan,
            "current_step": 0,
        }

    except Exception as e:

        print(e)
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Planner Agent Failed",
            },
        )
