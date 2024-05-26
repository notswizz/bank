import React from 'react';
import { Button } from 'react95';
import { usePrivy } from '@privy-io/react-auth';

const PrivyButton = () => {
  const { ready, authenticated, login } = usePrivy();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const disableLogin = !ready || (ready && authenticated);

  return (
    <Button disabled={disableLogin} onClick={handleLogin}>
      === ENTER ===
    </Button>
  );
};

export default PrivyButton;