from typing import List
from dataclasses import dataclass
from sympy import symbols, Eq, solve

# 投资
# 项目总投资


@dataclass
class WorkingCapitalTotalCalculator:
    capacity: float
    working_capital_index: float

    def calculate(self) -> float:
        return float(self.capacity * 1000 * self.working_capital_index / 10000)


@dataclass
class ConstructionPeriodInterestsObj:
    yearly_investment: float
    captial_ratio: float
    long_term_rate: float
    capital_in_year_ratio: float
    no_of_months: int


@dataclass
class CapitalAsWorkingCapitalCalculator:
    capacity: float
    working_capital_index: float
    working_captial_ratio: float

    def calculate(self) -> float:
        return float(self.capacity * 1000 * self.working_capital_index / 10000 * self.working_captial_ratio)


# 动态计算
@dataclass
class ConstructionPeriodInvestmentCalculator:
    total_investment: float
    working_capital_total: float

    def calculate(self) -> float:
        return float(self.total_investment - self.working_capital_total)


@dataclass
class ConstructionPeriodCapitalCalculator:
    construction_period_investment: float
    capital_ratio: float

    def calculate(self) -> float:
        return float(self.construction_period_investment * self.capital_ratio)


@dataclass
class YearlyInvestmentCapitalCalculator:
    construction_period_capital: float
    year_capital_ratio: float

    def calculate(self) -> float:
        return float(self.construction_period_capital * self.year_capital_ratio)


@dataclass
class YearlyDebtCalculator:
    yearly_investment_capital: float
    yearly_investment_total: float

    def calculate(self) -> float:
        return float(self.yearly_investment_total - self.yearly_investment_capital)


class YearlyConstructionPriodInterestsCalculator:
    yearly_debt_total: float
    long_term_rate: float
    number_of_months: int
    year_index: int = 0

    def calculate(self) -> float:
        if self.year_index == 1:
            self.long_term_rate *= 0.5
        return float(self.yearly_debt_total * self.long_term_rate * (self.number_of_months / 12))


class YearlyTotalInvestmentCalculator:
    yearly_investment_total: float
    yearly_construction_period_interests: float

    def calculate(self) -> float:
        return float(self.yearly_investment_total + self.yearly_construction_period_interests)


@dataclass
class ProjectTotalInvestmentCalculator:
    construction_period_interests: List[ConstructionPeriodInterestsObj]
    working_capital_total: float
    equations = []
    symbols: symbols = symbols('aa bb1')

    def calculate(self) -> float:
        # if len(self.construction_period_interests) != 2:
        #     return 0.0

        aa, bb1 = self.symbols
        # if len(self.construction_period_interests) != 2:
        #     return 0.0

        self.equations.append(
            Eq(
                aa - (self.working_capital_total + bb1 +
                      self.construction_period_interests[0].yearly_investment
                      ), 0
            )
        )
        for i, c in enumerate(self.construction_period_interests):
            if i == 0:
                self.equations.append(
                    Eq(
                        (c.yearly_investment - ((aa - self.working_capital_total) * c.captial_ratio) *
                         c.capital_in_year_ratio) * c.no_of_months / 12 * c.long_term_rate/2 - bb1, 0
                    )
                )
            # else:
            #     c1 = self.construction_period_interests[i-1]
            #     self.equations.append(
            #         Eq(
            #             (c1.yearly_investment - (aa - self.working_capital_total) * c1.captial_ratio * c1.capital_in_year_ratio + bb1) * c.long_term_rate +
            #             (c.yearly_investment - ((aa-self.working_capital_total) * c.captial_ratio) *
            #              c.capital_in_year_ratio) * c.long_term_rate/2 * c.no_of_months/12 - bb2, 0
            #         )
            #     )
        solution = solve(self.equations, aa, bb1, dict=True)

        return {
            "total_investment": float(solution[0][aa]),
            "first_year_interests": float(solution[0][bb1]),
        }


@dataclass
class CapitalInWorkingCapitalTotalCalculator:
    working_capital_total: float
    self_equity_ratio: float

    def calculate(self) -> float:
        return float(self.working_capital_total * self.self_equity_ratio)


# 静态计算
