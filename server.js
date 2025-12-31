require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.static('public'));


// Middleware
app.use(express.json());
app.use(cors());

// PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ----- RESTful Media Endpoints ----- //

// Create new media entry
app.post('/api/media', async (req, res) => {
  const { name, type, language } = req.body || {};

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
});

// Get all media entries
app.get('/api/list_media', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, type, language FROM media');
    return res.json({ success: true, media: result.rows });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ success: false, error: 'database error' });
  }
});

// Get a single media entry by ID
// app.get('/api/media/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query('SELECT id, name, type, language FROM media WHERE id=$1', [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, error: 'Media not found' });
//     }
//     return res.json({ success: true, media: result.rows[0] });
//   } catch (err) {
//     console.error('DB error:', err);
//     return res.status(500).json({ success: false, error: 'database error' });
//   }
// });

// Update a media entry by ID
// app.put('/api/media/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, type, language } = req.body;

//   if (!name || typeof name !== 'string' || name.trim().length === 0) {
//     return res.status(400).json({ success: false, error: 'name is required and must be a non-empty string' });
//   }

//   try {
//     const result = await pool.query(
//       'UPDATE media SET name=$1, type=$2, language=$3 WHERE id=$4 RETURNING id, name, type, language',
//       [name, type || null, language || null, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, error: 'Media not found' });
//     }

//     return res.json({ success: true, media: result.rows[0] });
//   } catch (err) {
//     console.error('DB error:', err);
//     return res.status(500).json({ success: false, error: 'database error' });
//   }
// });

// Delete a media entry by ID
// app.delete('/api/media/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query('DELETE FROM media WHERE id=$1 RETURNING id', [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, error: 'Media not found' });
//     }
//     return res.json({ success: true, message: `Media with id ${id} deleted` });
//   } catch (err) {
//     console.error('DB error:', err);
//     return res.status(500).json({ success: false, error: 'database error' });
//   }
// });

// Language Stats with Percentages ----- //
app.get('/api/media/stats/language', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
          language,
          COUNT(*) AS count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM media), 1) AS percentage
      FROM media
      GROUP BY language
    `);

    return res.json({ success: true, stats: result.rows });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ success: false, error: 'database error' });
  }
});


// Shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down, closing DB pool...');
  await pool.end();
  process.exit();
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
