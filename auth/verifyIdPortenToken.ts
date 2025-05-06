import axios from 'axios';
import { envVar } from '../utils/backend/env';

const texasConfig = {
  introspection_endpoint: envVar('NAIS_TOKEN_INTROSPECTION_ENDPOINT'),
};

type ValidToken = {
  active: true;
  client_id: string;
  acr: string;
};

type TexasIntrospectionResponse = { active: false } | ValidToken;

export async function verifyIdportenAccessToken(token?: string) {
  if (!token) {
    throw new Error('IdPortenToken is undefined');
  }
  const response = await axios.post<TexasIntrospectionResponse>(texasConfig.introspection_endpoint, {
    identity_provider: 'idporten',
    token,
  });
  const validatedToken = response.data;
  if (!validatedToken.active) {
    throw new Error('IdPortenToken is expired');
  }

  const { client_id, acr } = validatedToken;

  if (client_id !== process.env.IDPORTEN_CLIENT_ID) {
    throw new Error('client_id matcher ikke min client ID');
  }

  if (acr !== 'Level4' && acr !== 'idporten-loa-high') {
    throw new Error('For lavt sikkerhetsnivå - acr: ' + acr);
  }
  return validatedToken;
}
