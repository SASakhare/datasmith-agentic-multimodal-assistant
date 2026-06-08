from fastapi import HTTPException
from app.agent.state import AgentState
from app.tools.question_answering_tool import answer_question


async def qa_node(
    state: AgentState,
):

    try:

        query = state.query

        available_knowledge = state.available_knowledge

        history=state.conversation_history

        summary=state.conversation_summary

        context = state.retrieved_context

        web_context=state.web_context

        response = await answer_question(content=context, question=query,available_knowledge=available_knowledge,history=history,summary=summary,web_context=web_context)

        return {
            "final_answer": response,
            "current_step": state.current_step + 1,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Question Answer Tool Failed",
            },
        )
