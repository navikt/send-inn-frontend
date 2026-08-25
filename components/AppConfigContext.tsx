import React, { createContext, useContext } from 'react';
import { appConfig } from '../utils/appConfig';
import { EnvQualifierType } from '../utils/envQualifier';

interface AppConfigContextType {
  envQualifier: EnvQualifierType | undefined;
  minSideUrl: string;
  fyllutUrl: string;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const useAppConfig = () => {
  const appConfigContext = useContext(AppConfigContext);
  if (!appConfigContext) {
    throw new Error('Missing AppConfigProvider, when useAppConfigContext is called');
  }
  return appConfigContext;
};

type ProviderProps = {
  children?: React.ReactNode;
  envQualifier: EnvQualifierType | undefined;
};
export const AppConfigProvider = ({ children, envQualifier }: ProviderProps) => {
  const minSideUrl = getMinSideUrl(envQualifier);
  const fyllutUrl = getFyllutUrl(envQualifier);
  return (
    <AppConfigContext.Provider value={{ envQualifier, minSideUrl, fyllutUrl }}>{children}</AppConfigContext.Provider>
  );
};

const getMinSideUrl = (envQualifier?: EnvQualifierType): string => {
  const defaultUrl = appConfig.minSide.urls.default;
  if (!envQualifier) {
    return defaultUrl;
  }
  return appConfig.minSide.urls[envQualifier] || defaultUrl;
};

const getFyllutUrl = (envQualifier?: EnvQualifierType): string => {
  const defaultUrl = appConfig.fyllut.urls.default;
  if (!envQualifier) {
    return defaultUrl;
  }
  return appConfig.fyllut.urls[envQualifier] || defaultUrl;
};
