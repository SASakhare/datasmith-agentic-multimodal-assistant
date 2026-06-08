from fastapi import HTTPException
from app.agent.state import AgentState
from app.tools.code_explainer import explain_code
from app.tools.sentiment_tool import analyze_sentiment


async def code_explainer_node(
    state: AgentState,
):

    try:

        query = state.query

        available_knowledge = state.available_knowledge

        history = state.conversation_history

        summary = state.conversation_summary

        web_context=state.web_context

        sentiment = await explain_code(
            code=state.retrieved_context,
            query=query,
            available_knowledge=available_knowledge,
            history=history,
            summary=summary,
            web_context=web_context
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
