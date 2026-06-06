from database.collections import conversations_collection


async def create_conversation(data: dict):

    result = await conversations_collection.insert_one(data)

    return str(result.inserted_id)


async def get_conversations(user_id: str):

    cursor = conversations_collection.find({"user_id": user_id})

    return await cursor.to_list(length=None)


async def get_conversation(conversation_id: str):

    return await conversations_collection.find_one({"conversation_id": conversation_id})


async def update_conversation(conversation_id: str, data: dict):
    
    return await conversations_collection.update_one(
        {"conversation_id": conversation_id}, {"$set": data}
    )
