from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv

# from ..calculation.total_cost import YearlyCost
from ...repository.expense import ExpenseRepository
from ...repository.investment import InvestmentRepository
from ...repository.investment_progress import InvestmentProgressRepository
from ...repository.basic_info import BasicInfoRepository
from ...repository.operation import OperationRepository

from ...calculation.operations import OperationCalculator, MaterialCalculation, RepairCalculation, SalaryWelfareCalculation, InsuranceCalculation, Other1Calculation, Other2Calculation
from ...calculation.loans import LoanCalculation
from ...calculation.expenses import AmortizationCalculation, SalvageCalculation
from ...calculation.investment import ConstructionYearLoanCalculation, ConstructionYearInterestsCalculation, ConstructionYearCapitalsCalculation
from ...schema import TotalExpenseShow, InvestmentShow

from ...helper.cost_estimation_calculator import AmortizationCalculator, SalvageCalculator, FixedOriginalValueCalculator
from ...helper.project_investment_calculator import ConstructionPeriodInterestsObj, ProjectTotalInvestmentCalculator, WorkingCapitalTotalCalculator

from ...helper.operation_cost_result_manager import OperationCostResultManager, MaterialResultManager, RepairResultManager, SalaryWelfareResultManager, InsuranceResultManager, Other1ResultManager, Other2ResultManager
from ...helper.expense_result_manager import ExpenseResultManager, AmortizationResultManager, SalvageResultManager, FixedOriginalValueManager

results_router = APIRouter()


