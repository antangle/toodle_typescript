FROM node:16
WORKDIR /app
COPY package*.json .
COPY tsconfig.json .
RUN npm install
COPY . ./
EXPOSE 3000
RUN npm install pm2 -g
CMD ["node","dist/index.js"]