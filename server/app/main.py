from fastapi import FastAPI
from routes.chat import router as chat_router
from dotenv import load_dotenv
import os

load_dotenv()


app = FastAPI()

app.include_router(chat_router, prefix="/chat", tags=["chat"])


@app.get("/")
def home():
    return {"message": "DataSmith Agent running"}
