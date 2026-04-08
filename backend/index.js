import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/connectDB.js";

import esp32Router from "./routes/esp32.route.js";
import webRouter from "./routes/web.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/esp32", esp32Router);
app.use("/api/web", webRouter);

app.get("/", (request, response) => {
  return response.status(200).json({
    success: true,
    message: "API is running",
    service: "Reflex Grid Backend",
    version: "1.0.0",
    authors: ["Anubhav Jha", "Shivansh Ranjan"],
    timestamp: new Date().toISOString(),
  });
});

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
