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
        }
    } else {
        result.success = false
        result.message = "まだログインしていません"
        res.json(result)
    }
}


export default post