import prismaClient from "../../prisma-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { UploadRequest } from "@prisma/client";
import { getLocalIP } from "../../utils/network";
import { generateKeyAndIv } from "../../utils/cryptography";

type ResponseType = Pick<UploadRequest, "key"> & { url: string };
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const key = generateKeyAndIv();
  await prismaClient.uploadRequest.deleteMany({});
  const uploadRequest = await prismaClient.uploadRequest.create({
    data: {
      createdAt: new Date(),
      key: Buffer.from(JSON.stringify(key)).toString("base64"),
    },
  });
  const localIp = getLocalIP();
  return res.status(200).json({
    url: `http://${localIp}:${process.env.port || 3001}/api/upload/${
      uploadRequest.id
    }`,
    key: uploadRequest.key,
  });
}
