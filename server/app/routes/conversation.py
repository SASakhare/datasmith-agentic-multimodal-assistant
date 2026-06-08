from datetime import datetime
from uuid import uuid4
from fastapi import APIRouter, HTTPException
from fastapi import Depends
from app.dependencies.auth_dependency import get_current_user
from app.models.conversation import Conversation
from app.repositories.conversation_repository import (
    create_conversation,
    delete_conversation,
    get_conversation,
    get_conversations,
    update_conversation,
)
from app.schemas.conversation_schema import (
    CreateConversationRequest,
    UpdateConversationRequest,
)
from app.database.collections import conversations_collection

router = APIRouter()


# * creating the conversation
@router.post("/create")
async def crete(
    request: CreateConversationRequest,
    current_user=Depends(get_current_user),
):
    conversation = Conversation(
        conversation_id=str(uuid4()),
        user_id=current_user["user_id"],
        title=request.title,
        message_count=0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        rag_content=[],
        summary="",
    )

    await create_conversation(conversation.model_dump())

    return {
        "success": True,
        "conversation": conversation,
    }


# *get single the conversation  with conversation id
@router.get("/{conversation_id}")
async def get_conv_by_id(
    conversation_id: str,
    current_user=Depends(get_current_user),
):

    conversation = await get_conversation(conversation_id)

    if not conversation:

        raise HTTPException(status_code=404, detail="Conversation not found")

    conversation["_id"] = str(conversation["_id"])

    return {
        "success": True,
        "conversation": conversation,
    }


# *get all the conversation  with user id
@router.get("/user/all")
async def get_all_conv(
    current_user=Depends(get_current_user),
):
    conversations = await get_conversations(current_user["user_id"])

    for conv in conversations:
        conv["_id"] = str(conv["_id"])

    return {
        "success": True,
        "count": len(conversations),
        "conversation": conversations,
    }


# *update the conversation  with conversation_id
@router.put("/update/{conversation_id}")
async def update(
    conversation_id: str,
    request: UpdateConversationRequest,
    current_user=Depends(get_current_user),
):
    update_data = {}

    if request.title:
        update_data["title"] = request.title

    update_data["updated_at"] = datetime.utcnow()

    result = await update_conversation(conversation_id, update_data)

    if result.modified_count == 0:

        raise HTTPException(status_code=404, detail="Conversation not found")

    return {"success": True, "message": "Conversation updated"}


# *delete the conversation  with conversation_id
@router.delete("/delete/{conversation_id}")
async def delete(
    conversation_id: str,
    current_user=Depends(get_current_user),
):

    conversation = await get_conversation(conversation_id)

    if not conversation:

        raise HTTPException(status_code=404, detail="Conversation not found")

    if conversation["user_id"] != current_user["user_id"]:

        raise HTTPException(status_code=403, detail="Unauthorized")

    await delete_conversation(conversation_id)

    return {
        "success": True,
        "message": "Conversation deleted successfully",
    }
