# services/chat_history_service.py

from repositories.message_repository import create_message
from repositories.conversation_repository import increment_message_count


async def store_chat(
    conversation_id: str,
    user_message: str,
    assistant_message: str,
):

    await create_message(
        conversation_id=conversation_id,
        role="user",
        content=user_message,
    )

    await create_message(
        conversation_id=conversation_id,
        role="assistant",
        content=assistant_message,
    )

    await increment_message_count(conversation_id)

    await increment_message_count(conversation_id)