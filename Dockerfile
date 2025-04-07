# Dockerfile
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Build NestJS app
RUN npm run build

# Expose đúng cổng bạn đang dùng
EXPOSE 4000

# Chạy app NestJS đã build
CMD ["node", "dist/main"]
