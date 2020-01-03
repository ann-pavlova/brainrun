#build
FROM ubuntu:xenial as build-stage
RUN apt-get update && apt-get install sudo && apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN apt-get install -y python python-dev python-pip python-virtualenv && rm -rf /var/lib/apt/lists/*
RUN npm config set registry https://registry.npmjs.com/
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# prod
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist /front-app
COPY /config/nginx/nginx.conf /etc/nginx/nginx.conf
RUN addgroup -g 1000 -S www-data \
 && adduser -u 1000 -D -S -G www-data www-data
CMD ["nginx", "-g", "daemon off;"]