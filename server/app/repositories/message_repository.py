from datetime import datetime
from uuid import uuid4
from app.database.collections import messages_collection
from app.agent.state import Message


async def create_message(
    conversation_id: str,
    role: str,
    content: str,
):

    message = {
        "message_id": str(uuid4()),
        "conversation_id": conversation_id,
        "role": role,
        "content": content,
        "created_at": datetime.utcnow(),
    }

    await messages_collection.insert_one(message)

    return message


async def get_messages(conversation_id: str):

    cursor = messages_collection.find({"conversation_id": conversation_id}).sort(
        "timestamp", 1
    )

    return await cursor.to_list(length=None)


async def get_conversation_history(
    conversation_id: str,
):

    cursor = messages_collection.find({"conversation_id": conversation_id}).sort(
        "created_at", 1
    )

    messages = await cursor.to_list(length=None)

    return [
        Message(role=message["role"], content=message["content"])
        for message in messages
    ]
