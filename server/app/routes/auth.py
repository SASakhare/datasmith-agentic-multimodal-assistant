from uuid import uuid4
from fastapi import APIRouter, HTTPException, Response

from app.models.user import User
from app.repositories.user_repository import get_user_by_email
from app.schemas.auth_schema import LoginRequest, RegisterRequest
from app.services.auth_service import hash_password, verify_password
from datetime import datetime
from app.repositories.user_repository import create_user
from app.services.jwt_service import create_access_token

router = APIRouter()


@router.post(
    "/register",
)
async def register(request: RegisterRequest, response: Response):

    try:

        existing_user = await get_user_by_email(request.email)

        if existing_user:
            response.status_code = 409
            return {
                "message": "email already exist",
                "success": False,
            }

        user = User(
            user_id=str(uuid4()),
            username=request.name,
            email=request.email,
            hashed_password=hash_password(request.password),
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        await create_user(user.model_dump())
        response.status_code = 200
        return {
            "success": True,
            "message": "User registered successfully",
        }

    except Exception as e:
        response.status_code = 400
        return {
            "success": False,
            "message": "Error while registering",
        }


@router.post("/login")
async def login(request: LoginRequest, response: Response):

    try:

        user = await get_user_by_email(request.email)

        if not user:
            response.status_code = 404
            return {
                "message": "User not found",
                "success": False,
            }

        if not verify_password(request.password, user["hashed_password"]):
            response.status_code = 401
            return {
                "message": "Password Invalid",
                "success": False,
            }

        token = create_access_token(user["user_id"])

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=60 * 60 * 24 * 1,
        )
        safe_user = dict(user)
        safe_user.pop("hashed_password", None)
        safe_user.pop("_id", None)
        safe_user.pop("is_active", None)
        safe_user.pop("created_at", None)
        safe_user.pop("updated_at", None)

        return {
            "success": True,
            "message": "User login successfully",
            "user": safe_user,
        }
    except Exception as e:

        response.status_code = 400
        return {
            "success": False,
            "message": "Error while logging",
        }
