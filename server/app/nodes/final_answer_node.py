from fastapi import HTTPException
from app.agent.state import AgentState


async def final_answer_node(state: AgentState):
    try:

        return {
            "response": state.final_answer,
        }
    
    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Request Failed",
            },
        )
