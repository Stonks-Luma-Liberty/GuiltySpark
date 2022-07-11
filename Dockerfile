FROM node:16.15.0-alpine
WORKDIR /home/node/app/GuiltySpark
RUN npm install -g npm@8.13.2 typescript
COPY . .
RUN npm install --quiet 
