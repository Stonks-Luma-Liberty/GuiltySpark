FROM node:lts-alpine
WORKDIR /GuiltySpark
COPY package.json .
RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*
RUN npm install --quiet
COPY . . 