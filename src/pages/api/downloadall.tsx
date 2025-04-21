import JSZip from "jszip";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const zip = new JSZip();
    const body = req.body

    const method = req.method

    switch (method) {
        case "POST":
            for (const fileName of body) {
                // const filePath = path.join(process.cwd(), "public", "files", fileName);
                const response = await fetch(fileName);
                const blob = await response.blob();
                const buffer = await blob.arrayBuffer();
                const fileData = Buffer.from(buffer)
                const urlPath = new URL(fileName).pathname;
                const name = urlPath.substring(urlPath.lastIndexOf("/") + 1);
                zip.file(name, fileData);

            }

            const zipContent = await zip.generateAsync({ type: "nodebuffer" });

            res.setHeader("Content-Disposition", "attachment; filename=expo.zip");
            res.setHeader("Content-Type", "application/zip");
            res.send(zipContent);
    }
}