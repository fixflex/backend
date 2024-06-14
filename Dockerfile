FROM node

WORKDIR /app

EXPOSE 8080

COPY package.json .

RUN npm i 

COPY . .

CMD [ "npm", "run", "start:sta-build-run" ]

