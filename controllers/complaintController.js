const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");

// @desc    Create a new complaint
// @route   POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const { studentName, email, title, description, category, priority, location } = req.body;

    // Validate required fields
    if (!studentName || !email || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: studentName, email, title, description",
      });
    }

    const complaint = await Complaint.create({
      studentName,
      email,
      title,
      description,
      category,
      priority,
      location,
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all complaints (with optional filters & search)
// @route   GET /api/complaints?status=&category=&priority=&search=
const getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // Case-insensitive search on title or studentName
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { studentName: regex }];
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
const getComplaintById = async (req, res) => {
  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid complaint ID" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update complaint (editable fields)
// @route   PUT /api/complaints/:id
const updateComplaint = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid complaint ID" });
    }

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update complaint status only
// @route   PATCH /api/complaints/:id/status
const updateComplaintStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid complaint ID" });
    }

    const { status } = req.body;
    const validStatuses = ["Open", "In Progress", "Resolved", "Rejected"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
const deleteComplaint = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid complaint ID" });
    }

    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ success: true, message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
};
