from datetime import datetime
from uuid import uuid4
from fastapi import APIRouter, HTTPException, Response
from fastapi import Depends, Request
from app.dependencies.auth_dependency import get_current_user
from app.models.conversation import Conversation
from app.repositories.conversation_repository import (
    create_conversation,
    delete_conversation,
    get_all_messages,
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
async def create(
    request: CreateConversationRequest,
    response: Response,
    current_user=Depends(get_current_user),
):
    try:

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
        response.status_code = 201
        return {
            "success": True,
            "message": "Now Start Chat",
            "conversation": conversation,
        }
    except HTTPException as e:
        # print(e.status_code)
        print(e)
        raise

    except Exception as e:
        response.status_code = 500
        return {
            "success": False,
            "message": "error in creating new chat",
        }


# *get single the conversation  with conversation id
@router.get("/{conversation_id}")
async def get_conv_by_id(
    conversation_id: str,
    response: Response,
    current_user=Depends(get_current_user),
):

    try:
        conversation = await get_conversation(conversation_id)

        if not conversation:
            response.status_code = 404
            return {
                "success": False,
                "message": "Requested Conversation Not Found",
            }

        conversation["_id"] = str(conversation["_id"])

        messages = await get_all_messages(conversation["conversation_id"])

        response.status_code = 200
        return {
            "success": True,
            "message": "Conversation Fetch Successfully",
            "conversation": conversation,
            "messages": messages,
        }

    except Exception as e:
        response.status_code = 500
        return {
            "success": False,
            "message": "Error in Requested Conversation",
        }


# *get all the conversation  with user id
@router.get("/user/all")
async def get_all_conv(
    response: Response,
    current_user=Depends(get_current_user),
):
    try:
        conversations = await get_conversations(current_user["user_id"])

        for conv in conversations:
            conv["_id"] = str(conv["_id"])

        response.status_code = 200
        return {
            "success": True,
            "message": "Conversations Loading",
            "count": len(conversations),
            "conversations": conversations,
        }
    except Exception as e:
        response.status_code = 404
        return {
            "success": False,
            "message": "Error in Requested Conversation",
        }


# *update the conversation  with conversation_id
@router.put("/update/{conversation_id}")
async def update(
    conversation_id: str,
    request: UpdateConversationRequest,
    response: Response,
    current_user=Depends(get_current_user),
):

    try:
        update_data = {}

        if request.title:
            update_data["title"] = request.title

        update_data["updated_at"] = datetime.utcnow()

        result = await update_conversation(conversation_id, update_data)

        if result.modified_count == 0:
            response.status_code = 404
            return {
                "success": False,
                "message": "Updated Conversation Not Found",
            }

        response.status_code = 200
        return {
            "success": True,
            "message": "Conversation updated",
            "conversation": result,
        }

    except Exception as e:
        response.status_code = 500
        return {
            "success": True,
            "message": "Server Error",
        }


# *delete the conversation  with conversation_id
@router.delete("/delete/{conversation_id}")
async def delete(
    conversation_id: str,
    response: Response,
    current_user=Depends(get_current_user),
):

    try:
        conversation = await get_conversation(conversation_id)

        if not conversation:
            response.status_code = 404
            return {
                "success": False,
                "message": "Conversation not found",
            }

        if conversation["user_id"] != current_user["user_id"]:

            response.status_code = 403
            return {
                "success": False,
                "message": "Unauthorized",
            }

        await delete_conversation(conversation_id)

        response.status_code = 200
        return {
            "success": True,
            "message": "Conversation deleted successfully",
        }

    except Exception as e:
        response.status_code = 500
        return {
            "success": True,
            "message": "Error while Deleting Conversation",
        }
