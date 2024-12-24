FROM node:16-alpine

WORKDIR /src

COPY . .
# COPY package*.json ./

RUN npm install --force

RUN npm run build


EXPOSE 3000

CMD ["npm","run","start"]