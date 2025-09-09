import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import reportRouter from "./routes/reportRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Database pool
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/reports", reportRouter);

// Simple route to test DB
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM tasks;");
    res.json({ task_count: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
