const express = require("express");
const cors = require("cors");
const simulationRoutes = require("./routes/simulationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite client (http://localhost:5173)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Mount API Routes
app.use("/api", simulationRoutes);

// Root Welcome Endpoint
app.get("/", (req, res) => {
  res.json({
    name: "HashLab API Server",
    version: "1.0.0",
    status: "active",
    endpoints: {
      health: "/api/health",
      algorithms: "/api/algorithms",
      simulate: "POST /api/simulate",
      compare: "POST /api/compare",
    },
    documentation: "https://github.com/your-username/hashIndexSimulator",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    details: err.message,
  });
});

// Start HTTP Server
app.listen(PORT, () => {
  console.log("\n=======================================================");
  console.log("          HASHLAB BACKEND API SERVER ACTIVE            ");
  console.log("=======================================================");
  console.log(`  Local URL:        http://localhost:${PORT}`);
  console.log(`  Health Check:     http://localhost:${PORT}/api/health`);
  console.log(`  Algorithms API:   http://localhost:${PORT}/api/algorithms`);
  console.log(`  Client Origin:    http://localhost:5173`);
  console.log("=======================================================\n");
});
