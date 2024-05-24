import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('test'); // Replace with your database name

      const { walletAddress } = req.body;
      const email = req.cookies.email; // Get email from cookies

      if (!walletAddress || !email) {
        return res.status(400).json({ error: 'Wallet address and email are required' });
      }

      const collection = db.collection('users');
      const result = await collection.updateOne(
        { email },
        { $set: { walletAddress } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ walletAddress });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save wallet address' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
