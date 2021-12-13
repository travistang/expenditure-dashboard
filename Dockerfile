FROM node:14

WORKDIR /app
ADD . /app/

RUN yarn
RUN npx prisma generate
RUN yarn build

CMD node dist/server.js