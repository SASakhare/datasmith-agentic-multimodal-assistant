from fastapi import HTTPException
from services.llm_service import llm
from prompts.retriver_prompt import query_generation_prompt
from pydantic import BaseModel, Field
from typing import List


class Query(BaseModel):

    query: str


class QueryList(BaseModel):

    queries: List[Query]


llm_with_QueryList = llm.with_structured_output(QueryList)


async def get_relevant_queries(query: str):

    try:
        prompt = f"""
                {
                    query_generation_prompt
                }

                User query:
                {
                    query
                }
            """

        response = llm_with_QueryList.invoke([prompt])

        return response.queries
    
    except Exception as e:
        print(e)

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Retriever query generation Agent Failed",
            },
        )
