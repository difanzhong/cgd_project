from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal


class RequestPaymentYear(BaseModel):
    value: Optional[Decimal]

    class Config:
        orm_mode = True


class UpdatePaymentYear(BaseModel):
    id: int
    yearIndex: Optional[int]
    value: Optional[Decimal]
    unit: Optional[str]

    class Config:
        orm_mode = True


class ShowPaymentYear(BaseModel):
    id: int
    yearIndex: int
    value: Decimal
    unit: str
    loanBank_id: int

    class Config:
        orm_mode = True


class RequestLoanBank(BaseModel):
    expectYears: int
    grace: int
    frequency: int
    paymentMethod: str
    payments: List[RequestPaymentYear]

    class Config:
        orm_mode = True


class ShowLoanBank(BaseModel):
    id: int
    bankIndex: int | None
    expectYears: int | None
    grace: int | None
    frequency: int | None
    paymentMethod: str | None
    payments: List[ShowPaymentYear]

    class Config:
        orm_mode = True


class UpdateLoanBank(BaseModel):
    id: int
    expectYears: Optional[int]
    grace: Optional[int]
    frequency: Optional[int]
    paymentMethod: Optional[str]
    bankIndex: Optional[int]
    payments: Optional[List[UpdatePaymentYear]]

    class Config:
        orm_mode: True


class BaseFinance(BaseModel):
    shortTermLoanInterests: Decimal
    workingCapitalLoanInterests: Decimal
    workingCapitalRatio: Decimal
    unitKilowattIndex: Decimal
    project_id: str


class RequestFinance(BaseFinance):
    loanBanks: List[RequestLoanBank]
    project_id: str


class ShowFinance(BaseFinance):
    id: int
    loanBanks: List[ShowLoanBank] | None
    project_id: str

    class Config:
        orm_mode = True


class UpdateFinance(BaseModel):
    shortTermLoanInterests: Optional[Decimal]
    workingCapitalLoanInterests: Optional[Decimal]
    workingCapitalRatio: Optional[Decimal]
    unitKilowattIndex: Optional[Decimal]
    loanBanks: List[UpdateLoanBank]
    id: int
    project_id: str
