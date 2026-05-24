const express = require('express');
const { Resume } = require('../models');
const { verifyToken, isStudent } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

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

// Helper to perform resume parsing & technical feedback matching
const analyzeResume = (content, title) => {
  const text = ((content || '') + ' ' + (title || '')).toLowerCase();
  const techKeywords = {
    react: 'React.js component-based framework',
    javascript: 'JavaScript standard language',
    typescript: 'TypeScript static typing schemas',
    html: 'HTML5 semantic tags structuring',
    css: 'CSS3 custom stylesheet structures',
    tailwind: 'Tailwind CSS utility alignment style',
    node: 'Node.js backend environment runtime',
    express: 'Express server router patterns',
    python: 'Python programming syntax',
    sql: 'SQL database relations query skills',
    postgres: 'PostgreSQL database persistence',
    mongodb: 'MongoDB NoSQL collections',
    aws: 'Amazon Web Services cloud resources',
    docker: 'Docker microservices packaging container',
    git: 'Git workflow repository branches',
    figma: 'Figma layouts interactive designer prototyping'
  };

  const matched = [];
  const missing = [];
  
  for (const [key, label] of Object.entries(techKeywords)) {
    if (text.includes(key)) {
      matched.push(label);
    } else {
      missing.push(label);
    }
  }

  // Calculate score based on keyword coverage + structure
  let score = 55; // base score
  score += matched.length * 3; // up to 16 * 3 = 48
  
  // Word count check
  const wordCount = text.split(/\s+/).filter(w => w).length;
  if (wordCount > 30) score += 8;
  else if (wordCount > 10) score += 4;
  
  // Cap at 99, floor at 60
  score = Math.min(99, Math.max(60, score));

  // Generate detailed structured feedback
  const feedbackData = {
    strengths: matched.slice(0, 5),
    improvements: missing.slice(0, 4),
    formatting: wordCount < 20 ? 'Document body is too sparse. Please add more educational details and work history.' : 'Good page presentation layout structure and readability.',
    technicalGaps: missing.map(m => m.split(' ')[0]).slice(0, 5)
  };

  return {
    score,
    feedback: JSON.stringify(feedbackData)
  };
};

// POST add a new resume
router.post('/', verifyToken, isStudent, upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body;
    let parsed_content = req.body.parsed_content || '';
    let file_url = req.body.file_url || 'https://example.com/resume.pdf';

    if (req.file) {
      file_url = `/uploads/${req.file.filename}`;
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        parsed_content = data.text;
      } catch (err) {
        console.error('Error parsing PDF:', err);
      }
    }
    
    // Analyze resume content to get real score and feedback rather than random numbers
    const analysis = analyzeResume(parsed_content, title);
    
    const resume = await Resume.create({
      user_id: req.user.id,
      title: title || 'My Resume',
      file_url: file_url,
      parsed_content: parsed_content,
      ai_score: analysis.score,
      ai_feedback: analysis.feedback
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
