// Charger les variables d'environnement en premier
require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint pour Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Port
const PORT = process.env.AUTH_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Service d'authentification démarré sur le port ${PORT}`);
});