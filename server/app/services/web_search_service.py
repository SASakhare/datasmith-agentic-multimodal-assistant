from dotenv import load_dotenv
import os
from tavily import TavilyClient

load_dotenv()

client = TavilyClient(
    api_key=os.getenv("TAVILY_API_KEY")
)


async def web_search(query: str):

    result = client.search(
        query=query,
        search_depth="advanced",
        max_results=5
    )

    return result