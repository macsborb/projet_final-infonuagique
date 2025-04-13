const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route d'inscription
router.post('/register', authController.register);

// Route de connexion
router.post('/login', authController.login);

// Route protégée pour obtenir les informations de l'utilisateur actuel
router.get('/me', authController.verifyToken, authController.getCurrentUser);

module.exports = router;