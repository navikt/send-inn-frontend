import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { appConfig } from '../utils/appConfig';

interface PropsAxiosInterceptor {
  children: React.ReactNode;
}

interface AxiosInterceptorContextType {
  savedAt?: string;
}

const AxiosInterceptorContext = createContext<AxiosInterceptorContextType | null>(null);

export const useAxiosInterceptorContext = () => {
  const axiosInterceptorContext = useContext(AxiosInterceptorContext);
  if (!axiosInterceptorContext) {
    throw new Error('Mangler AxiosInterceptor, når useAxiosInterceptorContext kalles');
  }
  return axiosInterceptorContext;
};

export const AxiosInterceptor = ({ children }: PropsAxiosInterceptor) => {
  const [isSet, setIsSet] = useState(false);
  const [savedAt, setSavedAt] = useState<string>();

  const router = useRouter();
  const { i18n } = useTranslation();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (config.url?.startsWith(`${appConfig.apiUrl}/`)) {
        config.headers.set('Accept-Language', i18n.language || 'nb');
      }
      return config;
    });

    const responseInterceptor = (response: AxiosResponse) => {
      const method = response.config.method?.toLowerCase() || '';
      const updateMethods = ['post', 'put', 'patch', 'delete'];
      if (updateMethods.includes(method)) {
        setSavedAt(new Date(Date.now()).toLocaleString('nb'));
      }
      return response;
    };

    const errorInterceptor = (error: AxiosError) => {
      if (error.response?.status === 401) {
        router.push('redirect/login?redirect=' + encodeURIComponent(router.basePath + router.asPath));
      }
      return Promise.reject(error);
    };

    const interceptor = axios.interceptors.response.use(responseInterceptor, errorInterceptor);

    setIsSet(true);

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(interceptor);
    };
  }, [router, i18n]);

  return <AxiosInterceptorContext.Provider value={{ savedAt }}>{isSet && children}</AxiosInterceptorContext.Provider>;
};
