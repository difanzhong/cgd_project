import decimal

from .calculator import Calculator


class OperationCalculator(Calculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        pass

    async def initialization(self):
        await super().get_expense_operations()
        await super().get_basic_info()


class MaterialCalculation(OperationCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        return [
            float(operation.material) * int(self.capacity) * 0.1
            for operation in self.operations
        ]


class SalaryWelfareCalculation(OperationCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        return [
            float(operation.annual_salary) * int(operation.people) * (1 + float(operation.welfare) * 0.1)
            for operation in self.operations
        ]


class RepairCalculation(OperationCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        return [float(operation.repair) for operation in self.operations]


class InsuranceCalculation(OperationCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        return [float(operation.insurance) for operation in self.operations]


class Other1Calculation(OperationCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        return [float(operation.other_expense) for operation in self.operations]


class Other2Calculation(OperationCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        return [float(operation.other_expense2) for operation in self.operations]
