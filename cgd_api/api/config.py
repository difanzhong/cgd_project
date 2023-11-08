import os


class Config:
    DB_USER = os.getenv("DB_USER", "difan")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
    DB_NAME = os.getenv("DB_NAME", "cgd")
    DB_HOST = os.getenv("DB_HOST", "pg-sql")
    DB_CONFIG = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    TOKEN_URL = 'api/v1/token'
    TOKEN_KEY = "3DE81C0D5659679E907AE7D6BDF1EB27E7A80D28016369F3DCB035B4247AD1AE"
