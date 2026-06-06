from agent.planner import ExecutionPlan, PlanStep
from rag.retriever import retrieve_relevant_chunks_with_queries
from tools.code_explainer import explain_code
from tools.question_answering_tool import answer_question
from tools.retriver_prompt_generator import get_relevant_queries
from tools.sentiment_tool import analyze_sentiment
from tools.summarizer import summarize_content


async def execute_plan(plan: ExecutionPlan, query: str):

    current_context=""

    for step in plan.steps:

        if step.tool == "retriever":
            queries = await get_relevant_queries(query)

            relevant_chunks = await retrieve_relevant_chunks_with_queries(queries)

            current_context += "\n".join(
                [chunk.page_content for chunk in relevant_chunks]
            )

        elif step.tool in ("summarization", "summarize"):

            return await summarize_content(current_context,query)
        
        elif step.tool in ("code_explanation", "explain_code"):

            return await explain_code(current_context,query)  
        
        elif step.tool in ("sentiment_analysis", "analyze_sentiment"):

            return await analyze_sentiment(current_context,query)
        
        elif step.tool in ("question_answering", "answer_question", "general_qa"):

            return await answer_question(content=current_context, question=query)
        
        else:
            return {
                "message":"need clarification"
            }

