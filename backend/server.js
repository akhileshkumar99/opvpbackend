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
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://akhilesh:akhilesh5044@cluster0.tpzkao7.mongodb.net/opvp_school?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      maxPoolSize: 10
    });
    console.log("MongoDB Connected ✅");
    
    // Create default admin user
    const User = require('./models/User');
    try {
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        await User.create({
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          name: 'School Admin',
          email: 'admin@opvkolhampur.com',
          phone: '1234567890'
        });
        console.log('Default admin user created: admin / admin123');
      }
    } catch (err) {
      console.log('Admin creation error:', err.message);
    }
    
    // Start server only after DB connection
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
    
  } catch (err) {
    console.log("MongoDB Error ❌", err);
    process.exit(1);
  }
};

connectDB();

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


