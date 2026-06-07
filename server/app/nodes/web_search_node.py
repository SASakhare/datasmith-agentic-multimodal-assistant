from agent.state import AgentState

from tools.web_search_tool import search_web


async def web_search_node(
    state: AgentState
):

    result = await search_web(
        query=state.query,
        available_knowledge=state.available_knowledge,
        history=state.conversation_history,
        summary=state.conversation_summary,
    )

    state.web_context = result

    state.current_step += 1

    return state