import { useRouter } from 'next/router';
import React from 'react';
import useUser from '../hooks/useUser';

interface AuthenticationProviderProps {
  children?: React.ReactNode;
}

export function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const router = useRouter();
  const { user } = useUser({
    redirectTo: '/redirect/login',
    redirectedFrom: router.basePath + router.asPath,
  });

  return <>{user?.isLoggedIn ? children : null}</>;
}
