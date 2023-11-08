from sqlalchemy import select, update
from fastapi import HTTPException, status

from api.repository.repo import Repository
from api.models import BasicInformation
from api.schemas.basic_info import RequestBasicInfo, UpdateBasicInfo, ShowBasicInfo


class BasicInfoRepository(Repository):

    @Repository.withCTX
    async def show(self, project_id: str, session=None):
        if self.is_valid_uuid(project_id) is not True:
            return []
        query = select(BasicInformation).where(
            BasicInformation.project_id == project_id)
        data = await session.execute(query)
        return data.scalars().all()

    @Repository.withCTX
    async def create(self, request: RequestBasicInfo, session=None):
        new_basic_info = BasicInformation(
            start_date=request.startDate,
            calculation_year=request.calculationYear,
            construction_year=request.constructionYear,
            months_in_start_year=request.monthsInStartYear,
            months_in_end_year=request.monthsInEndYear,
            installation_capacity=request. installationCapacity,
            capital=request.capital,
            profit_before_tax=request.profitBeforeTax,
            profit_after_tax=request.profitAfterTax,
            project_id=request.project_id
        )
        session.add(new_basic_info)
        await session.flush()
        return new_basic_info

    @Repository.withCTX
    async def update(self, request: UpdateBasicInfo, session=None):
        data = await session.execute(select(BasicInformation).where(BasicInformation.id == request.id))

        if not data.first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"project not found")

        query = update(BasicInformation).where(
            BasicInformation.id == request.id)
        if request.startDate:
            query = query.values(start_date=request.startDate)
        if request.calculationYear:
            query = query.values(calculation_year=request.calculationYear)
        if request.constructionYear:
            query = query.values(construction_year=request.constructionYear)
        if request.monthsInEndYear:
            query = query.values(months_in_end_year=request.monthsInEndYear)
        if request.monthsInStartYear:
            query = query.values(
                months_in_start_year=request.monthsInStartYear)
        if request.capital:
            query = query.values(capital=request.capital)
        if request.profitBeforeTax:
            query = query.values(profit_before_tax=request.profitBeforeTax)
        if request.profitAfterTax:
            query = query.values(profit_after_tax=request.profitAfterTax)
        if request.installationCapacity:
            query = query.values(
                installation_capacity=request.installationCapacity)

        query.execution_options(synchronize_session="fetch")
        await session.execute(query)

    @staticmethod
    def to_api_schema(model_data):
        return ShowBasicInfo(
            id=model_data.id,
            startDate=model_data.start_date,
            calculationYear=model_data.calculation_year,
            constructionYear=model_data.construction_year,
            monthsInStartYear=model_data.months_in_start_year,
            monthsInEndYear=model_data.months_in_end_year,
            installationCapacity=model_data.installation_capacity,
            capital=model_data.capital,
            profitBeforeTax=model_data.profit_before_tax,
            profitAfterTax=model_data.profit_after_tax,
            project_id=str(model_data.project_id)
        )
