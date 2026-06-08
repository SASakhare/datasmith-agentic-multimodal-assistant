from fastapi import Cookie
from fastapi import HTTPException

from app.services.jwt_service import verify_access_token

from app.repositories.user_repository import (
    get_user_by_id,
)


async def get_current_user(access_token: str | None = Cookie(default=None)):

    if access_token is None:

        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    payload = verify_access_token(access_token)

    if payload is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user_id = payload["sub"]

    user = await get_user_by_id(user_id)

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user
