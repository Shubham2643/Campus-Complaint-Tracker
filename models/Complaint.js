const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Infrastructure", "IT", "Cleanliness", "Security", "Other"],
      default: "Other",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Rejected"],
      default: "Open",
    },
  },
  {
    timestamps: true, // auto createdAt & updatedAt
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
