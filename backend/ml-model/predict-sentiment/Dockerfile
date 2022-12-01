FROM python:3.10.7-alpine
RUN mkdir /ml-model
ADD ../ml-model ./ml-model
WORKDIR /ml-model
RUN pip install -r requirements.txt
CMD ["python","predict-sentiment/app.py"]