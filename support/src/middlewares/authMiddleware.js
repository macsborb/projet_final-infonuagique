// support/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../../.env' });

// Utilisation de la variable d'environnement pour le JWT
const JWT_SECRET = process.env.SUPPORT_JWT_SECRET || 'your_jwt_secret_key';

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token invalide' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.id !== 1) {
    return res.status(403).json({ message: "Accès réservé à l'administrateur" });
  }
  next();
};

module.exports = { authenticate, isAdmin };