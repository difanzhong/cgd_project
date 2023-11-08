from typing import List, Optional
from pydantic import BaseModel


class TotalExpenseShow(BaseModel):
    constructionYear: int
    calculationYear: int
    material: Optional[List[float]]
    salaryWithWelfare: Optional[List[float]]
    repair: Optional[List[float]]
    insurance: Optional[List[float]]
    other1: Optional[List[float]]
    other2: Optional[List[float]]
    depreciation: Optional[List[float]]
    amortization: Optional[List[float]]
    loan: Optional[List[List[float]]]


class InvestmentShow(BaseModel):
    constructionYear: int
    totalInvestment: List[float]
    constructionPeriodCapital: List[float]
    constructionPeriodYearlyInvestmentList: Optional[List[float]]
    constructionPeriodYearlyCapitalList: Optional[List[float]]
    constructionPeriodYearlyDebtList: Optional[List[float]]
    debtForConstruction: Optional[List[float]]
    debtForInterests: Optional[List[float]]
    capitalAsWorkingCapital: Optional[List[float]]
