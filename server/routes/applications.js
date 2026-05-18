const express = require('express');
const { Application, Job, User, Resume, Notification } = require('../models');
const { verifyToken, isStudent, isInterviewer } = require('../middleware/auth');
const router = express.Router();

// POST apply for a job (Student)
router.post('/', verifyToken, isStudent, async (req, res) => {
  try {
    const { job_id, resume_id } = req.body;
    
    // Check if job exists and is active
    const job = await Job.findByPk(job_id);
    if (!job || job.status !== 'active') {
      return res.status(404).json({ error: 'Job not found or not active' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      where: { student_id: req.user.id, job_id }
    });
    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    const application = await Application.create({
      student_id: req.user.id,
      job_id,
      resume_id,
      status: 'applied'
    });
    
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET my applications (Student)
router.get('/me', verifyToken, isStudent, async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { student_id: req.user.id },
      include: [
        { model: Job, attributes: ['title', 'company', 'location'] },
        { model: Resume, attributes: ['title'] }
      ]
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET applications for a specific job (Interviewer)
router.get('/job/:jobId', verifyToken, isInterviewer, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Verify interviewer owns this job
    const job = await Job.findOne({ where: { id: jobId, interviewer_id: req.user.id } });
    if (!job) {
      return res.status(403).json({ error: 'Not authorized or job not found' });
    }

    const applications = await Application.findAll({
      where: { job_id: jobId },
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
        { model: Resume, attributes: ['title', 'file_url', 'parsed_content', 'ai_score'] }
      ]
    });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update application status (Interviewer)
router.put('/:id/status', verifyToken, isInterviewer, async (req, res) => {
  try {
    const { status } = req.body; // 'shortlisted', 'rejected', 'selected'
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job }]
    });
    
    if (!application) return res.status(404).json({ error: 'Application not found' });
    
    // Verify ownership
    if (application.Job.interviewer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    // Create Notification for the student
    let message = `Your application for ${application.Job.title} at ${application.Job.company} has been updated to: ${status}.`;
    if (status === 'shortlisted') message = `Congratulations! You have been shortlisted for ${application.Job.title} at ${application.Job.company}.`;
    if (status === 'rejected') message = `Unfortunately, your application for ${application.Job.title} at ${application.Job.company} was not successful.`;

    await Notification.create({
      user_id: application.student_id,
      title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: message
    });

    // TODO: Trigger Nodemailer email here

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
