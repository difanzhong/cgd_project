from abc import ABC, abstractmethod

from ..repository.basic_info import BasicInfoRepository
from ..repository.operation import OperationRepository
from ..repository.expense import ExpenseRepository
from ..repository.finance import FinanceRepository
from ..repository.investment import InvestmentRepository
from ..repository.investment_progress import InvestmentProgressRepository
from ..repository.loan_bank import LoanBankRepository
from ..repository.payment import PaymentRepository


class Calculator(ABC):
    basic_info_repo: BasicInfoRepository = BasicInfoRepository()
    operation_repo: OperationRepository = OperationRepository()
    expense_repo: ExpenseRepository = ExpenseRepository()
    finance_repo: FinanceRepository = FinanceRepository()
    invest_repo: InvestmentRepository = InvestmentRepository()
    invest_progress_repo: InvestmentProgressRepository = InvestmentProgressRepository()
    loan_banks_repo:  LoanBankRepository = LoanBankRepository()
    payment_repo: PaymentRepository = PaymentRepository()

    def __init__(self, project_id: str):
        self.calculation_year = None
        self.construction_year = None
        self.capacity = None
        self.project_id = project_id
        self.operations = None
        self.finance = None
        self.invest = None
        self.invest_progress = None
        self.expense = None
        self.loan_banks = None
        self.payments = None
        self.basic_info = None

    @abstractmethod
    async def calculate(self):
        pass

    async def get_basic_info(self):
        basic_info = await self.basic_info_repo.show(self.project_id)
        self.capacity = basic_info[0].installation_capacity
        self.calculation_year = basic_info[0].calculation_year
        self.construction_year = basic_info[0].construction_year
        self.basic_info = basic_info[0]

    async def get_expense(self):
        self.expense = await self.expense_repo.show(self.project_id)

    async def get_expense_operations(self):
        expenses = await self.expense_repo.show(self.project_id)
        expense_id = expenses[0].id
        self.operations = await self.operation_repo.show(expense_id)

    async def get_finance(self):
        finance = await self.finance_repo.get(self.project_id)
        self.finance = finance[0]

    async def get_loan_banks(self):
        finance = await self.finance_repo.get(self.project_id)
        finance_id = finance[0].id
        self.loan_banks = await self.loan_banks_repo.get_all(finance_id)

    async def get_payments(self, bank_id):
        self.payments = await self.payment_repo.get_all(bank_id)

    async def get_invest(self):
        invest = await self.invest_repo.get(self.project_id)
        self.invest = invest[0]

    async def get_invest_progress(self):
        invest = await self.invest_repo.get(self.project_id)
        invest_id = invest[0].id
        self.invest_progress = await self.invest_progress_repo.get(invest_id)
