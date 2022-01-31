FROM node:lts-alpine
WORKDIR /GuiltySpark
COPY package.json .
RUN npm install --quiet
COPY . . 