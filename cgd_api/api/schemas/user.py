from pydantic import BaseModel
from typing import Optional


class BaseUser(BaseModel):
    username: str


class RequestUser(BaseUser):
    password: str


class ShowUser(BaseUser):
    name: Optional[str]
