import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Binary,
  Database,
  GitBranch,
  Hash,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Waypoints,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Gamepad2,
} from "lucide-react";

/* =========================================================
   ANIMATED HASH ENGINE SCENARIOS DATA
   Visually demonstrates the 3 pillars of DBMS Hash Indexing:
   1. Open Addressing & Collision Probing
   2. Separate Chaining (Linked Overflow)
   3. Dynamic Hashing (Extendible Bucket Splitting)
========================================================= */

const SCENARIOS = [
  {
    id: "probing",
    title: "1. Collision & Probing",
    subtitle: "Open Addressing",
    description: "Watch what happens when two keys target the exact same slot.",
    steps: [
      {
        stage: "INGEST",
        title: "DBMS Query Ingests Key 42",
        narrative: "A query arrives: INSERT Key 42 into a 5-bucket hash index table.",
        incomingKey: 42,
        activeBucket: null,
        status: "idle",
        probeTarget: null,
        chainNode: null,
        split: false,
        table: [
          { id: 0, keys: [] },
          { id: 1, keys: [31] },
          { id: 2, keys: [17] },
          { id: 3, keys: [] },
          { id: 4, keys: [94] },
        ],
      },
      {
        stage: "HASH",
        title: "Hash Function Evaluates: h(42) mod 5 = 2",
        narrative: "Primary hash maps 42 to Bucket Index 2. Preparing to insert.",
        incomingKey: 42,
        activeBucket: 2,
        status: "evaluating",
        probeTarget: null,
        chainNode: null,
        split: false,
        table: [
          { id: 0, keys: [] },
          { id: 1, keys: [31] },
          { id: 2, keys: [17] },
          { id: 3, keys: [] },
          { id: 4, keys: [94] },
        ],
      },
      {
        stage: "COLLISION",
        title: "⚠️ Collision Detected at Bucket 2!",
        narrative: "Bucket 2 is already occupied by Key 17! Open addressing probe triggers.",
        incomingKey: 42,
        activeBucket: 2,
        status: "collision",
        probeTarget: 3,
        chainNode: null,
        split: false,
        table: [
          { id: 0, keys: [] },
          { id: 1, keys: [31] },
          { id: 2, keys: [17] },
          { id: 3, keys: [] },
          { id: 4, keys: [94] },
        ],
      },
      {
        stage: "PROBE",
        title: "Probe Scans to Next Slot: (2 + 1) mod 5 = 3",
        narrative: "The algorithm leaps to Bucket 3 using step sequence h(k, i).",
        incomingKey: 42,
        activeBucket: 3,
        status: "probing",
        probeTarget: null,
        chainNode: null,
        split: false,
        table: [
          { id: 0, keys: [] },
          { id: 1, keys: [31] },
          { id: 2, keys: [17] },
          { id: 3, keys: [] },
          { id: 4, keys: [94] },
        ],
      },
      {
        stage: "STORED",
        title: "✅ Key 42 Stored Successfully at Bucket 3",
        narrative: "Empty slot found! Key 42 stored in O(1) expected time. Collision resolved.",
        incomingKey: null,
        activeBucket: 3,
        status: "success",
        probeTarget: null,
        chainNode: null,
        split: false,
        table: [
          { id: 0, keys: [] },
          { id: 1, keys: [31] },
          { id: 2, keys: [17] },
          { id: 3, keys: [42] },
          { id: 4, keys: [94] },
        ],
      },
    ],
  },
  {
    id: "chaining",
    title: "2. Separate Chaining",
    subtitle: "Closed Addressing",
    description: "Colliding records link into dynamic overflow chains in memory.",
    steps: [
      {
        stage: "INGEST",
        title: "Query Ingests Key 27",
        narrative: "Inserting Key 27 into a table where Bucket 2 already holds Key 17.",
        incomingKey: 27,
        activeBucket: null,
        status: "idle",
        probeTarget: null,
        chainNode: null,
        split: false,
        table: [
          { id: 0, keys: [10] },
          { id: 1, keys: [] },
          { id: 2, keys: [17] },
          { id: 3, keys: [33] },
          { id: 4, keys: [] },
        ],
      },
      {
        stage: "HASH",
        title: "Hash Function: h(27) mod 5 = Bucket 2",
        narrative: "Primary hash points directly to Bucket 2.",
        incomingKey: 27,
        activeBucket: 2,
        status: "evaluating",
        probeTarget: null,
        chainNode: null,
        split: false,
        table: [
          { id: 0, keys: [10] },
          { id: 1, keys: [] },
          { id: 2, keys: [17] },
          { id: 3, keys: [33] },
          { id: 4, keys: [] },
        ],
      },
      {
        stage: "COLLISION",
        title: "Slot Occupied: Spawning Overflow Link",
        narrative: "Rather than displacing other buckets, Separate Chaining creates a linked pointer.",
        incomingKey: 27,
        activeBucket: 2,
        status: "collision",
        probeTarget: null,
        chainNode: 27,
        split: false,
        table: [
          { id: 0, keys: [10] },
          { id: 1, keys: [] },
          { id: 2, keys: [17] },
          { id: 3, keys: [33] },
          { id: 4, keys: [] },
        ],
      },
      {
        stage: "STORED",
        title: "✅ Chain Extended: [17] → [27]",
        narrative: "Key 27 appended to Bucket 2's linked list! No open slots displaced.",
        incomingKey: null,
        activeBucket: 2,
        status: "success",
        probeTarget: null,
        chainNode: null,
        split: false,
        table: [
          { id: 0, keys: [10] },
          { id: 1, keys: [] },
          { id: 2, keys: [17, 27] },
          { id: 3, keys: [33] },
          { id: 4, keys: [] },
        ],
      },
    ],
  },
  {
    id: "split",
    title: "3. Dynamic Splitting",
    subtitle: "Extendible Hashing",
    description: "Watch a database bucket split in real-time as capacity overflows.",
    steps: [
      {
        stage: "INGEST",
        title: "Bucket at 100% Capacity (2/2 keys)",
        narrative: "Bucket A holds [4, 12]. Incoming Key 20 also hashes to Bucket A.",
        incomingKey: 20,
        activeBucket: null,
        status: "idle",
        probeTarget: null,
        chainNode: null,
        split: false,
        table: [
          { id: 0, label: "Bucket A (d=1)", keys: [4, 12] },
          { id: 1, label: "Bucket B (d=1)", keys: [7] },
        ],
      },
      {
        stage: "COLLISION",
        title: "⚠️ Bucket Overflow! Capacity Exceeded",
        narrative: "Bucket A cannot accept Key 20 without overflowing. Split trigger activated!",
        incomingKey: 20,
        activeBucket: 0,
        status: "collision",
        probeTarget: null,
        chainNode: null,
        split: false,
        table: [
          { id: 0, label: "Bucket A (d=1)", keys: [4, 12] },
          { id: 1, label: "Bucket B (d=1)", keys: [7] },
        ],
      },
      {
        stage: "SPLIT",
        title: "⚡ Partitioning Bucket & Increasing Depth (d=2)",
        narrative: "Bucket A splits into Bucket A0 and A1. Directory depth doubles from 1 to 2.",
        incomingKey: 20,
        activeBucket: 0,
        status: "probing",
        probeTarget: null,
        chainNode: null,
        split: true,
        table: [
          { id: 0, label: "Bucket A0 (d=2)", keys: [4] },
          { id: 1, label: "Bucket A1 (d=2)", keys: [12] },
          { id: 2, label: "Bucket B (d=1)", keys: [7] },
        ],
      },
      {
        stage: "STORED",
        title: "✅ Keys Redistributed Without Full Rehash",
        narrative: "Key 20 lands in Bucket A0. Directory pointers rewired smoothly.",
        incomingKey: null,
        activeBucket: 0,
        status: "success",
        probeTarget: null,
        chainNode: null,
        split: false,
        table: [
          { id: 0, label: "Bucket A0 (d=2)", keys: [4, 20] },
          { id: 1, label: "Bucket A1 (d=2)", keys: [12] },
          { id: 2, label: "Bucket B (d=1)", keys: [7] },
        ],
      },
    ],
  },
];

