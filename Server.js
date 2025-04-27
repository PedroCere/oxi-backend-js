require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
const authRoutes = require('./api/auth/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('🟢 Database connected!');
    await sequelize.sync();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

start();
