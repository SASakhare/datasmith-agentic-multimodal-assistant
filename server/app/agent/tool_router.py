
from app.agent.state import AgentState
from langgraph.graph import END # type: ignore


def tool_router(state:AgentState):

    plan = state.plan

    current_step = state.current_step

    if not plan:
        return END

    if current_step >= len(plan.steps):
        return END

    return plan.steps[current_step].tool