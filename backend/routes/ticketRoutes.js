// routes/ticketRoutes.js
const router = require("express").Router();

const {
      createTicket,
      getMyTickets,
      getAllTickets,
      getTicketById,
      replyToTicket,
} = require("../controllers/ticketController");

const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Logged-in user: submit a ticket (with optional photo proof) & view their own tickets
router.post("/", protect, upload.single("image"), createTicket);
router.get("/mytickets", protect, getMyTickets);

// Admin: view all tickets & reply
router.get("/", protect, admin, getAllTickets);
router.put("/:id/reply", protect, admin, replyToTicket);

// Single ticket (owner or admin) — kept below the more specific GET "/" and "/mytickets"
router.get("/:id", protect, getTicketById);

module.exports = router;