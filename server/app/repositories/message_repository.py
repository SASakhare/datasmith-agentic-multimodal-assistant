from database.collections import messages_collection


async def create_message(data: dict):

    result = await messages_collection.insert_one(data)

    return str(result.inserted_id)


async def get_messages(conversation_id: str):

    cursor = messages_collection.find(
        {
            "conversation_id": conversation_id
        }
    ).sort(
        "timestamp",
        1
    )

    return await cursor.to_list(length=None)