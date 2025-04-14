// support/src/controllers/ticketController.js
const Ticket = require('../models/ticketModel');

const createTicket = async (req, res) => {
  const { subject, message } = req.body;
  try {
    const ticket = await Ticket.create(req.user.id, subject, message);
    res.status(201).json({ message: 'Ticket créé', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.getAll(req.user.id === 1, req.user.id);
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.getById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });

    // Autorisation
    if (ticket.user_id !== req.user.id && req.user.id !== 1) {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const updateTicketStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Ticket.updateStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ message: 'Ticket non trouvé' });

    res.status(200).json({ message: 'Statut mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur too bad', error: err.message });
  }
};


const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.getByUserId(req.user.id); // Utiliser l'ID de l'utilisateur connecté
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Exporter la fonction
module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  getMyTickets, // Nouvelle méthode exportée
};
