import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Window, WindowContent, WindowHeader, Button, Slider } from 'react95';
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

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
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
  const [asset, setAsset] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [risk, setRisk] = useState('moderate');
  const [ethPrice, setEthPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
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

  const riskBands = {
    moderate: { upper: 1.1, lower: 0.9 },
    aggressive: { upper: 1.2, lower: 0.8 },
    degen: { upper: 1.5, lower: 0.7 },
  };

  const handleInvest = async () => {
    const band = riskBands[risk];
    const upperBand = ethPrice * band.upper;
    const lowerBand = ethPrice * band.lower;

    const investmentData = {
      asset,
      amount,
      leverage,
      risk,
      upperBand,
      lowerBand,
      ethPrice,
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
      setResult(investmentData);
      onClose(); // Close the window after successful investment
    } catch (error) {
      console.error('Error saving investment:', error);
      setError(error.message);
    }
  };

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
            <FormGroup>
              <Label htmlFor="asset">Choose Asset</Label>
              <Select id="asset" value={asset} onChange={(e) => setAsset(e.target.value)}>
                <option value="ETH">ETH</option>
                {/* Add more assets here */}
              </Select>
            </FormGroup>
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
              <Label>Leverage (1-7x)</Label>
              <Slider
                size="300px"
                min={1}
                max={7}
                step={1}
                value={leverage}
                onChange={(value) => setLeverage(value)}
                marks={[
                  { value: 1, label: '1x' },
                  { value: 2, label: '2x' },
                  { value: 3, label: '3x' },
                  { value: 4, label: '4x' },
                  { value: 5, label: '5x' },
                  { value: 6, label: '6x' },
                  { value: 7, label: '7x' },
                ]}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="risk">Risk Level</Label>
              <Select id="risk" value={risk} onChange={(e) => setRisk(e.target.value)}>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
                <option value="degen">Degen</option>
              </Select>
            </FormGroup>
            <StyledTable>
              <thead>
                <tr>
                  <th>Current ETH Price</th>
                  <th>Upper Band</th>
                  <th>Lower Band</th>
                  <th>Leverage</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${ethPrice.toFixed(2)}</td>
                  <td>${(ethPrice * riskBands[risk].upper).toFixed(2)}</td>
                  <td>${(ethPrice * riskBands[risk].lower).toFixed(2)}</td>
                  <td>{leverage}x</td>
                  <td>{risk}</td>
                </tr>
              </tbody>
            </StyledTable>
            <Button onClick={handleInvest} disabled={!amount || amount <= 0 || !ethPrice}>
              Invest
            </Button>
          </WindowContent>
        </Window>
      </Wrapper>
    </Draggable>
  );
};

export default InvestmentTool;
