require('dotenv').config();
const express = require('express');
const cors = require('cors');           
const path = require('path');
const { Pool } = require('pg');

const app = express();

app.use(express.json());
// Enable CORS for all origins during development. Tighten in production.
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/', (req, res) => res.send('Server is running!'));

// Primary endpoint 
app.post('/api/media', async (req, res) => {
  await insertMediaHandler(req, res);
});

// Alias 
app.post('/api/add-entry', async (req, res) => {
  await insertMediaHandler(req, res);
});

// Handler used by both routes
async function insertMediaHandler(req, res) {
  const { name, type, language} = req.body || {};

  // Basic server-side validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'name is required and must be a non-empty string' });
  }

  const sql = `
    INSERT INTO media (name, type, language)
    VALUES ($1, $2, $3)
    RETURNING id, name, type, language;
  `;

  try {
    const result = await pool.query(sql, [name, type || null, language || null]);
    return res.status(201).json({ success: true, media: result.rows[0] });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ success: false, error: 'database error' });
  }
}

// shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down, closing DB pool...');
  await pool.end();
  process.exit();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
 

// public/script.js


// document.getElementById("button-submit").addEventListener("click", async function() {
//   // collect inputs
//   const name = document.getElementById("input_name").value.trim();
//   const type = document.getElementById("input_type").value;
//   const language = document.getElementById("input_language").value;

//   const newEntry = { name, type, language };

//   try {
//     const res = await fetch('http://localhost:3000/api/entries', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(newEntry)
//     });

//     const data = await res.json();
//     if (res.ok) {
//       console.log('Saved:', data.entry);
//       alert('Saved: ' + data.entry.name);
//       // optionally clear inputs:
//       // document.getElementById("input_name").value = '';
//     } else {
//       console.error('Error:', data);
//       alert('Error: ' + (data.error || 'unknown'));
//     }
//   } catch (err) {
//     console.error(err);
//     alert('Network error');
//   }
// });
