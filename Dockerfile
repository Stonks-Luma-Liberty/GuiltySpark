FROM node:lts-alpine
RUN npm install -g npm@latest && \
    apk add --no-cache python3 make g++ && \
    addgroup -S guilty_spark_group && \
    adduser -S guilty_spark_user -G guilty_spark_group
USER guilty_spark_user
WORKDIR /GuiltySpark
COPY package.json .
RUN npm install --quiet
COPY . . 