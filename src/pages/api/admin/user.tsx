/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const user = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const query = req.query
    const method = req.method
    const result: any = { success: false };
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]
    const jwtResult = token && await jwt.verify(token, 'secretToken')
    const id = typeof jwtResult === 'object' && 'id' in jwtResult ? jwtResult.id : 0

    const prisma = new PrismaClient();

    if (id) {
        const user = await prisma.user.findFirst({ where: { id: id } })
        if (user?.position === "admin") {
            switch (method) {
                case "GET":
                    const userRe = await prisma.user.findMany({
                        where: query.archive ? { archive: query.archive.toString() } : undefined,
                        select: {
                            id: true,
                            username: true,
                            password: true,
                            email: true,
                            position: true,
                        },

                    })

                    result.success = true
                    result.data = userRe
                    res.json(result)

                    break
                case "POST":
                    const body = req.body
                    console.log(body)
                    await prisma.user.create({ data: body })
                    result.success = true
                    result.message = "アカウントが作成されました。"
                    res.json(result)
                    break
            }
        } else {
            result.success = false
            result.message = "許可がありません"
            res.json(result)
        }
    } else {
        result.success = false
        result.message = "まだログインしていません"
        res.json(result)
    }
}


export default user