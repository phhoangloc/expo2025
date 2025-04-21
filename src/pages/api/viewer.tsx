/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
// import connectMongoDB from '@/connect/database/mogoseDB'
// import { userModel } from '@/model/user.model'
import jwt from 'jsonwebtoken';

import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const prisma = new PrismaClient();
    const result: {
        success: boolean,
        message?: string,
        data?: any,
    } = { success: false };
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]
    const jwtResult = token && await jwt.verify(token, 'secretToken')
    const id = typeof jwtResult === 'object' && 'id' in jwtResult ? jwtResult.id : 0

    if (id) {
        try {
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