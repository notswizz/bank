import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Window, WindowContent, WindowHeader, Button, TextField } from 'react95';
import Draggable from 'react-draggable';
import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';

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

const Bank = ({ onClose, onBalanceUpdate }) => {
  const { user } = usePrivy();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletAddress = user.wallet?.address;
        const response = await axios.get(`/api/userBalance?walletAddress=${walletAddress}`);
        const data = response.data;
        setBalance(data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [user]);

  const handleSubmit = async () => {
    const walletAddress = user.wallet?.address;

    if (!walletAddress) {
      setError('Wallet address not found');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Invalid amount');
      return;
    }

    try {
      const updateResponse = await axios.put('/api/updateBalance', {
        walletAddress,
        amount: parsedAmount,
      });

      if (updateResponse.status !== 200) {
        throw new Error('Failed to update balance');
      }

      const result = updateResponse.data;
      console.log(result);
      onBalanceUpdate(); // Call the callback function to refresh the balance
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
        <WindowHeader className="window-header">
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
