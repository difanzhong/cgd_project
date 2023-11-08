from pydantic import BaseModel
from typing import List, Optional


class BaseInvestmentProgress(BaseModel):
    total: float
    assets: float
    others: float
    creditable: float
    ratio: float


class RequestInvestmentProgress(BaseInvestmentProgress):
    pass

    class Config:
        orm_mode = True


class ShowInvestmentProgress(BaseInvestmentProgress):
    id: float
    yearIndex: int
    investments_id: int

    class Config:
        orm_mode = True


class UpdateInvestmentProgress(BaseModel):
    id: int
    total: Optional[float]
    assets: Optional[float]
    others: Optional[float]
    creditable: Optional[float]
    ratio: Optional[float]

    class Config:
        orm_mode = True


class BaseInvestment(BaseModel):
    calculationMethod: str
    investmentMethod: str
    ratioMethod: str
    ratioValue: float
    interestsCalculationMethod: str
    investmentProgress: List[RequestInvestmentProgress]


class RequestInvestment(BaseInvestment):
    project_id: str

    class Config:
        orm_mode = True


class ShowInvestment(BaseInvestment):
    id: int


class UpdateInvestment(BaseModel):
    id: int
    calculationMethod: Optional[str]
    investmentMethod: Optional[str]
    ratioMethod: Optional[str]
    ratioValue: Optional[float]
    interestsCalculationMethod: Optional[str]
    investmentProgress: Optional[List[UpdateInvestmentProgress]]
