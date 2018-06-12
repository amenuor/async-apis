FROM node:alpine
LABEL authors="Angelo Agatino Nicolosi"
WORKDIR /srv/db-apigw
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 10010
CMD [ "npm", "start" ]