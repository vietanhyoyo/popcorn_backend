FROM node:18.10.0
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 5000
CMD ["npm","run","run"]