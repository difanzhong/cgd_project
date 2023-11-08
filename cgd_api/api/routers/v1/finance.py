from fastapi import APIRouter, Depends
from fastapi_utils.cbv import cbv
from typing import Union, List

from api.services.auth import get_current_user
from api.repository.finance import FinanceRepository
from api.repository.loan_bank import LoanBankRepository
from api.repository.payment import PaymentRepository
from api.schemas.finance import RequestFinance, UpdateFinance, ShowLoanBank, ShowFinance, ShowPaymentYear


finance_router = APIRouter(tags=["Finance"], dependencies=[
                           Depends(get_current_user)])


@cbv(finance_router)
class ProjectCBV:
    finance_repo: FinanceRepository = Depends(FinanceRepository.GetRepo)
    loan_bank_repo: LoanBankRepository = Depends(LoanBankRepository.GetRepo)
    payment_repo: PaymentRepository = Depends(PaymentRepository.GetRepo)

    @finance_router.get("/projects/{project_id}/finance", response_model=List[ShowFinance])
    async def get(self, project_id: str):
        finance_list = await self.finance_repo.get(project_id)
        result = []
        for f in finance_list:
            loan_bank_list = await self.loan_bank_repo.get_all(f.id)
            sub_list = []
            if loan_bank_list:
                for l in loan_bank_list:
                    payment_list = await self.payment_repo.get_all(l.id)
                    payment_list = [ShowPaymentYear(
                        id=p.id, yearIndex=p.year_index, value=p.value, unit=p.unit, loanBank_id=p.loanBank_id) for p in payment_list]
                    sub_list.append(ShowLoanBank(
                        id=l.id,
                        bankIndex=l.bank_index,
                        expectYears=l.expect_years,
                        grace=l.grace,
                        frequency=l.frequency,
                        paymentMethod=l.payment_method,
                        payments=payment_list
                    ))
            result.append(ShowFinance(
                id=f.id,
                shortTermLoanInterests=f.short_term_loan_interests,
                workingCapitalLoanInterests=f.working_capital_loan_interests,
                workingCapitalRatio=f.working_capital_ratio,
                unitKilowattIndex=f.unit_kilowatt_index,
                loanBanks=sub_list,
                project_id=str(f.project_id)
            ))
        return result

    @finance_router.post("/finance")
    async def create(self, request: RequestFinance):
        return await self.finance_repo.create(request)

    @finance_router.put("/finance")
    async def update(self, request: UpdateFinance):
        if request.id:
            await self.finance_repo.update(request)
        if len(request.loanBanks) > 0:
            for b in request.loanBanks:
                await self.loan_bank_repo.update(b)
                if len(b.payments) > 0:
                    for p in b.payments:
                        await self.payment_repo.update(p)
