FROM node:14-alpine as build

WORKDIR /app
ADD . /app/

RUN yarn
RUN npx prisma generate
RUN yarn build

FROM node:14-alpine as prod 
WORKDIR /app
COPY --from=build /app/dist package.json /app/

RUN yarn install --production && npm prune --production
CMD node dist/server.js