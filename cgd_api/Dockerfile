FROM python:3.11

WORKDIR /app
COPY . /app

RUN apt-get update -y && apt-get upgrade -y
RUN pip3 install -r requirements.txt

CMD ["uvicorn", "main:app", "--port" ,"8000", "--host", "0.0.0.0", "--reload"]

