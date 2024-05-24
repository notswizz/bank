// pages/api/getBalance.js

import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('test'); // Replace with your database name

    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const collection = db.collection('users');
    const user = await collection.findOne({ email });

    if (user) {
      const { balance } = user;
      return res.status(200).json({ balance });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};
