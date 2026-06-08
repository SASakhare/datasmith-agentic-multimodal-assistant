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
async def register(request: RegisterRequest):

    existing_user = await get_user_by_email(request.email)

    if existing_user:

        raise HTTPException(status_code=400, detail="Email already exist")

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

    return {"success": True, "message": "User registered successfully"}


@router.post("/login")
async def login(request: LoginRequest, response: Response):
    user = await get_user_by_email(request.email)

    if not user:

        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(request.password, user["hashed_password"]):

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

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

    return {
        "success": True,
        "message": "User login successfully",
        "user": safe_user,
    }
