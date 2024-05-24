import React from 'react';
import { Checkbox, GroupBox, ScrollView, Window, WindowContent } from 'react95';

const Welcome = ({ welcomeEnabled, handleCheckboxChange }) => {
  return (
    <Window>
      <WindowContent>
        <GroupBox label="bank 95">
          online #️⃣
        </GroupBox>
        <br />
        <ScrollView style={{ padding: '1rem', background: 'white', width: '300px' }}>
          <GroupBox variant="flat" label="digital life">
            money, crypto, sports, gambling
          </GroupBox>
        </ScrollView>
        <br />
        <GroupBox
          label={
            <Checkbox
              name="welcomeEnabled"
              style={{ margin: 0 }}
              label="ok bet"
              checked={welcomeEnabled}
              onChange={handleCheckboxChange}
            />
          }
        >
          like it's 95
        </GroupBox>
      </WindowContent>
    </Window>
  );
};

export default Welcome;
