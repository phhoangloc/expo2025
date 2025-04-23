import JSZip from "jszip";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const zip = new JSZip();
    const body = req.body

    const method = req.method

    switch (method) {
        case "POST":
            for (const fileName of body) {
                const comment = fileName.text.replace(/<[^>]*>/g, '')
                const response = await fetch(fileName.url);
                const blob = await response.blob();
                const buffer = await blob.arrayBuffer();
                const fileData = Buffer.from(buffer)
                const urlPath = new URL(fileName.url).pathname;
                const name = urlPath.substring(urlPath.lastIndexOf("/") + 1);
                const folder = zip.folder(name.split(".")[0])
                folder?.file(name, fileData);
                folder?.file('comment.txt', comment)
            }

            const zipContent = await zip.generateAsync({ type: "nodebuffer" });

            res.setHeader("Content-Disposition", "attachment; filename=expo.zip");
            res.setHeader("Content-Type", "application/zip");
            res.send(zipContent);
    }
}