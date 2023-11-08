import inspect

from fastapi import HTTPException
from loguru import logger


def raise_with_log(status_code: int, detail: str, logger=logger):
    desc = f"<HTTPException status_code={status_code} details={detail}"
    logger.error(f"{desc} | runner={runner_info()}")
    raise HTTPException(status_code=status_code, detail=detail)


def runner_info():
    stack = inspect.stack()
    frame = stack[2]
    module = inspect.getmodule(frame[0])
    filename = module.__file__
    return f"filename={filename} lineno={frame[2]} function={frame[3]}"
