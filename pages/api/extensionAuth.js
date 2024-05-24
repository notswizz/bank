import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  try {
    const { internalId, redirectUrl, uiMode } = req.body;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Token 4c0654348c4a7b8c4bf855d59ab16b65c5b69d6f',
      },
      body: JSON.stringify({ internalId, redirectUrl, uiMode }),
    };

    const response = await fetch('https://api.sharpsports.io/v1/extension/auth', options);
    if (!response.ok) {
      throw new Error('Failed to generate auth token');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate auth token' });
  }
};
