// Charger les variables d'environnement en premier
require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const productRoutes = require('./src/routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/catalog/products', productRoutes);

// Health check endpoint pour Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Port
const PORT = process.env.CATALOG_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Service de catalogue démarré sur le port ${PORT}`);
});