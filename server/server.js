require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const { User } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jobsRouter = require('./routes/jobs');
const applicationsRouter = require('./routes/applications');
const resumesRouter = require('./routes/resumes');
const notificationsRouter = require('./routes/notifications');
const profileRouter = require('./routes/profiles');
const resourcesRouter = require('./routes/resources');
const adminRouter = require('./routes/admin');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'success',
      message: 'Server is running',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Users endpoint for testing & Admin moderation
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'status', 'created_at'] });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user status (Admin moderation)
app.put('/api/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.status = status;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userRole = role || 'STUDENT';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash: hashedPassword, role: userRole });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mount API routes
app.use('/api/jobs', jobsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/resumes', resumesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/admin', adminRouter);

sequelize.sync({ alter: true }).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
