import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RefreshCw,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Sparkles,
  RotateCcw,
  HelpCircle,
  TrendingDown,
  Info,
  Clock,
  Trophy
} from "lucide-react";
import GameHeaderNav from "../../components/games/GameHeaderNav.jsx";
import ParticleCanvas from "../../components/games/ParticleCanvas.jsx";
import GameCompletionModal from "../../components/games/GameCompletionModal.jsx";
import { sounds } from "../../utils/soundEffects.js";
import {
  hashModulo,
  calculateLoadFactor,
  simulateRehash
} from "../../algorithms/gameEngine.js";
import {
  recordChallengeResult,
  getCurrentGlobalXp
} from "../../utils/gameProgress.js";
import "../../components/games/hashLabGames.css";

const REHASH_LEVELS = [
  {
    id: "level-1",
    levelNumber: 1,
    title: "Level 1: The Critical 0.70 Threshold",
    oldCapacity: 5,
    threshold: 0.70,
    keys: [12, 22, 32, 7],
    // 4 / 5 = 0.80 > 0.70
    primeCandidates: [8, 10, 11, 15],
    correctNewCapacity: 11,
    conceptTag: "Load Factor & Rehashing"
  },
  {
    id: "level-2",
    levelNumber: 2,
    title: "Level 2: The Multiples of Seven Overflow",
    oldCapacity: 7,
    threshold: 0.70,
    keys: [14, 21, 28, 35, 42],
    // 5 / 7 = 0.714 > 0.70
    primeCandidates: [12, 14, 17, 21],
    correctNewCapacity: 17,
    conceptTag: "Prime Resizing"
  },
  {
    id: "level-3",
    levelNumber: 3,
    title: "Level 3: Open Addressing Redistribution",
    oldCapacity: 7,
    threshold: 0.70,
    keys: [10, 17, 24, 31, 38],
    // 5 / 7 = 0.714
    primeCandidates: [11, 13, 15, 19],
    correctNewCapacity: 13,
    conceptTag: "Collision Mitigation"
  }
];

