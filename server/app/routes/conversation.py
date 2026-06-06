from fastapi import APIRouter
from fastapi import Depends
from dependencies.auth_dependency import get_current_user


router = APIRouter()


# * creating the conversation
@router.post("/create")
async def crete(
    current_user=Depends(get_current_user),
):
    pass


# *get single the conversation  with conversation id
@router.get("/{conversation_id}")
async def get_conv_by_id(
    current_user=Depends(get_current_user),
):
    pass


# *get all the conversation  with user id
@router.get("/user/{user_id}")
async def get_all_conv(
    current_user=Depends(get_current_user),
):
    pass


# *update the conversation  with conversation_id
@router.put("/update/{conversation_id}")
async def update(
    current_user=Depends(get_current_user),
):
    pass


# *delete the conversation  with conversation_id
@router.delete("/delete/{conversation_id}")
async def delete(
    current_user=Depends(get_current_user),
):
    pass
