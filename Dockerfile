FROM node

WORKDIR /usr/src/app

EXPOSE 8080

COPY package.json .

RUN npm i 

COPY . .

CMD [ "npm", "run", "start:dev-stg" ]

