const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Chemin vers le fichier .env
const envPath = path.join(__dirname, '.env');

// Vérifier si le fichier .env existe déjà
if (fs.existsSync(envPath)) {
  console.log('Le fichier .env existe déjà. Aucune action nécessaire.');
  process.exit(0);
}

// Générer des secrets sécurisés
const jwtSecret = crypto.randomBytes(32).toString('hex');
const dbPassword = crypto.randomBytes(12).toString('base64').replace(/[+/=]/g, '');

// Contenu du fichier .env avec des valeurs par défaut
const envContent = `# Variables d'environnement centralisées
# Fichier généré automatiquement - Ne pas commit ce fichier

# Service d'authentification
AUTH_DB_HOST=auth-mysql-service
AUTH_DB_USER=root
AUTH_DB_PASSWORD=${dbPassword}
AUTH_DB_NAME=auth_db
AUTH_JWT_SECRET=${jwtSecret}
AUTH_PORT=3001

# Service de catalogue
CATALOG_DB_HOST=catalog-mysql-service
CATALOG_DB_USER=root
CATALOG_DB_PASSWORD=${dbPassword}
CATALOG_DB_NAME=catalog_db
CATALOG_PORT=3002

# Service de paiement
PAYMENT_STRIPE_KEY=sk_test_your_stripe_key # Remplacez par votre clé Stripe
PAYMENT_SUCCESS_URL=http://e-commerce.local/stripe/success.html
PAYMENT_CANCEL_URL=http://e-commerce.local/stripe/cancel.html
PAYMENT_PORT=3003

# Service de support
SUPPORT_DB_HOST=support-db
SUPPORT_DB_USER=root
SUPPORT_DB_PASSWORD=${dbPassword}
SUPPORT_DB_NAME=support_db
SUPPORT_JWT_SECRET=${jwtSecret}
SUPPORT_PORT=3004
`;

// Écrire le fichier .env
fs.writeFileSync(envPath, envContent);

console.log('Fichier .env créé avec succès avec des valeurs sécurisées par défaut.');
console.log('⚠️  N\'oubliez pas de mettre à jour les clés sensibles comme PAYMENT_STRIPE_KEY si nécessaire.');