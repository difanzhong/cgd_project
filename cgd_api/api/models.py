from sqlalchemy import Column, String, Text, Integer, Date, DateTime, ForeignKey, Numeric
from sqlalchemy import func
from fastapi_utils.guid_type import GUID, GUID_SERVER_DEFAULT_POSTGRESQL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Users(Base):
    __tablename__ = 'users'

    id = Column(GUID, primary_key=True,
                server_default=GUID_SERVER_DEFAULT_POSTGRESQL)
    name = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created = Column(DateTime, default=func.now(), nullable=False)
    updated = Column(DateTime, default=func.now(), nullable=False)


class Project(Base):
    __tablename__ = 'projects'

    id = Column(GUID, primary_key=True,
                server_default=GUID_SERVER_DEFAULT_POSTGRESQL)
    name = Column(String(255))
    description = Column(Text)
    username = Column(String(255))
    created = Column(DateTime, default=func.now())
    updated = Column(DateTime, default=func.now())


class BasicInformation(Base):
    __tablename__ = 'project_info'

    id = Column(Integer, primary_key=True, autoincrement=True)
    calculation_year = Column(Numeric)
    construction_year = Column(Numeric)
    start_date = Column(Date)
    months_in_start_year = Column(Numeric)
    months_in_end_year = Column(Numeric)
    installation_capacity = Column(Numeric)
    capital = Column(Numeric)
    profit_before_tax = Column(Numeric)
    profit_after_tax = Column(Numeric)

    project_id = Column(GUID, ForeignKey('projects.id'))


class Construction(Base):
    __tablename__ = 'construction_year'

    id = Column(Integer, primary_key=True, autoincrement=True)
    year_index = Column(Integer)
    jan = Column(Numeric)
    feb = Column(Numeric)
    mar = Column(Numeric)
    apr = Column(Numeric)
    may = Column(Numeric)
    jun = Column(Numeric)
    jul = Column(Numeric)
    aug = Column(Numeric)
    sep = Column(Numeric)
    oct = Column(Numeric)
    nov = Column(Numeric)
    dec = Column(Numeric)

    project_id = Column(GUID, ForeignKey('projects.id'))


class Finance(Base):
    __tablename__ = 'finance'

    id = Column(Integer, primary_key=True, autoincrement=True)
    short_term_loan_interests = Column(Numeric)
    working_capital_loan_interests = Column(Numeric)
    working_capital_ratio = Column(Numeric)
    unit_kilowatt_index = Column(Numeric)
    banks = relationship("LoanBank", back_populates="finance")

    project_id = Column(GUID, ForeignKey('projects.id'))


class LoanBank(Base):
    __tablename__ = 'banks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    bank_index = Column(Integer)
    expect_years = Column(Numeric)
    grace = Column(Numeric)
    frequency = Column(Numeric)
    payment_method = Column(String(255))
    finance = relationship("Finance", back_populates="banks")

    finance_id = Column(Integer, ForeignKey('finance.id'))


class Payment(Base):
    __tablename__ = 'payment_years'

    id = Column(Integer, primary_key=True, autoincrement=True)
    year_index = Column(Integer)
    value = Column(Numeric)
    unit = Column(String(255))

    loanBank_id = Column(Integer, ForeignKey('banks.id'))


class Expense(Base):
    __tablename__ = 'expenses'

    id = Column(Integer, primary_key=True, autoincrement=True)
    salvage_rate = Column(Numeric)
    depreciation_method = Column(String(255))
    depreciation_period = Column(Numeric)
    insurance_fee_method = Column(String(255))
    amortization_period = Column(Numeric)
    other_amortization_period = Column(Numeric)

    project_id = Column(GUID, ForeignKey('projects.id'))


class Operation(Base):
    __tablename__ = "operations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    year_index = Column(Integer)
    people = Column(Numeric)  # 123
    annual_salary = Column(Numeric)  # 万元
    welfare = Column(Numeric)  # %
    repair = Column(Numeric)  # 万元
    insurance = Column(Numeric)  # 万元
    material = Column(Numeric)  # 元 每千瓦
    other_expense = Column(Numeric)
    other_expense2 = Column(Numeric)
    other_finance_expense = Column(Numeric)
    other_finance_expense2 = Column(Numeric)

    expense_id = Column(Integer, ForeignKey('expenses.id'))


class OperationParameter(Base):
    __tablename__ = "parameters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255))
    unit = Column(String(255))
    input_tax = Column(String(255))
    operation_id = (Integer, ForeignKey('operations.id'))


class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    calculation_method = Column(String(255))
    investment_method = Column(String(255))
    ratio_method = Column(String(255))
    ratio_value = Column(Numeric)
    interests_calculation_method = Column(String(255))
    project_id = Column(GUID, ForeignKey("projects.id"))


class InvestmentProgress(Base):
    __tablename__ = "investment_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    year_index = Column(Integer)
    total = Column(Numeric)
    assets = Column(Numeric)
    others = Column(Numeric)
    creditable = Column(Numeric)
    ratio = Column(Numeric)

    investment_id = Column(Integer, ForeignKey("investments.id"))
