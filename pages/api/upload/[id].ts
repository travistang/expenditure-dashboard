import type { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "../../../prisma-client";
import logger from "../../../logger";
import {
  ExpenditureInput,
  expenditureValid,
  transformExpenditureInput,
} from "./_utils";

type Payload = {
  expenditures: ExpenditureInput[];
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  if (req.method !== "POST") {
    return res.status(400).json({ error: "Unsupported method" });
  }

  const id = req.query?.id;
  const data = req.body;
  if (Array.isArray(id)) {
    return res.status(400).json({ error: "Multiple id found" });
  }

  try {
    const payload: Payload = data;
    if (!payload?.expenditures?.every(expenditureValid)) {
      return res.status(400).send("invalid data");
    }
    const transformedRecords = payload.expenditures.map(
      transformExpenditureInput
    );
    const createResult = await prismaClient.expenditureRecord.createMany({
      data: transformedRecords,
      skipDuplicates: true,
    });
    return res.status(200).json({ count: createResult.count });
  } catch (e) {
    logger.error(e);
    console.log({ e });
    return res.status(400).json({ error: "Failed to decrypt payload" });
  }
}
