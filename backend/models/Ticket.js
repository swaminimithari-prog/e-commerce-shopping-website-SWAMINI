// models/Ticket.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
      {
            user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                  required: true,
            },
            name: {
                  type: String,
                  required: [true, "Name is required"],
            },
            phone: {
                  type: String,
                  required: [true, "Phone is required"],
            },
            email: {
                  type: String,
                  required: [true, "Email is required"],
            },
            address: {
                  type: String,
                  required: [true, "Address is required"],
            },
            message: {
                  type: String,
                  required: [true, "Issue description is required"],
            },
            // Path/URL to uploaded proof image, served via /uploads static route
            image: {
                  type: String,
                  default: "",
            },
            adminReply: {
                  type: String,
                  default: "",
            },
            status: {
                  type: String,
                  enum: ["Open", "Answered"],
                  default: "Open",
            },
      },
      { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);