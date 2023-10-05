import getConfig from 'next/config';
import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { User } from '../pages/api/user';

const { publicRuntimeConfig } = getConfig();

export default function useUser({ redirectTo = '', redirectIfFound = false, redirectedFrom = '' } = {}) {
  const { data: user, mutate: mutateUser } = useSWR<User>(publicRuntimeConfig.basePath + '/api/user');

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet

    if (!redirectTo || !user) return;
    // Forhindrer login-loop
    if (redirectedFrom.includes('/redirect/login')) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      const loginPathWithRedirect = redirectedFrom
        ? `${redirectTo}?redirect=${encodeURIComponent(redirectedFrom)}`
        : redirectedFrom;
      Router.push(loginPathWithRedirect);
    }
  }, [user, redirectIfFound, redirectTo, redirectedFrom]);

  return { user, mutateUser };
}
