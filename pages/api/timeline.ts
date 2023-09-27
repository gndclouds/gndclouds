import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const posts = await prisma.timeline.findMany({
        where: { published: true },
      });
      // console.log(posts);

      res.status(200).json({ posts });
    } catch (error: any) {
      // console.log(error);
      res.status(500).end();
    }
  }
}
