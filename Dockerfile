FROM node:16.15.0-bullseye-slim
WORKDIR /GuiltySpark
RUN npm install -g npm@8.13.2
COPY . .
RUN npm install --quiet 
