from ..db import db
from uuid import UUID


class Repository:
    def __init__(self, shared_session=None) -> None:
        self._shared_session = shared_session
        self._ctx = None

    @staticmethod
    def withCTX(func):
        async def wrapped(self, *a, **kw):
            if self._shared_session is None:
                async with db.session() as session:
                    async with session.begin():
                        return await func(self, *a, **kw, session=session)

            else:
                return await func(self, *a, **kw, session=self._shared_session)

        return wrapped

    @staticmethod
    def is_valid_uuid(uuid_to_test, version=4):
        try:
            uuid_obj = UUID(uuid_to_test, version=version)
        except ValueError:
            return False
        return str(uuid_obj) == uuid_to_test

    @classmethod
    async def GetRepo(cls):
        async with db.session() as session:
            async with session.begin():
                yield cls(session)
