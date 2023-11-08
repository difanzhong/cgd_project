from dataclasses import dataclass
from typing import Protocol


class Calculator(Protocol):
    def calculate(self) -> float: ...

# Expense 折旧与摊销


@dataclass
class AmortizationCalculator:
    assets: float
    period: int
    others: float
    other_period: int

    def calculate(self) -> float:
        if self.other_period == 0:
            return 0
        if self.other_period == 0:
            return 0
        return float(float(self.assets/self.period) + float(self.others/self.other_period))


@dataclass
class SalvageCalculator:
    salvage_rate: float
    depreciation_period: int
    fixed_original_value: float

    def calculate(self) -> float:
        return float(self.fixed_original_value * float(1-self.salvage_rate) / float(self.depreciation_period))


# 固定资产原值

@dataclass
class FixedOriginalValueCalculator:
    working_capital: float
    assets: float
    others: float
    creditable: float

    def calculate(self) -> float:
        return float(self.working_capital - self.assets - self.others - self.creditable)


@dataclass
class WorkingCapitalCalculator:
    total_investment: float
    construction_period_total_interests: float

    def calculate(self) -> float:
        return self.total_investment + self.construction_period_total_interests


# Operation Costs 运营成本

@dataclass
class MaterialCalculator:
    material: float
    capacity: float

    def calculate(self) -> float:
        return self.material * self.capacity * 0.1


@dataclass
class SalaryWelfareCalculator:
    annual_salary: float
    people: int
    welfare_rate: float

    def calculate(self) -> float:
        return self.annual_salary * self.people * (1 + self.welfare_rate * 0.1)


@dataclass
class RepairCalculator:
    repair_fee: float
    capacity: float

    def calculate(self) -> float:
        return self.repair_fee * self.capacity * 0.1


@dataclass
class InsuranceCalculator:
    insurance_rate: float
    fixed_original_value: float

    def calculate(self) -> float:
        return self.insurance_rate * self.fixed_original_value


@dataclass
class Other1Calculator:
    other_expense: float
    capacity: float

    def calculate(self) -> float:
        return self.other_expense * self.capacity * 0.1


@dataclass
class Other2Calculator:
    other_expense2: float
    capacity: float

    def calculate(self) -> float:
        return self.other_expense2 * self.capacity * 0.1


# 等额还本利息照付 (等额本金）Annuity
@dataclass
class LoanAnnuityBaseRepaymentCalculator:
    expect_years: int
    first_year_debt: float

    def calculate(self) -> float:
        return float(self.first_year_debt / self.expect_years)


@dataclass
class LoanAnnuityTotalRepaymentCalculator:
    interests_repayment: float
    base_repayment: float

    def calculate(self) -> float:
        return float(self.interests_repayment + self.base_repayment)


# 等额本息 Linear
@dataclass
class LoanLinearBaseRepaymentCalculator:
    expect_years: int
    first_year_debt: float
    long_term_rate: float

    def calculate(self) -> float:
        return float(
            self.first_year_debt * self.long_term_rate * (1 + self.long_term_rate) ** self.expect_years /
            ((1 + self.long_term_rate) ** self.expect_years - 1)
        )


@dataclass
class LoanLinearTotalRepaymentCalculator:
    interests_repayment: float
    base_repayment: float

    def calculate(self) -> float:
        return float(self.base_repayment-self.interests_repayment)


# 利息计算 适用两种方式
@dataclass
class LoanInterestsRepaymentCalculator:
    long_term_rate: float
    total_debt: float

    def calculate(self) -> float:
        return float(self.long_term_rate * self.total_debt)


# 财务费用
@dataclass
class FinanceCalculator:
    short_term_loan_interests: float
    working_capital_loan_interests: float
    yearly_repayment_interests: float

    def calculate(self) -> float:
        return float(self.short_term_loan_interests + self.working_capital_loan_interests + self.yearly_repayment_interests)
