import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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
      throw err;
    });
};

app.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
  console.log("Connected to Server");
});
