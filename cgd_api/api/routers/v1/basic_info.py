from fastapi import APIRouter, Depends
from fastapi_utils.cbv import cbv
from typing import List

from api.repository.basic_info import BasicInfoRepository
from api.schemas.basic_info import RequestBasicInfo, UpdateBasicInfo, ShowBasicInfo
from api.services.auth import get_current_user

basic_info_router = APIRouter(tags=["Basic Information"],
                              dependencies=[Depends(get_current_user)])


@cbv(basic_info_router)
class ProjectCBV:
    basic_info_repo: BasicInfoRepository = Depends(BasicInfoRepository.GetRepo)

    @basic_info_router.get("/projects/{project_id}/basic_info", response_model=List[ShowBasicInfo])
    async def get(self, project_id: str):
        data = await self.basic_info_repo.show(project_id)
        return [BasicInfoRepository.to_api_schema(obj) for obj in data]

    @basic_info_router.post("/basic_info", tags=["Basic Information"], response_model=ShowBasicInfo)
    async def create(self, request: RequestBasicInfo):
        data = await self.basic_info_repo.create(request)
        return BasicInfoRepository.to_api_schema(data)

    @basic_info_router.put("/basic_info", tags=["Basic Information"])
    async def update(self, request: UpdateBasicInfo):
        return await self.basic_info_repo.update(request)
