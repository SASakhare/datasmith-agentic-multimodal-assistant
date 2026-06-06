from fastapi import HTTPException
from agent.state import AgentState
from rag.retriever import retrieve_relevant_chunks_with_queries
from tools.retriver_prompt_generator import get_relevant_queries


async def retriever_node(
    state: AgentState,
):

    try:

        query = state.query

        queries = await get_relevant_queries(query)

        relevant_chunks = await retrieve_relevant_chunks_with_queries(queries) # type: ignore

        retrieved_context = "\n".join([chunk.page_content for chunk in relevant_chunks])

        return {
            "retrieved_context": retrieved_context,
            "current_step": state.current_step + 1,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Retriever Tool Failed",
            },
        )
