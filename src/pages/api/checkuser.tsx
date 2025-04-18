import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query

    const method = req.method

    const prisma = new PrismaClient();
    switch (method) {

        case "GET":
            const users = await prisma.user.findFirst({
                where: {
                    username: query.username?.toString(),
                    email: query.email?.toString()
                },
            });
            if (users?.id) {
                res.json(true)
            } else {
                res.json(false)
            }

    }
}