from fastapi import APIRouter, Depends
from fastapi_utils.cbv import cbv
from typing import List

from api.repository.project import ProjectRepository
from api.schemas.project import RequestProject, UpdateProject, ShowProject
from api.schemas.user import ShowUser
from api.services.auth import get_current_user


project_router = APIRouter(tags=['Projects'])


@cbv(project_router)
class ProjectCBV:
    project_repo: ProjectRepository = Depends(ProjectRepository.GetRepo)
    current_user: ShowUser = Depends(get_current_user)

    @project_router.get("/projects", response_model=List[ShowProject])
    async def list_projects(self):
        username = self.current_user.username
        return await self.project_repo.get_all_projects(username)

    @project_router.post("/projects", response_model=ShowProject)
    async def create(self, request: RequestProject):
        username = self.current_user.username
        return await self.project_repo.create(request, username)

    @project_router.put("/projects/{id}")
    async def update(self, request: UpdateProject, id: str):
        return await self.project_repo.update(request, id)

    @project_router.delete("/projects/{id}")
    async def delete(self, id: str):
        return await self.project_repo.destroy(id)

    @project_router.get("/projects/{id}")
    async def show(self, id: str):
        return await self.project_repo.show(id)
