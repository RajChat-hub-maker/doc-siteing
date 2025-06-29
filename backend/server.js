/* server.js */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://<your-mongo-url>/salesautomate-docs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Doc = mongoose.model('Doc', new mongoose.Schema({ content: String }));

app.post('/save', async (req, res) => {
  const doc = await Doc.findOne();
  if (doc) {
    doc.content = req.body.content;
    await doc.save();
  } else {
    await new Doc({ content: req.body.content }).save();
  }
  res.send('Document saved!');
});

app.get('/load', async (req, res) => {
  const doc = await Doc.findOne();
  res.json(doc || { content: '' });
});

app.listen(3000, () => console.log('Docs server running on port 3000'));
