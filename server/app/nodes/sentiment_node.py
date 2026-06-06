from fastapi import HTTPException
from agent.state import AgentState
from tools.sentiment_tool import analyze_sentiment


async def sentiment_node(
    state: AgentState,
):
    try:

        query = state.query

        sentiment = await analyze_sentiment(
            content=state.retrieved_context, query=query
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