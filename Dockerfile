FROM nginx:1.15-alpine

COPY ./build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
