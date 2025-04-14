const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: 1 },
  process.env.JWT_SECRET,  // Utilisation de la variable d'environnement directement
  { expiresIn: '1h' }
);

console.log('Admin Token:', token);
