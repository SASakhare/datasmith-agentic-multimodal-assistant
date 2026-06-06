from langgraph.graph import StateGraph, END  # type: ignore

from agent.state import AgentState
from agent.tool_router import tool_router

from nodes.planner_node import planner_node
from nodes.retriever_node import retriever_node
from nodes.qa_node import qa_node
from nodes.final_answer_node import final_answer_node
from nodes.summarizer_node import summarizer_node
from nodes.sentiment_node import sentiment_node
from nodes.code_explainer_node import code_explainer_node  # type: ignore

# * graph nodes

graph = StateGraph(AgentState)

graph.add_node("planner", planner_node)

graph.add_node("retriever", retriever_node)

graph.add_node("general_qa", qa_node)

graph.add_node("summarizer", summarizer_node)

graph.add_node("sentiment", sentiment_node)

graph.add_node("code_explainer", code_explainer_node)

graph.add_node("final_answer", final_answer_node)


# * edges

graph.set_entry_point("planner")

graph.add_conditional_edges(
    "planner",
    tool_router,
    {
        "retriever": "retriever",
        "general_qa": "general_qa",
        "summarizer": "summarizer",
        "sentiment": "sentiment",
        "code_explainer": "code_explainer",
        END: "final_answer",
    },
)

graph.add_conditional_edges(
    "retriever",
    tool_router,
    {
        "retriever": "retriever",
        "general_qa": "general_qa",
        "summarizer": "summarizer",
        "sentiment": "sentiment",
        "code_explainer": "code_explainer",
        END: "final_answer",
    },
)

graph.add_conditional_edges(
    "general_qa",
    tool_router,
    {
        "retriever": "retriever",
        "general_qa": "general_qa",
        "summarizer": "summarizer",
        "sentiment": "sentiment",
        "code_explainer": "code_explainer",
        END: "final_answer",
    },
)

graph.add_conditional_edges(
    "summarizer",
    tool_router,
    {
        "retriever": "retriever",
        "general_qa": "general_qa",
        "summarizer": "summarizer",
        "sentiment": "sentiment",
        "code_explainer": "code_explainer",
        END: "final_answer",
    },
)
graph.add_conditional_edges(
    "code_explainer",
    tool_router,
    {
        "retriever": "retriever",
        "general_qa": "general_qa",
        "summarizer": "summarizer",
        "sentiment": "sentiment",
        "code_explainer": "code_explainer",
        END: "final_answer",
    },
)
graph.add_conditional_edges(
    "sentiment",
    tool_router,
    {
        "retriever": "retriever",
        "general_qa": "general_qa",
        "summarizer": "summarizer",
        "sentiment": "sentiment",
        "code_explainer": "code_explainer",
        END: "final_answer",
    },
)

graph.add_edge("final_answer", END)


app_graph = graph.compile()
