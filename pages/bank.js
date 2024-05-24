import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import Menu from '../components/Menu';
import Profile from '../components/Profile';
import Account from '../components/Account';
import Bank from '../components/Bank';
import Alpha from '../components/Alpha';
import Stats from '../components/Stats';
import Books from '../components/Books';
import Context from '../components/Context';
import InvestmentTool from '../components/Tool';
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

const Bank95 = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [showAlpha, setShowAlpha] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [showInvestmentTool, setShowInvestmentTool] = useState(false);

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

  if (!mounted) {
    return null;
  }

  const openWindows = {
    profile: showProfile,
    account: showAccount,
    bank: showBank,
    alpha: showAlpha,
    stats: showStats,
    books: showBooks,
    context: showContext,
    investmentTool: showInvestmentTool,
  };

  return (
    <Wrapper>
      <Menu
        handleLogout={handleLogout}
        email={email}
        onProfileClick={() => setShowProfile(!showProfile)}
        onAccountClick={() => setShowAccount(!showAccount)}
        onBankClick={() => setShowBank(!showBank)}
        onAlphaClick={() => setShowAlpha(!showAlpha)}
        onStatsClick={() => setShowStats(!showStats)}
        onBooksClick={() => setShowBooks(!showBooks)}
        onContextClick={() => setShowContext(!showContext)}
        onInvestmentToolClick={() => setShowInvestmentTool(!showInvestmentTool)}
        openWindows={openWindows}
      />
      <h1>BANK 95</h1>
      {showProfile && (
        <WindowWrapper style={{ top: '10%', left: '15%' }}>
          <Profile email={email} onClose={() => setShowProfile(false)} />
        </WindowWrapper>
      )}
      {showAccount && (
        <WindowWrapper style={{ top: '10%', left: '50%' }}>
          <Account data={accountData} onClose={() => setShowAccount(false)} />
        </WindowWrapper>
      )}
      {showBank && (
        <WindowWrapper style={{ top: '67%', left: '10%' }}>
          <Bank onClose={() => setShowBank(false)} />
        </WindowWrapper>
      )}
      {showAlpha && (
        <WindowWrapper style={{ top: '45%', left: '55%' }}>
          <Alpha onClose={() => setShowAlpha(false)} />
        </WindowWrapper>
      )}
      {showStats && (
        <WindowWrapper style={{ top: '45%', left: '75%' }}>
          <Stats onClose={() => setShowStats(false)} />
        </WindowWrapper>
      )}
      {showBooks && (
        <WindowWrapper style={{ top: '20%', left: '20%' }}>
          <Books onClose={() => setShowBooks(false)} />
        </WindowWrapper>
      )}
      {showContext && (
        <WindowWrapper style={{ top: '30%', left: '30%' }}>
          <Context onClose={() => setShowContext(false)} />
        </WindowWrapper>
      )}
      {showInvestmentTool && (
        <WindowWrapper style={{ top: '40%', left: '40%' }}>
          <InvestmentTool onClose={() => setShowInvestmentTool(false)} />
        </WindowWrapper>
      )}
    </Wrapper>
  );
};

export default Bank95;
