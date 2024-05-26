import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username, balance = 0, joinedDate, walletAddress } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db('test'); // Replace with your database name

    const result = await db.collection('users').updateOne(
      { walletAddress },
      {
        $set: {
          username,
          balance: parseInt(balance, 10),
          joinedDate: new Date(joinedDate),
          walletAddress,
        },
      },
      { upsert: true }
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      throw new Error('Failed to save user data');
    }

    res.status(200).json({ message: 'User data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};