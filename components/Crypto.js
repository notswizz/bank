import React, { useEffect, useState } from 'react';
import { Window, WindowContent, WindowHeader, Button } from 'react95';
import styled from 'styled-components';
import Draggable from 'react-draggable';

const Wrapper = styled.div`
  position: fixed;
  z-index: 1000;
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

const Crypto = ({ onClose }) => {
  const [ethPrice, setEthPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('/api/fetchEthPrice');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setEthPrice(data.coins['coingecko:ethereum'].price);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, []);

  const fakeCryptoData = [

    { name: 'Ethereum', price: ethPrice ? `$${ethPrice}` : 'Loading...', change: '+3%' },

  ];

  if (loading && !ethPrice) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Draggable>
      <Wrapper>
        <Window style={{ width: 500 }}>
          <WindowHeader>
            <span>Crypto</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <WindowContent>
            <StyledTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
             
                </tr>
              </thead>
              <tbody>
                {fakeCryptoData.map((crypto, index) => (
                  <tr key={index}>
                    <td>{crypto.name}</td>
                    <td>{crypto.price}</td>
              
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </WindowContent>
        </Window>
      </Wrapper>
    </Draggable>
  );
};

export default Crypto;
