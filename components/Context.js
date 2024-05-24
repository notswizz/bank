import React, { useState } from 'react';
import styled from 'styled-components';
import { Window, WindowContent, WindowHeader, Button, TextInput, GroupBox, Select } from 'react95';
import Draggable from 'react-draggable';
import useLocalStorage from '../utils/useLocalStorage';

const Wrapper = styled.div`
  position: fixed;
  z-index: 1000;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Context = ({ onClose }) => {
  const [internalId, setInternalId] = useState('test_bettor');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [uiMode, setUiMode] = useState('system');
  const [extensionAuthToken, setExtensionAuthToken] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cid, setCid] = useLocalStorage('sharpsports_cid', null);

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
        Authorization: 'Token 4c0654348c4a7b8c4bf855d59ab16b65c5b69d6f',
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
          <WindowHeader>
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
                  />
                </FormGroup>
                <FormGroup>
                  <TextInput
                    name="redirectUrl"
                    value={redirectUrl}
                    placeholder="Redirect URL"
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    fullWidth
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
