FROM node:21
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3009
CMD [ "node", "dist/main.js" ]