import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";

mongoose.set("strictQuery", false);
const PORT = 8800;
const app = express();
dotenv.config();

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB");
      throw err;
    });
};

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});
