from ..repository.basic_info import BasicInfoRepository
from ..repository.operation import OperationRepository
from ..repository.expense import ExpenseRepository
from ..repository.finance import FinanceRepository
from ..repository.investment import InvestmentRepository
from ..repository.investment_progress import InvestmentProgressRepository


class YearlyCost:
    basic_info_repo: BasicInfoRepository = BasicInfoRepository()
    operation_repo: OperationRepository = OperationRepository()
    expense_repo: ExpenseRepository = ExpenseRepository()
    finance_repo: FinanceRepository = FinanceRepository()
    invest_repo: InvestmentRepository = InvestmentRepository()
    invest_progress_repo: InvestmentProgressRepository = InvestmentProgressRepository()

    def __init__(self, project_id: str):
        self.calculation_year = None
        self.capacity = None
        self.project_id = project_id
        self.operations = None
        self.finance = None
        self.invest = None
        self.invest_progress = None
        self.expense = None

    async def calculate(self) -> None:
        await self.get_basic_info()
        await self.get_expense()
        await self.get_expense_operations()
        await self.get_finance()
        await self.get_invest()
        await self.get_invest_progress()
        await self.get_expense()

        year_indices = []
        amortization_list = []
        material_list = []
        salary_with_welfare_list = []
        repair_list = []
        insurance_list = []
        other1_list = []
        other2_list = []

        for (i, operation) in enumerate(self.operations, start=0):

            year_indices.append(operation.year_index)
            print("---------")
            print(self.calculate_amortization(i))
            print("---------")
            amortization_list.append(self.calculate_amortization(i))
            material_list.append(float(operation.material) * int(self.capacity) * 0.1)
            salary_with_welfare_list.append(float(operation.annual_salary) * int(operation.people) * (1 + float(operation.welfare) * 0.1))
            repair_list.append(float(operation.repair))
            insurance_list.append(float(operation.insurance))
            other1_list.append(float(operation.other_expense))
            other2_list.append(float(operation.other_expense2))

        return {
            "year_indices": year_indices,
            "amortization_list": amortization_list,
            "material_list": material_list,
            "salary_with_welfare_list": salary_with_welfare_list,
            "repair_list": repair_list,
            "insurance_list": insurance_list,
            "other1_list": other1_list,
            "other2_list": other2_list,
        }

        # Capacity * Material for each year

    async def get_basic_info(self):
        basic_info = await self.basic_info_repo.show(self.project_id)
        self.capacity = basic_info[0].installation_capacity
        self.calculation_year = basic_info[0].calculation_year

    async def get_expense(self):
        self.expense = await self.expense_repo.show(self.project_id)

    async def get_expense_operations(self):
        expenses = await self.expense_repo.show(self.project_id)
        expense_id = expenses[0].id
        self.operations = await self.operation_repo.show(expense_id)

    async def get_finance(self):
        self.finance = await self.finance_repo.get(self.project_id)

    async def get_invest(self):
        self.invest = await self.invest_repo.get(self.project_id)

    async def get_invest_progress(self):
        invest_id = await self.get_invest()[0].id
        self.invest_progress = await self.invest_progress_repo.get(invest_id)

    def get_fixed_original_value(self, index) -> float:
        if len(self.invest_progress) <= index:
            return 0
        p = self.invest_progress()[index]
        return p.total - p.assets - p.others - p.creditable

    def calculate_amortization(self, index):
        # print(len(self.invest_progress))
        # print(index)
        if len(self.invest_progress) <= index:
            return 0
        p = self.invest_progress[index]
        e = self.expense[0]
        return p.assets/e.amortization_period + p.others/e.other_amortization_period

    def calculate_salvage(self, index):
        fixed_original_value = self.get_fixed_original_value(index)
        salvage_rate = self.expence.salvage_rate
        depreciation_period = self.expense.depreciation_period

        return fixed_original_value * (1-salvage_rate) / depreciation_period
