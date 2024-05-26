import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { walletAddress, amount } = req.body;

  if (!walletAddress || amount == null) {
    return res.status(400).json({ error: 'Wallet address and amount are required' });
  }

  const parsedAmount = parseInt(amount, 10); // Parse amount as an integer
  if (isNaN(parsedAmount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('test'); // Replace with your database name
    const collection = db.collection('users');
    
    // Increment the balance by the specified amount
    const result = await collection.updateOne(
      { walletAddress },
      { $inc: { balance: parsedAmount } }
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
