import type { NextApiRequest, NextApiResponse } from 'next'
// import connectMongoDB from '@/connect/database/mogoseDB'
// import { userModel } from '@/model/user.model'
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const login = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {

    // connectMongoDB()
    const prisma = new PrismaClient();


    if (req.method === 'POST') {
        let result: {
            success: boolean,
            message: string,
            result?: string,
        }
        const body = req.body
        const username = body.username
        const password = body.password

        console.log(body)
        const usenameiExsited = await prisma.user.findUnique({ where: { username: username } })
        if (usenameiExsited == null) {

            result = {
                success: false,
                message: "アカウントは存在しません",
            }

            res.json(result)

        } else {
            if (usenameiExsited.active === false) {

                result = {
                    success: false,
                    message: "アカウントは無効です。",
                }

                res.json(result)

            } else {
                const isPasswordValid = await bcrypt.compare(password, usenameiExsited.password);
                if (isPasswordValid) {

                    const payload = { id: usenameiExsited.id }

                    const token = jwt.sign(payload, 'secretToken', { expiresIn: '24h' });

                    result = {
                        success: true,
                        message: "ログインを成功しました。",
                        result: token,
                    }

                    res.json(result)


                } else {
                    result = {
                        success: false,
                        message: "入力したパスワードが間違いです",
                    }

                    res.json(result)
                }
            }
        }
    } else {
        res.json({
            success: false,
            message: "your request method is not supply"
        })
    }


}


export default login