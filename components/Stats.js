import React, { useEffect, useState } from 'react';
import { Window, WindowContent, WindowHeader, Button, Table, TableBody, TableRow, TableHead, TableHeadCell, TableDataCell, ScrollView } from 'react95';
import styled from 'styled-components';
import Draggable from 'react-draggable';

const Wrapper = styled.div`
  position: fixed;
  z-index: 1000;
`;

const ScrollableWindowContent = styled(ScrollView)`
  max-height: 250px; /* Set the max-height for the scrollable area */
  overflow-y: auto; /* Enable vertical scrolling */
  padding: 1rem;
`;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Stats = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUsers(data.users);
        setTotalBalance(data.totalBalance);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Draggable>
      <Wrapper>
        <Window>
          <WindowHeader className="window-header">
            <span>Stats</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
            TVL: ${totalBalance}
          </div>
          <ScrollableWindowContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Username</TableHeadCell>
                  <TableHeadCell>Join Date</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableDataCell>{user.username}</TableDataCell>
                
                    <TableDataCell>{user.joinedDate ? formatDate(user.joinedDate) : 'N/A'}</TableDataCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollableWindowContent>
        </Window>
      </Wrapper>
    </Draggable>
  );
};

export default Stats;