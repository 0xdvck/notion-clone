FROM node:20-alpine as build


WORKDIR /app

COPY package*.json ./
COPY pnpm*.yaml ./  

RUN npm install -g pnpm

RUN pnpm install
COPY . .
RUN pnpm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]