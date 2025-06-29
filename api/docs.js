// api/docs.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
let cachedClient = null;

async function connectToDB() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  try {
    const client = await connectToDB();
    const db = client.db('salesautomate-docs'); // you can change DB name if needed
    const collection = db.collection('documents');

    if (req.method === 'GET') {
      const doc = await collection.findOne({});
      return res.status(200).json(doc || { content: '' });
    }

    if (req.method === 'POST') {
      const { content } = req.body;
      const existing = await collection.findOne({});

      if (existing) {
        await collection.updateOne({}, { $set: { content } });
      } else {
        await collection.insertOne({ content });
      }

      return res.status(200).json({ message: 'Document saved successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (err) {
    console.error('Error in docs.js:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
        }                
