FROM node:14-alpine as build

WORKDIR /app
COPY constants/ prisma/ queries/ utils/ backend/ styles/ components/ public/ jobs/ pages/ domain/ *.js *.ts *.json /app/

RUN yarn
RUN npx prisma generate
RUN yarn build

FROM node:14-alpine as prod 
WORKDIR /app
COPY --from=build /app/dist package.json /app/

RUN yarn install --production && npm prune --production
CMD node dist/server.js