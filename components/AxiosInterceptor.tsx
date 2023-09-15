import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface PropsAxiosInterceptor {
    children: React.ReactNode;
}

export const AxiosInterceptor = ({
    children,
}: PropsAxiosInterceptor) => {
    const [isSet, setIsSet] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const responseInterceptor = (response: AxiosResponse) => {
            return response;
        };

        const errorInterceptor = (error: AxiosError) => {
            if (error.response?.status === 401) {
                router.push(
                    'redirect/login?redirect=' +
                        encodeURIComponent(
                            router.basePath + router.asPath,
                        ),
                );
            }
            return Promise.reject(error);
        };

        const interceptor = axios.interceptors.response.use(
            responseInterceptor,
            errorInterceptor,
        );

        setIsSet(true);

        return () => axios.interceptors.response.eject(interceptor);
    }, [router]);

    return <>{isSet && children}</>;
};
