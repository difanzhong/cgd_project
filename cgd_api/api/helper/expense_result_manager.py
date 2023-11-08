from ..repository.expense import ExpenseRepository
from ..repository.investment import InvestmentRepository
from ..repository.investment_progress import InvestmentProgressRepository

from .pre_cal_schema import ExpenseResultCalObj
from .cost_estimation_calculator import AmortizationCalculator, SalvageCalculator, FixedOriginalValueCalculator


class ExpenseResultManager:
    expense_repo: ExpenseRepository = ExpenseRepository()
    investment_repo: InvestmentRepository = InvestmentRepository()
    investment_progress_repo: InvestmentProgressRepository = InvestmentProgressRepository()

    def __init__(self, project_id) -> None:
        self.project_id = project_id

    async def get_pre_calculation_obj(self) -> ExpenseResultCalObj:
        expense = await self.expense_repo.show(self.project_id)
        investment = await self.investment_repo.get(self.project_id)
        investment_id = investment[0].id
        investment_list = await self.investment_repo.get(self.project_id)
        investment_id = investment_list[0].id
        investment_progress_list = await self.investment_progress_repo.get(investment_id)

        return ExpenseResultCalObj(
            working_capital=[
                float(d.total) for d in investment_progress_list],
            assets=[float(d.assets) for d in investment_progress_list],
            others=[d.others for d in investment_progress_list],
            creditable=[float(d.creditable) for d in investment_progress_list],
            ratio=[d.ratio for d in investment_progress_list],
            amortization_period=expense[0].amortization_period,
            other_amortization_period=expense[0].other_amortization_period,
            salvage_rate=expense[0].salvage_rate,
            depreciation_period=expense[0].depreciation_period,
        )

    async def get_total_investment(self) -> float:
        return sum([d.total for d in await self.investment_progress_repo.get(self.project_id)])


class AmortizationResultManager:
    def __init__(self, pre_cal_obj: ExpenseResultCalObj) -> None:
        self.assets = pre_cal_obj.assets
        self.others = pre_cal_obj.others
        self.amortization_period = pre_cal_obj.amortization_period
        self.other_amortization_period = pre_cal_obj.other_amortization_period

    def get_single_year_expense(self, single_year_assets, single_year_others) -> float:
        return AmortizationCalculator(
            assets=single_year_assets,
            period=self.amortization_period,
            others=single_year_others,
            other_period=self.other_amortization_period
        ).calculate()

    def get_result(self) -> [float]:
        result_list = []
        for assets, others in zip(self.assets, self.others):
            result_list.append(self.get_single_year_expense(assets, others))
        return result_list


class SalvageResultManager:
    def __init__(self, pre_cal_obj: ExpenseResultCalObj) -> None:
        self.assets = pre_cal_obj.assets
        self.others = pre_cal_obj.others
        self.salvage_rate = pre_cal_obj.salvage_rate/100
        self.depreciation_period = pre_cal_obj.depreciation_period

    def get_single_year_expense(self, single_year_assets, single_year_others) -> float:
        return SalvageCalculator(
            salvage_rate=self.salvage_rate,
            depreciation_period=self.depreciation_period,
            fixed_original_value=single_year_assets + single_year_others
        ).calculate()

    def get_result(self) -> [float]:
        result_list = []
        for assets, others in zip(self.assets, self.others):
            result_list.append(self.get_single_year_expense(assets, others))
        return result_list


class FixedOriginalValueManager:
    def __init__(self, pre_cal_obj: ExpenseResultCalObj) -> None:
        self.working_capital = pre_cal_obj.working_capital[0]
        self.assets = pre_cal_obj.assets[0]
        self.others = pre_cal_obj.others[0]
        self.creditable = pre_cal_obj.creditable[0]

    def get_result(self) -> float:
        return FixedOriginalValueCalculator(
            working_capital=self.working_capital,
            assets=self.assets,
            others=self.others,
            creditable=self.creditable
        ).calculate()
