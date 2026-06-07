from fastapi import HTTPException
from agent.state import AgentState
from tools.sentiment_tool import analyze_sentiment


async def sentiment_node(
    state: AgentState,
):
    try:

        query = state.query

        available_knowledge = state.available_knowledge

        history = state.conversation_history

        summary = state.conversation_summary

        web_context=state.web_context

        sentiment = await analyze_sentiment(
            content=state.retrieved_context,
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
                "message": "Sentiment Agent Failed",
            },
        )
