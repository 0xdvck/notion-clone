FROM node:20-alpine as build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update && apk add bash

ENV APP_DIR /app
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY package*.json ./
COPY pnpm*.yaml ./  

RUN npm install -g pnpm

RUN pnpm install

COPY . .

CMD pnpm start