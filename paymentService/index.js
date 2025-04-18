// Charger les variables d'environnement en premier
require('dotenv').config({ path: '../.env' });

const express = require('express');
const app = express();
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');

// Port depuis les variables d'environnement
const PORT = process.env.PAYMENT_PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payment', paymentRoutes);

// Health check endpoint pour Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Service de paiement démarré sur le port ${PORT}`);
});