// pages/api/fetchEthPrice.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const coins = 'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1,coingecko:ethereum,bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878,ethereum:0xdB25f211AB05b1c97D595516F45794528a807ad8';
  const url = `https://coins.llama.fi/prices/current/${coins}?searchWidth=4h`;

  try {
    const response = await fetch(url, {
      headers: { 'accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: error.message });
  }
}
