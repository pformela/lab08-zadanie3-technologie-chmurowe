FROM node

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .
COPY db.js .

EXPOSE 3000

CMD ["npm", "start"]