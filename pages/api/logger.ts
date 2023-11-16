import type { NextApiRequest, NextApiResponse } from 'next';
import { rawLogger } from '../../utils/backendLogger';

const VALID_LEVELS = ['error', 'warn', 'info', 'debug'] as const;
export type LoggerDto = { message: string; level: (typeof VALID_LEVELS)[number] };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(404).send('Not found');
  }
  const { message, level }: LoggerDto = req.body || {};
  if (typeof message !== 'string' || typeof level !== 'string' || !VALID_LEVELS.includes(level)) {
    return res.status(400).send('Bad request');
  }

  const LogObject = {
    message,
    userAgent: req.headers['user-agent'],
    referer: req.headers['referer'],
  };

  rawLogger[level](LogObject);
  res.status(201).send('OK');
}
