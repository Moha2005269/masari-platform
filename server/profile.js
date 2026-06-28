const express = require('express');
const db = require('./db');
const { verifyToken } = require('./auth');

const router = express.Router();

// GET /api/profile
router.get('/', verifyToken, (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profile
router.put('/', verifyToken, (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = [
      'name', 'avatarId', 'slogan', 'weightedScore', 
      'testMatchScore', 'riasecTitle', 'careerPersona', 'hasTakenTest'
    ];
    
    // Build dynamic update query
    let updateFields = [];
    let values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        // Convert booleans to 1/0 for sqlite
        values.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
      }
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const query = `UPDATE profiles SET ${updateFields.join(', ')} WHERE user_id = ?`;
    values.push(req.userId);
    
    db.prepare(query).run(...values);
    
    // Fetch updated profile
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.userId);
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/profile/reports
router.get('/reports', verifyToken, (req, res) => {
  try {
    const reports = db.prepare('SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
    // Format them similar to what Firebase returned (id, title, content, date)
    const formattedReports = reports.map(r => ({
      id: r.id.toString(),
      title: r.title,
      content: r.content,
      date: r.created_at
    }));
    res.status(200).json(formattedReports);
  } catch (error) {
    console.error('Fetch reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/profile/reports
router.post('/reports', verifyToken, (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const info = db.prepare('INSERT INTO reports (user_id, title, content) VALUES (?, ?, ?)')
      .run(req.userId, title, content);
      
    res.status(201).json({ id: info.lastInsertRowid, title, content });
  } catch (error) {
    console.error('Save report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
