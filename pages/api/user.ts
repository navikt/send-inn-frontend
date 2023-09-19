import { NextApiRequest, NextApiResponse } from 'next';
import { decodeJwt } from 'jose';
import { isExpired } from '../../auth/verifyIdPortenToken';
export type User = {
    isLoggedIn: boolean;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<User>,
) {
    if (
        process.env.APP_ENV === 'development' ||
        process.env.APP_ENV === 'test'
    ) {
        return res.json({
            isLoggedIn: true,
        });
    }
    const authorization = req.headers.authorization;
    try {
        const token = authorization?.split(' ')[1] || '';
        const decodedToken = decodeJwt(token);
        if (isExpired(decodedToken)) {
            throw new Error('Expired');
        }
        return res.json({
            isLoggedIn: true,
        });
    } catch (error) {
        return res.json({
            isLoggedIn: false,
        });
    }
}
