import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap,
  Target,
  Sparkles,
  RotateCcw,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Clock,
  Trophy
} from "lucide-react";
import GameHeaderNav from "../../components/games/GameHeaderNav.jsx";
import ParticleCanvas from "../../components/games/ParticleCanvas.jsx";
import GameCompletionModal from "../../components/games/GameCompletionModal.jsx";
import { sounds } from "../../utils/soundEffects.js";
import {
  hashModulo,
  linearProbe,
  quadraticProbe,
  doubleHashProbe,
  defaultH2,
  computeProbeSequence
} from "../../algorithms/gameEngine.js";
import {
  recordChallengeResult,
  getCurrentGlobalXp
} from "../../utils/gameProgress.js";
import "../../components/games/hashLabGames.css";

const CHALLENGE_LEVELS = [
  {
    id: "level-1",
    levelNumber: 1,
    title: "Level 1: Linear Probing Fundamentals",
    description: "Learn how linear probing advances +1 slot whenever a collision occurs.",
    m: 7,
    strategy: "linear",
    formulaText: "h(k, i) = (k + i) mod 7",
    keysToInsert: [17, 24, 31, 10],
    conceptTag: "Linear Probing"
  },
  {
    id: "level-2",
    levelNumber: 2,
    title: "Level 2: Boundary Wraparound",
    description: "Handle collisions that hit the end of the table and wrap around circularly to slot 0.",
    m: 7,
    strategy: "linear",
    formulaText: "h(k, i) = (k + i) mod 7 with circular wraparound",
    keysToInsert: [6, 13, 20],
    conceptTag: "Linear Wraparound"
  },
  {
    id: "level-3",
    levelNumber: 3,
    title: "Level 3: Quadratic Probing",
    description: "Break primary clusters by jumping in squared intervals: +0, +1², +2² (+4)...",
    m: 7,
    strategy: "quadratic",
    formulaText: "h(k, i) = (k + i²) mod 7",
    keysToInsert: [9, 16, 23],
    conceptTag: "Quadratic Probing"
  },
  {
    id: "level-4",
    levelNumber: 4,
    title: "Level 4: Double Hashing",
    description: "Use a second independent hash function h₂(k) = 5 - (k mod 5) for key-dependent strides.",
    m: 7,
    strategy: "double",
    formulaText: "h(k, i) = (h₁(k) + i × h₂(k)) mod 7, where h₂(k) = 5 - (k mod 5)",
    keysToInsert: [10, 17, 24],
    conceptTag: "Double Hashing"
  }
];

