FROM node:lts-alpine
USER node

RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN npm install npm@8.10.0 && \
    apk add --no-cache python3 make g++
WORKDIR /GuiltySpark
COPY package.json .
RUN npm install --quiet 
COPY . . 