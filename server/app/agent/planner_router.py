from app.agent.state import AgentState


def planner_router(
    state: AgentState
):

    plan = state.plan

    if not plan:
        return "general_qa"

    if len(plan.steps) == 0:
        return "general_qa"

    tool = plan.steps[0].tool

    supported_tools = {
        "retriever",
        "general_qa",
        "summarizer",
        "sentiment",
        "code_explainer"
    }

    if tool not in supported_tools:
        return "general_qa"

    return tool











