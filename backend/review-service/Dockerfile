FROM node:alpine
WORKDIR /service-1
COPY package.json ./
RUN npm install
COPY . .
CMD [ "node", "server-1.js" ]