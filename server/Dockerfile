FROM node:12-alpine

WORKDIR /app

ADD package* /app/

RUN npm ci

ADD . /app/

EXPOSE 5500

ENTRYPOINT ["npm", "start"]
