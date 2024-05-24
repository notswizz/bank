// pages/api/saveInvestment.js

import clientPromise from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { asset, amount, leverage, risk, upperBand, lowerBand, ethPrice } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();

    const newInvestment = {
      asset,
      amount,
      leverage,
      risk,
      upperBand,
      lowerBand,
      ethPrice,
      date: new Date(),
    };

    await db.collection('investments').insertOne(newInvestment);

    res.status(201).json({ message: 'Investment saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
