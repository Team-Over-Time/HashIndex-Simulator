import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Play,
  Layers,
  Fingerprint,
  Clock,
  Trophy
} from "lucide-react";
import GameHeaderNav from "../../components/games/GameHeaderNav.jsx";
import ParticleCanvas from "../../components/games/ParticleCanvas.jsx";
import GameCompletionModal from "../../components/games/GameCompletionModal.jsx";
import { sounds } from "../../utils/soundEffects.js";
import {
  evaluateDetectiveHypothesis
} from "../../algorithms/gameEngine.js";
import {
  recordChallengeResult,
  getCurrentGlobalXp
} from "../../utils/gameProgress.js";
import "../../components/games/hashLabGames.css";

const DETECTIVE_CASES = [
  {
    id: "case-1",
    caseNumber: 1,
    title: "CASE #101: The Straight-Line Cluster",
    difficulty: "Beginner",
    m: 7,
    keys: [8, 15, 22, 29],
    hashFormula: "h₁(k) = k mod 7 (All keys yield home hash = 1)",
    tableSnapshot: [
      { id: 0, key: null, occupied: false },
      { id: 1, key: 8, occupied: true },
      { id: 2, key: 15, occupied: true },
      { id: 3, key: 22, occupied: true },
      { id: 4, key: 29, occupied: true },
      { id: 5, key: null, occupied: false },
      { id: 6, key: null, occupied: false }
    ],
    clue1: "Look closely at Slots [1, 2, 3, 4]. Every collided key moved exactly +1 slot into the next adjacent cell.",
    clue2: "Which collision strategy always increments the probe index by a constant step size of 1?",
    timelineSteps: [
      { step: 0, text: "Initial empty table of capacity 7." },
      { step: 1, text: "Key 8 hashes to (8 % 7) = 1. Placed in Bucket 1." },
      { step: 2, text: "Key 15 hashes to 1. Collides with 8! Steps +1 into Bucket 2." },
      { step: 3, text: "Key 22 hashes to 1. Collides with 8 and 15! Steps +1 into Bucket 3." },
      { step: 4, text: "Key 29 hashes to 1. Collides with 8, 15, and 22! Steps +1 into Bucket 4." }
    ],
    actualAlgorithm: "linear",
    explanations: {
      linear: "CORRECT! Linear probing steps sequentially (+1) through adjacent slots, forming this continuous primary cluster.",
      quadratic: "INCORRECT! Quadratic probing jumps by squares (+1, +4, +9). Key 22 would have landed at (1 + 2²) mod 7 = 5, not Slot 3!",
      double: "INCORRECT! Double hashing uses key-dependent strides, which would not produce a uniform adjacent sequence [1, 2, 3, 4] for these keys.",
      chaining: "INCORRECT! Separate chaining keeps all colliding keys in a linked list inside Slot 1 without populating Slots 2, 3, or 4."
    }
  },
  {
    id: "case-2",
    caseNumber: 2,
    title: "CASE #102: The Solitary Chain List",
    difficulty: "Beginner",
    m: 5,
    keys: [12, 17, 22],
    hashFormula: "h₁(k) = k mod 5 (All keys yield home hash = 2)",
    tableSnapshot: [
      { id: 0, key: null, occupied: false },
      { id: 1, key: null, occupied: false },
      { id: 2, keysChain: [12, 17, 22], occupied: true },
      { id: 3, key: null, occupied: false },
      { id: 4, key: null, occupied: false }
    ],
    clue1: "Buckets 0, 1, 3, and 4 are completely empty. All three keys are linked together in Bucket 2.",
    clue2: "Which technique stores colliding keys in an external data structure without probing array slots?",
    timelineSteps: [
      { step: 0, text: "Initial table of capacity 5 with empty linked list heads." },
      { step: 1, text: "Key 12 hashes to 2. Attached to Bucket 2's head." },
      { step: 2, text: "Key 17 hashes to 2. Appended to Bucket 2: 12 -> 17 -> NULL." },
      { step: 3, text: "Key 22 hashes to 2. Appended to Bucket 2: 12 -> 17 -> 22 -> NULL." }
    ],
    actualAlgorithm: "chaining",
    explanations: {
      chaining: "CORRECT! Separate Chaining resolves collisions by attaching nodes in a linked list, leaving other table buckets untouched.",
      linear: "INCORRECT! Linear probing would have spilled keys into adjacent Buckets 3 and 4.",
      quadratic: "INCORRECT! Quadratic probing populates array slots in the primary table.",
      double: "INCORRECT! Double hashing is an open-addressing method that uses primary array slots."
    }
  },
  {
    id: "case-3",
    caseNumber: 3,
    title: "CASE #103: The Squared Leap",
    difficulty: "Intermediate",
    m: 11,
    keys: [14, 25, 36],
    hashFormula: "h₁(k) = k mod 11 (All keys yield home hash = 3)",
    tableSnapshot: [
      { id: 0, key: null, occupied: false },
      { id: 1, key: null, occupied: false },
      { id: 2, key: null, occupied: false },
      { id: 3, key: 14, occupied: true },
      { id: 4, key: 25, occupied: true },
      { id: 5, key: null, occupied: false },
      { id: 6, key: null, occupied: false },
      { id: 7, key: 36, occupied: true },
      { id: 8, key: null, occupied: false },
      { id: 9, key: null, occupied: false },
      { id: 10, key: null, occupied: false }
    ],
    clue1: "Observe the jump distances from home Slot 3: Key 25 is at Slot 4 (+1 jump). Key 36 is at Slot 7 (+4 jump!).",
    clue2: "Notice that 1 = 1² and 4 = 2². Which algorithm advances by squares of the attempt counter?",
    timelineSteps: [
      { step: 0, text: "Table of size 11 initialized." },
      { step: 1, text: "Key 14 hashes to (14 % 11) = 3. Placed at Bucket 3." },
      { step: 2, text: "Key 25 hashes to 3 (collision). Probe 1: (3 + 1²) mod 11 = 4. Placed at Bucket 4." },
      { step: 3, text: "Key 36 hashes to 3 (collides at 3, collides at 4). Probe 2: (3 + 2²) mod 11 = 7. Placed at Bucket 7!" }
    ],
    actualAlgorithm: "quadratic",
    explanations: {
      quadratic: "CORRECT! Quadratic probing probes h(k) + i², yielding offsets +1² = 1 and +2² = 4 from the home slot.",
      linear: "INCORRECT! Linear probing would have placed Key 36 into adjacent Slot 5.",
      chaining: "INCORRECT! In separate chaining, keys 14, 25, 36 would all reside in Bucket 3's linked list.",
      double: "INCORRECT! Double hashing uses linear strides (i × h₂(k)), which do not produce non-linear squared gaps."
    }
  },
  {
    id: "case-4",
    caseNumber: 4,
    title: "CASE #104: The Second Formula Stride",
    difficulty: "Advanced",
    m: 7,
    keys: [10, 17],
    hashFormula: "h₁(k) = k mod 7; h₂(k) = 5 - (k mod 5)",
    tableSnapshot: [
      { id: 0, key: null, occupied: false },
      { id: 1, key: null, occupied: false },
      { id: 2, key: null, occupied: false },
      { id: 3, key: 10, occupied: true },
      { id: 4, key: null, occupied: false },
      { id: 5, key: null, occupied: false },
      { id: 6, key: 17, occupied: true }
    ],
    clue1: "Key 10 and Key 17 both hash to Slot 3 (10 % 7 = 3; 17 % 7 = 3).",
    clue2: "Key 17 did NOT land at Slot 4 (+1) or Slot 7/0 (+4). It leaped by +3 into Slot 6: h₂(17) = 5 - (17 % 5) = 3!",
    timelineSteps: [
      { step: 0, text: "Table of size 7 initialized." },
      { step: 1, text: "Key 10 hashes to (10 % 7) = 3. Placed at Bucket 3." },
      { step: 2, text: "Key 17 hashes to 3. Collides with Key 10! Stride h₂(17) = 5 - 2 = 3. Probe 1: (3 + 3) mod 7 = 6. Placed at Bucket 6." }
    ],
    actualAlgorithm: "double",
    explanations: {
      double: "CORRECT! Double hashing calculated stride h₂(17) = 3, probing bucket (3 + 3) % 7 = 6.",
      linear: "INCORRECT! Linear probing would have placed 17 into adjacent Bucket 4.",
      quadratic: "INCORRECT! Quadratic step 1 would also probe (3 + 1²) = 4.",
      chaining: "INCORRECT! Chaining would keep both 10 and 17 inside Bucket 3."
    }
  },
  {
    id: "case-5",
    caseNumber: 5,
    title: "CASE #105: The Midnight Wraparound",
    difficulty: "Advanced",
    m: 7,
    keys: [6, 13, 20],
    hashFormula: "h₁(k) = k mod 7 (All keys yield home hash = 6)",
    tableSnapshot: [
      { id: 0, key: 13, occupied: true },
      { id: 1, key: 20, occupied: true },
      { id: 2, key: null, occupied: false },
      { id: 3, key: null, occupied: false },
      { id: 4, key: null, occupied: false },
      { id: 5, key: null, occupied: false },
      { id: 6, key: 6, occupied: true }
    ],
    clue1: "All keys hash to 6. Key 6 occupied Slot 6. But where did Keys 13 and 20 go?",
    clue2: "Slots [6, 0, 1] form a contiguous sequential block that wrapped around from the end of the table back to the beginning!",
    timelineSteps: [
      { step: 0, text: "Table of size 7 initialized." },
      { step: 1, text: "Key 6 hashes to 6. Placed at Bucket 6." },
      { step: 2, text: "Key 13 hashes to 6 (collision). Step 1: (6 + 1) mod 7 = 0 (wraps around!). Placed at Bucket 0." },
      { step: 3, text: "Key 20 hashes to 6 (collides at 6, collides at 0). Step 2: (6 + 2) mod 7 = 1. Placed at Bucket 1." }
    ],
    actualAlgorithm: "linear",
    explanations: {
      linear: "CORRECT! Linear probing advances by +1 modulo m, gracefully wrapping around index 6 back to 0 and 1.",
      quadratic: "INCORRECT! Quadratic probe step 1 lands at 0, but step 2: (6 + 4) mod 7 = 3, NOT Slot 1!",
      double: "INCORRECT! Double hashing strides for these keys would not result in sequential buckets 6 -> 0 -> 1.",
      chaining: "INCORRECT! In chaining, Buckets 0 and 1 would remain empty while Bucket 6 holds all keys."
    }
  }
];

