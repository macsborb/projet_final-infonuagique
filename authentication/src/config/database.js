const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../../../.env' });

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
  host: process.env.AUTH_DB_HOST || 'auth-mysql-service',
  user: process.env.AUTH_DB_USER || 'root',
  password: process.env.AUTH_DB_PASSWORD || 'password',
  database: process.env.AUTH_DB_NAME || 'auth_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connexion à la base de données d\'authentification établie avec succès');
    connection.release();
  } catch (error) {
    console.error('Erreur de connexion à la base de données d\'authentification:', error);
  }
}

testConnection();

module.exports = pool;