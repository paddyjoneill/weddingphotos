// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const s3 = new S3Client({});

    const bucket = process.env.RESIZED_BUCKET_NAME as string;

    const locommand = new ListObjectsCommand({ Bucket: bucket });
    const response = await s3.send(locommand);
    const files = response.Contents?.map((obj) => obj.Key);

    console.log({ response: response.Contents });

    res.status(200).json({ files });
}
