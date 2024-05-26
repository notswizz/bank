import React, { useEffect, useState } from 'react';
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

const Account = ({ data, onClose, user }) => {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await fetch(`/api/getInvestments?user=${user.wallet?.address}`);
        const result = await response.json();
        if (response.ok) {
          setInvestments(result.investments);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error('Failed to fetch investments:', error);
      }
    };

    fetchInvestments();
  }, [user]);

  return (
    <Draggable>
      <Wrapper>
        <Window style={{ width: 650 }}>
          <WindowHeader className="window-header">
            <span>Accounts</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <WindowContent>
           
               <h3>Investments</h3>
               <Table>
                 <TableHead>
                   <TableRow>
                   <TableHeadCell>Date</TableHeadCell>
                     <TableHeadCell>Asset</TableHeadCell>
                     <TableHeadCell>ETH Price</TableHeadCell>
                     <TableHeadCell>Amount</TableHeadCell>
                     <TableHeadCell>Leverage</TableHeadCell>
                     <TableHeadCell>Risk</TableHeadCell>
                    
                     <TableHeadCell>Position Size</TableHeadCell>
                     <TableHeadCell>Liquidation</TableHeadCell>
               
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {investments.map((investment, index) => (
                     <TableRow key={index}>
                            <TableDataCell>{new Date(investment.date).toLocaleDateString()}</TableDataCell>
                       <TableDataCell>{investment.asset}</TableDataCell>
                       <TableDataCell>{Math.floor(investment.ethPrice)}</TableDataCell>
                       <TableDataCell>{investment.amount}</TableDataCell>
                       <TableDataCell>{investment.leverage}</TableDataCell>
                       <TableDataCell>{investment.risk}</TableDataCell>
             
                       <TableDataCell>{investment.positionSize}</TableDataCell>
                       <TableDataCell>{Math.floor(investment.liquidationPrice)}</TableDataCell>
                 
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