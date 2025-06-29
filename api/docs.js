// api/docs.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Required for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use Vercel writable temp directory or fallback to local
const dbPath = path.join(__dirname, 'docs.sqlite');
const db = new Database(dbPath);

// Initialize table if not exists
db.prepare(`CREATE TABLE IF NOT EXISTS docs (id INTEGER PRIMARY KEY, content TEXT)`).run();

export default function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const row = db.prepare('SELECT content FROM docs WHERE id = 1').get();
      res.status(200).json({ content: row?.content || '' });
    } else if (req.method === 'POST') {
      const { content } = req.body;
      const exists = db.prepare('SELECT id FROM docs WHERE id = 1').get();
      if (exists) {
        db.prepare('UPDATE docs SET content = ? WHERE id = 1').run(content);
      } else {
        db.prepare('INSERT INTO docs (id, content) VALUES (1, ?)').run(content);
      }
      res.status(200).json({ message: 'Document saved with SQLite!' });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'SQLite Error' });
  }
}                          
