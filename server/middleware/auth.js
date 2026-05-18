const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ error: 'A token is required for authentication' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
  
  return next();
};

const isRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    return res.status(403).json({ error: `Requires ${role} role` });
  };
};

const isAdmin = isRole('ADMIN');
const isInterviewer = isRole('INTERVIEWER');
const isStudent = isRole('STUDENT');

module.exports = {
  verifyToken,
  isAdmin,
  isInterviewer,
  isStudent
};
