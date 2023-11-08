from fastapi import APIRouter
from api.routers.v1.project import project_router
from api.routers.v1.basic_info import basic_info_router
from api.routers.v1.finance import finance_router
from api.routers.v1.expense import expense_router
from api.routers.v1.investment import investment_router
from api.routers.v1.results import results_router
from api.routers.v1.user import user_router
from api.routers.v1.auth import auth_router
from api.routers.v1.report import report_router

api_router = APIRouter(prefix='/api/v1')

api_router.include_router(project_router)
api_router.include_router(basic_info_router)
api_router.include_router(finance_router)
api_router.include_router(expense_router)
api_router.include_router(investment_router)
api_router.include_router(results_router)
api_router.include_router(user_router)
api_router.include_router(auth_router)
api_router.include_router(report_router)

routers = [api_router]
