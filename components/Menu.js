import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Button,
  MenuList,
  MenuListItem,
  Handle,
  Separator,
  Toolbar,
} from 'react95';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import useLocalStorage from '../utils/useLocalStorage';

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
  margin-right: 16px; /* Add some margin to the right */
`;

const Menu = ({
  handleLogout,
  email,
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
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({ username: '', balance: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cid] = useLocalStorage('sharpsports_cid', null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = Cookies.get('email'); // Get email from cookies
        if (!email) {
          setError('cool kid club');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/user?email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
                  Portfolio
                </MenuListItem>
                <MenuListItem onClick={onBankClick}>
                  <EmojiSpan role="img" aria-label="💰">
                    💰 {openWindows.bank && '✔️'}
                  </EmojiSpan>
                  Bank
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
                  Connect
                </MenuListItem>
                <MenuListItem onClick={onInvestmentToolClick}>
                  <EmojiSpan role="img" aria-label="🛠️">
                    🛠️ {openWindows.investmentTool && '✔️'}
                  </EmojiSpan>
                  Invest
                </MenuListItem>
                <Separator />
                <MenuListItem onClick={handleLogout}>
                  <EmojiSpan role="img" aria-label="🔙">
                    🔙
                  </EmojiSpan>
                  Logout
                </MenuListItem>
              </MenuList>
            )}
          </div>

          <UserDataWrapper>
            {loading ? (
              'Loading...'
            ) : error ? (
              <span style={{ color: 'red' }}>{error}</span>
            ) : (
              <span>
                {userData.username} <Handle size={24} /> ${userData.balance}
              </span>
            )}
          </UserDataWrapper>
        </Toolbar>
      </AppBar>
      {cid && (
        <p>
          <a href={`https://ui.sharpsports.io/link/${cid}`} target="_blank" rel="noopener noreferrer">
            Link Sportsbook Account
          </a>
        </p>
      )}
    </BottomWrapper>
  );
};

export default Menu;
