// pages/api/saveInvestment.js

import clientPromise from '../../utils/mongodb';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { asset, amount, leverage, risk, ethPrice, positionSize, liquidationPrice } = req.body;

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const email = cookies.email;

    if (!email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const client = await clientPromise;
    const db = client.db('test'); // Replace with your database name

    const newInvestment = {
      user: email,
      asset,
      amount,
      leverage,
      risk,
      ethPrice,
      positionSize,
      liquidationPrice,
      date: new Date(),
    };

    await db.collection('investments').insertOne(newInvestment);

    res.status(201).json({ message: 'Investment saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
