require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Root Test Route =====
app.get("/", (req, res) => {
  res.send("OPVP BACKEND RUNNING 🚀");
});

// ===== Upload Folder Create =====
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// ===== MongoDB Connect =====
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

// ===== Routes =====
app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/students"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/fees", require("./routes/fees"));
app.use("/api/income", require("./routes/income"));
app.use("/api/expense", require("./routes/expense"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/exams", require("./routes/exams"));
app.use("/api/results", require("./routes/results"));
app.use("/api/notices", require("./routes/notices"));
app.use("/api/classes", require("./routes/classes"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/admission", require("./routes/admission"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/slider", require("./routes/slider"));

// ===== Error handler =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

// ===== Railway Port =====
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
