// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand, PutObjectRequest } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const s3 = new S3Client({});

    const bucket = process.env.BUCKET_NAME as string;
    const filename = req.query.file as string;

    const horeq: PutObjectRequest = { Bucket: bucket, Key: filename };

    const command = new PutObjectCommand(horeq);

    const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 });

    res.status(200).json(url);
}
``;
