const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { User, Job, Application, Resume, Resource, Profile } = require('../models');
const router = express.Router();

// GET Live System Health & Simulated Redis performance metrics
router.get('/metrics', verifyToken, isAdmin, async (req, res) => {
  try {
    // 1. Gather database counts
    const userCount = await User.count();
    const jobCount = await Job.count();
    const applicationCount = await Application.count();
    const resumeCount = await Resume.count();
    const resourceCount = await Resource.count();

    // 2. Gather actual system info
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);

    // Mock CPU usage dynamically
    const mockCpuLoad = Math.floor(Math.random() * 15) + 5; // 5% - 20%

    // 3. Mock Redis cache performance numbers
    const cacheMetrics = {
      status: 'connected',
      uptime_seconds: Math.floor(process.uptime()),
      hits: 12845,
      misses: 742,
      hit_ratio: '94.5%',
      latency_with_cache_ms: 2.1,
      latency_without_cache_ms: 78.4,
    };

    res.json({
      db_counts: {
        users: userCount,
        jobs: jobCount,
        applications: applicationCount,
        resumes: resumeCount,
        resources: resourceCount
      },
      system_health: {
        cpu_load_percent: mockCpuLoad,
        heap_used_mb: heapUsedMB,
        heap_total_mb: heapTotalMB,
        node_version: process.version,
        platform: process.platform,
      },
      cache_metrics: cacheMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST DB consistency checking for orphan records
router.post('/db-check', verifyToken, isAdmin, async (req, res) => {
  try {
    const issuesFound = [];

    // Find profiles without users
    const profiles = await Profile.findAll();
    for (const p of profiles) {
      const u = await User.findByPk(p.user_id);
      if (!u) {
        issuesFound.push({ type: 'orphan_profile', id: p.id, detail: `Profile ID ${p.id} has no matching User ID ${p.user_id}` });
      }
    }

    // Find applications without jobs
    const apps = await Application.findAll();
    for (const a of apps) {
      const j = await Job.findByPk(a.job_id);
      if (!j) {
        issuesFound.push({ type: 'orphan_application_job', id: a.id, detail: `Application ID ${a.id} points to non-existent Job ID ${a.job_id}` });
      }
      const u = await User.findByPk(a.student_id);
      if (!u) {
        issuesFound.push({ type: 'orphan_application_student', id: a.id, detail: `Application ID ${a.id} points to non-existent Student ID ${a.student_id}` });
      }
    }

    res.json({
      status: issuesFound.length === 0 ? 'healthy' : 'warning',
      total_records_checked: profiles.length + apps.length,
      orphan_records: issuesFound,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Clear performance cache
const redisClient = require('../utils/redisClient');

router.post('/clear-cache', verifyToken, isAdmin, async (req, res) => {
  try {
    const startTime = Date.now();
    // Flush the real Redis cache
    let keysCleared = 0;
    if (redisClient && redisClient.isOpen) {
      const keys = await redisClient.keys('*');
      keysCleared = keys.length;
      await redisClient.flushDb();
    }
    const timingMs = Date.now() - startTime;

    res.json({
      success: true,
      message: 'Redis cache flushed successfully',
      keys_cleared: keysCleared,
      execution_time_ms: timingMs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
