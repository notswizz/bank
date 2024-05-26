import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Window, WindowContent, WindowHeader, Button, Toolbar, Monitor } from 'react95';
import Menu from '../components/Menu';
import Profile from '../components/Profile';
import Account from '../components/Account';
import Bank from '../components/Bank';
import Alpha from '../components/Alpha';
import Stats from '../components/Stats';
import Books from '../components/Books';
import Context from '../components/Context';
import InvestmentTool from '../components/Tool';
import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';

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



const MonitorWrapper = styled(Monitor)`
color:white;
  margin-bottom: 20rem;
`;

const Bank95 = () => {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  const [mounted, setMounted] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [showAlpha, setShowAlpha] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [showInvestmentTool, setShowInvestmentTool] = useState(false);
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState('');

  const accountData = [
    { account: 'Bovada', balance: '$12,098', lastUpdate: '2024-05-20' },
    { account: 'PrizePicks', balance: '$1,342', lastUpdate: '2024-05-21' },
    { account: 'Stake', balance: '$420', lastUpdate: '2024-05-22' },
  ];

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    } else if (ready && authenticated) {
      const fetchUserData = async () => {
        try {
          const walletAddress = user.wallet?.address;
          const response = await axios.get(`/api/userByWallet?walletAddress=${walletAddress}`);
          const data = response.data;
          if (!data.username) {
            setShowProfile(true);
          }
          setBalance(data.balance || 0);
          setUsername(data.username || '');
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
      setMounted(true);
    }
  }, [ready, authenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleBalanceUpdate = async () => {
    try {
      const walletAddress = user.wallet?.address;
      const response = await axios.get(`/api/userBalance?walletAddress=${walletAddress}`);
      const data = response.data;
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  if (!mounted) {
    return <div>Loading...</div>; // Show a loading state while Privy is initializing
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
        email={user?.email || ''}
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
      <MonitorWrapper backgroundStyles={{ background: 'blue' }}>
        <WindowContent>
          <h1> ----- BANK 95 ----- </h1>
          <p><strong> {username}</strong></p>
          <p><strong>Balance:</strong> ${balance}</p>
        </WindowContent>
      </MonitorWrapper>
      {showProfile && (
        <WindowWrapper style={{ top: '10%', left: '15%' }}>
          <Profile onClose={() => setShowProfile(false)} />
        </WindowWrapper>
      )}
      {showAccount && (
        <WindowWrapper style={{ top: '10%', left: '50%' }}>
          <Account data={accountData} user={user} onClose={() => setShowAccount(false)} />
        </WindowWrapper>
      )}
      {showBank && (
        <WindowWrapper style={{ top: '67%', left: '10%' }}>
          <Bank onClose={() => setShowBank(false)} onBalanceUpdate={handleBalanceUpdate} />
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