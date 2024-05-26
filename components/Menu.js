import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Button,
  MenuList,
  MenuListItem,
  Toolbar,
} from 'react95';
import styled from 'styled-components';
import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';
import LogoutButton from './LogoutButton';

const BottomWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
`;

const EmojiSpan = styled.span`
  margin-right: 8px;
`;

const UserDataWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px; /* Add some margin to the right */
`;

const LogoutButtonWrapper = styled.div`
  margin-left: 16px; /* Add some margin to the left */
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const WalletAddress = styled.div`
  margin-left: 16px;
  @media (max-width: 768px) {
    display: none;
  }
`;


const Menu = ({
  handleLogout,
  onProfileClick,
  onAccountClick,
  onBankClick,
  onAlphaClick,
  onStatsClick,
  onBooksClick,
  onContextClick,
  onInvestmentToolClick,
  openWindows,
}) => {
  const { user, ready, authenticated } = usePrivy();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (ready && authenticated && user) {
        try {
          const walletAddress = user.wallet?.address;
          if (!walletAddress) {
            setError('Wallet address not found');
            setLoading(false);
            return;
          }

          const response = await axios.get(`/api/userByWallet?walletAddress=${walletAddress}`);
          const data = response.data;
          setUsername(data.username || '');
          setBalance(data.balance || 0);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [ready, authenticated, user]);

  return (
    <BottomWrapper>
      <AppBar>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button
              onClick={() => setOpen(!open)}
              active={open}
              style={{ fontWeight: 'bold' }}
            >
              Start 🌎
            </Button>
            {open && (
              <MenuList
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '100%',
                }}
                onClick={() => setOpen(false)}
              >
                <MenuGrid>
                  <MenuListItem onClick={onProfileClick}>
                    <EmojiSpan role="img" aria-label="👨‍💻">
                      👨‍💻 {openWindows.profile && '✔️'}
                    </EmojiSpan>
                    Profile
                  </MenuListItem>
                  <MenuListItem onClick={onAccountClick}>
                    <EmojiSpan role="img" aria-label="📁">
                      📁 {openWindows.account && '✔️'}
                    </EmojiSpan>
                    Positions
                  </MenuListItem>
                  <MenuListItem onClick={onBankClick}>
                    <EmojiSpan role="img" aria-label="💰">
                      💰 {openWindows.bank && '✔️'}
                    </EmojiSpan>
                    Banker
                  </MenuListItem>
                  <MenuListItem onClick={onAlphaClick}>
                    <EmojiSpan role="img" aria-label="🍀">
                      🍀 {openWindows.alpha && '✔️'}
                    </EmojiSpan>
                    Alpha
                  </MenuListItem>
                  <MenuListItem onClick={onStatsClick}>
                    <EmojiSpan role="img" aria-label="📊">
                      📊 {openWindows.stats && '✔️'}
                    </EmojiSpan>
                    Stats
                  </MenuListItem>
                  <MenuListItem onClick={onBooksClick}>
                    <EmojiSpan role="img" aria-label="📚">
                      📚 {openWindows.books && '✔️'}
                    </EmojiSpan>
                    Books
                    </MenuListItem>
                  <MenuListItem onClick={onContextClick}>
                    <EmojiSpan role="img" aria-label="🔗">
                      🔗 {openWindows.context && '✔️'}
                    </EmojiSpan>
                    Context
                  </MenuListItem>
                  <MenuListItem onClick={onInvestmentToolClick}>
                    <EmojiSpan role="img" aria-label="💹">
                      💹 {openWindows.investmentTool && '✔️'}
                    </EmojiSpan>
                    Leverage
                  </MenuListItem>
                </MenuGrid>
              </MenuList>
            )}
          </div>
          <UserDataWrapper>
            {loading ? (
              <span>Loading...</span>
            ) : error ? (
              <span>please add username</span>
            ) : (
              user && user.wallet && (
                <>
                  <WalletAddress>
                    <strong>{user.wallet.address}</strong>
                  </WalletAddress>
                
                </>
              )
            )}
            <LogoutButtonWrapper>
              <LogoutButton />
            </LogoutButtonWrapper>
          </UserDataWrapper>
        </Toolbar>
      </AppBar>
    </BottomWrapper>
  );
};

export default Menu;