/* =========================================================
   STATIC ALGORITHM TAXONOMY GROUPS
========================================================= */

const algorithmGroups = [
  {
    id: "closed-addressing",
    title: "Closed Addressing",
    subtitle: "Open Hashing",
    description:
      "Collisions are handled by maintaining multiple keys at the same hash location.",
    icon: Database,
    className: "flow-group-chaining",
    algorithms: [
      {
        id: "separate",
        name: "Separate Chaining",
        description:
          "Store colliding keys in the same bucket using a chain.",
        icon: GitBranch,
      },
    ],
  },
  {
    id: "open-addressing",
    title: "Open Addressing",
    subtitle: "Close Hashing",
    description:
      "Collisions are resolved by probing alternative positions in the table.",
    icon: Search,
    className: "flow-group-open",
    algorithms: [
      {
        id: "linear",
        name: "Linear Probing",
        description:
          "Check the next available position sequentially.",
        icon: ArrowRight,
      },
      {
        id: "quadratic",
        name: "Quadratic Probing",
        description:
          "Use quadratic jumps to find an empty position.",
        icon: Binary,
      },
      {
        id: "double",
        name: "Double Hashing",
        description:
          "Use a second hash function to determine probe steps.",
        icon: Hash,
      },
    ],
  },
  {
    id: "dynamic-hashing",
    title: "Dynamic Hashing",
    subtitle: "Adaptive Hash Structures",
    description:
      "The hash structure grows dynamically as more keys are inserted.",
    icon: RefreshCw,
    className: "flow-group-dynamic",
    algorithms: [
      {
        id: "rehashing",
        name: "Rehashing",
        description:
          "Expand the table and redistribute existing keys.",
        icon: RefreshCw,
      },
      {
        id: "extendible",
        name: "Extendible Hashing",
        description:
          "Use a directory and local bucket depths to grow dynamically.",
        icon: Waypoints,
      },
      {
        id: "linear-hashing",
        name: "Linear Hashing",
        description:
          "Split buckets progressively using a split pointer.",
        icon: GitBranch,
      },
    ],
  },
];

