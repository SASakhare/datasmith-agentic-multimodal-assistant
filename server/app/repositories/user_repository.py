from database.collections import users_collection


async def create_user(user: dict):

    result = await users_collection.insert_one(user)

    return str(result.inserted_id)


async def get_user_by_email(email: str):

    return await users_collection.find_one(
        {"email": email}
    )


async def get_user_by_id(user_id: str):

    return await users_collection.find_one(
        {"user_id": user_id}
    )















