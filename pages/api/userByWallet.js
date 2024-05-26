import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('test'); // Replace with your database name

    const { walletAddress } = req.query;

    if (walletAddress) {
      const collection = db.collection('users');
      const user = await collection.findOne({ walletAddress });

      if (user) {
        const { username, balance, join, walletAddress } = user;
        return res.status(200).json({ username, balance, join, walletAddress });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } else {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};