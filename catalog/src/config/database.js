const mysql = require('mysql2/promise');

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'catalog_db',
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