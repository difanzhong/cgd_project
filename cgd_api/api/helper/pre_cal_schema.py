from decimal import Decimal
from typing import List
from pydantic import BaseModel


class OperationCostResultCalObj(BaseModel):
    calculation_year: int
    construction_year: int
    capacity: float
    material_cost: list[float]
    repair_cost: list[float]
    welfare_rates: list[float]
    annual_salarys: list[float]
    people: list[int]
    insurance: list[float]
    other1_cost: list[float]
    other2_cost: list[float]
    fixed_original_value: float


class ExpenseResultCalObj(BaseModel):
    working_capital: list[float]
    assets: list[float]
    others: list[int]
    creditable: list[float]
    ratio: list[float]
    amortization_period: int
    other_amortization_period: int
    salvage_rate: float
    depreciation_period: int


class ConstructionPeriodInterestsObj(BaseModel):
    yearly_investment: float
    captial_ratio: float
    long_term_rate: float
    capital_in_year_ratio: float
    no_of_months: int


class InvestmentResultCalObj(BaseModel):
    capacity: float
    working_capital_index: float
    construction_period_interests: List[ConstructionPeriodInterestsObj]
