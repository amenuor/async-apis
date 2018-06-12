# Stage 0, based on Node.js, to build and compile Vue
FROM node:alpine as node
LABEL authors="Angelo Agatino Nicolosi"
RUN apk add --update git && \
  rm -rf /tmp/* /var/cache/apk/*
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG env=prod
RUN npm run build -- --prod --environment $env

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=node /app/dist/ /usr/share/nginx/html
COPY ./ngnix.conf /etc/nginx/conf.d/default.conf
EXPOSE 80