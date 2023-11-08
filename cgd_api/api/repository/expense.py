from sqlalchemy import select, update
from fastapi import HTTPException, status

from api.repository.repo import Repository
from api.repository.operation import OperationRepository
from api.models import Expense, Operation
from api.schemas.expense import RequestExpense, UpdateExpense, ShowExpense


class ExpenseRepository(Repository):
    operation_repo: OperationRepository = OperationRepository()

    @Repository.withCTX
    async def show(self, project_id: str, session=None):
        if self.is_valid_uuid(project_id) is not True:
            return []
        query = select(Expense).where(Expense.project_id == project_id)
        data = await session.execute(query)
        return data.scalars().all()

    @Repository.withCTX
    async def create(self, request: RequestExpense, session=None):
        expense_obj = Expense(
            salvage_rate=request.salvageRate,
            depreciation_method=request.depreciationMethod,
            depreciation_period=request.depreciationPeriod,
            amortization_period=request.amortizationPeriod,
            insurance_fee_method=request.insuranceFeeMethod,
            other_amortization_period=request.otherAmortizationPeriod,
            project_id=request.project_id
        )
        session.add(expense_obj)
        await session.flush()
        await session.refresh(expense_obj)
        expense_id = expense_obj.id
        for index, operation in enumerate(request.operations):
            operation_obj = Operation(
                year_index=index+1,
                people=operation.numOfPeople,
                annual_salary=operation.annualSalary,
                welfare=operation.othersWithWelfare,
                repair=operation.repairExpense,
                insurance=operation.insuranceExpense,
                material=operation.materialExpense,
                other_expense=operation.otherExpense,
                other_expense2=operation.otherExpense2,
                other_finance_expense=operation.otherFinanceExpense,
                other_finance_expense2=operation.otherFinanceExpense2,
                expense_id=expense_id
            )
            session.add(operation_obj)
            await session.flush()
        await session.commit()
        return expense_obj

    @Repository.withCTX
    async def update(self, request: UpdateExpense, session=None):
        data = await session.execute(select(Expense).where(Expense.id == request.id))
        if not data.first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"project not found")

        query = update(Expense).where(Expense.id == Expense.id)
        if request.salvageRate:
            query = query.values(salvage_rate=request.salvageRate)
        if request.depreciationMethod:
            query = query.values(
                depreciation_method=request.depreciationMethod)
        if request.depreciationPeriod:
            query = query.values(
                depreciation_period=request.depreciationPeriod)
        if request.amortizationPeriod:
            query = query.values(
                amortization_period=request.amortizationPeriod)
        if request.otherAmortizationPeriod:
            query = query.values(
                other_amortization_period=request.otherAmortizationPeriod)
        if request.insuranceFeeMethod:
            query = query.values(
                insurance_fee_method=request.insuranceFeeMethod)

        query.execution_options(synchronize_session="fetch")
        await session.execute(query)

    @staticmethod
    def to_api_schema(expense: Expense):
        return ShowExpense(
            id=expense.id,
            salvageRate=expense.salvage_rate,
            depreciationMethod=expense.depreciation_method,
            depreciationPeriod=expense.depreciation_period,
            amortizationPeriod=expense.amortization_period,
            insuranceFeeMethod=expense.insurance_fee_method,
            otherAmortizationPeriod=expense.other_amortization_period,
            operations=[OperationRepository.to_api_schema(
                i) for i in expense.operations],
            project_id=str(expense.project_id)
        )
