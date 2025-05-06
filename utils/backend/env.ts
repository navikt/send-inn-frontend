import { rawLogger } from '../backendLogger';

export const envVar = (name: string, required = true, defaultValue?: string): string => {
  const envVariable = process.env[name];
  if (!envVariable && required && !defaultValue) {
    rawLogger.error(`Missing required environment variable: '${name}'`);
    throw Error(`Missing required environment variable: '${name}'`);
  }
  if (!envVariable && defaultValue) {
    return defaultValue;
  } else {
    return envVariable as string;
  }
};
