from sqlalchemy import func, select, update, delete
from fastapi import HTTPException, status

from api.repository.repo import Repository
from api.models import Project
from api.schemas.project import RequestProject, UpdateProject, ShowProject


class ProjectRepository(Repository):

    @Repository.withCTX
    async def get_all_projects(self, username: str, session=None):
        query = select(Project).where(Project.username == username)
        data = await session.execute(query)

        result = []
        model_data_list = data.scalars().all()

        for model_data in model_data_list:
            result.append(self.to_api_schema(model_data))

        return result

    @Repository.withCTX
    async def show(self, id: str, session=None):
        query = select(Project).where(Project.id == id)
        data = await session.execute(query)
        project = data.scalar()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"not available"
            )
        return self.to_api_schema(project)

    @Repository.withCTX
    async def create(self, request: RequestProject, username: str, session=None):
        new_project = Project(
            name=request.name,
            description=request.description,
            username=username,
            created=func.now()
        )
        session.add(new_project)
        await session.flush()
        await session.refresh(new_project)
        return self.to_api_schema(new_project)

    @Repository.withCTX
    async def update(self, request: UpdateProject, id: str, session=None):

        data = await session.execute(select(Project).where(Project.id == id))

        return_obj = data.first()

        if not return_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"project not found")
        query = update(Project).where(Project.id == id)
        query = query.values(updated=func.now())
        if request.name:
            query = query.values(name=request.name)
        if request.description:
            query = query.values(description=request.description)

        query.execution_options(synchronize_session="fetch")
        await session.execute(query)
        await session.commit()
        return None

    @Repository.withCTX
    async def destroy(self, id: str, session=None):
        query = select(Project).where(id == id)
        data = await session.execute(query)

        if not data.scalar():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"project not found")

        await session.execute(delete(Project).where(Project.id == id))
        await session.flush()
        return 'removed'

    def to_api_schema(self, model_data):
        return ShowProject(
            id=str(model_data.id),
            name=model_data.name,
            description=model_data.description,
            created=model_data.created if model_data.created else None,
            updated=model_data.updated if model_data.updated else None
        )
