import type { NextApiRequest, NextApiResponse } from 'next'
import JSZip from "jszip";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query

    const body = req.body
    const text = body.text
    const method = req.method
    const zip = new JSZip();

    switch (method) {

        case "POST":
            const { filename } = query;
            const fileUrl = `https://image.buoncf.jp/expo/${filename}`;
            const name = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const buffer = await blob.arrayBuffer();
            zip.file(name.toString(), Buffer.from(buffer));
            zip.file("comment.txt", text);

            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
            const zipContent = await zip.generateAsync({ type: "nodebuffer" });
            res.send(zipContent);

    }
}