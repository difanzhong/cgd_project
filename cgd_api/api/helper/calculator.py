from typing import Protocol


class Calculator(Protocol):
    def calculate(self) -> float: ...
