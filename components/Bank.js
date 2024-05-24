import React, { useState } from 'react';
import styled from 'styled-components';
import { Window, WindowContent, WindowHeader, Button, TextField } from 'react95';
import Draggable from 'react-draggable';

const Wrapper = styled.div`
  position: fixed;
  z-index: 1000;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const Bank = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    const email = document.cookie.split('; ').find(row => row.startsWith('email=')).split('=')[1];

    if (!email) {
      setError('Email not found in cookies');
      return;
    }

    try {
      // Update the balance using PUT request with $inc
      const updateResponse = await fetch('/api/updateBalance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, amount }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update balance');
      }

      const result = await updateResponse.json();
      console.log(result);
      onClose(); // Close the window after successful update
    } catch (error) {
      console.error('Error updating balance:', error);
      setError(error.message);
    }
  };

  return (
    <Draggable>
      <Wrapper>
        <Window style={{ width: 300 }}>
          <WindowHeader>
            <span>Bank</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <WindowContent>
            <FormGroup>
              <Label htmlFor="amount">Deposit $$</Label>
              <TextField
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormGroup>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            <Button onClick={handleSubmit} disabled={!amount || amount <= 0}>
              Save
            </Button>
          </WindowContent>
        </Window>
      </Wrapper>
    </Draggable>
  );
};

export default Bank;
