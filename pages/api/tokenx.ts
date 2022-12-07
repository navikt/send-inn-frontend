import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokenxToken } from '../../auth/getTokenXToken';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const idportenToken = req.headers.authorization.split(' ')[1];
    const tokenxToken = await getTokenxToken(
        idportenToken,
        process.env.INNSENDING_API_AUDIENCE,
    );
    res.status(200).json({ tokenxToken, idportenToken });
}
