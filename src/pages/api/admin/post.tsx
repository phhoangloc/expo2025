/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const post = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    // const query = req.query
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
                    const post = await prisma.post.findMany({
                        // where: query.id ? { id: Number(query.id) } : {},
                        select: {
                            id: true,
                            host: {
                                select: {
                                    id: true,
                                    username: true
                                }
                            },
                            image: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            content: true,
                            createdAt: true
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    })

                    result.success = true
                    result.data = post
                    res.json(result)

                    break
                case "POST":
                    const body = req.body
                    console.log(body)
                    body.host = {
                        connect: { id: body.hostId }
                    }
                    body.hostId = undefined
                    body.image = {
                        connect: { id: body.imageId }
                    }
                    body.imageId = undefined

                    await prisma.post.create({ data: body })
                    result.success = true
                    result.message = "写真を投稿できました"
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


export default post