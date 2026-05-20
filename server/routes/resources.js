const express = require('express');
const { Resource, User } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// GET all resources
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type } = req.query;
    let whereClause = {};
    if (type) {
      whereClause.type = type;
    }

    const resources = await Resource.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'author', attributes: ['name'] }]
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a resource (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, content, type } = req.body;
    if (!title || !content || !type) {
      return res.status(400).json({ error: 'Title, content, and type are required' });
    }

    const resource = await Resource.create({
      title,
      content,
      type,
      author_id: req.user.id
    });

    const populated = await Resource.findByPk(resource.id, {
      include: [{ model: User, as: 'author', attributes: ['name'] }]
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update a resource (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, content, type } = req.body;
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    resource.title = title !== undefined ? title : resource.title;
    resource.content = content !== undefined ? content : resource.content;
    resource.type = type !== undefined ? type : resource.type;
    await resource.save();

    const populated = await Resource.findByPk(resource.id, {
      include: [{ model: User, as: 'author', attributes: ['name'] }]
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a resource (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    await resource.destroy();
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
