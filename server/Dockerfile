FROM node:12

WORKDIR /server

ADD package* /server/

RUN npm ci

ADD . /server/

ENTRYPOINT ["npm", "start"]
