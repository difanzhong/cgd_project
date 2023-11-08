from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BaseProject(BaseModel):
    name: str
    description: str | None


class RequestProject(BaseProject):
    pass


class ShowProject(BaseProject):
    id: str
    created: datetime | None
    updated: datetime | None


class UpdateProject(BaseModel):
    name: Optional[str]
    description: Optional[str]
