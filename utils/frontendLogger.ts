import axios from 'axios';
import { LoggerDto } from '../pages/api/logger';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const sendLog = async (body: LoggerDto) => {
  await axios.post(`${BASE_PATH}/api/logger`, body).catch(() => {
    console.error('Failed to send log:', body.message);
  });
};
