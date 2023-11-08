from typing import List

from api.repository.basic_info import BasicInfoRepository
from api.repository.investment import InvestmentRepository
from api.repository.investment_progress import InvestmentProgressRepository
from api.repository.finance import FinanceRepository

from api.helper.pre_cal_schema import InvestmentResultCalObj, ConstructionPeriodInterestsObj
from api.helper.project_investment_calculator import CapitalInWorkingCapitalTotalCalculator, ProjectTotalInvestmentCalculator, CapitalAsWorkingCapitalCalculator, ConstructionPeriodCapitalCalculator, YearlyInvestmentCapitalCalculator, YearlyDebtCalculator


class InvestmentResultManager:
    basic_info_repo: BasicInfoRepository = BasicInfoRepository()
    investment_repo: InvestmentRepository = InvestmentRepository()
    investment_progress_repo: InvestmentProgressRepository = InvestmentProgressRepository()
    finance_repo: FinanceRepository = FinanceRepository()

    def __init__(self, project_id: str):
        self.project_id = project_id

    async def get_pre_calculation_obj(self) -> InvestmentResultCalObj:
        basic_info = await self.basic_info_repo.show(self.project_id)
        investment = await self.investment_repo.get(self.project_id)
        investment_id = investment[0].id
        investment_progress_list = await self.investment_progress_repo.get(investment_id)
        finance = await self.finance_repo.get(self.project_id)

        construction_period_list = []
        for progress in investment_progress_list:
            construction_period_list.append(ConstructionPeriodInterestsObj(
                yearly_investment=progress.total,
                captial_ratio=finance[0].working_capital_ratio/100,
                long_term_rate=finance[0].short_term_loan_interests/100,
                capital_in_year_ratio=progress.ratio/100,
                no_of_months=basic_info[0].months_in_start_year
            ))

        print(construction_period_list[0])

        return InvestmentResultCalObj(
            capacity=basic_info[0].installation_capacity,
            working_capital_index=finance[0].unit_kilowatt_index,
            construction_period_interests=construction_period_list,
        )


class YearlyInvestmentCapitalManager:
    def __init__(self, investment_result_obj: InvestmentResultCalObj) -> None:
        self.construction_period_investment_list = investment_result_obj.construction_period_interests

    def get_result(self) -> List[float]:
        return [float(d.yearly_investment) for d in self.construction_period_investment_list]


class ProjectCapitalManager:
    def __init__(self, investment_result_obj) -> None:
        self.construction_period_capital_list = investment_result_obj.construction_period_interests
        self.captial_ratio = investment_result_obj.construction_period_interests[
            0].captial_ratio

    def get_result(self) -> List[float]:
        result_list = []
        for d in self.construction_period_capital_list:
            result_list.append(ConstructionPeriodCapitalCalculator(
                construction_period_investment=d.yearly_investment,
                capital_ratio=self.captial_ratio
            ).calculate())
        return result_list


class ConstructionCapitalManager:
    def __init__(self, investment_result_obj) -> None:
        self.construction_period_capital_list = investment_result_obj.construction_period_interests

    def get_yearly_capital_list(self) -> List[float]:
        result_list = []
        for d in self.construction_period_capital_list:
            result_list.append(YearlyInvestmentCapitalCalculator(
                construction_period_capital=d.yearly_investment * d.captial_ratio,
                year_capital_ratio=d.capital_in_year_ratio
            ).calculate())
        return result_list

    def get_yearly_debt_list(self) -> List[float]:
        result_list = []
        for d in self.construction_period_capital_list:
            result_list.append(YearlyDebtCalculator(
                yearly_investment_capital=d.yearly_investment * d.captial_ratio,
                yearly_investment_total=d.yearly_investment
            ).calculate())
        return result_list


class ProjectTotalInvestmentManager:
    def __init__(self, invest_result_obj) -> None:
        self.construction_period_interests = invest_result_obj.construction_period_interests
        self.working_capital_index = invest_result_obj.working_capital_index
        self.capacity = invest_result_obj.capacity

    # 方程
    def get_result(self) -> [float]:
        return ProjectTotalInvestmentCalculator(
            construction_period_interests=self.construction_period_interests,
            working_capital_total=self.get_working_capital_total()
        ).calculate()

    def get_working_capital_total(self) -> float:
        return float(self.capacity * 1000 * self.working_capital_index / 10000)


class WorkingCapitalManager:
    def __init__(self, invest_result_obj) -> None:
        self.working_capital_index = invest_result_obj.working_capital_index
        self.capacity = invest_result_obj.capacity
        self.working_capital_ratio = invest_result_obj.construction_period_interests[
            0].captial_ratio

    def get_result(self, working_capital_total: float) -> float:
        print(working_capital_total)
        print(self.working_capital_ratio)
        return CapitalAsWorkingCapitalCalculator(
            working_capital_index=self.working_capital_index,
            capacity=self.capacity,
            working_captial_ratio=self.working_capital_ratio
        ).calculate()
