import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.query

    const method = req.method

    switch (method) {

        case "GET":
            const { filename } = query;

            const fileUrl = `https://image.buoncf.jp/expo/${filename}`;
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const buffer = await blob.arrayBuffer();

            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
            res.send(Buffer.from(buffer));

    }
}