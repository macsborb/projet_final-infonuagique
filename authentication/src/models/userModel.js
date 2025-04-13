const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateur par email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateur par ID:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      // Hachage du mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const [result] = await pool.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [userData.username, userData.email, hashedPassword]
      );

      return { id: result.insertId, username: userData.username, email: userData.email };
    } catch (error) {
      console.error('Erreur lors de la création d\'un utilisateur:', error);
      throw error;
    }
  }
}

module.exports = User;