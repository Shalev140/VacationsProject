import express from "express";
import path from "path";

const assetsController = express.Router();

// Serve static files from the "assets" folder
const assetsPath = path.resolve(__dirname, "..", "assets");
assetsController.use("/", express.static(assetsPath));

export { assetsController };
