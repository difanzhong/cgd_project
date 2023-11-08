from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from .models import Base

class DB():
    engine = None
    session: AsyncSession = None
    _engine_config = None

    @classmethod
    def CreateEngine(cls, engine_config):
        cls._engine_config = engine_config
        cls.engine = create_async_engine(engine_config)
        cls.session = sessionmaker(cls.engine, expire_on_commit=False, class_=AsyncSession)

    @classmethod
    async def InitDB(cls, engine_config=None):
        if engine_config is not None:
            cls.CreateEngine(engine_config)

        async with cls.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    @classmethod
    async def TestInit(cls, engine_config=None):
        if engine_config is not None:
            cls.CreateEngine(engine_config)

        async with cls.engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)

        async with cls.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)


db = DB()
