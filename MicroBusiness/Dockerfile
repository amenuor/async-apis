FROM node:alpine
LABEL authors="Angelo Agatino Nicolosi"
WORKDIR /srv/microbusiness
COPY package*.json ./
RUN npm install --only=production
COPY . .
CMD [ "npm", "start" ]