from .calculator import Calculator


class ExpensesCalculator(Calculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        pass

    async def initialization(self):
        await self.get_expense()
        await self.get_invest_progress()


class AmortizationCalculation(ExpensesCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        e = self.expense[0]
        return [float(p.assets/e.amortization_period + p.others/e.other_amortization_period) for p in self.invest_progress]


class SalvageCalculation(ExpensesCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        e = self.expense[0]
        return [
            float(self.get_fixed_original_value(p) * (1-e.salvage_rate) / e.depreciation_period)
            for p in self.invest_progress
        ]

    def get_fixed_original_value(self, p) -> float:
        return p.total - p.assets - p.others - p.creditable
