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
          <WindowHeader>
            <span>Stats</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
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
                    <TableDataCell>{formatDate(user.join)}</TableDataCell>
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
