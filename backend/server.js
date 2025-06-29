// server.js

require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection using secure .env variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully!'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// ✅ Mongoose Schema & Model
const Doc = mongoose.model('Doc', new mongoose.Schema({
  content: String
}));

// ✅ Save Document Endpoint
app.post('/save', async (req, res) => {
  try {
    let doc = await Doc.findOne();
    if (doc) {
      doc.content = req.body.content;
      await doc.save();
    } else {
      doc = new Doc({ content: req.body.content });
      await doc.save();
    }
    res.send('✅ Document saved!');
  } catch (error) {
    console.error('❌ Save error:', error);
    res.status(500).send('Failed to save document.');
  }
});

// ✅ Load Document Endpoint
app.get('/load', async (req, res) => {
  try {
    const doc = await Doc.findOne();
    res.json(doc || { content: '' });
  } catch (error) {
    console.error('❌ Load error:', error);
    res.status(500).send('Failed to load document.');
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Docs server running on port ${PORT}`);
});  
