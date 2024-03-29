FROM node:18.16.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir /usr/src/app/data
CMD [ "npm", "start" ]