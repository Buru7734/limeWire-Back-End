import express from "express";
import db from "./db/connection.js";
import cors from "cors";
import logger from "morgan";
import dotenv from "dotenv";
dotenv.config();

console.log("MONGODB_URI:", process.env.MONGODB_URI ? "loaded" : "missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "loaded" : "missing");

const app = express();

// Import routers
import routes from "./routes/index.js";

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger("dev"));

app.get("/", (_, res) => {
  res.send("You have reached our API.");
});

// Routes
app.use("/", routes);

// Start the server and listen on port 3000
db.on("connected", () => {
  // console.clear();
  console.log("Connected to MongoDB");
  app.listen(3000, () => {
    console.log("The express app is ready!");
  });
});
