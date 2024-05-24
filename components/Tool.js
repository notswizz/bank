import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Window, WindowContent, WindowHeader, Button, Slider, Radio, GroupBox } from 'react95';
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

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    border: 1px solid #ccc;
    padding: 0.5rem;
    text-align: center;
  }

  th {
    background-color: #f1f1f1;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const InvestmentTool = ({ onClose }) => {
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState('long');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [ethPrice, setEthPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('/api/fetchEthPrice');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const ethPrice = data.coins['coingecko:ethereum'].price;
        setEthPrice(ethPrice);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEthPrice();
  }, []);

  const handleCalculate = () => {
    const positionSize = amount * leverage;
    const initialMargin = parseFloat(amount);
    const liquidationPrice = position === 'long'
      ? ethPrice * (1 - (initialMargin / positionSize))
      : ethPrice * (1 + (initialMargin / positionSize));

    setResult({
      ethPrice,
      leverage,
      stake: amount,
      positionSize,
      liquidationPrice,
    });
  };

  const handleSubmit = async () => {
    const investmentData = {
      asset: 'ETH',
      amount: result.stake,
      leverage: result.leverage,
      risk: position,
      ethPrice: result.ethPrice,
      positionSize: result.positionSize,
      liquidationPrice: result.liquidationPrice,
    };

    try {
      const response = await fetch('/api/saveInvestment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to save investment');
      }

      const resultData = await response.json();
      console.log(resultData);
      onClose(); // Close the window after successful investment
    } catch (error) {
      console.error('Error saving investment:', error);
      setError(error.message);
    }
  };

  if (!isClient) {
    return null; // Do not render on the server
  }

  if (loading && !ethPrice) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Draggable>
      <Wrapper>
        <Window style={{ width: 600 }}>
          <WindowHeader>
            <span>Investment Tool</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <WindowContent>
            <GroupBox label='Position'>
              <Radio
                checked={position === 'long'}
                onChange={() => setPosition('long')}
                value='long'
                label='📈 Long'
                name='position'
              />
              <br />
              <Radio
                checked={position === 'short'}
                onChange={() => setPosition('short')}
                value='short'
                label='📉 Short'
                name='position'
              />
            </GroupBox>

            <FormGroup>
              <Label htmlFor="amount">Amount ($USD)</Label>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Leverage (1-20x)</Label>
              <Slider
                size="300px"
                min={1}
                max={20}
                step={1}
                value={leverage}
                onChange={(value) => setLeverage(value)}
                marks={[
                  { value: 1, label: '1x' },
                  { value: 5, label: '5x' },
                  { value: 10, label: '10x' },
                  { value: 15, label: '15x' },
                  { value: 20, label: '20x' },
                ]}
              />
            </FormGroup>

            <Button onClick={handleCalculate} disabled={!amount || amount <= 0 || !ethPrice}>
              Calculate
            </Button>

            {result && (
              <>
                <StyledTable>
                  <thead>
                    <tr>
                      <th>ETH Price</th>
                      <th>Leverage</th>
                      <th>Stake</th>
                      <th>Position Size</th>
                      <th>Liquidation Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${result.ethPrice.toFixed(2)}</td>
                      <td>{result.leverage}x</td>
                      <td>${result.stake}</td>
                      <td>${result.positionSize.toFixed(2)}</td>
                      <td>${result.liquidationPrice.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </StyledTable>
                <Button onClick={handleSubmit}>
                  Submit
                </Button>
              </>
            )}
          </WindowContent>
        </Window>
      </Wrapper>
    </Draggable>
  );
};

export default InvestmentTool;
