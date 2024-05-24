import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Window, WindowContent, WindowHeader, Button, Table, TableBody, TableRow, TableHead, TableHeadCell, TableDataCell, ScrollView } from 'react95';
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

const Books = ({ onClose }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://api.sharpsports.io/v1/books?support=true', {
          headers: {
            'Authorization': 'Token 4c0654348c4a7b8c4bf855d59ab16b65c5b69d6f',
            'accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
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
            <span>Sports Books</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <ScrollableWindowContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Name</TableHeadCell>
                  <TableHeadCell>Abbreviation</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableDataCell>{book.name}</TableDataCell>
                    <TableDataCell>{book.abbr}</TableDataCell>
                    <TableDataCell>{book.status}</TableDataCell>
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

export default Books;
