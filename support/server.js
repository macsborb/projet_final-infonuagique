// Charger les variables d'environnement en premier
require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const app = express();
const ticketRoutes = require('./src/routes/ticketRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tickets', ticketRoutes);

// Health check endpoint pour Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Port
const PORT = process.env.SUPPORT_PORT || 3004;
app.listen(PORT, () => {
  console.log(`Service de support démarré sur le port ${PORT}`);
});