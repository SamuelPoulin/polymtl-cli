FROM node:lts-bullseye

WORKDIR /usr/src/polymtl-cli

COPY package.json ./
RUN yarn
RUN npx playwright install-deps

COPY ./src ./src

CMD yarn start