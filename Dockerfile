FROM node:16.17.1-bullseye-slim
WORKDIR /GuiltySpark
RUN npm install -g npm@8.13.2
COPY . .
RUN npm install --quiet 
