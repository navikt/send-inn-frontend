import { NextApiRequest, NextApiResponse } from 'next';
// import jwt from 'jsonwebtoken';

export type User = {
    isLoggedIn: boolean;
    pid: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<User>,
) {
    console.log('user');
    const authorization = req.headers.authorization;

    console.log(process.env.NODE_ENV);
    if (authorization) {
        // const token = authorization.split(' ')[1];
        // //TODO: verify token
        // const decodedToken = jwt.decode(token);
        res.json({
            isLoggedIn: true,
            pid: null,
        });
    } else if (process.env.NODE_ENV !== 'production') {
        res.json({
            isLoggedIn: true,
            pid: null,
        });
    } else {
        res.json({
            isLoggedIn: false,
            pid: null,
        });
    }
}
