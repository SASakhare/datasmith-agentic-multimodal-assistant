from datetime import datetime

from fastapi import HTTPException
from app.database.collections import conversations_collection, messages_collection
from app.prompts import message_summarization_prompt
from app.services.llm_service import llm


async def create_conversation(data: dict):

    result = await conversations_collection.insert_one(data)

    return result


async def get_conversations(user_id: str):

    cursor = conversations_collection.find({"user_id": user_id}).sort("created_at", -1)

    return await cursor.to_list(length=None)


async def get_conversation(conversation_id: str):

    return await conversations_collection.find_one({"conversation_id": conversation_id})


async def update_conversation(conversation_id: str, data: dict):

    await conversations_collection.update_one(
        {"conversation_id": conversation_id}, {"$set": data}
    )

    updated = await conversations_collection.find_one(
        {"conversation_id": conversation_id}
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail={"success": False, "message": "Conversation not found"},
        )

    updated["_id"] = str(updated["_id"])

    return updated


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


async def get_recent_messages(conversation_id: str, limit: int = 6):

    cursor = (
        messages_collection.find({"conversation_id": conversation_id})
        .sort("created_at", -1)
        .limit(limit)
    )

    messages = await cursor.to_list(length=limit)

    messages.reverse()

    return messages


async def get_all_messages(conversation_id: str):
    cursor = messages_collection.find({"conversation_id": conversation_id}).sort(
        "created_at", 1
    )

    messages = await cursor.to_list(length=None)

    # convert ObjectId to string

    for message in messages:
        message["_id"] = str(message["_id"])

    # print(messages)

    return messages


async def build_agent_memory(
    conversation_id: str,
):

    conversation = await get_conversation(conversation_id)

    recent_messages = await get_recent_messages(conversation_id, limit=6)

    rag_content = await get_available_knowledge(conversation_id)

    return {
        "summary": conversation["summary"],  # type: ignore
        "messages": recent_messages,
        "rag_content": rag_content,
    }


async def get_recent_messages_for_summary(
    conversation_id: str,
    limit: int = 20,
):

    cursor = (
        messages_collection.find({"conversation_id": conversation_id})
        .sort("created_at", -1)
        .limit(limit)
    )

    messages = await cursor.to_list(length=limit)

    messages.reverse()

    return messages


async def update_conversation_summary(
    conversation_id: str,
):

    conversation = await get_conversation(conversation_id)

    message_count = conversation["message_count"]  # type: ignore

    if message_count % 15 != 0:
        return ""

    old_summary = conversation.get("summary", "")  # type: ignore

    messages = await get_recent_messages_for_summary(conversation_id)

    message_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])

    prompt = message_summarization_prompt.format(  # type: ignore
        old_summary=old_summary,
        messages=message_text,
    )

    response = llm.invoke(prompt)

    new_summary = response.content

    await update_conversation(conversation_id, {"summary": new_summary})

    return new_summary


async def get_available_knowledge(conversation_id: str) -> list[str]:

    conversation = await conversations_collection.find_one(
        {"conversation_id": conversation_id}
    )

    if not conversation:
        return []

    return conversation.get("rag_content", [])


async def store_rag_content(conversation_id: str, rag_content: list[str]):

    conversation = await conversations_collection.find_one(
        {"conversation_id": conversation_id}
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail={"success": False, "message": "Conversation not found"},
        )

    # existing = conversation.get("rag_content", [])

    # merge without duplicates
    updated = list(set(rag_content))

    await conversations_collection.update_one(
        {"conversation_id": conversation_id},
        {"$set": {"rag_content": updated}},
    )

    return updated
