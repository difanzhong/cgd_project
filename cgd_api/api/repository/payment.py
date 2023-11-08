from sqlalchemy import select, update
from fastapi import HTTPException, status

from api.repository.repo import Repository
from api.models import Payment
from api.schemas.finance import RequestPaymentYear, UpdatePaymentYear, ShowPaymentYear


class PaymentRepository(Repository):
    @Repository.withCTX
    async def get_all(self, loan_bank_id: int, session=None):
        query = select(Payment).where(Payment.loanBank_id == loan_bank_id)
        data = await session.execute(query)
        return data.scalars().all()

    @Repository.withCTX
    async def create(self, request: RequestPaymentYear, session=None):
        payment_obj = Payment(
            year_index=request.yearIndex,
            value=request.value,
            unit=request.unit,
            loanBank_id=request.loanBank_id
        )
        session.add(payment_obj)
        await session.flush()
        return payment_obj

    @Repository.withCTX
    async def update(self, request: UpdatePaymentYear, session=None):
        data = await session.execute(select(Payment).where(Payment.id == request.id))
        if not data.first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"project not found")

        query = update(Payment).where(Payment.id == request.id)
        if request.yearIndex:
            query = query.values(year_index=request.yearIndex)
        if request.value:
            query = query.values(value=request.value)
        if request.unit:
            query = query.values(unit=request.unit)

        query.execution_options(synchronize_session="fetch")
        await session.execute(query)

    @staticmethod
    def to_api_schema(payment: Payment):
        return ShowPaymentYear(
            id=payment.id,
            yearIndex=payment.year_index,
            value=payment.value,
            unit=payment.unit,
            loanBank_id=payment.loanBank_id
        )
