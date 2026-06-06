from pymongo import AsyncMongoClient # type: ignore
from dotenv import load_dotenv # type: ignore
import os

load_dotenv()


MONGO_URI=os.getenv('MONGODB_URL')
DATABASE_NAME=os.getenv("MONGODB_USER_NAME")



client=AsyncMongoClient(MONGO_URI)

db=client[DATABASE_NAME] # type: ignore

























