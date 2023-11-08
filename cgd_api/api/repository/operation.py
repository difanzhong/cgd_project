from sqlalchemy import select, update
from fastapi import HTTPException, status

from api.repository.repo import Repository
from api.models import Operation
from api.schemas.expense import RequestOperation, UpdateOperation, ShowOperation


class OperationRepository(Repository):
    @Repository.withCTX
    async def show(self, expense_id: id, session=None):
        query = select(Operation).where(Operation.expense_id ==
                                        expense_id).order_by(Operation.year_index)
        data = await session.execute(query)
        return data.scalars().all()

    @Repository.withCTX
    async def create(self, request: RequestOperation, session=None):
        expense_obj = Operation(
            year_index=request.year_index,
            people=request.numOfPeople,
            annualSalary=request.annualSalary,
            welfare=request.othersWithWelfare,
            repair=request.repairExpense,
            insurance=request.insuranceExpense,
            material=request.materialExpense,
            other_expense=request.otherExpense,
            other_expense2=request.otherExpense2,
            other_finance_expense=request.otherFinanceExpense,
            other_finance_expense2=request.otherFinanceExpense2,
            expense_id=request.expense_id
        )
        session.add(expense_obj)
        await session.flush()
        return expense_obj

    @Repository.withCTX
    async def update(self, request: UpdateOperation, session=None):
        data = await session.execute(select(Operation).where(Operation.id == request.id))
        if not data.first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"project not found")

        query = update(Operation).where(Operation.id == request.id)
        if request.numOfPeople:
            query = query.values(people=request.numOfPeople)
        if request.annualSalary:
            query = query.values(annual_salary=request.annualSalary)
        if request.othersWithWelfare:
            query = query.values(welfare=request.othersWithWelfare)
        if request.repairExpense:
            query = query.values(repair=request.repairExpense)
        if request.insuranceExpense:
            query = query.values(insurance=request.insuranceExpense)
        if request.materialExpense:
            query = query.values(material=request.materialExpense)
        if request.otherExpense:
            query = query.values(other_expense=request.otherExpense)
        if request.otherExpense2:
            query = query.values(other_expense2=request.otherExpense2)
        if request.otherFinanceExpense:
            query = query.values(
                other_finance_expense=request.otherFinanceExpense)
        if request.otherFinanceExpense2:
            query = query.values(
                other_finance_expense2=request.otherFinanceExpense2)

        query.execution_options(synchronize_session="fetch")
        await session.execute(query)

    @staticmethod
    def to_api_schema(obj: Operation):
        return ShowOperation(
            id=obj.id,
            yearIndex=obj.year_index,
            numOfPeople=obj.people,
            annualSalary=obj.annual_salary,
            othersWithWelfare=obj.welfare,
            repairExpense=obj.repair,
            insuranceExpense=obj.insurance,
            materialExpense=obj.material,
            otherExpense=obj.other_expense,
            otherExpense2=obj.other_expense2,
            otherFinanceExpense=obj.other_finance_expense,
            otherFinanceExpense2=obj.other_finance_expense2,
            expense_id=obj.expense_id
        )
