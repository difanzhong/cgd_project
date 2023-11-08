from sqlalchemy import select, update
from fastapi import HTTPException, status
from typing import List

from api.repository.repo import Repository
from api.repository.loan_bank import LoanBankRepository
from api.models import Finance, LoanBank, Payment
from api.schemas.finance import RequestFinance, UpdateFinance, ShowFinance


class FinanceRepository(Repository):

    @Repository.withCTX
    async def get(self, project_id: str, session=None):
        if self.is_valid_uuid(project_id) is not True:
            return []
        query = select(Finance).where(Finance.project_id == project_id)
        data = await session.execute(query)
        return data.scalars().all()

    @Repository.withCTX
    async def create(self, request: RequestFinance, session=None):
        finance_obj = Finance(
            short_term_loan_interests=request.shortTermLoanInterests,
            working_capital_loan_interests=request.workingCapitalLoanInterests,
            working_capital_ratio=request.workingCapitalRatio,
            unit_kilowatt_index=request.unitKilowattIndex,
            project_id=request.project_id
        )
        session.add(finance_obj)
        await session.flush()
        await session.refresh(finance_obj)
        finance_id = finance_obj.id
        for bank_index, loan_bank in enumerate(request.loanBanks):
            loan_bank_obj = LoanBank(
                bank_index=bank_index+1,
                expect_years=loan_bank.expectYears,
                grace=loan_bank.grace,
                frequency=loan_bank.frequency,
                payment_method=loan_bank.paymentMethod,
                finance_id=finance_id
            )
            session.add(loan_bank_obj)
            await session.flush()
            await session.refresh(loan_bank_obj)
            loan_bank_id = loan_bank_obj.id
            for year_index, payment in enumerate(loan_bank.payments):
                payment_obj = Payment(
                    year_index=year_index+1,
                    value=payment.value,
                    unit="%",
                    loanBank_id=loan_bank_id,
                )
                session.add(payment_obj)
                await session.flush()
        await session.commit()
        return finance_obj

    @Repository.withCTX
    async def update(self, request: UpdateFinance, session=None):
        data = await session.execute(select(Finance).where(Finance.id == request.id))
        if not data.first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"project not found")

        query = update(Finance).where(Finance.id == request.id)
        if request.workingCapitalRatio:
            query = query.values(
                working_capital_ratio=request.workingCapitalRatio)
        if request.workingCapitalLoanInterests:
            query = query.values(
                working_capital_loan_interests=request.workingCapitalLoanInterests)
        if request.unitKilowattIndex:
            query = query.values(unit_kilowatt_index=request.unitKilowattIndex)
        if request.shortTermLoanInterests:
            query = query.values(
                short_term_loan_interests=request.shortTermLoanInterests)

        query.execution_options(synchronize_session="fetch")
        await session.execute(query)

    @staticmethod
    def to_api_schema(finance: Finance):
        return ShowFinance(
            id=finance.id,
            shortTermLoanInterests=finance.short_term_loan_interests,
            workingCapitalLoanInterests=finance.working_capital_loan_interests,
            workingCapitalRatio=finance.working_capital_ratio,
            unitKilowattIndex=finance.unit_kilowatt_index,
            loanBanks=[LoanBankRepository.to_api_schema(
                b) for b in finance.loan_banks],
            project_id=str(finance.project_id)
        )
