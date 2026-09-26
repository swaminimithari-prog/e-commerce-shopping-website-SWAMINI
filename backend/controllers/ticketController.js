// controllers/ticketController.js
const Ticket = require("../models/Ticket");

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private (any logged-in user)
const createTicket = async (req, res) => {
      try {
            const { name, phone, email, address, message } = req.body;

            if (!name || !phone || !email || !address || !message) {
                  return res.status(400).json({
                        success: false,
                        message: "Name, phone, email, address and message are all required",
                  });
            }

            // If an image was uploaded via multer (field name "image"), store its served path
            const image = req.file ? `/uploads/${req.file.filename}` : "";

            const ticket = await Ticket.create({
                  user: req.user.id,
                  name,
                  phone,
                  email,
                  address,
                  message,
                  image,
            });

            res.status(201).json({
                  success: true,
                  message: "Support ticket submitted successfully",
                  ticket,
            });
      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: "Failed to create ticket",
                  error: error.message,
            });
      }
};

// @desc    Get logged-in user's own tickets
// @route   GET /api/tickets/mytickets
// @access  Private
const getMyTickets = async (req, res) => {
      try {
            const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });

            res.status(200).json({
                  success: true,
                  count: tickets.length,
                  tickets,
            });
      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: "Failed to fetch tickets",
                  error: error.message,
            });
      }
};

// @desc    Get all tickets (admin support inbox)
// @route   GET /api/tickets
// @access  Private/Admin
const getAllTickets = async (req, res) => {
      try {
            const tickets = await Ticket.find({}).sort({ createdAt: -1 });

            res.status(200).json({
                  success: true,
                  count: tickets.length,
                  tickets,
            });
      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: "Failed to fetch tickets",
                  error: error.message,
            });
      }
};

// @desc    Get a single ticket by ID
// @route   GET /api/tickets/:id
// @access  Private (owner or admin)
const getTicketById = async (req, res) => {
      try {
            const ticket = await Ticket.findById(req.params.id);

            if (!ticket) {
                  return res.status(404).json({
                        success: false,
                        message: "Ticket not found",
                  });
            }

            if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
                  return res.status(403).json({
                        success: false,
                        message: "Not authorized to view this ticket",
                  });
            }

            res.status(200).json({
                  success: true,
                  ticket,
            });
      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: "Failed to fetch ticket",
                  error: error.message,
            });
      }
};

// @desc    Admin replies to a ticket
// @route   PUT /api/tickets/:id/reply
// @access  Private/Admin
const replyToTicket = async (req, res) => {
      try {
            const { adminReply } = req.body;

            if (!adminReply || !adminReply.trim()) {
                  return res.status(400).json({
                        success: false,
                        message: "Reply message is required",
                  });
            }

            const ticket = await Ticket.findById(req.params.id);

            if (!ticket) {
                  return res.status(404).json({
                        success: false,
                        message: "Ticket not found",
                  });
            }

            ticket.adminReply = adminReply.trim();
            ticket.status = "Answered";

            await ticket.save();

            res.status(200).json({
                  success: true,
                  message: "Reply posted successfully",
                  ticket,
            });
      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: "Failed to post reply",
                  error: error.message,
            });
      }
};

module.exports = {
      createTicket,
      getMyTickets,
      getAllTickets,
      getTicketById,
      replyToTicket,
};