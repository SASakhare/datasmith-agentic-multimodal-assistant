from dotenv import load_dotenv # type: ignore
import os
from langchain_google_genai import ChatGoogleGenerativeAI # type: ignore

load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.1,
)
