export default function CollisionBusterPage() {
  const navigate = useNavigate();
  const [levelIndex, setLevelIndex] = useState(0);
  const [table, setTable] = useState([]);
  const [keyQueueIndex, setKeyQueueIndex] = useState(0);
  const [currentProbeStep, setCurrentProbeStep] = useState(0);
  const [activeCandidateSlot, setActiveCandidateSlot] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [levelScore, setLevelScore] = useState(100);
  const [levelScores, setLevelScores] = useState({});
  const [levelComplete, setLevelComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [operationLog, setOperationLog] = useState([]);
  const [totalCollisions, setTotalCollisions] = useState(0);
  const [totalProbes, setTotalProbes] = useState(0);
  const [xp, setXp] = useState(getCurrentGlobalXp);

  const particleRef = useRef(null);
  const currentLevel = CHALLENGE_LEVELS[levelIndex] || CHALLENGE_LEVELS[0];
  const keysList = currentLevel.keysToInsert;
  const currentKey = keysList[keyQueueIndex];

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
    const lvl = CHALLENGE_LEVELS[idx] || CHALLENGE_LEVELS[0];
    const initialTable = Array.from({ length: lvl.m }, (_, id) => ({
      id,
      key: null,
      occupied: false,
      history: []
    }));
    setTable(initialTable);
    setKeyQueueIndex(0);
    setCurrentProbeStep(0);
    setActiveCandidateSlot(null);
    setFeedback(null);
    setHintsUsed(0);
    setAttempts(1);
    setLevelScore(100);
    setLevelComplete(false);
    setTotalCollisions(0);
    setTotalProbes(0);
    setOperationLog([
      {
        text: `Level ${lvl.levelNumber} initialized. Table capacity m = ${lvl.m}. Algorithm: ${lvl.strategy.toUpperCase()}.`,
        status: "info"
      }
    ]);
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

  // Calculate the mathematically expected next probe slot
  function calculateExpectedProbeSlot(step) {
    if (currentKey === undefined) return 0;
    if (currentLevel.strategy === "linear") {
      return linearProbe(currentKey, step, currentLevel.m);
    } else if (currentLevel.strategy === "quadratic") {
      return quadraticProbe(currentKey, step, currentLevel.m, 0, 1);
    } else if (currentLevel.strategy === "double") {
      return doubleHashProbe(currentKey, step, currentLevel.m, null, 5);
    }
    return hashModulo(currentKey, currentLevel.m);
  }

  // Check where the home slot is
  const homeSlot = currentKey !== undefined ? hashModulo(currentKey, currentLevel.m) : null;
  const currentExpectedSlot = currentKey !== undefined ? calculateExpectedProbeSlot(currentProbeStep) : null;

  // Handle player clicking a bucket to place or probe
  function handleSelectBucket(bucketIndex) {
    if (levelComplete || currentKey === undefined) return;

    sounds.playClick();
    setTotalProbes((prev) => prev + 1);

    const expectedSlot = calculateExpectedProbeSlot(currentProbeStep);

    if (bucketIndex !== expectedSlot) {
      // Wrong bucket selected
      sounds.playError();
      setAttempts((prev) => prev + 1);
      setLevelScore((prev) => Math.max(20, prev - 15));

      let explanation = "";
      if (currentProbeStep === 0) {
        explanation = `Incorrect bucket! Key ${currentKey}'s home hash is h(${currentKey}) = ${currentKey} mod ${currentLevel.m} = ${homeSlot}. You selected Bucket ${bucketIndex}.`;
      } else if (currentLevel.strategy === "linear") {
        explanation = `Linear probing requires checking the next sequential slot: (${homeSlot} + ${currentProbeStep}) mod ${currentLevel.m} = ${expectedSlot}. You selected Bucket ${bucketIndex}.`;
      } else if (currentLevel.strategy === "quadratic") {
        explanation = `Quadratic probing jumps by i²: (${homeSlot} + ${currentProbeStep}²) mod ${currentLevel.m} = (${homeSlot} + ${currentProbeStep * currentProbeStep}) mod ${currentLevel.m} = ${expectedSlot}.`;
      } else if (currentLevel.strategy === "double") {
        const h2 = defaultH2(currentKey, 5);
        explanation = `Double hashing stride is h₂(${currentKey}) = 5 - (${currentKey} mod 5) = ${h2}. Step ${currentProbeStep}: (${homeSlot} + ${currentProbeStep} × ${h2}) mod ${currentLevel.m} = ${expectedSlot}.`;
      }

      setFeedback({
        type: "error",
        message: explanation
      });
      return;
    }

    // Correct bucket selected according to the formula!
    const targetBucket = table[bucketIndex];
    if (targetBucket.occupied) {
      // Collision occurred!
      sounds.playWhoosh();
      setTotalCollisions((prev) => prev + 1);
      setOperationLog((prev) => [
        {
          text: `Probe #${currentProbeStep}: Inspected Bucket ${bucketIndex} for Key ${currentKey} → COLLISION! Bucket occupied by Key ${targetBucket.key}.`,
          status: "collision"
        },
        ...prev
      ]);
      setFeedback({
        type: "collision",
        message: `Collision at Bucket ${bucketIndex}! Key ${targetBucket.key} already occupies this slot. Advance probe step (i = ${currentProbeStep + 1}) to find an open slot.`
      });
      setCurrentProbeStep((prev) => prev + 1);
    } else {
      // Vacant slot found! Insert key!
      sounds.playSuccess();
      const updatedTable = [...table];
      updatedTable[bucketIndex] = {
        ...targetBucket,
        key: currentKey,
        occupied: true,
        placedAtStep: currentProbeStep
      };
      setTable(updatedTable);

      setOperationLog((prev) => [
        {
          text: `Success! Key ${currentKey} placed into vacant Bucket ${bucketIndex} on probe #${currentProbeStep}.`,
          status: "success"
        },
        ...prev
      ]);

      const nextQueueIndex = keyQueueIndex + 1;
      if (nextQueueIndex >= keysList.length) {
        // Level Finished!
        sounds.playCelebration();
        if (particleRef.current) particleRef.current.celebration();
        setLevelComplete(true);

        const nextScores = { ...levelScores, [levelIndex]: levelScore };
        setLevelScores(nextScores);

        const isLastLevel = levelIndex >= CHALLENGE_LEVELS.length - 1;

        const result = recordChallengeResult({
          gameId: "collision-buster",
          challengeId: currentLevel.id,
          score: levelScore,
          baseXp: 50,
          hintsUsed,
          attempts,
          totalStagesInGame: CHALLENGE_LEVELS.length,
          conceptTag: currentLevel.conceptTag
        });

        setXp(getCurrentGlobalXp());

        if (isLastLevel) {
          setIsTimerRunning(false);
          setFeedback({
            type: "complete",
            message: `ALL 4 LEVELS COMPLETE! Final score calculated. Generating mission debrief...`
          });
          setTimeout(() => {
            setIsGameOver(true);
          }, 800);
        } else {
          setFeedback({
            type: "complete",
            message: `Level ${currentLevel.levelNumber} Complete! All keys successfully inserted without overwriting. ${
              result.isFirstTime ? `+${result.xpAwarded} XP awarded!` : "Replay verified."
            }`
          });
        }
      } else {
        // Next key in sequence
        setKeyQueueIndex(nextQueueIndex);
        setCurrentProbeStep(0);
        setFeedback({
          type: "success",
          message: `Key ${currentKey} inserted into Bucket ${bucketIndex}! Next up: Key ${keysList[nextQueueIndex]}.`
        });
      }
    }
  }

  function handleUseHint() {
    if (levelComplete || currentKey === undefined) return;
    sounds.playClick();
    setHintsUsed((prev) => prev + 1);
    setLevelScore((prev) => Math.max(10, prev - 15));

    const expectedSlot = calculateExpectedProbeSlot(currentProbeStep);
    let hintText = "";
    if (currentProbeStep === 0) {
      hintText = `Hint: The home hash is h(${currentKey}) = ${currentKey} mod ${currentLevel.m} = ${expectedSlot}. Click Bucket [${expectedSlot}]!`;
    } else {
      hintText = `Hint: For step ${currentProbeStep}, formula calculates Bucket [${expectedSlot}]. Click Bucket [${expectedSlot}]!`;
    }

    setFeedback({
      type: "info",
      message: hintText
    });
    setActiveCandidateSlot(expectedSlot);
  }

  return (
    <div className="hl-games-page">
      <ParticleCanvas ref={particleRef} />

      <GameHeaderNav
        gameTitle="Collision Buster"
        xp={xp}
        onReset={() => initLevel(levelIndex)}
        onCelebrate={() => {
          if (particleRef.current) particleRef.current.celebration();
        }}
        extraBadge={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb" }}>
              LEVEL {currentLevel.levelNumber} / {CHALLENGE_LEVELS.length}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "5px" }}>
              <Clock size={13} color="#2563eb" /> {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")}
            </span>
          </div>
        }
      />

      <div className="hl-games-container" style={{ marginTop: "24px" }}>
        {/* Level Selector Tabs */}
        <div className="hl-btn-row" style={{ marginBottom: "20px" }}>
          {CHALLENGE_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              className={`hl-filter-pill ${idx === levelIndex ? "active" : ""}`}
              onClick={() => {
                sounds.playClick();
                setLevelIndex(idx);
              }}
            >
              Level {lvl.levelNumber}: {lvl.strategy.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Level Header Banner */}
        <div className="hl-panel" style={{ marginBottom: "24px" }}>
          <div className="hl-panel-header">
            <div>
              <h2 className="hl-panel-title">
                <Zap size={22} color="#2563eb" />
                {currentLevel.title}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
                {currentLevel.description}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="hl-card-pill pill-difficulty-intermediate">
                {currentLevel.strategy.toUpperCase()} PROBING
              </span>
              <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "6px" }}>
                Formula: {currentLevel.formulaText}
              </div>
            </div>
          </div>

          {/* Current Insertion Target HUD */}
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
              gap: "16px"
            }}
          >
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Current Key to Insert
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                {currentKey !== undefined ? (
                  <>
                    <span className="hl-key-token" style={{ fontSize: "1.4rem", padding: "8px 16px" }}>
                      {currentKey}
                    </span>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                      Home Bucket: <strong>h({currentKey}) = {homeSlot}</strong> (Current Probe Step i = <strong>{currentProbeStep}</strong>)
                    </span>
                  </>
                ) : (
                  <span style={{ color: "#10b981", fontWeight: 700 }}>
                    ✓ All keys inserted!
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ textAlign: "center", padding: "0 10px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>COLLISIONS</span>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ef4444", fontFamily: "monospace" }}>
                  {totalCollisions}
                </div>
              </div>
              <div style={{ textAlign: "center", padding: "0 10px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>PROBES</span>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#2563eb", fontFamily: "monospace" }}>
                  {totalProbes}
                </div>
              </div>
              <div style={{ textAlign: "center", padding: "0 10px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>SCORE</span>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#10b981", fontFamily: "monospace" }}>
                  {levelScore}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interactive Hash Table Grid */}
        <div className="hl-workspace-grid">
          <div className="hl-panel">
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={18} color="#2563eb" />
              Interactive Hash Table (Capacity m = {currentLevel.m})
            </h3>
            <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginBottom: "16px" }}>
              Click the correct bucket according to the probe formula. If occupied, collision is triggered and you must probe the next step.
            </p>

            <div className="hl-bucket-rack">
              {table.map((bucket) => {
                const isCandidate = activeCandidateSlot === bucket.id;
                const isOccupied = bucket.occupied;

                let cellClass = "hl-bucket-cell";
                if (isCandidate) cellClass += " target-candidate";
                if (isOccupied) cellClass += " success-placed";

                return (
                  <button
                    key={bucket.id}
                    type="button"
                    className={cellClass}
                    onClick={() => handleSelectBucket(bucket.id)}
                    aria-label={`Bucket ${bucket.id}: ${isOccupied ? `Occupied by ${bucket.key}` : "Empty"}`}
                  >
                    <span className="hl-bucket-index-tag">Bucket [{bucket.id}]</span>
                    <div className="hl-bucket-content">
                      {isOccupied ? (
                        <span className="hl-key-token">{bucket.key}</span>
                      ) : (
                        <span className="hl-empty-bucket-label">EMPTY</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Feedback Box */}
            {feedback && (
              <div className={`hl-feedback-card ${feedback.type === "complete" || feedback.type === "success" ? "correct" : feedback.type === "error" || feedback.type === "collision" ? "incorrect" : "info"}`}>
                {feedback.type === "complete" || feedback.type === "success" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <AlertTriangle size={20} />
                )}
                <div style={{ fontSize: "0.92rem", lineHeight: "1.4" }}>
                  {feedback.message}
                </div>
              </div>
            )}

            {/* Controls Row */}
            <div className="hl-btn-row" style={{ marginTop: "24px", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="hl-action-btn btn-secondary"
                  onClick={handleUseHint}
                  disabled={levelComplete || currentKey === undefined}
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
                  <span>Restart Level</span>
                </button>
              </div>

              {levelComplete && levelIndex < CHALLENGE_LEVELS.length - 1 && (
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

              {levelComplete && levelIndex === CHALLENGE_LEVELS.length - 1 && (
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

          {/* Right Column: Key Insertion Queue & Operation Log */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Keys Queue Panel */}
            <div className="hl-panel">
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Target size={16} color="#2563eb" />
                Insertion Queue
              </h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {keysList.map((k, idx) => {
                  const isDone = idx < keyQueueIndex;
                  const isCurrent = idx === keyQueueIndex;
                  return (
                    <div
                      key={k}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "var(--radius-sm)",
                        background: isDone
                          ? "rgba(16, 185, 129, 0.15)"
                          : isCurrent
                          ? "var(--accent-primary)"
                          : "var(--bg-card-muted)",
                        color: isCurrent ? "#ffffff" : isDone ? "#10b981" : "var(--text-muted)",
                        fontWeight: 700,
                        fontFamily: "monospace",
                        border: isCurrent ? "2px solid #38bdf8" : "1px solid var(--border-main)",
                        fontSize: "0.95rem"
                      }}
                    >
                      {k} {isDone ? "✓" : ""}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operation Log */}
            <div className="hl-panel" style={{ flex: 1 }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Cpu size={16} color="#2563eb" />
                Real-Time Probing Log
              </h4>
              <div className="hl-log-container">
                {operationLog.map((log, i) => (
                  <div key={i} className={`hl-log-row ${log.status === "collision" ? "status-collision" : log.status === "success" ? "status-success" : ""}`}>
                    <span>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Game Completion Victory Modal */}
      <GameCompletionModal
        isOpen={isGameOver}
        gameTitle="Collision Buster"
        score={Object.values(levelScores).reduce((a, b) => a + b, 0)}
        maxScore={CHALLENGE_LEVELS.length * 100}
        elapsedSeconds={elapsedSeconds}
        xpAwarded={200}
        stats={[
          { label: "Levels Cleared", value: "4 / 4", color: "#10b981" },
          { label: "Total Probes", value: totalProbes, color: "#2563eb" },
          { label: "Total Collisions", value: totalCollisions, color: "#f59e0b" }
        ]}
        onRestart={handleRestartFullGame}
        onExit={() => navigate("/games")}
      />
    </div>
  );
}
