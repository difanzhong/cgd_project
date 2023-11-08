from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from typing import Annotated

from ...services.auth import AuthService
from ...schema import TokenSchema

auth_router = APIRouter(tags=["Auth"])


@auth_router.post("/token")
async def authenticate(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> TokenSchema | None:
    return await AuthService().authenticate(form_data)
