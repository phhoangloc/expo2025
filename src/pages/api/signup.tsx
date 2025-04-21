

// import { userModel } from '@/model/user.model';
import type { NextApiRequest, NextApiResponse } from 'next'
// import connectMongoDB from '@/connect/database/mogoseDB';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'h-loc@astem-co.co.jp',
        pass: 'zkwe vmxt gkxc ixts'
    },
});

const createUser = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    // connectMongoDB()
    const prisma = new PrismaClient();

    if (req.method === 'POST') {
        const body = req.body;
        const result: {
            success: boolean,
            message?: string,
            result?: string,
        } = { success: false }
        await prisma.user.create({ data: body })
            .catch((error: Error) => {
                result.success = false
                result.message = error.message
                throw error.message
            })

        const mainOptions = {
            from: 'astem (astem@gmail.com) <no-reply>',
            to: req.body.email,
            subject: 'Active your Account',
            html: `
        <p style="text-align:center">ご登録いただきありがとうございます！<p>
        <p style="text-align:center">アカウントを有効にするには<a style="font-weight:bold;color:green" href="${process.env.HOMEPAGE_URL}api/active?email=${req.body.email}">ここ</a>をクリックしてください<p>`
        };
        await transporter.sendMail(mainOptions)
            .catch((error: Error) => {
                result.success = false
                result.message = error.message
                res.send(result)
                throw error.message
            }).then(() => {
                result.success = true
                result.message = "アカウントを有効にするためにメールを確認してください"
                res.json(result)
            })
    } else {
        res.json({
            success: false,
            message: "your request method is not supply"
        })
    }
}

export default createUser