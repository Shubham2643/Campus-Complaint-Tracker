const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");

// Routes only map endpoints to controller functions
router.route("/").post(createComplaint).get(getAllComplaints);
router.route("/:id").get(getComplaintById).put(updateComplaint).delete(deleteComplaint);
router.route("/:id/status").patch(updateComplaintStatus);

module.exports = router;
