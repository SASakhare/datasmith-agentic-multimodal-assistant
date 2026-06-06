from fastapi import HTTPException
from agent.state import AgentState
from tools.summarizer import summarize_content


async def summarizer_node(
    state: AgentState,
):

    try:
        query = state.query

        summary = await summarize_content(content=state.retrieved_context, query=query)

        return {
            "final_answer": summary,
            "current_step": state.current_step + 1,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Summarizer Agent Failed",
            },
        )
