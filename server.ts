import "reflect-metadata";

import express from "express";
import next from "next";
import { resolvers } from "./prisma/generated/type-graphql";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import prisma from "./prisma-client";
import { CustomBudgetResolver } from "./backend/budgets";
import initializeJobs from "./jobs";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(() => {
    const jobs = initializeJobs(prisma);
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
