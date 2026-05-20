const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    defaultValue: [],
  },
  interviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending_approval', 'active', 'closed', 'rejected'),
    defaultValue: 'pending_approval',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  jd_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Job;
