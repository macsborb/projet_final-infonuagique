const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

const token = jwt.sign(
  { id: 1 },
  process.env.SUPPORT_JWT_SECRET,
  { expiresIn: '1h' }
);

console.log('Admin Token:', token);