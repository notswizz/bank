import React from 'react';
import { Button, TextInput, GroupBox, Window, WindowContent } from 'react95';
import styled from 'styled-components';

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Login = ({ state, handleFormChange, handleFormSubmit, toggleForm }) => {
  const isFormValid = () => {
    const { username, email, password } = state.formData;
    if (state.showLogin) {
      return email && password;
    }
    return username && email && password;
  };

  return (
    <Window>
      <WindowContent>
        <h2>bank 95</h2>
        <GroupBox label={state.showLogin ? "Login" : "Register"} style={{ minWidth: '300px' }}>
          <form onSubmit={handleFormSubmit}>
            {!state.showLogin && (
              <FormGroup>
                <TextInput
                  name="username"
                  value={state.formData.username}
                  placeholder="Username"
                  onChange={handleFormChange}
                  fullWidth
                />
              </FormGroup>
            )}
            <FormGroup>
              <TextInput
                name="email"
                value={state.formData.email}
                placeholder="Email"
                onChange={handleFormChange}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <TextInput
                name="password"
                value={state.formData.password}
                type="password"
                placeholder="Password"
                onChange={handleFormChange}
                fullWidth
              />
            </FormGroup>
            {isFormValid() && (
              <Button type="submit" style={{ marginTop: '1rem' }}>
                Submit
              </Button>
            )}
          </form>
          <Button onClick={toggleForm} style={{ marginTop: '1rem' }}>
            {state.showLogin ? 'Switch to Register' : 'Switch to Login'}
          </Button>
        </GroupBox>
      </WindowContent>
    </Window>
  );
};

export default Login;
