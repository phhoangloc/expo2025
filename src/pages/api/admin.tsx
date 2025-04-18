/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
// import connectMongoDB from '@/connect/database/mogoseDB'
// import { userModel } from '@/model/user.model'

import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const prisma = new PrismaClient();
    let id
    const result: {
        success: boolean,
        message?: string,
        data?: any,
    } = { success: false };
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]

    if (token) {
        try {
            const result = verify(token, "secretToken")
            if (typeof result === 'object' && 'id' in result) {
                const id: number = result.id
                const user = await prisma.admin.findUnique({
                    where: {
                        id: id
                    },
                    select: {
                        id: true,
                        username: true,
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
                    msg: "you have problem in your JWT",
                    id: undefined
                })
            }
        } catch (error) {
            res.json({
                success: false,
                msg: "your token is expired",
                id: undefined
            })

        }
        // await verify(token, 'secretToken', async (err: Error, data: any) => {
        //     if (err) {
        //         if (err.name === 'TokenExpiredError') {
        //             result.message = ''
        //             res.json(result);
        //         } else {
        //             res.json(result);
        //         }
        //     } else {
        //         id = data.id
        //         const user = await prisma.user.findUnique({
        //             where: {
        //                 id: id
        //             },
        //             select: {
        //                 id: true,
        //                 username: true,
        //                 email: true,
        //                 position: true,
        //                 pic: {
        //                     select: {
        //                         id: true,
        //                         name: true,
        //                     },
        //                 }
        //             }
        //         })
        //         if (user?.id) {
        //             result.success = true
        //             result.data = user
        //             res.json(result)
        //         } else {
        //             result.success = false
        //             result.data = []
        //             res.json(result)
        //         }

        //     }
        // })
    } else {
        res.send(result)
    }
}