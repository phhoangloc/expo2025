import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';


export const config = {
    api: {
        bodyParser: false, // Tắt bodyParser để sử dụng formidable
    },
};

const image = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {


    // const query = req.query
    const method = req.method
    const query = req.query
    const result: {
        success: boolean,
        message?: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?: any,
    } = { success: false }
    const prisma = new PrismaClient();


    switch (method) {
        case "GET":
            const pics = await prisma.image.findMany({
                where: query.id ? { id: Number(query.id) } : {},
                select: {
                    id: true,
                    host: {
                        select: {
                            id: true,
                            username: true
                        }
                    },
                    name: true,
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'desc',
                },
            })

            // .find(query.id ? { "_id": query.id } : {})
            // .find(query.search ? { "name": { $regex: query.search } } : {})
            // .sort({ "createDate": -1 })
            // .skip(query.skip)
            // .sort(query.sort ? query.sort : {})
            // .limit(query.limit ? query.limit : {})
            // .catch((error: Error) => {
            //     result.success = false
            //     result.message = error.message
            //     res.json(result)
            // })
            // .then((data: any) => {
            //     result.success = true
            //     result.data = data
            //     res.json(result)

            // })                           
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


export default image