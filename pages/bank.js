import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import Menu from '../components/Menu';
import Profile from '../components/Profile';
import Account from '../components/Account';
import Crypto from '../components/Crypto';
import Alpha from '../components/Alpha';
import Stats from '../components/Stats';
import Books from '../components/Books';
import Context from '../components/Context';
import { Button } from 'react95';
import useLocalStorage from '../utils/useLocalStorage';

const Wrapper = styled.div`
  padding: 5rem;
  background: ${({ theme }) => theme.desktopBackground};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 2rem;
`;

const WindowWrapper = styled.div`
  position: absolute;
`;

const Bank = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showProfile, setShowProfile] = useLocalStorage('showProfile', true);
  const [showAccount, setShowAccount] = useLocalStorage('showAccount', true);
  const [showCrypto, setShowCrypto] = useLocalStorage('showCrypto', true);
  const [showAlpha, setShowAlpha] = useLocalStorage('showAlpha', true);
  const [showStats, setShowStats] = useLocalStorage('showStats', true);
  const [showBooks, setShowBooks] = useLocalStorage('showBooks', true);
  const [showContext, setShowContext] = useLocalStorage('showContext', true);

  const accountData = [
    { account: 'Bovada', balance: '$12,098', lastUpdate: '2024-05-20' },
    { account: 'PrizePicks', balance: '$1,342', lastUpdate: '2024-05-21' },
    { account: 'Stake', balance: '$420', lastUpdate: '2024-05-22' },
  ];

  useEffect(() => {
    const token = Cookies.get('token');
    const userEmail = Cookies.get('email');
    if (!token) {
      router.push('/');
    } else {
      setEmail(userEmail);
    }
    setMounted(true);
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('email');
    router.push('/');
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const toggleAccount = () => {
    setShowAccount(!showAccount);
  };

  const toggleCrypto = () => {
    setShowCrypto(!showCrypto);
  };

  const toggleAlpha = () => {
    setShowAlpha(!showAlpha);
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const toggleBooks = () => {
    setShowBooks(!showBooks);
  };

  const toggleContext = () => {
    setShowContext(!showContext);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Wrapper>
      <Menu
        handleLogout={handleLogout}
        email={email}
        onProfileClick={toggleProfile}
        onAccountClick={toggleAccount}
        onCryptoClick={toggleCrypto}
        onAlphaClick={toggleAlpha}
        onStatsClick={toggleStats}
        onBooksClick={toggleBooks}
        onContextClick={toggleContext}
      />
      <h1>BANK 95</h1>
      {showProfile && (
        <WindowWrapper style={{ top: '10%', left: '15%' }}>
          <Profile email={email} onClose={toggleProfile} />
        </WindowWrapper>
      )}
      {showAccount && (
        <WindowWrapper style={{ top: '10%', left: '50%' }}>
          <Account data={accountData} onClose={toggleAccount} />
        </WindowWrapper>
      )}
      {showCrypto && (
        <WindowWrapper style={{ top: '67%', left: '10%' }}>
          <Crypto onClose={toggleCrypto} />
        </WindowWrapper>
      )}
      {showAlpha && (
        <WindowWrapper style={{ top: '45%', left: '55%' }}>
          <Alpha onClose={toggleAlpha} />
        </WindowWrapper>
      )}
      {showStats && (
        <WindowWrapper style={{ top: '45%', left: '75%' }}>
          <Stats onClose={toggleStats} />
        </WindowWrapper>
      )}
      {showBooks && (
        <WindowWrapper style={{ top: '20%', left: '20%' }}>
          <Books onClose={toggleBooks} />
        </WindowWrapper>
      )}
      {showContext && (
        <WindowWrapper style={{ top: '30%', left: '30%' }}>
          <Context onClose={toggleContext} />
        </WindowWrapper>
      )}
    </Wrapper>
  );
};

export default Bank;
