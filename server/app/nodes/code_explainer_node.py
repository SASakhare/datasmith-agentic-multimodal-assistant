from fastapi import HTTPException
from agent.state import AgentState
from tools.code_explainer import explain_code
from tools.sentiment_tool import analyze_sentiment


async def code_explainer_node(
    state: AgentState,
):

    try:
        query = state.query

        sentiment = await explain_code(code=state.retrieved_context, query=query)

        return {
            "final_answer": sentiment,
            "current_step": state.current_step + 1,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Code Explainer Agent Failed",
            },
        )
