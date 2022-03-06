import "reflect-metadata";

import express from "express";
import next from "next";
import { resolvers } from "./prisma/generated/type-graphql";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";

import prisma from "./prisma-client";
import { CustomBudgetResolver } from "./backend/budgets";
import jobs from "./jobs";
import logger from "./logger";
import authMiddleware from "./backend/middlewares/authMiddleware";
import loginHandler from "./pages/api/login";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(() => {
    jobs.forEach((job) => job.start());
  })
  .then(async () => {
    const schema = await buildSchema({
      resolvers: [...resolvers, CustomBudgetResolver],
      validate: false,
    });
    return schema;
  })
  .then((schema) => new ApolloServer({ schema, context: () => ({ prisma }) }))
  .then(async (apolloServer) => {
    const app = express();
    await apolloServer.start();

    app.use(express.json());
    app.use(cookieParser());

    if (process.env.NODE_ENV === "production") {
      app.use(authMiddleware);
      app.post("/login", loginHandler);
    }

    app.use("/graphql", (req, res, next) => {
      logger.info(`[GraphQL Request]`, { request: req.body });
      next();
    });

    await apolloServer.applyMiddleware({ app });
    app.get("*", (req, res) => handle(req, res));
    app.post("*", (req, res) => handle(req, res));
    app.options("*", (req, res) => handle(req, res));
    return app;
  })
  .then((app) => {
    app.listen(3001, () => {
      console.log("> Ready on http://localhost:3001");
    });
  });
