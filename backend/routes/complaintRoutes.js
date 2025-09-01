const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const complaintController = require("../controllers/complaintController");
const authMiddleware = require("../middleware/authMiddleware"); // if you have JWT auth

// Student complaint creation
router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  complaintController.submitComplaint
);

// Get student complaints
router.get(
  "/student",
  authMiddleware,
  complaintController.getStudentComplaints
);

// Admin get all complaints
router.get("/all", authMiddleware, complaintController.getAllComplaints);

module.exports = router;
