from pydantic import BaseModel
from typing import Optional
from datetime import date
from decimal import Decimal


class BasicInfo(BaseModel):
    startDate: date
    calculationYear: int
    constructionYear: int
    monthsInStartYear: int
    monthsInEndYear: int
    installationCapacity: Decimal
    capital: Decimal
    profitBeforeTax: Decimal
    profitAfterTax: Decimal


class RequestBasicInfo(BasicInfo):
    project_id: str


class ShowBasicInfo(BasicInfo):
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
