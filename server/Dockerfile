FROM node:12

WORKDIR /server

ADD package* /server/

RUN npm ci

ADD . /server/

EXPOSE 5500

ENTRYPOINT ["npm", "start"]
