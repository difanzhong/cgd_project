from sqlalchemy import select, update
from fastapi import HTTPException, status

from api.repository.repo import Repository
from api.repository.payment import PaymentRepository
from api.models import LoanBank
from api.schemas.finance import RequestLoanBank, UpdateLoanBank, ShowLoanBank


class LoanBankRepository(Repository):
    @Repository.withCTX
    async def get_all(self, finance_id: int, session=None):
        query = select(LoanBank).where(LoanBank.finance_id == finance_id)
        data = await session.execute(query)
        return data.scalars().all()

    @Repository.withCTX
    async def create(self, request: RequestLoanBank, session=None):
        loan_bank_obj = LoanBank(
            bank_index=request.bank_index,
            expectedYears=request.expectYears,
            grace=request.grace,
            interestAccrual=request.numOfInterestAccrual,
            paymentMethod=request.paymentMethod
        )
        session.add(loan_bank_obj)
        await session.flush()
        await session.refresh(loan_bank_obj)
        return loan_bank_obj

    @Repository.withCTX
    async def update(self, request: UpdateLoanBank, session=None):
        data = await session.execute(select(LoanBank).where(LoanBank.id == request.id))
        if not data.first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"project not found")

        query = update(LoanBank).where(LoanBank.id == request.id)

        if request.expectYears:
            query = query.values(expect_years=request.expectYears)
        if request.grace:
            query = query.values(grace=request.grace)
        if request.frequency:
            query = query.values(frequency=request.frequency)
        if request.paymentMethod:
            query = query.values(payment_method=request.paymentMethod)

        query.execution_options(synchronize_session="fetch")
        await session.execute(query)

    @staticmethod
    def to_api_schema(loan_bank: LoanBank):
        return ShowLoanBank(
            id=loan_bank.id,
            bankIndex=loan_bank.bank_index,
            expectYears=loan_bank.expect_years,
            grace=loan_bank.grace,
            frequency=loan_bank.frequency,
            paymentMethod=loan_bank.payment_method,
            paymentYears=[PaymentRepository.to_api_schema(
                p) for p in loan_bank.payments],
            finance_id=loan_bank.finance_id
        )
