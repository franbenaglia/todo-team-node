FROM node:14

WORKDIR /todo-team-resource
COPY package.json .
RUN npm install
COPY . .
CMD [ "node", "src/index.js" ]
