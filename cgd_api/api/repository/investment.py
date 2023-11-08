from sqlalchemy import select, update
from fastapi import HTTPException, status

from api.repository.repo import Repository
from api.repository.investment_progress import InvestmentProgressRepository
from api.models import Investment, InvestmentProgress
from api.schemas.investment import RequestInvestment, UpdateInvestment, ShowInvestment


class InvestmentRepository(Repository):
    @Repository.withCTX
    async def get(self, project_id: str, session=None):
        if self.is_valid_uuid(project_id) is not True:
            return []
        query = select(Investment).where(Investment.project_id == project_id)
        data = await session.execute(query)
        return data.scalars().all()

    @Repository.withCTX
    async def create(self, request: RequestInvestment, session=None):

        investment_obj = Investment(
            calculation_method=request.calculationMethod,
            investment_method=request.investmentMethod,
            ratio_method=request.ratioMethod,
            ratio_value=request.ratioValue,
            interests_calculation_method=request.interestsCalculationMethod,
            project_id=request.project_id
        )
        session.add(investment_obj)
        await session.flush()
        await session.refresh(investment_obj)
        investments_id = investment_obj.id
        for index, progress in enumerate(request.investmentProgress):
            progress_obj = InvestmentProgress(
                year_index=index+1,
                total=progress.total,
                assets=progress.assets,
                others=progress.others,
                creditable=progress.creditable,
                ratio=progress.ratio,
                investment_id=investments_id
            )
            session.add(progress_obj)
            await session.flush()
        await session.commit()
        return investment_obj

    @Repository.withCTX
    async def update(self, request: UpdateInvestment, session=None):
        data = await session.execute(select(Investment).where(Investment.id == request.id))
        if not data.first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"project not found")

        query = update(Investment).where(Investment.id == request.id)
        if request.calculationMethod:
            query = query.values(calculation_method=request.calculationMethod)
        if request.interestsCalculationMethod:
            query = query.values(
                interests_calculation_method=request.interestsCalculationMethod)
        if request.ratioValue:
            query = query.values(ratio_value=request.ratioValue)
        if request.ratioMethod:
            query = query.values(ratio_method=request.ratioMethod)
        if request.interestsCalculationMethod:
            query = query.values(
                interests_calculation_method=request.interestsCalculationMethod)

        query.execution_options(synchronize_session="fetch")
        await session.execute(query)

    @staticmethod
    def to_api_schema(investment: Investment):
        return ShowInvestment(
            id=investment.id,
            calculationMethod=investment.calculation_method,
            investmentMethod=investment.investment_method,
            ratioMethod=investment.ratio_method,
            ratioValue=investment.ratio_value,
            interestsCalculationMethod=investment.interests_calculation_method,
            investmentProgress=[InvestmentProgressRepository.to_api_schema(
                p) for p in investment.investment_progress],
            project_id=investment.project_id
        )
