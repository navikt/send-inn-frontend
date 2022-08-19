import React from 'react';
import useUser from '../hooks/useUser';
import { useRouter } from 'next/router';

interface AuthenticationProviderProps {
    children?: React.ReactNode;
}

export function AuthenticationProvider({
    children,
}: AuthenticationProviderProps) {
    const router = useRouter();
    const { user } = useUser({
        redirectTo: '/login',
        redirectedFrom: router.basePath + router.asPath,
    });

    return <>{user?.isLoggedIn ? children : null}</>;
}
