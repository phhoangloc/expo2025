/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import Client from "ssh2-sftp-client"
import moment from "moment"
export const config = {
    api: {
        bodyParser: false, // Tắt bodyParser để sử dụng formidable
    },
};

const image = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {


    const query = req.query
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
    // console.log(trydata)
    switch (method) {
        case "GET":
            const pics = await prisma.image.findMany({ where: { hostId: id } })

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
        case "POST":
            // const form = new formidable.IncomingForm();
            const form = new IncomingForm();

            await form.parse(req, async (err: Error, fields: any, files: any) => {
                if (err) {
                    throw err
                } else {
                    const uploadFile = files && files.file;

                    const client = new Client();
                    // client.ftp.timeout = 60 * 1000

                    await client.connect({
                        host: "buoncf.jp",
                        username: "locpham",
                        password: "031090Ph@",
                        port: 22
                    });
                    const pic = await prisma.image.findFirst({ where: { name: moment(Date()).format("YYYYMMDD_hhmmss") + uploadFile[0].originalFilename } })
                    if (pic) {
                        result.success = false
                        result.message = "この写真はすでに存在します"
                        res.json(result)

                    } else {
                        await client.put(uploadFile[0].filepath, `/home/locpham/public_html/expo/${moment(Date()).format("YYYYMMDD_hhmmss") + uploadFile[0].originalFilename}`);
                        client.end()
                        await prisma.image.create({ data: { hostId: id, name: moment(Date()).format("YYYYMMDD_hhmmss") + uploadFile[0].originalFilename } })

                        result.success = true
                        result.message = "写真をアップロードしました"
                        result.data = moment(Date()).format("YYYYMMDD_hhmmss") + uploadFile[0].originalFilename
                        res.json(result)

                    }
                }
            })
            break
        case "DELETE":
            const pic = await prisma.image.findUnique({ where: { id: Number(query.id) } })
            if (id === pic?.hostId) {


                const client = new Client();
                // client.ftp.timeout = 60 * 1000

                await client.connect({
                    host: "buoncf.jp",
                    username: "locpham",
                    password: "031090Ph@",
                    port: 22
                });

                const result = await client.delete("/home/locpham/public_html/expo/" + pic?.name);
                if (result) {
                    await prisma.image.delete({ where: { id: Number(query.id) } })
                    res.json({ success: true })
                } else {
                    res.json({ success: false })
                }
                break;
            } else {
                res.json({
                    msg: "この画像はあなたの画像ではありません。",
                    success: false
                })

            }
    }
}


export default image