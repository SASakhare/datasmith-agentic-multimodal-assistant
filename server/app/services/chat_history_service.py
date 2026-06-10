# services/chat_history_service.py

from app.repositories.message_repository import create_message
from app.repositories.conversation_repository import (
    increment_message_count,
    update_conversation_summary,
)


async def store_chat(
    conversation_id: str,
    user_message: str,
    assistant_message: str,
):

    response_message=await create_message(
        conversation_id=conversation_id,
        role="assistant",
        content=assistant_message,
    )

    await increment_message_count(conversation_id)

    await update_conversation_summary(conversation_id)

    return response_message
