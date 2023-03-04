// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand, PutObjectRequest, ListObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const s3 = new S3Client({});

    const bucket = process.env.BUCKET_NAME as string;
    const filename = req.query.file as string;

    const locommand = new ListObjectsCommand({ Bucket: bucket });
    const response = await s3.send(locommand);
    const files = response.Contents?.map((obj) => obj.Key);

    if (files?.includes(filename)) {
        res.status(409).json({ message: 'files exists' });
        return;
    }

    const poreq: PutObjectRequest = { Bucket: bucket, Key: filename };

    const pocommand = new PutObjectCommand(poreq);

    const url = await getSignedUrl(s3, pocommand, { expiresIn: 15 * 60 });

    res.status(200).json(url);
}
