from .calculator import Calculator


class InvestmentCalculator(Calculator):
    def __init__(self, project_id):
        super().__init__(project_id)
        self.total_working_capital = None
        self.capital_for_working_capital = None
        self.total_invest = None
        self.construction_capital = None

    async def calculate(self):
        pass

    async def initialization(self):
        await self.get_basic_info()
        await self.get_invest()
        await self.get_invest_progress()
        await self.get_finance()
        self.set_total_invest()
        self.set_total_working_capital()
        self.set_capital_for_working_capital()
        self.set_construction_capital_calculation()

    def set_total_working_capital(self):
        working_capital_index = self.finance.unit_kilowatt_index
        self.total_working_capital = self.capacity * 1000 * working_capital_index / 10000

    def set_capital_for_working_capital(self):
        own_funds_proportion = self.finance.working_capital_ratio / 100
        self.capital_for_working_capital = self.total_working_capital * own_funds_proportion

    def set_total_invest(self):
        self.total_invest = sum([p.total for p in self.invest_progress])

    def set_construction_capital_calculation(self):
        self.construction_capital = (self.total_invest - self.capital_for_working_capital) * self.invest.ratio_value / 100


class CapitalCalculation(InvestmentCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        return self.total_invest - self.capital_for_working_capital


class ConstructionYearCapitalsCalculation(InvestmentCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        result = []
        print(self.construction_capital)
        for i in self.invest_progress:
            result.append(self.construction_capital * i.ratio/100)
        return result


class ConstructionYearLoanCalculation(InvestmentCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        result = []
        for i in self.invest_progress:
            result.append(i.total - self.construction_capital * i.ratio/100)
        return result


class ConstructionYearInterestsCalculation(InvestmentCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        result = []
        for index, i in enumerate(self.invest_progress):
            loan = i.total - self.construction_capital * i.ratio/100
            first_year_months_ratio = self.basic_info.months_in_start_year / 12 if index == 0 else 1
            half_interest_rate = self.finance.working_capital_loan_interests / 2 / 100
            previous_year_loan = self.invest_progress[index-1].total - self.construction_capital * self.invest_progress[index-1].ratio/100
            previous_year_loan_interests = previous_year_loan * self.finance.working_capital_loan_interests / 100
            if index == 0:
                result.append(loan * half_interest_rate * first_year_months_ratio)
                continue
            result.append(previous_year_loan_interests + loan * half_interest_rate)
        return result








