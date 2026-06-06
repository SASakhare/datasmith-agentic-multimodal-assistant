from fastapi import HTTPException
from agent.state import AgentState
from tools.question_answering_tool import answer_question


async def qa_node(
    state: AgentState,
):

    try:

        query = state.query

        response = await answer_question(content=" ", question=query)

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
