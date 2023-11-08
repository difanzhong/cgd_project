from fastapi import Depends

from .cost_estimation_calculator import MaterialCalculator, RepairCalculator, SalaryWelfareCalculator, InsuranceCalculator, Other1Calculator, Other2Calculator
from .pre_cal_schema import ExpenseResultCalObj, OperationCostResultCalObj

from ..models import Expense, InvestmentProgress

# manager class to manage calculate Expense result
from ..repository.basic_info import BasicInfoRepository
from ..repository.expense import ExpenseRepository
from ..repository.operation import OperationRepository


class OperationCostResultManager:
    expense_repo: ExpenseRepository = ExpenseRepository()
    basic_info_repo: BasicInfoRepository = BasicInfoRepository()
    operation_repo: OperationRepository = OperationRepository()

    def __init__(self, project_id: str, fixed_original_value: float) -> None:
        self.project_id = project_id
        self.fixed_original_value = fixed_original_value

    async def get_pre_calculation_obj(self) -> OperationCostResultCalObj:
        expense = await self.expense_repo.show(self.project_id)
        expense_id = expense[0].id
        operations = await self.operation_repo.show(expense_id)
        basic_info = await self.basic_info_repo.show(self.project_id)

        return OperationCostResultCalObj(
            calculation_year=basic_info[0].calculation_year,
            construction_year=basic_info[0].construction_year,
            capacity=basic_info[0].installation_capacity,
            material_cost=[d.material for d in operations],
            repair_cost=[d.repair for d in operations],
            people=[d.people for d in operations],
            annual_salarys=[d.annual_salary for d in operations],
            welfare_rates=[d.welfare for d in operations],
            insurance=[d.insurance for d in operations],
            other1_cost=[d.other_expense for d in operations],
            other2_cost=[d.other_expense2 for d in operations],
            fixed_original_value=self.fixed_original_value
        )


class MaterialResultManager:
    def __init__(self, pre_cal_obj: OperationCostResultCalObj):
        self.material_cost = pre_cal_obj.material_cost
        self.capacity = pre_cal_obj.capacity

    def get_single_year_expense(self, single_year_cost) -> float:
        return MaterialCalculator(single_year_cost, self.capacity).calculate()

    def get_result(self) -> [float]:
        result_list = []
        for cost in self.material_cost:
            result_list.append(self.get_single_year_expense(cost))
        return result_list


class RepairResultManager:
    def __init__(self, pre_cal_obj: OperationCostResultCalObj) -> None:
        self.repair_cost = pre_cal_obj.repair_cost
        self.capacity = pre_cal_obj.capacity

    def get_single_year_expense(self, single_year_cost) -> float:
        return RepairCalculator(single_year_cost, self.capacity).calculate()

    def get_result(self) -> [float]:
        result_list = []
        for cost in self.repair_cost:
            result_list.append(self.get_single_year_expense(cost))
        return result_list


class SalaryWelfareResultManager:
    def __init__(self, pre_cal_obj: OperationCostResultCalObj) -> None:
        self.annual_salarys = pre_cal_obj.annual_salarys
        self.people = pre_cal_obj.people
        self.welfare_rates = pre_cal_obj.welfare_rates

    def get_single_year_expense(self, annual_salary, people, welfare_rate) -> float:
        return SalaryWelfareCalculator(annual_salary, people, welfare_rate).calculate()

    def get_result(self) -> [float]:
        result_list = []
        for index, salary in enumerate(self.annual_salarys):
            people = self.people[index]
            welfare_rate = float(self.welfare_rates[index]/100)
            result_list.append(self.get_single_year_expense(
                salary, people, welfare_rate))
        return result_list


class InsuranceResultManager:
    def __init__(self, pre_cal_obj: OperationCostResultCalObj) -> None:
        self.insurance = pre_cal_obj.insurance
        self.fixed_original_value = pre_cal_obj.fixed_original_value

    def get_single_year_expense(self, insurance_rate) -> float:
        return InsuranceCalculator(insurance_rate, self.fixed_original_value).calculate()

    def get_result(self) -> [float]:
        result_list = []
        for insurance_rate in self.insurance:
            insurance_rate = float(insurance_rate/100)
            result_list.append(self.get_single_year_expense(insurance_rate))
        return result_list


class Other1ResultManager:
    def __init__(self, pre_cal_obj: OperationCostResultCalObj) -> None:
        self.other1_cost = pre_cal_obj.other1_cost
        self.capacity = pre_cal_obj.capacity

    def get_single_year_expense(self, single_year_cost) -> float:
        return Other1Calculator(single_year_cost, self.capacity).calculate()

    def get_result(self) -> [float]:
        result_list = []
        for cost in self.other1_cost:
            result_list.append(self.get_single_year_expense(cost))
        return result_list


class Other2ResultManager:
    def __init__(self, pre_cal_obj: OperationCostResultCalObj) -> None:
        self.other2_cost = pre_cal_obj.other2_cost
        self.capacity = pre_cal_obj.capacity

    def get_single_year_expense(self, single_year_cost) -> float:
        return Other2Calculator(single_year_cost, self.capacity).calculate()

    def get_result(self) -> [float]:
        result_list = []
        for cost in self.other2_cost:
            result_list.append(self.get_single_year_expense(cost))
        return result_list
