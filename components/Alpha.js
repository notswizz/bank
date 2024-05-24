import React from 'react';
import { Window, WindowContent, ScrollView, GroupBox, WindowHeader, Button } from 'react95';
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
  background: white;
`;

const Alpha = ({ onClose }) => {
  return (
    <Draggable>
      <Wrapper>
        <Window>
          <WindowHeader>
            <span>Alpha</span>
            <Button onClick={onClose} style={{ marginLeft: 'auto' }}>X</Button>
          </WindowHeader>
          <WindowContent>
            <ScrollableWindowContent>
              <GroupBox variant='flat' label='5/15'>
                fantasy.top
              </GroupBox>
              <br />
              <GroupBox variant='flat' label='4/20'>
                smoke weed
              </GroupBox>
              <br />
              <GroupBox variant='flat' label='4/20'>
                smoke weed
              </GroupBox>
              <br />
              <GroupBox variant='flat' label='4/20'>
                smoke weed
              </GroupBox>
              <br />
              <GroupBox variant='flat' label='4/20'>
                smoke weed
              </GroupBox>
              {/* Add more GroupBox components here */}
            </ScrollableWindowContent>
          </WindowContent>
        </Window>
      </Wrapper>
    </Draggable>
  );
};

export default Alpha;
