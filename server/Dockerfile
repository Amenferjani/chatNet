FROM node:18
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=4000
EXPOSE 4000
CMD ["node", "app.js"]