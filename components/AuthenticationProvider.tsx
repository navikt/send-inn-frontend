import React from 'react';
import useUser from '../hooks/useUser';

interface AuthenticationProviderProps {
    children?: React.ReactNode;
}

export function AuthenticationProvider({
    children,
}: AuthenticationProviderProps) {
    const { user } = useUser({
        redirectTo: '/login',
    });

    return <>{children}</>;
}
