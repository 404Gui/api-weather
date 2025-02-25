FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x /app/node_modules/.bin/tsc

RUN npm run build

CMD ["npm", "start"]
