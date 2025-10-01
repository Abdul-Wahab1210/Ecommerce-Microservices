import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.send("User Service is running 🚀");
});

// Routes
app.use("/api/users", userRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
