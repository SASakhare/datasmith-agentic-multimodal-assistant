from langgraph.graph import StateGraph, END  # type: ignore

from app.agent.state import AgentState
from app.agent.tool_router import tool_router

from app.nodes.web_search_node import web_search_node
from app.nodes.planner_node import planner_node
from app.nodes.retriever_node import retriever_node
from app.nodes.qa_node import qa_node
from app.nodes.final_answer_node import final_answer_node
from app.nodes.summarizer_node import summarizer_node
from app.nodes.sentiment_node import sentiment_node
from app.nodes.code_explainer_node import code_explainer_node  # type: ignore
# * graph nodes

graph = StateGraph(AgentState)

graph.add_node("planner", planner_node)

graph.add_node("retriever", retriever_node)

graph.add_node("general_qa", qa_node)

graph.add_node("summarizer", summarizer_node)

graph.add_node("sentiment", sentiment_node)

graph.add_node("code_explainer", code_explainer_node)

graph.add_node("web_search", web_search_node)

graph.add_node("final_answer", final_answer_node)


# * edges

graph.set_entry_point("planner")

graph.add_conditional_edges(
    "planner",
    tool_router,
    {
        "retriever": "retriever",
        "web_search": "web_search",
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
        "web_search": "web_search",
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
        "web_search": "web_search",
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
        "web_search": "web_search",
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
        "web_search": "web_search",
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
        "web_search": "web_search",
        "general_qa": "general_qa",
        "summarizer": "summarizer",
        "sentiment": "sentiment",
        "code_explainer": "code_explainer",
        END: "final_answer",
    },
)

graph.add_conditional_edges(
    "web_search",
    tool_router,
    {
        "retriever": "retriever",
        "web_search": "web_search",
        "general_qa": "general_qa",
        "summarizer": "summarizer",
        "sentiment": "sentiment",
        "code_explainer": "code_explainer",
        END: "final_answer",
    },
)

graph.add_edge("final_answer", END)


app_graph = graph.compile()
