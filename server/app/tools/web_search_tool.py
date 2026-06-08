from fastapi import HTTPException

from app.services.web_search_service import web_search

from app.agent.state import Message



async def search_web(
    query: str,
    available_knowledge: list[str],
    history: list[Message],
    summary: str,
):

    try:

        result = await web_search(query=query)

        content = []

        for item in result["results"]:

            content.append(
                f"""
        Title:
        {item.get('title')}

        URL:
        {item.get('url')}

        Content:
        {item.get('content')}
        """
            )

        return "\n\n".join(content)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
