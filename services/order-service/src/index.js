import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send(`${process.env.SERVICE_NAME || "Service"} is running ✅`);
});

const PORT = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ User Service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database", error);
    process.exit(1);
  }
};

startServer();
