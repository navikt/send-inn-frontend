import { IncomingMessage } from 'node:http';

export const EnvQualifier = {
  preprodIntern: 'preprodIntern',
  preprodAnsatt: 'preprodAnsatt',
  preprodAltIntern: 'preprodAltIntern',
  preprodAltAnsatt: 'preprodAltAnsatt',
  delingslenke: 'delingslenke',
  local: 'local',
} as const;

export type EnvQualifierType = (typeof EnvQualifier)[keyof typeof EnvQualifier];

export const getEnvQualifier = (req?: IncomingMessage): EnvQualifierType | undefined => {
  if (process.env.NAIS_CLUSTER_NAME === 'prod-gcp' || !req) {
    return undefined;
  }
  const appName = process.env.NAIS_APP_NAME;
  const host = req.headers['host'];
  if (host?.includes('local')) {
    return 'local';
  }
  if (host?.includes('intern.dev')) {
    switch (appName) {
      case 'send-inn-frontend-alt':
        return 'preprodAltIntern';
      default:
        return 'preprodIntern';
    }
  }
  if (host?.includes('ansatt.dev')) {
    switch (appName) {
      case 'send-inn-frontend-delingslenke':
        return 'delingslenke';
      case 'send-inn-frontend-alt':
        return 'preprodAltAnsatt';
      default:
        return 'preprodAnsatt';
    }
  }
  return undefined;
};
