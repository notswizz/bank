import React, { useEffect, useState } from 'react';
import { Window, WindowContent, WindowHeader, Button, Avatar, TextInput } from 'react95';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';

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

const Profile = ({ onClose }) => {
  const { user, ready, authenticated } = usePrivy();
  const [username, setUsername] = useState('');
  const [isUsernameSaved, setIsUsernameSaved] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (ready && authenticated && user) {
        try {
          const response = await axios.get(`/api/userByWallet?walletAddress=${user.wallet?.address}`);
          const data = response.data;
          setUsername(data.username || '');
          setIsUsernameSaved(!!data.username);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [ready, authenticated, user]);

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/saveUserData', {
        username,
        balance: 0,
        joinedDate: new Date().toISOString(),
        walletAddress: user.wallet?.address || '',
      });

      if (response.status !== 200) {
        throw new Error('Failed to save data');
      }

      console.log('User data saved successfully');
      setIsUsernameSaved(true);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <Draggable>
      <Wrapper>
        <Window style={{ width: 350, height: 200 }}>
        <WindowHeader className="window-header">
            <span>Profile</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <WindowContent>
            <ContentWrapper>
              <AvatarWrapper>
                <Avatar size={60}>
                  <span role='img' aria-label='👤'>
                    👤
                  </span>
                </Avatar>
              </AvatarWrapper>
    
              {isUsernameSaved ? (
                <p>Username: {username}</p>
              ) : (
                <>
                  <TextInput
                    value={username}
                    placeholder="Enter username"
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                  />
                  <Button onClick={handleSave} style={{ marginTop: '1rem' }}>
                    Save
                  </Button>
                </>
              )}
            </ContentWrapper>
          </WindowContent>
        </Window>
      </Wrapper>
    </Draggable>
  );
};

export default Profile;