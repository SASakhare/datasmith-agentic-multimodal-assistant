from fastapi import HTTPException
from agent.state import AgentState
from tools.code_explainer import explain_code
from tools.sentiment_tool import analyze_sentiment


async def code_explainer_node(
    state: AgentState,
):

    try:

        query = state.query

        available_knowledge = state.available_knowledge

        history = state.conversation_history

        summary = state.conversation_summary

        sentiment = await explain_code(
            code=state.retrieved_context,
            query=query,
            available_knowledge=available_knowledge,
            history=history,
            summary=summary,
        )

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
