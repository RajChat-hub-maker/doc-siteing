// api/docs.js
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;

const conn = await mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Doc = mongoose.models.Doc || mongoose.model('Doc', new mongoose.Schema({
  content: String,
}));

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { content } = req.body;

    let doc = await Doc.findOne();
    if (doc) {
      doc.content = content;
      await doc.save();
    } else {
      await Doc.create({ content });
    }

    return res.status(200).json({ message: 'Saved successfully' });
  }

  if (req.method === 'GET') {
    const doc = await Doc.findOne();
    return res.status(200).json({ content: doc?.content || '' });
  }

  res.status(405).end('Method Not Allowed');
}                           
