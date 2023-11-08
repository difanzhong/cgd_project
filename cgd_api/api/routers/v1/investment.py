from fastapi import APIRouter, Depends
from fastapi_utils.cbv import cbv
from typing import List

from api.services.auth import get_current_user
from api.repository.investment import InvestmentRepository
from api.repository.investment_progress import InvestmentProgressRepository
from api.schema import RequestInvestment, UpdateInvestment, ShowInvestment, ShowInvestmentProgress


investment_router = APIRouter(tags=["Investment"], dependencies=[
    Depends(get_current_user)])


@cbv(investment_router)
class ProjectCBV:
    investment_repo: InvestmentRepository = Depends(
        InvestmentRepository.GetRepo)
    investment_progress_repo: InvestmentProgressRepository = Depends(
        InvestmentProgressRepository.GetRepo)

    @investment_router.get("/projects/{project_id}/investment",  response_model=List[ShowInvestment])
    async def get(self, project_id: str):
        investment_list = await self.investment_repo.get(project_id)
        return [ShowInvestment(
            id=e.id,
            calculationMethod=e.calculation_method,
            investmentMethod=e.investment_method,
            ratioMethod=e.ratio_method,
            ratioValue=e.ratio_value,
            interestsCalculationMethod=e.interests_calculation_method,
            investmentProgress=[ShowInvestmentProgress(
                id=i.id,
                yearIndex=i.year_index,
                total=i.total,
                assets=i.assets,
                others=i.others,
                creditable=i.creditable,
                ratio=i.ratio,
                investments_id=e.id
            ) for i in (await self.investment_progress_repo.get(e.id))],
            project_id=str(project_id)
        ) for e in investment_list]

    @investment_router.post("/investment")
    async def create(self, request: RequestInvestment):
        return await self.investment_repo.create(request)

    @investment_router.put("/investment")
    async def update(self, request: UpdateInvestment):
        if request.id:
            await self.investment_repo.update(request)
        if len(request.investmentProgress) > 0:
            for progress in request.investmentProgress:
                await self.investment_progress_repo.update(progress)
