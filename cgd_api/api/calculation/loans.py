import decimal
import math

from .calculator import Calculator


class FinanceCalculator(Calculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        pass

    async def initialization(self):
        await self.get_finance()
        await self.get_loan_banks()


class LoanCalculation(FinanceCalculator):
    def __init__(self, project_id):
        super().__init__(project_id)

    async def calculate(self):
        await super().initialization()
        result = []
        for b in self.loan_banks:
            await self.get_payments(bank_id=b.id)
            if b.payment_method == "Annuity":
                result.append(self.get_annuity_payments(b, self.payments))
                continue
            if b.payment_method == "Linear":
                result.append(self.get_linear_payments(b, self.payments))
                continue

        return result

    def get_annuity_payments(self, bank, payments):
        payment_list = [100000]
        r = bank.expect_years
        for index, p in enumerate(payments):
            h = p.value/100
            cc0 = payment_list[index]
            multi = decimal.Decimal(math.pow(1+h, r))
            dd = decimal.Decimal(cc0 * h) * multi / (multi-1)
            payment_list.append(cc0 - dd - cc0*h)

        return payment_list

    def get_linear_payments(self, bank, payments):
        payment_list = [100000]
        r = bank.expect_years
        ff = payment_list[0] / r
        for index, p in enumerate(payments):
            h = p.value/100
            ccn = payment_list[index-1] - ff if index>0 else payment_list[0]
            een = ccn * h
            payment_list.append(een + ff)
        return payment_list
