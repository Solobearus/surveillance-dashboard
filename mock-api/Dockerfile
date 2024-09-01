FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npx", "json-server", "--watch", "db.json", "--port", "3001", "--host", "0.0.0.0"]