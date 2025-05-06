import axios from 'axios';
import { envVar } from '../utils/backend/env';

const texasConfig = {
  exchange_endpoint: envVar('NAIS_TOKEN_EXCHANGE_ENDPOINT'),
};

type TexasExchangeResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export const getTokenxToken = async (subject_token: string, audience: string) => {
  const response = await axios.post<TexasExchangeResponse>(texasConfig.exchange_endpoint, {
    identity_provider: 'tokenx',
    target: audience,
    user_token: subject_token,
  });

  return response.data.access_token;
};
