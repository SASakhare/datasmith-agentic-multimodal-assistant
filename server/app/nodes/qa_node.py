from fastapi import HTTPException
from agent.state import AgentState
from tools.question_answering_tool import answer_question


async def qa_node(
    state: AgentState,
):

    try:

        query = state.query

        available_knowledge = state.available_knowledge

        history=state.conversation_history

        summary=state.conversation_summary

        context = state.retrieved_context

        response = await answer_question(content=context, question=query,available_knowledge=available_knowledge,history=history,summary=summary)

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
