import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { AppBar, Button, Window, WindowContent, WindowHeader, Toolbar } from 'react95';
import original from 'react95/dist/themes/original';
import PrivyButton from '../components/PrivyButton';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${({ theme }) => theme.desktopBackground};
  padding: 2rem;
`;

const Header = styled(WindowHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled(WindowContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Footer = styled(Toolbar)`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const Home = () => {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  React.useEffect(() => {
    if (ready && authenticated) {
      router.push('/bank');
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return <div>Loading...</div>; // Show a loading state while Privy is initializing
  }

  return (
    <ThemeProvider theme={original}>
      <Wrapper>
        <Window style={{ width: 400 }}>
          <Header>
            <span>Bank 95</span>
           
          </Header>
          <Content>
            <Title>Welcome to Bank 95</Title>
            <Description>
              the future of finance... like it's 1995
            </Description>
            <PrivyButton />
          </Content>
          <Footer>
          <Button onClick={() => alert('About button clicked!')}>Refer</Button>
            <Button onClick={() => alert('Help button clicked!')}>Help</Button>
            <Button onClick={() => alert('About button clicked!')}>About</Button>
            <Button onClick={() => alert('About button clicked!')}>WTF</Button>
          </Footer>
        </Window>
      </Wrapper>
    </ThemeProvider>
  );
};

export default Home;