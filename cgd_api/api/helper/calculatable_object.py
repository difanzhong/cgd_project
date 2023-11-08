from pydantic import BaseModel
from typing import List, Optional, Protocol


class Amortization(BaseModel):
    assets: float
    period: int
    others: float
    other_period: int


class InvestProgress(BaseModel):
    total: float
    assets: float
    others: float
    creditable: float


class Salvage(BaseModel):
    salvage_rate: float
    depreciation_period: int
    invest_progress: InvestProgress
