from sqlalchemy import select, update
from fastapi import HTTPException, status

from api.repository.repo import Repository
from api.models import InvestmentProgress
from api.schemas.investment import UpdateInvestmentProgress, ShowInvestmentProgress


class InvestmentProgressRepository(Repository):
    @Repository.withCTX
    async def get(self, investment_id: str, session=None):
        query = select(InvestmentProgress).where(
            InvestmentProgress.investment_id == investment_id)
        data = await session.execute(query)
        return data.scalars().all()

    @Repository.withCTX
    async def update(self, request: UpdateInvestmentProgress, session=None):
        data = await session.execute(select(InvestmentProgress).where(InvestmentProgress.id == request.id))
        if not data.first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"project not found")

        query = update(InvestmentProgress).where(
            InvestmentProgress.id == request.id
        ).values(
            total=request.total,
            assets=request.assets,
            others=request.others,
            creditable=request.creditable,
            ratio=request.ratio
        )
        query.execution_options(synchronize_session="fetch")
        await session.execute(query)

    @staticmethod
    def to_api_schema(investment_progress: InvestmentProgress):
        return ShowInvestmentProgress(
            id=investment_progress.id,
            yearIndex=investment_progress.year_index,
            total=investment_progress.total,
            assets=investment_progress.assets,
            others=investment_progress.others,
            creditable=investment_progress.creditable,
            ratio=investment_progress.ratio,
            investment_id=investment_progress.investment_id
        )
