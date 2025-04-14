const db = require('../config/database');

const Ticket = {
  create: async (user_id, subject, message) => {
    const [result] = await db.execute(
      'INSERT INTO tickets (user_id, subject, message) VALUES (?, ?, ?)',
      [user_id, subject, message]
    );
    return { id: result.insertId, user_id, subject, message, status: 'open' };
  },

  getAll: async (isAdmin, user_id) => {
    const [rows] = isAdmin
      ? await db.execute('SELECT * FROM tickets ORDER BY created_at DESC')
      : await db.execute('SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM tickets WHERE id = ?', [id]);
    return rows[0];
  },

  getByUserId: async (userId) => {
    const [rows] = await db.execute('SELECT * FROM tickets WHERE user_id = ?', [userId]);
    return rows;
  },

  updateStatus: async (id, status) => {
    const [result] = await db.execute(
      'UPDATE tickets SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Ticket;
