from datetime import datetime
from database.collections import conversations_collection, messages_collection


async def create_conversation(data: dict):

    result = await conversations_collection.insert_one(data)

    return result


async def get_conversations(user_id: str):

    cursor = conversations_collection.find({"user_id": user_id})

    return await cursor.to_list(length=None)


async def get_conversation(conversation_id: str):

    return await conversations_collection.find_one({"conversation_id": conversation_id})


async def update_conversation(conversation_id: str, data: dict):

    return await conversations_collection.update_one(
        {"conversation_id": conversation_id}, {"$set": data}
    )


async def delete_conversation(conversation_id: str):

    # delete all messages
    await messages_collection.delete_many({"conversation_id": conversation_id})

    # delete conversation
    result = await conversations_collection.delete_one(
        {"conversation_id": conversation_id}
    )

    return result


async def increment_message_count(
    conversation_id: str,
):

    await conversations_collection.update_one(
        {"conversation_id": conversation_id},
        {
            "$inc": {"message_count": 1},
            "$set": {"updated_at": datetime.utcnow()},
        },
    )



async def get_recent_messages(
    conversation_id: str,
    limit: int = 6
):

    cursor = (
        messages_collection
        .find(
            {"conversation_id": conversation_id}
        )
        .sort("created_at", -1)
        .limit(limit)
    )

    messages = await cursor.to_list(
        length=limit
    )

    messages.reverse()

    return messages


async def build_agent_memory(
    conversation_id: str,
):

    conversation = await get_conversation(
        conversation_id
    )

    recent_messages = await get_recent_messages(
        conversation_id,
        limit=6
    )

    return {
        "summary": conversation["summary"], # type: ignore
        "messages": recent_messages,
    }