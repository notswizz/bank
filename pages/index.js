import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Welcome from '../components/Welcome';
import Login from '../components/Login';
import Menu from '../components/Menu';

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

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

export default function Home() {
  const [state, setState] = useState({
    welcomeEnabled: false,
    showLogin: true,
    formData: {
      username: '',
      email: '',
      password: '',
    },
    isAuthenticated: false,
  });

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    const email = Cookies.get('email');
    if (token) {
      setState((prevState) => ({
        ...prevState,
        isAuthenticated: true,
        formData: {
          ...prevState.formData,
          email: email || '',
        },
      }));
      router.push('/bank');
    }
  }, [router]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: checked,
      showLogin: true,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = state.formData;
    try {
      const response = state.showLogin
        ? await axios.post('/api/auth/login', { email, password })
        : await axios.post('/api/auth/register', { username, email, password });
      console.log(response.data);
      Cookies.set('token', response.data.token);
      Cookies.set('email', email);
      setState((prevState) => ({
        ...prevState,
        isAuthenticated: true,
      }));
      router.push('/bank');
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const toggleForm = () => {
    setState((prevState) => ({
      ...prevState,
      showLogin: !prevState.showLogin,
    }));
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('email');
    setState({
      welcomeEnabled: false,
      showLogin: true,
      formData: {
        username: '',
        email: '',
        password: '',
      },
      isAuthenticated: false,
    });
    router.push('/');
  };

  return (
    <Wrapper>
      <Menu isAuthenticated={state.isAuthenticated} handleLogout={handleLogout} email={state.formData.email} />
      <Content>
        {!state.isAuthenticated && (
          <>
            <Welcome
              welcomeEnabled={state.welcomeEnabled}
              handleCheckboxChange={handleCheckboxChange}
            />
            {state.welcomeEnabled && (
              <Login
                state={state}
                handleFormChange={handleFormChange}
                handleFormSubmit={handleFormSubmit}
                toggleForm={toggleForm}
              />
            )}
          </>
        )}
      </Content>
    </Wrapper>
  );
}