export default function RehashRescuePage() {
  const navigate = useNavigate();
  const [levelIndex, setLevelIndex] = useState(0);
  // Game phases: "analyze" -> "select_capacity" -> "reinsert" -> "complete"
  const [phase, setPhase] = useState("analyze");
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [newTable, setNewTable] = useState([]);
  const [reinsertedKeys, setReinsertedKeys] = useState({});
  const [activeKeyToRehash, setActiveKeyToRehash] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [score, setScore] = useState(100);
  const [levelScores, setLevelScores] = useState({});
  const [isGameOver, setIsGameOver] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [xp, setXp] = useState(getCurrentGlobalXp);

  const particleRef = useRef(null);
  const currentLevel = REHASH_LEVELS[levelIndex] || REHASH_LEVELS[0];

  const currentLoadFactor = calculateLoadFactor(currentLevel.keys.length, currentLevel.oldCapacity);
  const isOverThreshold = currentLoadFactor >= currentLevel.threshold;

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isGameOver) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isGameOver]);

  // Initialize level
  useEffect(() => {
    initLevel(levelIndex);
  }, [levelIndex]);

  function initLevel(idx) {
    const lvl = REHASH_LEVELS[idx] || REHASH_LEVELS[0];
    setPhase("analyze");
    setSelectedCapacity(null);
    setNewTable([]);
    setReinsertedKeys({});
    setActiveKeyToRehash(null);
    setFeedback(null);
    setHintsUsed(0);
    setAttempts(1);
    setScore(100);
  }

  function handleRestartFullGame() {
    sounds.playClick();
    setIsGameOver(false);
    setLevelIndex(0);
    setLevelScores({});
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    initLevel(0);
  }

  // Old table state: where keys were placed under old capacity
  const oldTable = Array.from({ length: currentLevel.oldCapacity }, (_, id) => ({
    id,
    keys: currentLevel.keys.filter((k) => hashModulo(k, currentLevel.oldCapacity) === id)
  }));

  // Step 1: Confirm resizing is needed
  function handleConfirmResize(userDecision) {
    sounds.playClick();
    if (userDecision === isOverThreshold) {
      sounds.playSuccess();
      setFeedback({
        type: "success",
        message: `Correct! Current load factor α = ${currentLevel.keys.length}/${currentLevel.oldCapacity} = ${(
          currentLoadFactor * 100
        ).toFixed(1)}%, which exceeds the ${currentLevel.threshold * 100}% threshold. Resizing is required!`
      });
      setPhase("select_capacity");
    } else {
      sounds.playError();
      setAttempts((prev) => prev + 1);
      setScore((prev) => Math.max(20, prev - 15));
      setFeedback({
        type: "error",
        message: `Incorrect! Calculate α = stored keys / table capacity = ${currentLevel.keys.length} / ${
          currentLevel.oldCapacity
        } = ${currentLoadFactor.toFixed(2)}. Since ${currentLoadFactor.toFixed(2)} ≥ ${currentLevel.threshold.toFixed(
          2
        )}, table resizing is triggered.`
      });
    }
  }

  // Step 2: Choose new capacity
  function handleSelectCapacity(cap) {
    sounds.playClick();
    setSelectedCapacity(cap);

    if (cap === currentLevel.correctNewCapacity) {
      sounds.playSuccess();
      const initializedNewTable = Array.from({ length: cap }, (_, id) => ({
        id,
        key: null,
        occupied: false
      }));
      setNewTable(initializedNewTable);
      setActiveKeyToRehash(currentLevel.keys[0]);
      setFeedback({
        type: "success",
        message: `Excellent choice! Capacity ${cap} is prime, reducing shared divisors and clustering. Now re-hash each existing key into the new table using h(k) = k mod ${cap}.`
      });
      setPhase("reinsert");
    } else {
      sounds.playError();
      setAttempts((prev) => prev + 1);
      setScore((prev) => Math.max(20, prev - 15));
      setFeedback({
        type: "error",
        message: `Suboptimal choice. In DBMS hashing, expanding to a prime number larger than 2× the old capacity (such as ${currentLevel.correctNewCapacity}) prevents secondary clustering.`
      });
    }
  }

  // Step 3: Player clicks a bucket in the new table to place active key
  function handleReinsertKeyToBucket(bucketId) {
    if (!activeKeyToRehash || phase !== "reinsert") return;

    sounds.playClick();
    const expectedBucket = hashModulo(activeKeyToRehash, selectedCapacity);

    // Prevent simply copying keys to their old positions
    const oldPosition = hashModulo(activeKeyToRehash, currentLevel.oldCapacity);
    if (bucketId === oldPosition && expectedBucket !== oldPosition) {
      sounds.playError();
      setAttempts((prev) => prev + 1);
      setScore((prev) => Math.max(10, prev - 15));
      setFeedback({
        type: "error",
        message: `Mistake: You clicked Bucket ${bucketId}, which was its OLD position! When capacity changes to ${selectedCapacity}, keys MUST be re-hashed using h(k) = k mod ${selectedCapacity}. Key ${activeKeyToRehash} cannot stay in its old slot.`
      });
      return;
    }

    if (bucketId !== expectedBucket) {
      sounds.playError();
      setAttempts((prev) => prev + 1);
      setScore((prev) => Math.max(10, prev - 15));
      setFeedback({
        type: "error",
        message: `Incorrect bucket! New hash formula is h(${activeKeyToRehash}) = ${activeKeyToRehash} mod ${selectedCapacity} = ${expectedBucket}. You selected Bucket ${bucketId}.`
      });
      return;
    }

    // Correct placement in new table!
    sounds.playSuccess();
    const updatedTable = [...newTable];
    updatedTable[bucketId] = {
      id: bucketId,
      key: activeKeyToRehash,
      occupied: true
    };
    setNewTable(updatedTable);

    const updatedMapping = { ...reinsertedKeys, [activeKeyToRehash]: bucketId };
    setReinsertedKeys(updatedMapping);

    // Check next key to rehash
    const remainingKeys = currentLevel.keys.filter((k) => updatedMapping[k] === undefined);

    if (remainingKeys.length === 0) {
      // All keys reinserted!
      sounds.playCelebration();
      if (particleRef.current) particleRef.current.celebration();
      setPhase("complete");

      const nextScores = { ...levelScores, [levelIndex]: score };
      setLevelScores(nextScores);

      const isLastLevel = levelIndex >= REHASH_LEVELS.length - 1;

      const persistRes = recordChallengeResult({
        gameId: "rehash-rescue",
        challengeId: currentLevel.id,
        score,
        baseXp: 50,
        hintsUsed,
        attempts,
        totalStagesInGame: REHASH_LEVELS.length,
        conceptTag: currentLevel.conceptTag
      });

      setXp(getCurrentGlobalXp());

      if (isLastLevel) {
        setIsTimerRunning(false);
        setFeedback({
          type: "success",
          message: `ALL LEVELS RESCUED! Saturated tables cooled down to optimal load factor. Generating final report...`
        });
        setTimeout(() => {
          setIsGameOver(true);
        }, 800);
      } else {
        setFeedback({
          type: "success",
          message: `Level ${currentLevel.levelNumber} Rescued! All ${currentLevel.keys.length} keys safely preserved in the new table (m = ${selectedCapacity}). Load factor reduced to ${(
            (currentLevel.keys.length / selectedCapacity) *
            100
          ).toFixed(1)}%! ${persistRes.isFirstTime ? `+${persistRes.xpAwarded} XP earned!` : "Replay verified."}`
        });
      }
    } else {
      setActiveKeyToRehash(remainingKeys[0]);
      setFeedback({
        type: "info",
        message: `Key ${activeKeyToRehash} successfully placed into Bucket ${bucketId}! Next: Re-hash Key ${remainingKeys[0]}.`
      });
    }
  }

  function handleHint() {
    if (phase === "complete") return;
    sounds.playClick();
    setHintsUsed((prev) => prev + 1);
    setScore((prev) => Math.max(10, prev - 15));

    if (phase === "analyze") {
      setFeedback({
        type: "info",
        message: `Hint: Stored keys = ${currentLevel.keys.length}, Capacity = ${currentLevel.oldCapacity}. α = ${currentLevel.keys.length} / ${currentLevel.oldCapacity} = ${(
          currentLevel.keys.length / currentLevel.oldCapacity
        ).toFixed(2)}. Since ${(currentLevel.keys.length / currentLevel.oldCapacity).toFixed(2)} ≥ ${
          currentLevel.threshold
        }, click YES.`
      });
    } else if (phase === "select_capacity") {
      setFeedback({
        type: "info",
        message: `Hint: Select the prime number capacity (${currentLevel.correctNewCapacity}) to ensure a well-distributed hash index.`
      });
    } else if (phase === "reinsert" && activeKeyToRehash) {
      const exp = hashModulo(activeKeyToRehash, selectedCapacity);
      setFeedback({
        type: "info",
        message: `Hint: Calculate ${activeKeyToRehash} mod ${selectedCapacity} = ${exp}. Click Bucket [${exp}] in the new table.`
      });
    }
  }

  return (
    <div className="hl-games-page">
      <ParticleCanvas ref={particleRef} />

      <GameHeaderNav
        gameTitle="Rehash Rescue"
        xp={xp}
        onReset={() => initLevel(levelIndex)}
        onCelebrate={() => {
          if (particleRef.current) particleRef.current.celebration();
        }}
        extraBadge={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#10b981" }}>
              LEVEL {currentLevel.levelNumber} / {REHASH_LEVELS.length}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "5px" }}>
              <Clock size={13} color="#10b981" /> {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")}
            </span>
          </div>
        }
      />

      <div className="hl-games-container" style={{ marginTop: "24px" }}>
        {/* Level Selector Tabs */}
        <div className="hl-btn-row" style={{ marginBottom: "20px" }}>
          {REHASH_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              className={`hl-filter-pill ${idx === levelIndex ? "active" : ""}`}
              onClick={() => {
                sounds.playClick();
                setLevelIndex(idx);
              }}
            >
              Level {lvl.levelNumber}: {lvl.title.split(":")[1] || lvl.title}
            </button>
          ))}
        </div>

        {/* Level Status & Load Factor Header */}
        <div className="hl-panel" style={{ marginBottom: "24px" }}>
          <div className="hl-panel-header">
            <div>
              <h2 className="hl-panel-title">
                <RefreshCw size={22} color="#10b981" />
                {currentLevel.title}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
                Detect saturation thresholds, expand the table to a prime capacity, and re-hash keys without losing data!
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="hl-card-pill pill-difficulty-intermediate">
                THRESHOLD: {currentLevel.threshold * 100}%
              </span>
              <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "6px" }}>
                Old Capacity: {currentLevel.oldCapacity} | Keys: [{currentLevel.keys.join(", ")}]
              </div>
            </div>
          </div>

          {/* Live Load Factor Gauge Banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-card-muted)",
              padding: "16px 20px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-main)",
              flexWrap: "wrap",
              gap: "20px"
            }}
          >
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Live Load Factor (α = n / m)
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                <span
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    fontFamily: "monospace",
                    color: isOverThreshold ? "#ef4444" : "#10b981"
                  }}
                >
                  {(currentLoadFactor * 100).toFixed(1)}%
                </span>
                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  ({currentLevel.keys.length} keys in {currentLevel.oldCapacity} buckets)
                </span>
                {isOverThreshold && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#ef4444",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: 700
                    }}
                  >
                    <AlertOctagon size={14} /> CRITICAL SATURATION
                  </span>
                )}
              </div>
            </div>

            {/* Stage Progress Pills */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  background: phase === "analyze" ? "var(--accent-primary)" : "var(--bg-card)",
                  color: phase === "analyze" ? "#fff" : "var(--text-muted)",
                  border: "1px solid var(--border-main)"
                }}
              >
                1. Detect Saturation
              </span>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  background: phase === "select_capacity" ? "var(--accent-primary)" : "var(--bg-card)",
                  color: phase === "select_capacity" ? "#fff" : "var(--text-muted)",
                  border: "1px solid var(--border-main)"
                }}
              >
                2. Select Capacity
              </span>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  background: phase === "reinsert" || phase === "complete" ? "var(--accent-primary)" : "var(--bg-card)",
                  color: phase === "reinsert" || phase === "complete" ? "#fff" : "var(--text-muted)",
                  border: "1px solid var(--border-main)"
                }}
              >
                3. Re-Hash Keys
              </span>
            </div>
          </div>
        </div>

        {/* Phase 1: Saturation Analysis Question */}
        {phase === "analyze" && (
          <div className="hl-panel" style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
              Decision Step: Does this hash table require resizing?
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "16px" }}>
              The system resize threshold is set to <strong>{(currentLevel.threshold * 100).toFixed(0)}%</strong>. Inspect the table below and determine if rehashing is triggered.
            </p>

            <div className="hl-btn-row">
              <button
                type="button"
                className="hl-action-btn btn-primary"
                onClick={() => handleConfirmResize(true)}
              >
                <CheckCircle2 size={18} />
                <span>YES — Trigger Rehashing (α ≥ {(currentLevel.threshold * 100).toFixed(0)}%)</span>
              </button>
              <button
                type="button"
                className="hl-action-btn btn-secondary"
                onClick={() => handleConfirmResize(false)}
              >
                <span>NO — Table Is Stable</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Capacity Selection */}
        {phase === "select_capacity" && (
          <div className="hl-panel" style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
              Capacity Selection: Choose the optimal new table capacity
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "16px" }}>
              In DBMS hash indexes, expanding to a prime number larger than 2× the old capacity ({currentLevel.oldCapacity}) minimizes collision clusters.
            </p>

            <div className="hl-btn-row">
              {currentLevel.primeCandidates.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  className="hl-action-btn btn-secondary"
                  style={{ fontSize: "1.1rem", padding: "12px 24px", fontFamily: "monospace" }}
                  onClick={() => handleSelectCapacity(cap)}
                >
                  Capacity m = {cap}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Side-by-Side Table Comparison */}
        <div className="hl-workspace-grid">
          {/* Left: New Resized Table (when in reinsert or complete phase) */}
          <div className="hl-panel">
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={18} color="#10b981" />
              {selectedCapacity ? `New Hash Table (m = ${selectedCapacity})` : "Old Saturated Table (m = " + currentLevel.oldCapacity + ")"}
            </h3>

            {phase === "reinsert" && activeKeyToRehash && (
              <div
                style={{
                  background: "rgba(37, 99, 235, 0.1)",
                  border: "1px solid rgba(37, 99, 235, 0.3)",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Active Key to Re-Hash:
                  </span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "monospace", color: "#2563eb" }}>
                    Key {activeKeyToRehash}
                  </div>
                </div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Click Bucket in New Table: <strong>h({activeKeyToRehash}) = {activeKeyToRehash} mod {selectedCapacity}</strong>
                </div>
              </div>
            )}

            {/* Display Active Table */}
            {selectedCapacity && newTable.length > 0 ? (
              <div className="hl-bucket-rack">
                {newTable.map((bucket) => (
                  <button
                    key={bucket.id}
                    type="button"
                    className={`hl-bucket-cell ${bucket.occupied ? "success-placed" : ""}`}
                    onClick={() => handleReinsertKeyToBucket(bucket.id)}
                    disabled={phase !== "reinsert"}
                    aria-label={`New Bucket ${bucket.id}: ${bucket.occupied ? `Occupied by ${bucket.key}` : "Empty"}`}
                  >
                    <span className="hl-bucket-index-tag">Bucket [{bucket.id}]</span>
                    <div className="hl-bucket-content">
                      {bucket.occupied ? (
                        <span className="hl-key-token">{bucket.key}</span>
                      ) : (
                        <span className="hl-empty-bucket-label">EMPTY</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="hl-bucket-rack">
                {oldTable.map((bucket) => (
                  <div key={bucket.id} className="hl-bucket-cell" style={{ cursor: "default" }}>
                    <span className="hl-bucket-index-tag">Bucket [{bucket.id}]</span>
                    <div className="hl-bucket-content">
                      {bucket.keys.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {bucket.keys.map((k) => (
                            <span key={k} className="hl-key-token secondary-token" style={{ fontSize: "0.85rem", padding: "2px 8px" }}>
                              {k}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="hl-empty-bucket-label">EMPTY</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Feedback Banner */}
            {feedback && (
              <div className={`hl-feedback-card ${feedback.type === "success" ? "correct" : feedback.type === "error" ? "incorrect" : "info"}`}>
                {feedback.type === "success" ? <CheckCircle2 size={20} /> : <Info size={20} />}
                <div style={{ fontSize: "0.92rem", lineHeight: "1.4" }}>{feedback.message}</div>
              </div>
            )}

            {/* Controls Row */}
            <div className="hl-btn-row" style={{ marginTop: "24px", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="hl-action-btn btn-secondary"
                  onClick={handleHint}
                  disabled={phase === "complete"}
                >
                  <HelpCircle size={16} />
                  <span>Get Hint ({hintsUsed})</span>
                </button>
                <button
                  type="button"
                  className="hl-action-btn btn-secondary"
                  onClick={() => initLevel(levelIndex)}
                >
                  <RotateCcw size={16} />
                  <span>Restart Challenge</span>
                </button>
              </div>

              {phase === "complete" && levelIndex < REHASH_LEVELS.length - 1 && (
                <button
                  type="button"
                  className="hl-action-btn btn-primary"
                  onClick={() => {
                    sounds.playClick();
                    setLevelIndex((prev) => prev + 1);
                  }}
                >
                  <span>Next Level</span>
                  <ArrowRight size={16} />
                </button>
              )}

              {phase === "complete" && levelIndex === REHASH_LEVELS.length - 1 && (
                <button
                  type="button"
                  className="hl-action-btn btn-success"
                  onClick={() => {
                    sounds.playCelebration();
                    setIsGameOver(true);
                  }}
                >
                  <Trophy size={16} />
                  <span>View Final Score & Results</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Old vs New Comparison Metrics */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="hl-panel">
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <TrendingDown size={16} color="#10b981" />
                Before vs After Metrics
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-main)", paddingBottom: "8px", fontSize: "0.88rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Old Table Capacity:</span>
                  <strong>{currentLevel.oldCapacity}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-main)", paddingBottom: "8px", fontSize: "0.88rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Old Load Factor (α):</span>
                  <strong style={{ color: "#ef4444" }}>{(currentLoadFactor * 100).toFixed(1)}%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-main)", paddingBottom: "8px", fontSize: "0.88rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>New Capacity (Target):</span>
                  <strong style={{ color: "#10b981" }}>{selectedCapacity || "Pending selection"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", fontSize: "0.88rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>New Load Factor (α):</span>
                  <strong style={{ color: selectedCapacity ? "#10b981" : "var(--text-muted)" }}>
                    {selectedCapacity
                      ? `${((currentLevel.keys.length / selectedCapacity) * 100).toFixed(1)}%`
                      : "Pending"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="hl-panel" style={{ flex: 1 }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Info size={16} color="#2563eb" />
                Educational Takeaway
              </h4>
              <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                Resizing does not copy keys into their old array positions! When capacity changes from m to m', every key k must be re-evaluated as <strong>h(k) = k mod m'</strong>.
              </p>
              <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: "1.5", marginTop: "10px" }}>
                Resizing does not blindly guarantee zero collisions; rather, it lowers the overall density (load factor) so probe sequences remain short and O(1) on average.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Game Completion Victory Modal */}
      <GameCompletionModal
        isOpen={isGameOver}
        gameTitle="Rehash Rescue"
        score={Object.values(levelScores).reduce((a, b) => a + b, 0)}
        maxScore={REHASH_LEVELS.length * 100}
        elapsedSeconds={elapsedSeconds}
        xpAwarded={150}
        stats={[
          { label: "Tables Resized", value: "3 / 3", color: "#10b981" },
          { label: "Critical Load Factor", value: "Stabilized", color: "#2563eb" },
          { label: "Prime Tables", value: "100% Verified", color: "#f59e0b" }
        ]}
        onRestart={handleRestartFullGame}
        onExit={() => navigate("/games")}
      />
    </div>
  );
}
