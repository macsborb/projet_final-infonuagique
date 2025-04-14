const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  getMyTickets
} = require('../controllers/ticketController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// Routes publiques/authentifiées
router.post('/', authenticate, createTicket);
router.get('/', authenticate, getTickets);
router.get('/my-tickets', authenticate, getMyTickets); // 👈 Voir ses propres tickets
router.get('/:id', authenticate, getTicketById);
router.put('/:id/status', authenticate, isAdmin, updateTicketStatus);

module.exports = router;
