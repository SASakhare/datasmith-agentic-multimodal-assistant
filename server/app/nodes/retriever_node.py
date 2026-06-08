from fastapi import HTTPException
from app.agent.state import AgentState
from app.rag.retriever import retrieve_relevant_chunks_with_queries
from app.tools.retriver_prompt_generator import Query, get_relevant_queries


async def retriever_node(
    state: AgentState,
):

    try:
        
        query = state.query

        available_knowledge = state.available_knowledge

        history=state.conversation_history

        summary=state.conversation_summary


        queries = await get_relevant_queries(query=query,available_knowledge=available_knowledge,history=history,summary=summary)

        
        relevant_chunks = await retrieve_relevant_chunks_with_queries(queries)  # type: ignore

        retrieved_context = "\n".join([chunk.page_content for chunk in relevant_chunks])

        return {
            "retrieved_context": retrieved_context,
            "current_step": state.current_step + 1,
        }

    except Exception as e:
        print(e)

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Retriever Tool Failed",
            },
        )
