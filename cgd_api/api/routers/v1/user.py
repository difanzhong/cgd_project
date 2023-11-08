from fastapi import APIRouter, Depends
from fastapi_utils.cbv import cbv
from typing import Annotated

from api.schemas.user import RequestUser, ShowUser
from api.services.auth import AuthService, get_current_user

user_router = APIRouter(tags=["User"])


@cbv(user_router)
class UserCBV:
    @user_router.post("/register")
    async def create(self, request: RequestUser):
        return await AuthService().create_user(request)

    @user_router.get("/user/me")
    async def read_users_me(self, current_user: Annotated[ShowUser, Depends(get_current_user)]):
        return current_user
