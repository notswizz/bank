import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePrivy } from '@privy-io/react-auth';

const AuthHandler = ({ children }) => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push('/bank');
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return <div>Loading...</div>; // Show a loading state while Privy is initializing
  }

  if (ready && !authenticated) {
    return <>{children}</>; // Render children if not authenticated
  }

  return null; // or a loading spinner while redirecting
};

export default AuthHandler;