require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
const authRoutes = require('./api/auth/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Connect to database once when the module is loaded
sequelize.authenticate()
  .then(() => console.log('🟢 Database connected!'))
  .catch(err => console.error('❌ Unable to connect to the database:', err));

// Do not call sequelize.sync() in serverless environment

module.exports = app;
