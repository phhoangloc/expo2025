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
                    email: query.email?.toString()
                },
            });
            if (users?.id) {
                const email = users.email
                const result = await prisma.user.update({
                    where: { email: email },
                    data: {
                        active: true
                    }
                })
                console.log(result)
                res.json("このアカウントは有効化されました。")
            } else {
                res.json("このメールは存在しません。")
            }

    }
}