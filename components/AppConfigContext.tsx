import getConfig from 'next/config';
import React, { createContext, useContext } from 'react';
import { EnvQualifierType } from '../utils/envQualifier';

const { publicRuntimeConfig } = getConfig();

interface AppConfigContextType {
  envQualifier: EnvQualifierType | undefined;
  minSideUrl: string;
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
  return <AppConfigContext.Provider value={{ envQualifier, minSideUrl }}>{children}</AppConfigContext.Provider>;
};

const getMinSideUrl = (envQualifier?: EnvQualifierType): string => {
  const defaultUrl = publicRuntimeConfig.minSide.urls.default;
  if (!envQualifier) {
    return defaultUrl;
  }
  return publicRuntimeConfig.minSide.urls[envQualifier] || defaultUrl;
};
