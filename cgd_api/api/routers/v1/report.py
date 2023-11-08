from fastapi import APIRouter, Depends
from fastapi_utils.cbv import cbv

from api.services.auth import get_current_user
from api.repository.expense import ExpenseRepository
from api.repository.investment import InvestmentRepository
from api.repository.investment_progress import InvestmentProgressRepository
from api.repository.basic_info import BasicInfoRepository
from api.repository.operation import OperationRepository

from api.helper.expense_result_manager import ExpenseResultManager, FixedOriginalValueManager
from api.helper.investment_result_manager import InvestmentResultManager, ProjectTotalInvestmentManager, WorkingCapitalManager, YearlyInvestmentCapitalManager, ProjectCapitalManager, ConstructionCapitalManager
from api.helper.operation_cost_result_manager import OperationCostResultManager, MaterialResultManager, RepairResultManager, SalaryWelfareResultManager, InsuranceResultManager, Other1ResultManager, Other2ResultManager

from api.schemas.report import TotalExpenseShow, InvestmentShow

report_router = APIRouter(tags=["Reports"])
#   dependencies=[Depends(get_current_user)])


@cbv(report_router)
class ProjectCBV:
    expense_repo: ExpenseRepository = Depends(ExpenseRepository.GetRepo)
    investment_repo: InvestmentRepository = Depends(
        InvestmentRepository.GetRepo)
    investment_progress_repo: InvestmentProgressRepository = Depends(
        InvestmentProgressRepository.GetRepo)
    basic_info_repo: BasicInfoRepository = Depends(BasicInfoRepository.GetRepo)
    operation_repo: OperationRepository = Depends(OperationRepository.GetRepo)

    @report_router.get("/projects/{project_id}/total_expense")
    async def get(self, project_id: str):
        expense_manager = ExpenseResultManager(project_id=project_id)
        expense_pre_cal_obj = await expense_manager.get_pre_calculation_obj()
        fixed_original_value = FixedOriginalValueManager(
            expense_pre_cal_obj).get_result()

        operation_cost_manager = OperationCostResultManager(
            project_id=project_id, fixed_original_value=fixed_original_value)
        operation_cost_pre_cal_obj = await operation_cost_manager.get_pre_calculation_obj()

        return TotalExpenseShow(
            constructionYear=operation_cost_pre_cal_obj.construction_year,
            calculationYear=operation_cost_pre_cal_obj.calculation_year,
            material=MaterialResultManager(
                operation_cost_pre_cal_obj).get_result(),
            repair=RepairResultManager(
                operation_cost_pre_cal_obj).get_result(),
            salaryWithWelfare=SalaryWelfareResultManager(
                operation_cost_pre_cal_obj).get_result(),
            insurance=InsuranceResultManager(
                operation_cost_pre_cal_obj).get_result(),
            other1=Other1ResultManager(
                operation_cost_pre_cal_obj).get_result(),
            other2=Other2ResultManager(operation_cost_pre_cal_obj).get_result()
        )

    @report_router.get("/projects/{project_id}/total_investment")
    async def get_invest(self, project_id: str):

        investment_manager = InvestmentResultManager(project_id=project_id)
        investment_result_cal_obj = await investment_manager.get_pre_calculation_obj()

        total_investment_manager = ProjectTotalInvestmentManager(
            investment_result_cal_obj)

        total_investment_obj = total_investment_manager.get_result()
        construction_period_capital = ProjectCapitalManager(
            investment_result_cal_obj).get_result()
        construction_period_yearly_investment_list = YearlyInvestmentCapitalManager(
            investment_result_cal_obj).get_result()
        construction_period_yearly_capital_list = ConstructionCapitalManager(
            investment_result_cal_obj).get_yearly_capital_list()
        construction_period_yearly_debt_list = ConstructionCapitalManager(
            investment_result_obj=investment_result_cal_obj).get_yearly_debt_list()

        result = {
            "constructionYear": len(investment_result_cal_obj.construction_period_interests),
            "totalInvestment": [total_investment_obj['total_investment']],
            "constructionPeriodCapital": construction_period_capital,
            "constructionPeriodYearlyInvestmentList": construction_period_yearly_investment_list,
            "constructionPeriodYearlyCapitalList": construction_period_yearly_capital_list,
            "constructionPeriodYearlyDebtList": construction_period_yearly_debt_list,
            "debtForConstruction": [debt - interest for debt, interest in zip(construction_period_yearly_debt_list, [total_investment_obj['first_year_interests']])],
            "debtForInterests": [total_investment_obj['first_year_interests']],
            "capitalAsWorkingCapital": [WorkingCapitalManager(investment_result_cal_obj).get_result(total_investment_manager.get_working_capital_total())]
        }

        return InvestmentShow(**result)
