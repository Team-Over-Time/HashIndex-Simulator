const express = require("express");
const router = express.Router();
const simulationController = require("../controllers/simulationController");

// Health check endpoint
router.get("/health", simulationController.getHealth);

// Get list of supported algorithms and metadata
router.get("/algorithms", simulationController.getAlgorithms);

// Execute a hash simulation
router.post("/simulate", simulationController.runSimulation);

// Run benchmark comparison
router.post("/compare", simulationController.runBenchmark);

module.exports = router;
