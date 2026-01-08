# Frontend Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json ./
# Xóa package-lock.json (nếu có) để tránh lỗi thiếu binary Rollup cho Linux khi build từ Windows
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy config vào folder templates để Nginx tự động thay thế biến môi trường ${PORT}
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
# Biến PORT mặc định là 80 nếu không có (Railway sẽ tự override)
ENV PORT=80
CMD ["nginx", "-g", "daemon off;"]
