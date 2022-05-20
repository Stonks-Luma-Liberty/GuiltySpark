FROM node:lts-alpine
WORKDIR /home/node/app/GuiltySpark
RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
RUN npm install -g npm@8.10.0 && \
    apk add --no-cache python3 make g++ && \
    chown -Rh node:node /home/node/app/GuiltySpark
COPY package.json .
RUN npm install --quiet 
COPY . . 
