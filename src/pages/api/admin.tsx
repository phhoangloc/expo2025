
import type { NextApiRequest, NextApiResponse } from 'next'

import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const prisma = new PrismaClient();

    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]

    const jwtResult = token && await jwt.verify(token, 'secretToken')
    const id = typeof jwtResult === 'object' && 'id' in jwtResult ? jwtResult.id : 0

    if (id) {
        try {
            const user = await prisma.user.findFirst({ where: { id: id } })
            if (user?.position === "admin") {
                const user = await prisma.user.findUnique({
                    where: {
                        id: id
                    },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        position: true,
                    }
                })
                res.json({
                    success: true,
                    data: user
                })
            } else {
                res.json({
                    success: false,
                    msg: "許可がありません"
                })
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            res.json({
                success: false,
                msg: "有効期限が切れた",
                id: undefined
            })

        }

    } else {
        res.json({
            success: false,
            msg: "まだログインしていません",
            id: undefined
        })
    }
}