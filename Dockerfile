FROM node:lts-alpine
WORKDIR /GuiltySpark
COPY package.json .
RUN npm install -g npm@latest
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install --quiet
COPY . . 