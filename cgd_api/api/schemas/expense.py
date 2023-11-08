from pydantic import BaseModel
from typing import List, Optional


class BaseOperation(BaseModel):
    numOfPeople: int
    annualSalary: int
    othersWithWelfare: float
    repairExpense: float
    insuranceExpense: float
    materialExpense: float
    otherExpense: float
    otherExpense2: Optional[float]
    otherFinanceExpense: float
    otherFinanceExpense2: Optional[float]


class RequestOperation(BaseOperation):
    pass

    class Config:
        orm_mode = True


class ShowOperation(BaseOperation):
    id: int
    expense_id: int


class UpdateOperation(BaseModel):
    id: int
    numOfPeople: Optional[int]
    annualSalary: Optional[int]
    othersWithWelfare: Optional[float]
    repairExpense: Optional[float]
    insuranceExpense: Optional[float]
    materialExpense: Optional[float]
    otherExpense: Optional[float]
    otherExpense2: Optional[float]
    otherFinanceExpense: Optional[float]
    otherFinanceExpense2: Optional[float]
    expense_id: int


class BaseExpense(BaseModel):
    salvageRate: float
    depreciationMethod: str
    depreciationPeriod: int
    amortizationPeriod: int
    otherAmortizationPeriod: int
    insuranceFeeMethod: str
    operations: List[RequestOperation]


class RequestExpense(BaseExpense):
    project_id: str


class ShowExpense(BaseExpense):
    id: int
    operations: List[ShowOperation]
    project_id: str

    class Config:
        orm_mode = True


class UpdateExpense(BaseModel):
    id: int
    salvageRate: Optional[float]
    depreciationMethod: Optional[str]
    depreciationPeriod: Optional[int]
    amortizationPeriod: Optional[int]
    insuranceFeeMethod: Optional[str]
    otherAmortizationPeriod: Optional[int]
    operations: Optional[List[UpdateOperation]]