@cbv(results_router)
class ProjectCBV:
    expense_repo: ExpenseRepository = Depends(ExpenseRepository.GetRepo)
    investment_repo: InvestmentRepository = Depends(
        InvestmentRepository.GetRepo)
    investment_progress_repo: InvestmentProgressRepository = Depends(
        InvestmentProgressRepository.GetRepo)
    operation_cal: OperationCalculator = Depends(OperationCalculator)
    basic_info_repo: BasicInfoRepository = Depends(BasicInfoRepository.GetRepo)
    operation_repo: OperationRepository = Depends(OperationRepository.GetRepo)

    @results_router.get("/results", tags=["Result"], response_model=TotalExpenseShow)
    async def get(self, project_id: str) -> None:
        # for index in range(1,25):
        #     operation_cal_list = [OperationCalculator]
        #     operation_cal_list.append(MaterialCalculation(y_index=index))
        material_cal = MaterialCalculation(project_id=project_id)
        material_list = await material_cal.calculate()
        welfare_cal = SalaryWelfareCalculation(project_id=project_id)
        welfare_list = await welfare_cal.calculate()
        repair_cal = RepairCalculation(project_id=project_id)
        repair_list = await repair_cal.calculate()
        loan_cal = LoanCalculation(project_id=project_id)
        loan_list = await loan_cal.calculate()
        insurance_cal = InsuranceCalculation(project_id=project_id)
        insurance_list = await insurance_cal.calculate()
        other1_cal = Other1Calculation(project_id=project_id)
        other1_list = await other1_cal.calculate()
        other2_cal = Other2Calculation(project_id=project_id)
        other2_list = await other2_cal.calculate()
        amortization_cal = AmortizationCalculation(project_id=project_id)
        amortization_list = await amortization_cal.calculate()
        depreciation_cal = SalvageCalculation(project_id=project_id)
        depreciation_list = await depreciation_cal.calculate()
        print(material_list)

        return TotalExpenseShow(
            constructionYear=material_cal.construction_year,
            calculationYear=material_cal.calculation_year,
            loan=loan_list,
            material=material_list,
            repair=repair_list,
            salaryWithWelfare=welfare_list,
            insurance=insurance_list,
            other1=other1_list,
            other2=other2_list,
            amortization=amortization_list,
            depreciation=depreciation_list
        )

        # return await loan_cal.calculate()
        # await self.yearlyCost.calculate()
        # obj = TotalCostShow(material=await self.materialCost.calculate(project_id))

    @results_router.get("/results/invest", tags=["Result"], response_model=InvestmentShow)
    async def get_invest(self, project_id: str) -> None:
        construction_year_capital_cal = ConstructionYearCapitalsCalculation(
            project_id=project_id)
        construction_year_capitals = await construction_year_capital_cal.calculate()
        construction_year_interests_cal = ConstructionYearInterestsCalculation(
            project_id=project_id)
        construction_year_interests = await construction_year_interests_cal.calculate()

        return InvestmentShow(
            constructionYearLoans=construction_year_capitals,
            constructionYearInterests=construction_year_interests
        )

    @results_router.get("/results/test", tags=["Result"], response_model=None)
    async def get_test(self, project_id: str) -> None:
        expense = await self.expense_repo.show(project_id)
        expense_id = expense[0].id
        operations = await self.operation_repo.show(expense_id)
        basic_info = await self.basic_info_repo.show(project_id)
        investment_list = await self.investment_repo.get(project_id)
        investment_id = investment_list[0].id
        investment_progress_list = await self.investment_progress_repo.get(investment_id)

        amorti_list = []
        salvage_list = []

        for progress in investment_progress_list:
            fixed_original_cal = FixedOriginalValueCalculator(
                working_capital=progress.total,
                assets=progress.assets,
                others=progress.others,
                creditable=progress.creditable
            )
            amortization_cal = AmortizationCalculator(
                assets=progress.assets,
                period=expense[0].amortization_period,
                others=progress.others,
                other_period=expense[0].other_amortization_period
            )
            salvage_cal = SalvageCalculator(
                salvage_rate=expense[0].salvage_rate,
                depreciation_period=expense[0].depreciation_period,
                fixed_original_value=fixed_original_cal.calculate()
            )
            amorti_list.append(amortization_cal.calculate())
            salvage_list.append(salvage_cal.calculate())

        #
        expense_manager = ExpenseResultManager(project_id=project_id)
        expense_pre_cal_obj = await expense_manager.get_pre_calculation_obj()

        fixed_original = FixedOriginalValueManager(
            expense_pre_cal_obj).get_result()

        print('----', fixed_original, '----')

        operation_cost_manager = OperationCostResultManager(
            project_id=project_id, fixed_original_value=fixed_original)
        operation_cost_pre_cal_obj = await operation_cost_manager.get_pre_calculation_obj()

        print("Amortization: ", AmortizationResultManager(
            expense_pre_cal_obj).get_result())
        print("Salvage: ", SalvageResultManager(
            expense_pre_cal_obj).get_result())

        print("Material: ", MaterialResultManager(
            operation_cost_pre_cal_obj).get_result())
        print("Salary Welfare: ", SalaryWelfareResultManager(
            operation_cost_pre_cal_obj).get_result())
        print("Repair: ", RepairResultManager(
            operation_cost_pre_cal_obj).get_result())
        print("Insurance: ", InsuranceResultManager(
            operation_cost_pre_cal_obj).get_result())
        print("Other1: ", Other1ResultManager(
            operation_cost_pre_cal_obj).get_result())
        print("Other2: ", Other2ResultManager(
            operation_cost_pre_cal_obj).get_result())

        #

        print(amorti_list)
        print(salvage_list)
        return None

    @results_router.get("/results/test_total_investment", tags=["Result"], response_model=None)
    async def get_total_investment(self) -> None:
        working_captial_total = WorkingCapitalTotalCalculator(
            capacity=1.627, working_capital_index=30
        ).calculate()

        construction_period_interest_obj1 = ConstructionPeriodInterestsObj(
            yearly_investment=1267.98,
            captial_ratio=0.3,
            long_term_rate=0.4,
            capital_in_year_ratio=0.5,
            no_of_months=6
        )

        construction_period_interest_obj2 = ConstructionPeriodInterestsObj(
            yearly_investment=634.5,
            captial_ratio=0.3,
            long_term_rate=0.0365,
            capital_in_year_ratio=0.5,
            no_of_months=6
        )

        total_investment_list = ProjectTotalInvestmentCalculator(
            construction_period_interests=[
                construction_period_interest_obj1, construction_period_interest_obj2],
            working_capital_total=working_captial_total
        ).calculate()
        print(total_investment_list)
        return None
