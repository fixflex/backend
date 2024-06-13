FROM node:18.20.0

WORKDIR /usr/src/app

EXPOSE 8080

COPY package.json .

RUN npm i 

COPY . .

CMD [ "npm", "run", "start:sta" ]

