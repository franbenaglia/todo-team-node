FROM node:14

WORKDIR /todo-team-security
COPY package.json .
RUN npm install
COPY . .
CMD [ "node", "src/index.js" ]
