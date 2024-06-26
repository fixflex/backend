FROM node:18.20.0
WORKDIR /usr/src/app
# Dependencies that are required to run puppeteer in a docker container
RUN apt-get update
RUN apt-get install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
EXPOSE 8080
COPY package.json .
ARG NODE_ENV=staging
RUN if [ "$NODE_ENV" = "staging" ] || [ "$NODE_ENV" = "production" ]; \
    then npm install --omit=dev; \
    else npm install; \
    fi
COPY . .
RUN if [ "$NODE_ENV" = "staging" ] || [ "$NODE_ENV" = "production" ]; \
    then npm run build-ts; \
    fi
CMD [ "npm", "run", "start:sta"]
