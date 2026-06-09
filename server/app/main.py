from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router
from app.routes.auth import router as auth_router
from app.routes.conversation import router as conv_router
from dotenv import load_dotenv
import os

load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization"],  # ← add Authorization
)

app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(auth_router, prefix="/auth")
app.include_router(conv_router, prefix="/conversation")


@app.get("/")
def home():
    return {"message": "DataSmith Agent running"}


# D:\DataSmith\server\.venv\Scripts\activate.bat
