import React from 'react';
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Window,
  WindowContent,
  WindowHeader,
  Button
} from 'react95';
import styled from 'styled-components';
import Draggable from 'react-draggable';

const Wrapper = styled.div`
  position: fixed;
  z-index: 1000;
`;

const Account = ({ data, onClose }) => {
  return (
    <Draggable>
      <Wrapper>
        <Window style={{ width: 480 }}>
          <WindowHeader>
            <span>Accounts</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <WindowContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Account</TableHeadCell>
                  <TableHeadCell>Balance</TableHeadCell>
                  <TableHeadCell>Last Update</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableDataCell>{row.account}</TableDataCell>
                    <TableDataCell>{row.balance}</TableDataCell>
                    <TableDataCell>{row.lastUpdate}</TableDataCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </WindowContent>
        </Window>
      </Wrapper>
    </Draggable>
  );
};

export default Account;
