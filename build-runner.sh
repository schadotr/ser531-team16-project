#!/bin/bash

cd backend
cp -r common/* api-gateway
cp -r common/* movie-recommender
cp -r common/* review-service
cp -r common/* user
cp -r common/* mailer-service
cp -r common/.env api-gateway/.env
cp -r common/.env movie-recommender/.env
cp -r common/.env review-service/.env
cp -r common/.env user/.env
cp -r common/.env mailer-service/.env
cd ..
cp backend/common/.env frontend/.env

cd backend
cd ./api-gateway && npm install && cd ..
cd ./review-service && npm install && cd ..
cd ./mailer-service && npm install && cd ..
cd ./user && npm install && cd ..
cd ./movie-recommender && npm install && cd ..
cd ../frontend && npm install && cd .. && cd backend


(cd ./api-gateway && nodemon gateway.js) & (cd ./user && nodemon login-registration.js) & (cd ./movie-recommender && nodemon movie-endpoints.js) & (cd ./mailer-service && nodemon mailer.js) & (cd ../frontend && npm start) & (docker compose up --build)