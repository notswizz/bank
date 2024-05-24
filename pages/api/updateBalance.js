// pages/api/updateBalance.js

import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, amount } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db('test'); // Replace with your database name

    if (!email || amount == null) {
      return res.status(400).json({ error: 'Email and amount are required' });
    }

    const collection = db.collection('users');
    
    // Increment the balance by the specified amount
    const result = await collection.updateOne(
      { email },
      { $inc: { balance: parseFloat(amount) } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Balance updated successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update balance' });
  }
};
