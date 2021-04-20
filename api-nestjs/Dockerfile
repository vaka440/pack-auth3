FROM node:12-alpine
WORKDIR /app
COPY ./package.json .
RUN yarn
COPY . .
EXPOSE 3000
CMD yarn run start:dev


