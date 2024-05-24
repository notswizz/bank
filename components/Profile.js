import React, { useEffect, useState } from 'react';
import { Window, WindowContent, WindowHeader, Button, Avatar, Tabs, Tab, TabBody, TextInput } from 'react95';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import Cookies from 'js-cookie';

const Wrapper = styled.div`
  position: fixed;
  z-index: 1000;

`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;

`;

const AvatarWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Profile = ({ email, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState({ username: '', balance: '', walletAddress: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  const handleChange = (value) => {
    setActiveTab(value);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = Cookies.get('email'); // Get email from cookies
        if (!email) {
          setError('Email not found in cookies');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/user?email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUserData(data);
        setWalletAddress(data.walletAddress || '');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/saveWalletAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const data = await response.json();
      setUserData((prev) => ({ ...prev, walletAddress: data.walletAddress }));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Draggable>
      <Wrapper>
        <Window style={{ width: 350, height: 300 }}>
          <WindowHeader>
            <span>Profile</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <WindowContent>
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab value={0}>Details</Tab>
              <Tab value={1}>Crypto</Tab>
              <Tab value={2}>Settings</Tab>
            </Tabs>
            <TabBody style={{ height: 200 }}>
              {activeTab === 0 && (
                <ContentWrapper>
                  <AvatarWrapper>
                    <Avatar size={60}>
                      <span role='img' aria-label='👤'>
                        👤
                      </span>
                    </Avatar>
                  </AvatarWrapper>
                  <p>{email}</p>
                  <p>Username: {userData.username}</p>
                  <p>Balance: ${userData.balance}</p>
                </ContentWrapper>
              )}
              {activeTab === 1 && (
                <ContentWrapper>
                  
                  <TextInput
                    value={walletAddress}
                    placeholder="Enter new wallet address"
                    onChange={(e) => setWalletAddress(e.target.value)}
                    fullWidth
                  />
                  <Button onClick={handleSave} style={{ marginTop: '1rem' }}>
                    Save
                  </Button>
                </ContentWrapper>
              )}
              {activeTab === 2 && (
                <ContentWrapper>
                  <p>About content goes here...</p>
                </ContentWrapper>
              )}
            </TabBody>
          </WindowContent>
        </Window>
      </Wrapper>
    </Draggable>
  );
};

export default Profile;
