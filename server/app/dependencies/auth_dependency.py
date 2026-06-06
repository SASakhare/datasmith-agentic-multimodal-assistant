from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials

from services.jwt_service import verify_access_token

from repositories.user_repository import (
    get_user_by_id
)

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if payload is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user_id = payload["sub"]

    user = await get_user_by_id(user_id)

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user