FROM node

WORKDIR /app

EXPOSE 8080

COPY package.json .

RUN npm i 

COPY . .

RUN  npm run build-ts

CMD [ "npm", "run", "start:sta"]
