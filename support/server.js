const express = require('express');
const cors = require('cors');  // Importer le package CORS
const app = express();

// Activer CORS pour toutes les requêtes
app.use(cors());  // Cela permettra d'accepter les requêtes provenant de n'importe quel domaine

// Autres middlewares
app.use(express.json());

// Tes routes et contrôleurs
const ticketRoutes = require('./src/routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);

// Autres routes éventuelles ou middleware
// app.use('/api/otherRoute', otherRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
