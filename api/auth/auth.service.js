const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const generateToken = require('../../utils/generate.token');

const registerUser = async ({ username, email, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });

  const token = generateToken(user.email);
  return { token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken(user.email);
  return { token };
};

module.exports = { registerUser, loginUser };
