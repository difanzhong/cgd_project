from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.v1 import routers
from .config import Config
from .db import db


app = FastAPI()

#origins = [
#    "*"
#]

#app.add_middleware(
#    CORSMiddleware,
#    allow_origins=origins,
#    allow_credentials=True,
#    allow_methods=["*"],
#    allow_headers=["*"]
#)

for router in routers:
    app.include_router(router)


@app.on_event("startup")
async def startup():
    await db.InitDB(Config.DB_CONFIG)
