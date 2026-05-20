const express = require('express');
const { Job, User } = require('../models');
const { verifyToken, isInterviewer, isAdmin } = require('../middleware/auth');
const router = express.Router();

// GET all active jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.findAll({ 
      where: { status: 'active' },
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'interviewer', attributes: ['name', 'company_name'] }]
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all jobs (Admin/Interviewer view)
router.get('/all', verifyToken, async (req, res) => {
  try {
    let whereClause = {};
    // If interviewer, only show their jobs
    if (req.user.role === 'INTERVIEWER') {
      whereClause.interviewer_id = req.user.id;
    }
    
    const jobs = await Job.findAll({ 
      where: whereClause,
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'interviewer', attributes: ['name', 'company_name'] }]
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new job (Interviewer)
router.post('/', verifyToken, isInterviewer, async (req, res) => {
  try {
    const { title, company, location, type, salary, tags, description, jd_url } = req.body;
    const job = await Job.create({
      title,
      company, // Can also derive from req.user if company_name is stored there
      location,
      type,
      salary,
      tags: tags || [],
      interviewer_id: req.user.id,
      status: 'pending_approval', // Needs Admin approval
      description: description || '',
      jd_url: jd_url || ''
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT change job status (Admin)
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'active', 'closed', 'rejected'
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    job.status = status;
    await job.save();
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
