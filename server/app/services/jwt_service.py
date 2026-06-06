from jose import JWTError, jwt  # type: ignore
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = os.getenv("ALGORITHM")


def create_access_token(user_id: str):

    payload = {"sub": user_id, "exp": datetime.utcnow() + timedelta(days=1)}

    return jwt.encode(payload, str(SECRET_KEY), algorithm=str(ALGORITHM))


def verify_access_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY, # pyright: ignore[reportArgumentType]
            algorithms=[ALGORITHM] # type: ignore
        )

        return payload

    except JWTError:
        return None