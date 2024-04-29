import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { FyllutForm } from '../../../../types/form';
import { logger } from '../../../../utils/backendLogger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { form, type, lang } = req.query;

  const queryParams = new URLSearchParams();
  queryParams.append('type', (type as string) ?? 'limited');
  queryParams.append('lang', (lang as string) ?? 'nb');

  try {
    const response = await axios.get<FyllutForm>(
      `${process.env.NEXT_PUBLIC_FYLLUT_URL}/api/forms/${form}?${queryParams.toString()}`,
    );
    return res.status(200).json(response.data);
  } catch (error) {
    logger.warn('Failed to fetch form from fyllut', error);

    const axiosError = error as AxiosError;
    const status = axiosError?.response?.status;
    const message = axiosError?.message;

    return res.status(status ?? 500).json({ error: message ?? 'Failed to fetch form' });
  }
}
