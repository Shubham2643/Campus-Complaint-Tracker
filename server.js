const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const complaintRoutes = require("./routes/complaintRoutes");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Routes
app.use("/api/complaints", complaintRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Campus Complaint Tracker API is running" });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
