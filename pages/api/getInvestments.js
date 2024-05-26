import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('test'); // Replace with your database name

    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ error: 'User is required' });
    }

    const collection = db.collection('investments');
    const investments = await collection.find({ user }).toArray();

    if (investments.length > 0) {
      return res.status(200).json({ investments });
    } else {
      return res.status(404).json({ error: 'No investments found for this user' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
};