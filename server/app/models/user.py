from pydantic import BaseModel, EmailStr
from datetime import datetime


class User(BaseModel):

    user_id: str

    username: str

    email: EmailStr

    hashed_password: str

    is_active: bool = True

    created_at: datetime

    updated_at: datetime
