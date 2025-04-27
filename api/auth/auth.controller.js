const { registerUser, loginUser } = require('./auth.service');

const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login };
