from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from decimal import Decimal


class RequestUser(BaseModel):
    username: str
    password: str


class ShowUser(BaseModel):
    username: str
    name: Optional[str]


class TokenSchema(BaseModel):
    access_token: str
    token_type: str


class RequestProject(BaseModel):
    name: str
    description: str | None


class UpdateProject(BaseModel):
    name: Optional[str]
    description: Optional[str]


class RequestBasicInfo(BaseModel):
    startDate: date
    calculationYear: int
    constructionYear: int
    monthsInStartYear: int
    monthsInEndYear: int
    installationCapacity: Decimal
    capital: Decimal
    profitBeforeTax: Decimal
    profitAfterTax: Decimal
    project_id: str


class ShowBasicInfo(BaseModel):
    id: int
    startDate: Optional[date]
    calculationYear: Optional[int]
    constructionYear: Optional[int]
    monthsInStartYear: Optional[int]
    monthsInEndYear: Optional[int]
    installationCapacity: Optional[Decimal]
    capital: Optional[float]
    profitBeforeTax: Optional[float]
    profitAfterTax: Optional[float]
    project_id: str


class UpdateBasicInfo(BaseModel):
    id: int
    startDate: Optional[date]
    calculationYear: Optional[int]
    constructionYear: Optional[int]
    monthsInStartYear: Optional[int]
    monthsInEndYear: Optional[int]
    installationCapacity: Optional[Decimal]
    capital: Optional[Decimal]
    profitBeforeTax: Optional[Decimal]
    profitAfterTax: Optional[Decimal]


# 分年度投资
class RequestInvestmentProgress(BaseModel):
    total: float
    assets: float
    others: float
    creditable: float
    ratio: float

    class Config:
        orm_mode = True


class ShowInvestmentProgress(BaseModel):
    id: float
    yearIndex: int
    total: float
    assets: float
    others: float
    creditable: float
    ratio: float
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


class RequestInvestment(BaseModel):
    calculationMethod: str
    investmentMethod: str
    ratioMethod: str
    ratioValue: float
    interestsCalculationMethod: str
    investmentProgress: List[RequestInvestmentProgress]
    project_id: str

    class Config:
        orm_mode = True


class UpdateInvestment(BaseModel):
    id: int
    calculationMethod: Optional[str]
    investmentMethod: Optional[str]
    ratioMethod: Optional[str]
    ratioValue: Optional[float]
    interestsCalculationMethod: Optional[str]
    investmentProgress: Optional[List[UpdateInvestmentProgress]]


class ShowInvestment(BaseModel):
    id: int
    calculationMethod: str
    investmentMethod: str
    ratioMethod: str
    ratioValue: float
    interestsCalculationMethod: str
    investmentProgress: List[ShowInvestmentProgress]


# Part 2
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


class RequestFinance(BaseModel):
    shortTermLoanInterests: Decimal
    workingCapitalLoanInterests: Decimal
    workingCapitalRatio: Decimal
    unitKilowattIndex: Decimal
    loanBanks: List[RequestLoanBank]
    project_id: str


class ShowFinance(BaseModel):
    id: int
    shortTermLoanInterests: Decimal
    workingCapitalLoanInterests: Decimal
    workingCapitalRatio: Decimal
    unitKilowattIndex: Decimal
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


# part 3

class RequestOperation(BaseModel):
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

    class Config:
        orm_mode = True


class ShowOperation(BaseModel):
    id: int
    yearIndex: int
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


class RequestExpense(BaseModel):
    salvageRate: float
    depreciationMethod: str
    depreciationPeriod: int
    amortizationPeriod: int
    otherAmortizationPeriod: int
    insuranceFeeMethod: str
    operations: List[RequestOperation]
    project_id: str


class ShowExpense(BaseModel):
    id: int
    salvageRate: float
    depreciationMethod: str
    depreciationPeriod: int
    amortizationPeriod: int
    insuranceFeeMethod: str
    otherAmortizationPeriod: int
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


# result part
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
    totalInvest: Optional[float]
    capitalForWorkingCapital: Optional[float]
    totalWorkingCapital: Optional[float]
    constructionCapital: Optional[float]
    constructionYearCapitals: Optional[List[float]]
    constructionYearLoans: Optional[List[float]]
    constructionYearInterests: Optional[List[float]]
