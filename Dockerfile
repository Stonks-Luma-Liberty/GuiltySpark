FROM node:16-alpine
WORKDIR /GuiltySpark
COPY package.json .
RUN npm install --quiet
COPY . . 