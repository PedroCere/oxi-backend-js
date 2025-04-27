require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./config/db');
const authRoutes = require('./api/auth/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging middleware

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/auth', authRoutes);

// Connect to database once when the module is loaded
sequelize.authenticate()
  .then(() => console.log('🟢 Database connected!'))
  .catch(err => console.error('❌ Unable to connect to the database:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
