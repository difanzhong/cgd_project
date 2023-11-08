from sqlalchemy import func, select, update, delete
from fastapi import HTTPException, status

from api.repository.repo import Repository
from api.schemas.user import RequestUser
from api.models import Users


class UserRepository(Repository):

    @Repository.withCTX
    async def create(self, request: RequestUser, session=None):
        user = Users(username=request.username,
                     password=request.password)

        query = select(Users).where(Users.username == user.username)
        data = await session.execute(query)
        userInDB = data.scalar()
        if userInDB:
            return HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"用户名已存在"
            )
        session.add(user)
        await session.flush()
        return user

    @Repository.withCTX
    async def get(self, username: str, session=None):
        query = select(Users).where(Users.username == username)
        data = await session.execute(query)
        user = data.scalar()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"用户名不存在"
            )
        return user
