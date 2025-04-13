const pool = require('../config/database');

class Product {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM products');
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erreur lors de la récupération du produit par ID:', error);
      throw error;
    }
  }

  static async create(productData) {
    try {
      const [result] = await pool.query(
        'INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)',
        [
          productData.name, 
          productData.description, 
          productData.price, 
          productData.image_url || null, 
          productData.stock || 0
        ]
      );

      return { id: result.insertId, ...productData };
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  }

  static async update(id, productData) {
    try {
      const [result] = await pool.query(
        'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock = ? WHERE id = ?',
        [
          productData.name, 
          productData.description, 
          productData.price, 
          productData.image_url || null, 
          productData.stock || 0, 
          id
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }

  static async search(query) {
    try {
      const searchQuery = `%${query}%`;
      const [rows] = await pool.query(
        'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
        [searchQuery, searchQuery]
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la recherche de produits:', error);
      throw error;
    }
  }
}

module.exports = Product;