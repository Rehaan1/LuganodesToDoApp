FROM node:18-alpine

RUN apk update && apk add --no-cache npm

ENV PORT=3000

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]