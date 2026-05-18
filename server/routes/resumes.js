const express = require('express');
const { Resume } = require('../models');
const { verifyToken, isStudent } = require('../middleware/auth');
const router = express.Router();

// GET all resumes for the logged-in student
router.get('/', verifyToken, isStudent, async (req, res) => {
  try {
    const resumes = await Resume.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add a new resume
router.post('/', verifyToken, isStudent, async (req, res) => {
  try {
    const { title, file_url, parsed_content, ai_score, ai_feedback } = req.body;
    
    // In a real app, file upload middleware (like multer) would handle file_url
    // and AI parsing would generate parsed_content and ai_score here.
    
    const resume = await Resume.create({
      user_id: req.user.id,
      title: title || 'My Resume',
      file_url,
      parsed_content,
      ai_score,
      ai_feedback
    });
    
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a resume
router.delete('/:id', verifyToken, isStudent, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });
    
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    
    await resume.destroy();
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
