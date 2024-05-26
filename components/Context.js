import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Window, WindowContent, WindowHeader, Button, TextInput, GroupBox, Select } from 'react95';
import Draggable from 'react-draggable';
import useLocalStorage from '../utils/useLocalStorage';
import Cookies from 'js-cookie';

const Wrapper = styled.div`
  position: fixed;
  z-index: 1000;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Context = ({ onClose }) => {
  const [internalId, setInternalId] = useState('jack'); // Hardcoded username
  const [redirectUrl, setRedirectUrl] = useState('http://localhost:3000/bank'); // Hardcoded redirect URL
  const [uiMode, setUiMode] = useState('system');
  const [extensionAuthToken, setExtensionAuthToken] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cid, setCid] = useLocalStorage('sharpsports_cid', null);

  useEffect(() => {
    // Fetch the extension auth token
    const fetchExtensionAuthToken = async () => {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: 'Token 4c0654348c4a7b8c4bf855d59ab16b65c5b69d6f', // Private API Key
        },
        body: JSON.stringify({ internalId }),
      };

      try {
        const response = await fetch('https://api.sharpsports.io/v1/extension/auth', options);
        if (!response.ok) {
          throw new Error('Failed to fetch extension auth token');
        }
        const data = await response.json();
        setExtensionAuthToken(data.token);
        Cookies.set('extensionAuthToken', data.token); // Store the token in cookies
      } catch (error) {
        setError(error.message);
      }
    };

    fetchExtensionAuthToken();
  }, [internalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Token 14e0460d14dcde2c7098e45e634c09442c71d79b', // Public API Key
      },
      body: JSON.stringify({
        internalId,
        redirectUrl,
        uiMode,
        extensionAuthToken,
      }),
    };

    try {
      const response = await fetch('https://api.sharpsports.io/v1/context', options);
      if (!response.ok) {
        throw new Error('Failed to create context');
      }
      const data = await response.json();
      setResponse(data);
      setCid(data.cid);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Draggable>
      <Wrapper>
        <Window>
        <WindowHeader className="window-header">
            <span>Create Context</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <WindowContent>
            <GroupBox label="Create a new context">
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <TextInput
                    name="internalId"
                    value={internalId}
                    placeholder="Internal ID"
                    onChange={(e) => setInternalId(e.target.value)}
                    fullWidth
                    disabled
                  />
                </FormGroup>
                <FormGroup>
                  <TextInput
                    name="redirectUrl"
                    value={redirectUrl}
                    placeholder="Redirect URL"
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    fullWidth
                    disabled
                  />
                </FormGroup>
                <FormGroup>
                  <Select
                    name="uiMode"
                    value={uiMode}
                    onChange={(e) => setUiMode(e.target.value)}
                    options={[
                      { value: 'system', label: 'System' },
                      { value: 'dark', label: 'Dark' },
                      { value: 'light', label: 'Light' },
                    ]}
                    fullWidth
                  />
                </FormGroup>
                <FormGroup>
                  <TextInput
                    name="extensionAuthToken"
                    value={extensionAuthToken}
                    placeholder="Extension Auth Token"
                    onChange={(e) => setExtensionAuthToken(e.target.value)}
                    fullWidth
                    disabled
                  />
                </FormGroup>
                <Button type="submit" style={{ marginTop: '1rem' }} disabled={loading || !internalId}>
                  {loading ? 'Creating...' : 'Create Context'}
                </Button>
              </form>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {response && (
                <div style={{ marginTop: '1rem' }}>
                  <p>Context ID: {response.cid}</p>
                  <p>
                    <a href={`https://ui.sharpsports.io/link/${response.cid}`} target="_blank" rel="noopener noreferrer">
                      Link Sportsbook Account
                    </a>
                  </p>
                </div>
              )}
            </GroupBox>
          </WindowContent>
        </Window>
      </Wrapper>
    </Draggable>
  );
};

export default Context;
