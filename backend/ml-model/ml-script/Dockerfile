FROM python:3.10.6
RUN mkdir /ml-model
ADD ../ml-model ./ml-model
WORKDIR /ml-model
RUN pip install -r requirements.txt
CMD ["python","ml-script/model.py"]