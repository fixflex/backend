FROM node:v20.14.0

WORKDIR /usr/src/app

EXPOSE 8080

COPY package.json .

RUN npm i 

COPY . .

CMD [ "npm", "run", "start:sta-build-run" ]

