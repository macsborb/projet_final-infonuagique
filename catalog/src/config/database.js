const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../../../.env' });

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
  host: process.env.CATALOG_DB_HOST || 'catalog-mysql-service',
  user: process.env.CATALOG_DB_USER || 'root',
  password: process.env.CATALOG_DB_PASSWORD || 'password',
  database: process.env.CATALOG_DB_NAME || 'catalog_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connexion à la base de données du catalogue établie avec succès');
    connection.release();
  } catch (error) {
    console.error('Erreur de connexion à la base de données du catalogue:', error);
  }
}

testConnection();

module.exports = pool;