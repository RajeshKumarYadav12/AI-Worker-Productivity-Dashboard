FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY src/ ./src/

RUN mkdir -p data

EXPOSE 5000

CMD ["node", "--experimental-sqlite", "server.js"]