export default function HashDetectivePage() {
  const navigate = useNavigate();
  const [caseIndex, setCaseIndex] = useState(0);
  const [selectedHypothesis, setSelectedHypothesis] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [hintsUnlocked, setHintsUnlocked] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [caseScore, setCaseScore] = useState(100);
  const [caseScores, setCaseScores] = useState({});
  const [isGameOver, setIsGameOver] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [xp, setXp] = useState(getCurrentGlobalXp);

  const particleRef = useRef(null);
  const currentCase = DETECTIVE_CASES[caseIndex] || DETECTIVE_CASES[0];

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isGameOver) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isGameOver]);

  function handleSelectCase(idx) {
    sounds.playClick();
    setCaseIndex(idx);
    setSelectedHypothesis(null);
    setVerdict(null);
    setHintsUnlocked(0);
    setAttempts(1);
    setCaseScore(100);
    setTimelineVisible(false);
  }

  function handleRestartFullGame() {
    sounds.playClick();
    setIsGameOver(false);
    setCaseIndex(0);
    setSelectedHypothesis(null);
    setVerdict(null);
    setHintsUnlocked(0);
    setAttempts(1);
    setCaseScore(100);
    setCaseScores({});
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setTimelineVisible(false);
  }

  function handleUnlockClue() {
    if (hintsUnlocked >= 2 || verdict?.isCorrect) return;
    sounds.playClick();
    setHintsUnlocked((prev) => prev + 1);
    setCaseScore((prev) => Math.max(20, prev - 20));
  }

  function handleSubmitHypothesis() {
    if (!selectedHypothesis || verdict?.isCorrect) return;

    sounds.playClick();
    const result = evaluateDetectiveHypothesis(currentCase, selectedHypothesis);

    if (result.isCorrect) {
      sounds.playCelebration();
      if (particleRef.current) particleRef.current.celebration();

      const persistRes = recordChallengeResult({
        gameId: "hash-detective",
        challengeId: currentCase.id,
        score: caseScore,
        baseXp: 50,
        hintsUsed: hintsUnlocked,
        attempts,
        totalStagesInGame: DETECTIVE_CASES.length,
        conceptTag: "Algorithm Identification"
      });

      const nextScores = { ...caseScores, [caseIndex]: caseScore };
      setCaseScores(nextScores);

      setXp(getCurrentGlobalXp());
      setVerdict({
        isCorrect: true,
        message: result.explanation,
        xpAwarded: persistRes.xpAwarded,
        isFirstTime: persistRes.isFirstTime
      });
      setTimelineVisible(true);

      const isLastCase = caseIndex >= DETECTIVE_CASES.length - 1;
      if (isLastCase) {
        setIsTimerRunning(false);
        setTimeout(() => {
          setIsGameOver(true);
        }, 800);
      }
    } else {
      sounds.playError();
      setAttempts((prev) => prev + 1);
      setCaseScore((prev) => Math.max(15, prev - 25));
      setVerdict({
        isCorrect: false,
        message: result.explanation
      });
    }
  }

  return (
    <div className="hl-games-page">
      <ParticleCanvas ref={particleRef} />

      <GameHeaderNav
        gameTitle="Hash Detective"
        xp={xp}
        onReset={() => handleSelectCase(caseIndex)}
        onCelebrate={() => {
          if (particleRef.current) particleRef.current.celebration();
        }}
        extraBadge={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#d97706" }}>
              CASE {currentCase.caseNumber} / {DETECTIVE_CASES.length}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "5px" }}>
              <Clock size={13} color="#d97706" /> {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")}
            </span>
          </div>
        }
      />

      <div className="hl-games-container" style={{ marginTop: "24px" }}>
        {/* Case Dossier Selector Tabs */}
        <div className="hl-btn-row" style={{ marginBottom: "20px" }}>
          {DETECTIVE_CASES.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              className={`hl-filter-pill ${idx === caseIndex ? "active" : ""}`}
              onClick={() => handleSelectCase(idx)}
            >
              Case #{c.caseNumber}: {c.difficulty}
            </button>
          ))}
        </div>

        {/* Case File Header */}
        <div className="hl-panel" style={{ marginBottom: "24px" }}>
          <div className="hl-panel-header">
            <div>
              <h2 className="hl-panel-title">
                <Search size={22} color="#f59e0b" />
                {currentCase.title}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
                Examine the crime scene hash table snapshot and identify which algorithm produced it!
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="hl-card-pill pill-difficulty-intermediate">
                {currentCase.difficulty.toUpperCase()}
              </span>
              <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "6px" }}>
                Capacity m = {currentCase.m} | Keys: [{currentCase.keys.join(", ")}]
              </div>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-card-muted)",
              padding: "14px 20px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-main)",
              fontSize: "0.9rem",
              fontFamily: "monospace",
              color: "var(--text-primary)"
            }}
          >
            <strong>EVIDENCE DATA:</strong> {currentCase.hashFormula}
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="hl-workspace-grid">
          {/* Left Column: Crime Scene Snapshot & Hypothesis Controls */}
          <div className="hl-panel">
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Fingerprint size={18} color="#f59e0b" />
              Crime Scene Snapshot (Final Table State)
            </h3>

            {/* Table Snapshot Display */}
            <div className="hl-bucket-rack">
              {currentCase.tableSnapshot.map((bucket) => (
                <div
                  key={bucket.id}
                  className={`hl-bucket-cell ${bucket.occupied ? "success-placed" : ""}`}
                  style={{ cursor: "default" }}
                >
                  <span className="hl-bucket-index-tag">Bucket [{bucket.id}]</span>
                  <div className="hl-bucket-content">
                    {bucket.keysChain ? (
                      <span className="hl-key-token" style={{ fontSize: "0.85rem", padding: "4px 8px" }}>
                        {bucket.keysChain.join(" -> ")}
                      </span>
                    ) : bucket.occupied ? (
                      <span className="hl-key-token">{bucket.key}</span>
                    ) : (
                      <span className="hl-empty-bucket-label">EMPTY</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Suspect Algorithm Hypotheses */}
            <div style={{ marginTop: "28px" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px", color: "var(--text-primary)" }}>
                Identify the Suspect Algorithm:
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px"
                }}
              >
                {[
                  { id: "linear", label: "Linear Probing (+1)" },
                  { id: "quadratic", label: "Quadratic Probing (+i²)" },
                  { id: "double", label: "Double Hashing (+i × h₂)" },
                  { id: "chaining", label: "Separate Chaining (Linked List)" }
                ].map((hypo) => (
                  <button
                    key={hypo.id}
                    type="button"
                    className={`hl-action-btn ${selectedHypothesis === hypo.id ? "btn-primary" : "btn-secondary"}`}
                    style={{ textAlign: "left", justifyContent: "flex-start", padding: "12px 16px" }}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedHypothesis(hypo.id);
                    }}
                    disabled={verdict?.isCorrect}
                  >
                    <span>{hypo.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                type="button"
                className="hl-action-btn btn-primary"
                onClick={handleSubmitHypothesis}
                disabled={!selectedHypothesis || verdict?.isCorrect}
              >
                <Search size={16} />
                <span>Submit Forensic Verdict</span>
              </button>

              <button
                type="button"
                className="hl-action-btn btn-secondary"
                onClick={handleUnlockClue}
                disabled={hintsUnlocked >= 2 || verdict?.isCorrect}
              >
                <HelpCircle size={16} />
                <span>Request Crime Lab Clue ({hintsUnlocked}/2)</span>
              </button>
            </div>

            {/* Verdict Feedback */}
            {verdict && (
              <div className={`hl-feedback-card ${verdict.isCorrect ? "correct" : "incorrect"}`}>
                {verdict.isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                    {verdict.isCorrect ? "CASE SOLVED!" : "FORENSIC ERROR!"}
                  </div>
                  <div style={{ fontSize: "0.92rem", lineHeight: "1.4" }}>
                    {verdict.message}
                  </div>
                  {verdict.isCorrect && verdict.isFirstTime && (
                    <div style={{ marginTop: "6px", fontWeight: 700, color: "#10b981" }}>
                      +{verdict.xpAwarded} XP Earned!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Case Button or View Final Score */}
            {verdict?.isCorrect && caseIndex < DETECTIVE_CASES.length - 1 && (
              <div style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  className="hl-action-btn btn-primary"
                  onClick={() => handleSelectCase(caseIndex + 1)}
                >
                  <span>Open Next Case</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {verdict?.isCorrect && caseIndex === DETECTIVE_CASES.length - 1 && (
              <div style={{ marginTop: "20px" }}>
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
              </div>
            )}
          </div>

          {/* Right Column: Clues, Dossier Notes & Reconstruction Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Clues Card */}
            <div className="hl-panel">
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <HelpCircle size={16} color="#f59e0b" />
                Forensic Clues
              </h4>

              {hintsUnlocked === 0 && (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  No clues unlocked yet. Request a clue if you need help deciphering the pattern.
                </p>
              )}

              {hintsUnlocked >= 1 && (
                <div style={{ padding: "10px 14px", borderRadius: "8px", background: "var(--bg-card-muted)", marginBottom: "8px", fontSize: "0.85rem", borderLeft: "3px solid #f59e0b" }}>
                  <strong>Clue 1:</strong> {currentCase.clue1}
                </div>
              )}

              {hintsUnlocked >= 2 && (
                <div style={{ padding: "10px 14px", borderRadius: "8px", background: "var(--bg-card-muted)", fontSize: "0.85rem", borderLeft: "3px solid #f59e0b" }}>
                  <strong>Clue 2:</strong> {currentCase.clue2}
                </div>
              )}
            </div>

            {/* Reconstruction Timeline */}
            <div className="hl-panel" style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileText size={16} color="#2563eb" />
                  Chronological Crime Reconstruction
                </h4>
                <button
                  type="button"
                  className="hl-action-btn btn-secondary"
                  style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                  onClick={() => setTimelineVisible(!timelineVisible)}
                >
                  {timelineVisible ? "Hide" : "Reveal Timeline"}
                </button>
              </div>

              {timelineVisible ? (
                <div className="hl-log-container">
                  {currentCase.timelineSteps.map((step) => (
                    <div key={step.step} className="hl-log-row">
                      <span style={{ color: "#2563eb", fontWeight: 700 }}>[T+{step.step}]</span>
                      <span>{step.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Reconstruction log is locked. Solve the case or click "Reveal Timeline" to inspect the step-by-step forensic sequence.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Universal Game Completion Victory Modal */}
      <GameCompletionModal
        isOpen={isGameOver}
        gameTitle="Hash Detective"
        score={Object.values(caseScores).reduce((a, b) => a + b, 0)}
        maxScore={DETECTIVE_CASES.length * 100}
        elapsedSeconds={elapsedSeconds}
        xpAwarded={150}
        stats={[
          { label: "Cases Solved", value: "3 / 3", color: "#10b981" },
          { label: "Hints Used", value: hintsUnlocked, color: "#f59e0b" },
          { label: "Forensic Deduction", value: "100% Verified", color: "#2563eb" }
        ]}
        onRestart={handleRestartFullGame}
        onExit={() => navigate("/games")}
      />
    </div>
  );
}
