import React from 'react';
import { Button } from 'react95';
import { usePrivy } from '@privy-io/react-auth';

const LogoutButton = () => {
  const { ready, authenticated, logout } = usePrivy();
  const disableLogout = !ready || (ready && !authenticated);

  return (
    <Button disabled={disableLogout} onClick={logout}>
      Log out
    </Button>
  );
};

export default LogoutButton;