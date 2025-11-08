FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache bash
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
EXPOSE 3000
CMD ["/wait-for-it.sh", "db:5432", "--", "npm", "start"]