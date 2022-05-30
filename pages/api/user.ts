import { NextApiRequest, NextApiResponse } from 'next';
import { decodeJwt } from 'jose';
import { isExpired } from '../../auth/verifyIdPortenToken';
export type User = {
    isLoggedIn: boolean;
    pid: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<User>,
) {
    if (process.env.NODE_ENV !== 'production') {
        return res.json({
            isLoggedIn: true,
            pid: null,
        });
    }
    const authorization = req.headers.authorization;
    try {
        const token = authorization.split(' ')[1];
        const decodedToken = decodeJwt(token);
        if (isExpired(decodedToken)) {
            throw new Error('Expired');
        }
        return res.json({
            isLoggedIn: true,
            pid: decodedToken.pid as string,
        });
    } catch (error) {
        return res.json({
            isLoggedIn: false,
            pid: null,
        });
    }
}
