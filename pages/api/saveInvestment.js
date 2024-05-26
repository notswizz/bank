import clientPromise from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { asset, amount, leverage, risk, ethPrice, positionSize, liquidationPrice, walletAddress } = req.body;

  try {
    if (!walletAddress) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const client = await clientPromise;
    const db = client.db('test'); // Replace with your database name

    const userCollection = db.collection('users');
    const investmentCollection = db.collection('investments');

    // Fetch the user
    const user = await userCollection.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has enough balance
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Subtract the amount from the user's balance
    const newBalance = user.balance - amount;
    await userCollection.updateOne(
      { walletAddress },
      { $set: { balance: newBalance } }
    );

    // Save the new investment
    const newInvestment = {
      user: walletAddress,
      asset,
      amount,
      leverage,
      risk,
      ethPrice,
      positionSize,
      liquidationPrice,
      date: new Date(),
    };

    await investmentCollection.insertOne(newInvestment);

    res.status(201).json({ message: 'Investment saved successfully', newBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}