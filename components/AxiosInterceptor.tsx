import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';

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

  useEffect(() => {
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

    return () => axios.interceptors.response.eject(interceptor);
  }, [router]);

  return (
    <AxiosInterceptorContext.Provider value={{ savedAt }}>
      {savedAt}
      {isSet && children}
    </AxiosInterceptorContext.Provider>
  );
};
