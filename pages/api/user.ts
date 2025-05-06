import { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdportenAccessToken } from '../../auth/verifyIdPortenToken';
export type User = {
  isLoggedIn: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
  if (process.env.APP_ENV === 'development' || process.env.APP_ENV === 'test') {
    return res.json({
      isLoggedIn: true,
    });
  }
  const authorization = req.headers.authorization;
  try {
    const token = authorization?.split(' ')[1] || '';
    await verifyIdportenAccessToken(token);
    return res.json({
      isLoggedIn: true,
    });
  } catch (error) {
    return res.json({
      isLoggedIn: false,
    });
  }
}
