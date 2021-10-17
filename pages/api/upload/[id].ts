import type { NextApiRequest, NextApiResponse } from "next";
import prismaClient from "../../../prisma-client";
import { ExpenditureRecord } from ".prisma/client";
import { differenceInMinutes } from "date-fns";
import { decryptCipherWithKey } from "../../../utils/cryptography";

type Payload = {
  expenditures: (Omit<ExpenditureRecord, "date"> & { date: string })[];
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
  const uploadRequestRecord = await prismaClient.uploadRequest.findFirst({
    where: { id },
  });
  if (!uploadRequestRecord) {
    return res.status(404).json({ error: "Record not found" });
  }

  if (
    differenceInMinutes(new Date(), new Date(uploadRequestRecord.createdAt)) > 1
  ) {
    await prismaClient.uploadRequest.delete({ where: { id } });
    return res.status(400).json({ error: "Request timed out" });
  }
  try {
    const decryptedString = decryptCipherWithKey(data, uploadRequestRecord.key);
    const payload: Payload = JSON.parse(decryptedString.toString());
    if (
      !payload?.expenditures?.every((expenditure) => {
        const isDateValid = !Number.isNaN(new Date(expenditure.date).getTime());
        const isTagValid =
          Array.isArray(expenditure.tags) &&
          expenditure.tags.every((tag) => typeof tag === "string");
        const hasFieldMissing =
          !expenditure.date || !expenditure.name || !expenditure.id;

        return isDateValid && isTagValid && !hasFieldMissing;
      })
    ) {
      return res.status(400).send("invalid data");
    }
    const transformedRecords = payload.expenditures.map((expenditure) => ({
      ...expenditure,
      date: new Date(expenditure.date),
    }));
    console.log({ transformedRecords });
    //TODO: Uncomment below to save incoming data to DB
    // const createResult = await prismaClient.expenditureRecord.createMany({
    //   data: transformedRecords,
    // });
    // return res.status(200).json({ count: createResult.count });
    return res.status(200).json({ count: 0 });
  } catch {
    return res.status(400).json({ error: "Failed to decrypt payload" });
  }
}
