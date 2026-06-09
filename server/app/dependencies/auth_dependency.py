from fastapi import Cookie
from fastapi import HTTPException, Response, Request

from app.services.jwt_service import verify_access_token

from app.repositories.user_repository import (
    get_user_by_id,
)


from fastapi import Request, Response, HTTPException


async def get_current_user(request: Request, response: Response):
    try:
        auth = request.headers.get("Authorization")

        if not auth or not auth.startswith("Bearer "):
            response.status_code = 401
            raise HTTPException(
                status_code=401,
                detail={"success": False, "message": "Not authenticated"},
            )

        token = auth.split(" ")[1]
        payload = verify_access_token(token)

        if payload is None:
            response.status_code = 401
            raise HTTPException(
                status_code=401, detail={"success": False, "message": "Invalid token"}
            )

        user_id = payload["sub"]
        user = await get_user_by_id(user_id)

        if user is None:
            response.status_code = 404
            raise HTTPException(
                status_code=404, detail={"success": False, "message": "User not found"}
            )

        return user

    except HTTPException as e:
        
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "message": "Internal server error"},
        )