function AlgorithmNode({ algorithm }) {
  const Icon = algorithm.icon;

  return (
    <Link
      to={`/simulator?algorithm=${algorithm.id}`}
      className="home-algorithm-node"
    >
      <div className="home-algorithm-icon">
        <Icon size={20} strokeWidth={2} />
      </div>

      <div className="home-algorithm-content">
        <h3>{algorithm.name}</h3>
        <p>{algorithm.description}</p>
      </div>

      <ArrowRight className="home-node-arrow" size={20} />
    </Link>
  );
}

function Home() {
  /*
   * Graphical Animated Hero Engine State
   */
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scenario = SCENARIOS[activeScenarioIdx];
  const currentStep = scenario.steps[stepIdx];

  // Auto-advancing visual animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (stepIdx < scenario.steps.length - 1) {
        setStepIdx((prev) => prev + 1);
      } else {
        // Switch to next scenario smoothly
        setStepIdx(0);
        setActiveScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, activeScenarioIdx, scenario.steps.length]);

  const handleNextStep = () => {
    setIsPlaying(false);
    if (stepIdx < scenario.steps.length - 1) {
      setStepIdx((prev) => prev + 1);
    } else {
      setStepIdx(0);
      setActiveScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
    }
  };

  const handleReset = () => {
    setStepIdx(0);
  };

  return (
    <main className="home-page">
      {/* =====================================================
          HERO SECTION
          ===================================================== */}
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-content">
            <div className="home-eyebrow">
              <span className="home-eyebrow-dot" />
              DBMS × DSA × INTERACTIVE VISUAL ENGINE
            </div>

            <h1>
              Understand how
              <span> Hash Indexes </span>
              actually work.
            </h1>

            <p className="home-hero-description">
              HashLab reveals the hidden mechanics of database hash indexing: watch
              queries compute hash addresses, witness collisions in real time, and
              explore adaptive bucket growth dynamically.
            </p>

            <div className="home-hero-actions">
              <Link to="/simulator" className="home-primary-button">
                <Play size={18} />
                Open Simulator
              </Link>

              <Link to="/learn" className="home-secondary-button">
                Learn Hashing
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="home-hero-stats">
              <div>
                <strong>7</strong>
                <span>Algorithms</span>
              </div>

              <div>
                <strong>3</strong>
                <span>Core Families</span>
              </div>

              <div>
                <strong>O(1)</strong>
                <span>Expected Lookup</span>
              </div>
            </div>
          </div>

          {/* =====================================================
              GRAPHICAL ANIMATED HASH ENGINE (HERO VISUAL)
              ===================================================== */}
          <div className="home-hero-visual">
            <div className="home-visual-glow" />

            <div
              className="home-hash-card"
            >
              {/* ENGINE HEADER WITH MODE SWITCHER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  borderBottom: "1.5px solid var(--border-main)",
                  paddingBottom: "14px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: "var(--palette-azure)",
                      letterSpacing: "0.1em",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Sparkles size={13} color="var(--palette-azure)" />
                    LIVE GRAPHICAL HASH ENGINE
                  </span>
                  <strong style={{ fontSize: "16px", color: "var(--text-primary)" }}>
                    {scenario.title}
                  </strong>
                </div>

                {/* PLAY / PAUSE CONTROLS */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    title={isPlaying ? "Pause Animation" : "Play Animation"}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-main)",
                      background: isPlaying ? "var(--accent-primary)" : "var(--bg-card-muted)",
                      color: isPlaying ? "#ffffff" : "var(--text-primary)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "11px",
                      fontWeight: 700,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                    <span>{isPlaying ? "Auto" : "Paused"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    title="Step to next phase"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-main)",
                      background: "var(--bg-card-muted)",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      fontWeight: 700,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <SkipForward size={13} />
                    <span>Step</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    title="Replay this scenario"
                    style={{
                      padding: "6px 9px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-main)",
                      background: "var(--bg-card-muted)",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* SCENARIO MODE SELECTOR PILLS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "6px",
                  background: "var(--bg-card-muted)",
                  border: "1px solid var(--border-main)",
                  padding: "5px",
                  borderRadius: "12px",
                }}
              >
                {SCENARIOS.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setActiveScenarioIdx(idx);
                      setStepIdx(0);
                    }}
                    style={{
                      padding: "7px 9px",
                      borderRadius: "9px",
                      border: "none",
                      fontSize: "11px",
                      fontWeight: 750,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background:
                        activeScenarioIdx === idx
                          ? "var(--accent-primary)"
                          : "transparent",
                      color: activeScenarioIdx === idx ? "#ffffff" : "var(--text-muted)",
                      boxShadow:
                        activeScenarioIdx === idx
                          ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                          : "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.title.split(". ")[1]}
                  </button>
                ))}
              </div>

              {/* GRAPHICAL ANIMATION STAGE (SVG & DYNAMIC BUCKETS) */}
              <div
                style={{
                  background: "var(--bg-card-muted)",
                  border: "1.5px solid var(--border-main)",
                  borderRadius: "16px",
                  padding: "20px 16px",
                  minHeight: "220px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* PIPELINE STREAM: INCOMING RECORD -> HASH FUNCTION GATE */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: "12px",
                  }}
                >
                  {/* INCOMING RECORD CHIP */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      minWidth: "75px",
                    }}
                  >
                    <div
                      style={{
                        padding: "6px 12px",
                        borderRadius: "10px",
                        background:
                          currentStep.incomingKey !== null
                            ? "var(--accent-primary)"
                            : "var(--bg-card)",
                        border: "1px solid var(--border-main)",
                        color: currentStep.incomingKey !== null ? "#ffffff" : "var(--text-muted)",
                        fontWeight: 900,
                        fontSize: "14px",
                        boxShadow:
                          currentStep.incomingKey !== null
                            ? "0 0 16px rgba(72, 202, 228, 0.6)"
                            : "none",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Database size={13} />
                      <span>{currentStep.incomingKey !== null ? `Key ${currentStep.incomingKey}` : "Ingested"}</span>
                    </div>
                    <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: 700 }}>
                      INCOMING RECORD
                    </span>
                  </div>

                  {/* CONNECTING FLOW ARROW */}
                  <div style={{ display: "flex", alignItems: "center", gap: "2px", opacity: 0.7 }}>
                    <div style={{ width: "20px", height: "2px", background: "var(--accent-primary)" }} />
                    <ArrowRight size={16} color="var(--accent-primary)" />
                  </div>

                  {/* HASH GATE ENGINE */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        padding: "6px 14px",
                        borderRadius: "10px",
                        background: "var(--bg-card)",
                        border: "1.5px solid var(--accent-primary)",
                        color: "var(--accent-primary)",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        fontWeight: 800,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      h(k) = k mod m
                    </div>
                    <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 700 }}>
                      HASH GATE
                    </span>
                  </div>

                  {/* CONNECTING FLOW ARROW */}
                  <div style={{ display: "flex", alignItems: "center", gap: "2px", opacity: 0.7 }}>
                    <div style={{ width: "20px", height: "2px", background: "var(--accent-primary)" }} />
                    <ArrowRight size={16} color="var(--accent-primary)" />
                  </div>

                  {/* COLLISION / STATUS INDICATOR */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      minWidth: "80px",
                    }}
                  >
                    <div
                      style={{
                        padding: "5px 10px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background:
                          currentStep.status === "collision"
                            ? "rgba(239, 68, 68, 0.2)"
                            : currentStep.status === "success"
                            ? "rgba(34, 197, 94, 0.2)"
                            : "rgba(56, 189, 248, 0.15)",
                        color:
                          currentStep.status === "collision"
                            ? "#f87171"
                            : currentStep.status === "success"
                            ? "#4ade80"
                            : "#38bdf8",
                        border:
                          currentStep.status === "collision"
                            ? "1px solid #ef4444"
                            : currentStep.status === "success"
                            ? "1px solid #22c55e"
                            : "1px solid #0284c7",
                      }}
                    >
                      {currentStep.status === "collision" ? (
                        <>
                          <AlertTriangle size={12} />
                          <span>COLLISION</span>
                        </>
                      ) : currentStep.status === "success" ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>RESOLVED</span>
                        </>
                      ) : (
                        <>
                          <Hash size={12} />
                          <span>ROUTING</span>
                        </>
                      )}
                    </div>
                    <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: 700 }}>
                      INDEX STATUS
                    </span>
                  </div>
                </div>

                {/* VISUAL STORAGE BUCKET RACK */}
                <div style={{ marginTop: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "10px",
                      color: "#64748b",
                      fontWeight: 800,
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <span>Storage Buckets in RAM:</span>
                    <span>
                      {currentStep.probeTarget !== null
                        ? `Probing Next Slot → Bucket ${currentStep.probeTarget}`
                        : currentStep.activeBucket !== null
                        ? `Active Target: Bucket ${currentStep.activeBucket}`
                        : "Ready"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${currentStep.table.length}, 1fr)`,
                      gap: "6px",
                    }}
                  >
                    {currentStep.table.map((bucket) => {
                      const isTarget = currentStep.activeBucket === bucket.id;
                      const isProbe = currentStep.probeTarget === bucket.id;
                      const hasCollision = isTarget && currentStep.status === "collision";
                      const isSuccess = isTarget && currentStep.status === "success";

                      return (
                        <div
                          key={bucket.id}
                          style={{
                            background: hasCollision
                              ? "rgba(239, 68, 68, 0.1)"
                              : isSuccess
                              ? "rgba(16, 185, 129, 0.1)"
                              : isProbe
                              ? "rgba(245, 158, 11, 0.1)"
                              : isTarget
                              ? "rgba(37, 99, 235, 0.1)"
                              : "var(--bg-card)",
                            border: hasCollision
                              ? "2px solid var(--accent-danger)"
                              : isSuccess
                              ? "2px solid var(--accent-success)"
                              : isProbe
                              ? "2px dashed var(--accent-warning)"
                              : isTarget
                              ? "2px solid var(--accent-primary)"
                              : "1.5px solid var(--border-main)",
                            borderRadius: "10px",
                            padding: "8px 6px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "5px",
                            minHeight: "65px",
                            transition: "all 0.3s ease",
                            transform: isTarget || isProbe ? "translateY(-3px)" : "none",
                            boxShadow: hasCollision
                              ? "0 0 12px rgba(239, 68, 68, 0.25)"
                              : isSuccess
                              ? "0 0 12px rgba(16, 185, 129, 0.25)"
                              : "none",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 800,
                              color: hasCollision
                                ? "#f87171"
                                : isSuccess
                                ? "#4ade80"
                                : "#94a3b8",
                            }}
                          >
                            {bucket.label || `Bucket ${bucket.id}`}
                          </span>

                          <div
                            style={{
                              display: "flex",
                              gap: "3px",
                              flexWrap: "wrap",
                              justifyContent: "center",
                            }}
                          >
                            {bucket.keys.length === 0 ? (
                              <span style={{ fontSize: "10px", color: "#475569", fontStyle: "italic" }}>
                                [empty]
                              </span>
                            ) : (
                              bucket.keys.map((k, kidx) => (
                                <span
                                  key={kidx}
                                  style={{
                                    padding: "2px 6px",
                                    borderRadius: "5px",
                                    fontSize: "11px",
                                    fontWeight: 900,
                                    background: "var(--accent-primary)",
                                    color: "#ffffff",
                                  }}
                                >
                                  {k}
                                </span>
                              ))
                            )}

                            {/* ANIMATED LINKED CHAIN NODE PREVIEW */}
                            {currentStep.chainNode && isTarget && (
                              <span
                                style={{
                                  padding: "2px 6px",
                                  borderRadius: "5px",
                                  fontSize: "11px",
                                  fontWeight: 900,
                                  background: "#f59e0b",
                                  color: "#000000",
                                  animation: "pulse 1.5s infinite",
                                }}
                              >
                                → [{currentStep.chainNode}]
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* LIVE STEP NARRATOR BANNER */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1.5px solid var(--border-main)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    background:
                      currentStep.status === "collision"
                        ? "var(--accent-danger)"
                        : currentStep.status === "success"
                        ? "var(--accent-success)"
                        : "var(--accent-primary)",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 900,
                    padding: "4px 8px",
                    borderRadius: "6px",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                  }}
                >
                  PHASE {stepIdx + 1}/{scenario.steps.length}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: "13px", color: "var(--text-primary)" }}>
                    {currentStep.title}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                      lineHeight: 1.4,
                    }}
                  >
                    {currentStep.narrative}
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <Link
                to="/simulator"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "var(--accent-primary)",
                  color: "#ffffff",
                  fontWeight: 750,
                  fontSize: "13px",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                <span>Launch Interactive Full Lab Simulator</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO / ROADMAP
          ===================================================== */}
      <section className="home-intro-section">
        <div className="home-section-heading">
          <span>HASHING ROADMAP</span>
          <h2>Follow the structure of hashing</h2>
          <p>
            Start with the basic idea and move through collision handling into
            dynamic hashing. Every algorithm below is directly connected to the
            interactive simulator.
          </p>
        </div>

        {/* MAIN FLOWCHART */}
        <div className="hash-flowchart">
          {/* ROOT */}
          <div className="flow-root">
            <div className="flow-root-icon">
              <Hash size={26} />
            </div>

            <div>
              <span>START</span>
              <h3>Hashing Strategies</h3>
              <p>Choose how collisions and table growth should be handled.</p>
            </div>
          </div>

          <div className="flow-connector vertical">
            <ArrowDown size={22} />
          </div>

          {/* THREE MAIN GROUPS */}
          <div className="flow-groups">
            {algorithmGroups.map((group) => {
              const GroupIcon = group.icon;

              return (
                <div
                  className={`flow-group ${group.className}`}
                  key={group.id}
                >
                  {/* GROUP HEADER */}
                  <div className="flow-group-header">
                    <div className="flow-group-icon">
                      <GroupIcon size={21} strokeWidth={2} />
                    </div>

                    <div>
                      <span>{group.subtitle}</span>
                      <h3>{group.title}</h3>
                    </div>
                  </div>

                  <p className="flow-group-description">{group.description}</p>

                  {/* CONNECTOR */}
                  <div className="flow-group-line">
                    <span />
                  </div>

                  {/* ALGORITHM NODES */}
                  <div className="flow-algorithm-list">
                    {group.algorithms.map((algorithm) => (
                      <AlgorithmNode
                        key={algorithm.id}
                        algorithm={algorithm}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
          ===================================================== */}
      <section className="home-process-section">
        <div className="home-section-heading">
          <span>HOW HASHLAB WORKS</span>
          <h2>From a key to a complete simulation</h2>
          <p>
            The simulator exposes the internal steps instead of hiding them
            behind a black box.
          </p>
        </div>

        <div className="home-process-grid">
          <div className="home-process-card">
            <div className="home-process-number">01</div>
            <Hash size={25} />
            <h3>Hash the key</h3>
            <p>
              A hash function maps the input key to an initial bucket or table
              position.
            </p>
            <code>h(k) = k MOD m</code>
          </div>

          <div className="home-process-card">
            <div className="home-process-number">02</div>
            <Search size={25} />
            <h3>Resolve collisions</h3>
            <p>
              When two keys reach the same position, the selected collision
              strategy determines what happens next.
            </p>
            <code>Chain / Probe / Rehash</code>
          </div>

          <div className="home-process-card">
            <div className="home-process-number">03</div>
            <RefreshCw size={25} />
            <h3>Observe the structure</h3>
            <p>
              Watch buckets, directory growth, load factor, collisions and
              operations change as the simulation runs.
            </p>
            <code>State → Metrics → Activity</code>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURE STRIP
          ===================================================== */}
      <section className="home-feature-strip">
        <div className="home-feature">
          <div className="home-feature-icon">
            <Sparkles size={21} />
          </div>
          <div>
            <strong>Interactive</strong>
            <span>Insert, search and delete keys live.</span>
          </div>
        </div>

        <div className="home-feature">
          <div className="home-feature-icon">
            <GitBranch size={21} />
          </div>
          <div>
            <strong>Visual</strong>
            <span>See buckets and dynamic structures.</span>
          </div>
        </div>

        <div className="home-feature">
          <div className="home-feature-icon">
            <Shield size={21} />
          </div>
          <div>
            <strong>Explainable</strong>
            <span>Follow the hashing calculation and activity.</span>
          </div>
        </div>

        <div className="home-feature">
          <div className="home-feature-icon" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>
            <Gamepad2 size={21} color="#fff" />
          </div>
          <div>
            <strong>Gamified</strong>
            <span>Master Separate Chaining & collisions via games!</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
          ===================================================== */}
      <section className="home-cta">
        <div>
          <span>READY TO EXPERIMENT?</span>
          <h2>Build your own hashing intuition.</h2>
          <p>
            Choose an algorithm to simulate live or jump into the interactive Game Arcade!
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Link to="/simulator" className="home-primary-button">
            Start Simulation
            <ArrowRight size={18} />
          </Link>
          <Link to="/games" className="home-secondary-button" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 10, background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)" }}>
            <Gamepad2 size={18} />
            Play Games
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;