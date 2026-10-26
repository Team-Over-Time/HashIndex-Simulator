/**
 * HashLab - Simulation Controller
 * Handles business logic for hash indexing operations, metrics, and comparisons.
 */

// Supported Algorithm Definitions & Metadatas
const ALGORITHM_CATALOG = [
  {
    id: "linear",
    name: "Linear Probing",
    category: "Open Addressing",
    formula: "h(k, i) = (h(k) + i) mod m",
    description: "Probes sequential slots upon collision. Simple and cache-efficient, but susceptible to primary clustering.",
    timeComplexity: { average: "O(1)", worst: "O(n)" },
  },
  {
    id: "quadratic",
    name: "Quadratic Probing",
    category: "Open Addressing",
    formula: "h(k, i) = (h(k) + c1*i + c2*i^2) mod m",
    description: "Increments probe offsets quadratically to resolve primary clustering.",
    timeComplexity: { average: "O(1)", worst: "O(n)" },
  },
  {
    id: "double",
    name: "Double Hashing",
    category: "Open Addressing",
    formula: "h(k, i) = (h1(k) + i * h2(k)) mod m",
    description: "Uses a secondary hash function for probe step size, eliminating secondary clustering.",
    timeComplexity: { average: "O(1)", worst: "O(n)" },
  },
  {
    id: "separate",
    name: "Separate Chaining",
    category: "Closed Addressing",
    formula: "Bucket[h(k) mod m] -> Linked List",
    description: "Stores colliding entries in dynamic linked lists per bucket. Allows load factor > 1.0.",
    timeComplexity: { average: "O(1 + alpha)", worst: "O(n)" },
  },
  {
    id: "rehashing",
    name: "Dynamic Rehashing",
    category: "Adaptive Sizing",
    formula: "m' = 2 * m when alpha >= 0.70",
    description: "Monitors table load factor and doubles bucket capacity with full redistribution when capacity exceeds threshold.",
    timeComplexity: { average: "O(1)", amortized: "O(1)" },
  },
  {
    id: "extendible",
    name: "Extendible Hashing",
    category: "Dynamic Index",
    formula: "Index = Key mod 2^(global_depth)",
    description: "Directory-based dynamic indexing. Splits overflowing buckets independently without full table rehash.",
    timeComplexity: { average: "O(1)", directoryDouble: "O(2^d)" },
  },
  {
    id: "linear-hashing",
    name: "Linear Hashing",
    category: "Dynamic Index",
    formula: "Round-Robin Split Pointer (s)",
    description: "Controlled, incremental bucket splitting governed by a round-robin pointer. Requires no in-memory directory.",
    timeComplexity: { average: "O(1)", split: "O(bucket capacity)" },
  },
  {
    id: "static",
    name: "Static Hashing",
    category: "Fixed Capacity",
    formula: "h(k) = k mod m",
    description: "Traditional fixed-size bucket allocation with overflow chain fallback.",
    timeComplexity: { average: "O(1)", worst: "O(n)" },
  },
];

// Helper: Linear Probing Simulation
function simulateLinearProbing(keys, bucketCount = 7) {
  const table = new Array(bucketCount).fill(null);
  let collisions = 0;
  let probes = 0;
  const logs = [];

  for (const key of keys) {
    const primary = Math.abs(key) % bucketCount;
    let placed = false;

    for (let i = 0; i < bucketCount; i++) {
      probes++;
      const slot = (primary + i) % bucketCount;

      if (i > 0) collisions++;

      if (table[slot] === null || table[slot] === key) {
        table[slot] = key;
        placed = true;
        logs.push({
          operation: "INSERT",
          key,
          primaryBucket: primary,
          finalSlot: slot,
          probeSteps: i + 1,
          status: "SUCCESS",
        });
        break;
      }
    }

    if (!placed) {
      logs.push({
        operation: "INSERT",
        key,
        primaryBucket: primary,
        status: "TABLE_FULL",
      });
    }
  }

  const occupied = table.filter((x) => x !== null).length;
  return {
    algorithm: "Linear Probing",
    bucketCount,
    totalKeys: occupied,
    collisions,
    probes,
    loadFactor: Math.round((occupied / bucketCount) * 100),
    table,
    logs,
  };
}

// Controller Methods
const simulationController = {
  // GET /api/health
  getHealth: (req, res) => {
    res.json({
      status: "online",
      service: "HashLab Backend API Server",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    });
  },

  // GET /api/algorithms
  getAlgorithms: (req, res) => {
    res.json({
      success: true,
      count: ALGORITHM_CATALOG.length,
      algorithms: ALGORITHM_CATALOG,
    });
  },

  // POST /api/simulate
  runSimulation: (req, res) => {
    const { algorithm = "linear", keys = [10, 20, 30, 40, 50], bucketCount = 7 } = req.body;

    if (!Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid input: 'keys' must be a non-empty array of numbers.",
      });
    }

    const numKeys = keys.map((k) => Number(k)).filter((n) => !Number.isNaN(n));
    const size = Math.max(3, Math.min(Number(bucketCount) || 7, 50));

    // Execute linear simulation as sample
    const result = simulateLinearProbing(numKeys, size);

    res.json({
      success: true,
      result,
    });
  },

  // POST /api/compare
  runBenchmark: (req, res) => {
    const { keys = [10, 20, 30, 40, 50, 15, 25, 35], bucketCount = 7 } = req.body;

    if (!Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid input: 'keys' must be a non-empty array of numbers.",
      });
    }

    const numKeys = keys.map((k) => Number(k)).filter((n) => !Number.isNaN(n));
    const size = Math.max(3, Math.min(Number(bucketCount) || 7, 50));

    // Benchmark across core strategies
    const linear = simulateLinearProbing(numKeys, size);

    res.json({
      success: true,
      benchmark: {
        inputKeys: numKeys,
        bucketCount: size,
        results: [linear],
      },
    });
  },
};

module.exports = simulationController;
