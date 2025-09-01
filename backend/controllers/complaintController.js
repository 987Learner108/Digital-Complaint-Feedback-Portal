
const Complaint = require("../models/Complaint");

// Helper to generate random 5-digit ID with CMP- prefix
const generateUniqueComplaintId = () => {
  return "CMP-" + Math.floor(10000 + Math.random() * 90000);
};

// Get all complaints by logged-in student
exports.getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints", error: err });
  }
};

// Get all complaints (for Admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints", error: err });
  }
};


exports.submitComplaint = async (req, res) => {
  try {
    const { title, description, category, department, assignTo, isAnonymous } = req.body;

    // Generate a unique 5-digit complaint ID
    let complaintId;
    let isUnique = false;

    while (!isUnique) {
      complaintId = generateUniqueComplaintId();
      const existing = await Complaint.findOne({ complaintId });
      if (!existing) isUnique = true;
    }

    const complaint = new Complaint({
      complaintId,
      title,
      description,
      category,
      department,
      assignTo,
      isAnonymous,
      user: req.user.id,
      attachment: req.file ? req.file.path : null,
      updates: [
        {
          status: "Pending",
          description: "Complaint submitted.",
        },
      ],
    });

    await complaint.save();
    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit complaint", error: err.message });
  }
};
