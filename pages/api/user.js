import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('test'); // Replace with your database name

    const { email } = req.query;

    if (email) {
      const collection = db.collection('users');
      const user = await collection.findOne({ email });

      if (user) {
        const { username, balance, join, walletAddress } = user;
        return res.status(200).json({ username, balance, join, walletAddress });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } else {
      const collection = db.collection('users');
      const users = await collection.find({}).toArray();
      const userList = users.map(user => ({ _id: user._id, username: user.username, join: user.join }));
      
      return res.status(200).json({ users: userList });
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};
