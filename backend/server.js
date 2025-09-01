const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Import cloudinary config
const cloudinary = require("./config/cloudinary");

// Config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/details", require("./routes/detailsRoutes"));
app.use("/api/track", require("./routes/trackRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));

// Serve frontend
const frontendPath = path.join(__dirname, "dist"); // Frontend build directory after build
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
async function start() {
  try {
    if (!MONGO_URI) {
      throw new Error("❌ MONGO_URI not set in environment");
    }
    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Atlas Connected");

    // Check Cloudinary connection
    await checkCloudinaryConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("🔥 Server startup error:", err.message);
    process.exit(1);
  }
}

async function checkCloudinaryConnection() {
  try {
    await cloudinary.api.ping();
    console.log("✅ Cloudinary Connected");
  } catch (error) {
    throw new Error("❌ Cloudinary Connection Error: " + error.message);
  }
}

start();
