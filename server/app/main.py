from fastapi import FastAPI
from routes.chat import router as chat_router
from routes.auth import router as auth_router
from routes.conversation import router as conv_router
from dotenv import load_dotenv
import os

load_dotenv()


app = FastAPI()

app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(auth_router,prefix='/auth')
app.include_router(conv_router,prefix='/conversation')

@app.get("/")
def home():
    return {"message": "DataSmith Agent running"}
