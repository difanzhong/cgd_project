from fastapi import APIRouter, Depends
from fastapi_utils.cbv import cbv
from typing import List

from api.services.auth import get_current_user
from api.repository.expense import ExpenseRepository
from api.repository.operation import OperationRepository
from api.schemas.expense import RequestExpense, UpdateExpense, ShowExpense, ShowOperation

expense_router = APIRouter(tags=["Expense"],
                           dependencies=[Depends(get_current_user)])


@cbv(expense_router)
class ProjectCBV:
    expense_repo: ExpenseRepository = Depends(ExpenseRepository.GetRepo)
    operation_repo: OperationRepository = Depends(OperationRepository.GetRepo)

    @expense_router.get("/projects/{project_id}/expense", response_model=List[ShowExpense])
    async def get(self, project_id: str):
        expense_list = await self.expense_repo.show(project_id)
        result = []
        for e in expense_list:
            e.operations = await self.operation_repo.show(e.id)
            result.append(ExpenseRepository.to_api_schema(e))
        return [ExpenseRepository.to_api_schema(e) for e in expense_list]

    @expense_router.post("/expense")
    async def create(self, request: RequestExpense):
        return await self.expense_repo.create(request)

    @expense_router.put("/expense")
    async def update(self, request: UpdateExpense):
        if request.id:
            await self.expense_repo.update(request)
        if len(request.operations) > 0:
            for b in request.operations:
                await self.operation_repo.update(b)
