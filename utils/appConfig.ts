import { EnvQualifierType } from './envQualifier';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const minSideAnsattUrl = process.env.NEXT_PUBLIC_MIN_SIDE_ANSATT_URL;

const minSideUrls: Partial<Record<EnvQualifierType, string>> & { default: string } = {
  ...(process.env.NEXT_PUBLIC_APP_ENV !== 'production' && {
    preprodAnsatt: minSideAnsattUrl,
    preprodAltAnsatt: minSideAnsattUrl,
    delingslenke: minSideAnsattUrl,
  }),
  default: process.env.NEXT_PUBLIC_MIN_SIDE_URL || '',
};

const fyllutUrls: Partial<Record<EnvQualifierType, string>> & { default: string } = {
  ...(process.env.NEXT_PUBLIC_APP_ENV !== 'production' && {
    preprodAnsatt: 'https://fyllut-preprod.ansatt.dev.nav.no/fyllut',
    preprodAltAnsatt: 'https://fyllut-preprod-alt.ansatt.dev.nav.no/fyllut',
  }),
  default: process.env.NEXT_PUBLIC_FYLLUT_URL || '',
};

export const appConfig = {
  apiUrl: basePath + (process.env.NEXT_PUBLIC_API_URL || '/api/backend'),
  maxFileSizeInMb: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_IN_MB!),
  minSide: {
    urls: minSideUrls,
  },
  fyllut: {
    urls: fyllutUrls,
  },
  basePath,
};
