/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

import jwt from 'jsonwebtoken';
export const config = {
    api: {
        bodyParser: false, // Tắt bodyParser để sử dụng formidable
    },
};

const image = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const method = req.method
    const result: {
        success: boolean,
        message?: string,
        data?: any,
    } = { success: false }
    const prisma = new PrismaClient();


    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]
    const jwtResult = token && await jwt.verify(token, 'secretToken')
    const id = typeof jwtResult === 'object' && 'id' in jwtResult ? jwtResult.id : 0
    if (id) {
        switch (method) {
            case "GET":
                const pics = await prisma.image.findMany({ where: { hostId: id }, include: { host: { select: { username: true } } }, orderBy: { createdAt: "desc" } })

                if (pics.length) {
                    result.success = true
                    result.data = pics
                    res.json(result)
                } else {
                    result.success = false
                    result.data = []
                    res.json(result)
                }
                break
        }
    }
    else {
        result.success = false
        result.message = "まだログインしていません"
        res.json(result)
    }

}


export default image