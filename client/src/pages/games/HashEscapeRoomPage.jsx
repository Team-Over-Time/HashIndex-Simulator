import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Key,
  Unlock,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Clock,
  Award,
  Layers,
  Cpu,
  Fingerprint,
  RefreshCw,
  GitBranch,
  Flame,
  Zap,
  Play,
  Trophy,
  LogOut
} from "lucide-react";
import GameHeaderNav from "../../components/games/GameHeaderNav.jsx";
import ParticleCanvas from "../../components/games/ParticleCanvas.jsx";
import { sounds } from "../../utils/soundEffects.js";
import {
  hashModulo,
  linearProbe,
  validatePointerChain,
  simulateRehash
} from "../../algorithms/gameEngine.js";
import {
  recordChallengeResult,
  getCurrentGlobalXp,
  loadGameProgress
} from "../../utils/gameProgress.js";
import "../../components/games/hashLabGames.css";

const ROOM_DEFINITIONS = [
  {
    id: "room-1",
    roomNumber: 1,
    name: "Room 1: The Hash Gate",
    concept: "Modulo Arithmetic & Collisions",
    fragmentName: "MODULO_CORE",
    shortDesc: "Map incoming data packets to initial hash slots: h(k) = k mod 7.",
    icon: Key
  },
  {
    id: "room-2",
    roomNumber: 2,
    name: "Room 2: The Collision Chamber",
    concept: "Linear Probing Resolution",
    fragmentName: "LINEAR_ROUTER",
    shortDesc: "Resolve sequential collisions using open addressing linear probing.",
    icon: Zap
  },
  {
    id: "room-3",
    roomNumber: 3,
    name: "Room 3: The Broken Chain",
    concept: "Chaining & Pointer Surgery",
    fragmentName: "CHAIN_LINKER",
    shortDesc: "Repair corrupted linked-list pointers to restore Key 21 reachability.",
    icon: GitBranch
  },
  {
    id: "room-4",
    roomNumber: 4,
    name: "Room 4: The Overflow Reactor",
    concept: "Load Factor & Rehashing",
    fragmentName: "REHASH_EXPANDER",
    shortDesc: "Cool down saturated reactor by resizing table to prime capacity 11.",
    icon: Flame
  },
  {
    id: "room-5",
    roomNumber: 5,
    name: "Room 5: The Crime Scene",
    concept: "Algorithm Forensic Deduction",
    fragmentName: "FORENSIC_DECODER",
    shortDesc: "Inspect memory snapshot to decode the underlying collision strategy.",
    icon: Fingerprint
  }
];

export default function HashEscapeRoomPage() {
  // Current screen: "lobby" | "room-1" | "room-2" | "room-3" | "room-4" | "room-5" | "vault" | "escaped"
  const [activeScreen, setActiveScreen] = useState("lobby");
  const [difficulty, setDifficulty] = useState("standard"); // "guided" | "standard" | "expert"

  // Escape Room overall state
  const [completedRooms, setCompletedRooms] = useState(() => {
    const saved = loadGameProgress().games["hash-escape-room"]?.completedChallenges || [];
    return saved;
  });
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [xp, setXp] = useState(getCurrentGlobalXp);

  const particleRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && activeScreen !== "escaped") {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeScreen]);

  // Helper to mark room solved & award fragment
  function completeRoom(roomId, fragmentName) {
    sounds.playCelebration();
    if (particleRef.current) particleRef.current.celebration();

    if (!completedRooms.includes(roomId)) {
      const nextRooms = [...completedRooms, roomId];
      setCompletedRooms(nextRooms);

      recordChallengeResult({
        gameId: "hash-escape-room",
        challengeId: roomId,
        score: Math.max(50, 100 - hintsUsed * 10),
        baseXp: 60,
        hintsUsed,
        attempts,
        totalStagesInGame: 6, // 5 rooms + vault
        conceptTag: "Escape Room Adventure"
      });
      setXp(getCurrentGlobalXp());
    }

    setFeedback({
      type: "success",
      message: `ROOM OVERRIDDEN! Verified Fragment Acquired: [${fragmentName}]. Return to Lobby or proceed to next chamber.`
    });
  }

  function handleStartMission() {
    sounds.playClick();
    setIsTimerRunning(true);
    // Open first incomplete room or room 1
    const firstIncomplete = ROOM_DEFINITIONS.find((r) => !completedRooms.includes(r.id));
    setActiveScreen(firstIncomplete ? firstIncomplete.id : "room-1");
  }

  function handleResetAllRooms() {
    sounds.playClick();
    setCompletedRooms([]);
    setHintsUsed(0);
    setAttempts(1);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setActiveScreen("lobby");
    setFeedback(null);
  }

  // Format seconds mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="hl-games-page">
      <ParticleCanvas ref={particleRef} />

      <GameHeaderNav
        gameTitle="Hash Escape Room"
        xp={xp}
        onReset={handleResetAllRooms}
        onCelebrate={() => {
          if (particleRef.current) particleRef.current.celebration();
        }}
        extraBadge={
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={14} /> {formatTime(elapsedSeconds)}
          </span>
        }
      />

      <div className="hl-games-container" style={{ marginTop: "24px" }}>
        {/* LOBBY VIEW */}
        {activeScreen === "lobby" && (
          <div>
            {/* Story & Facility Header Banner */}
            <div className="hl-panel" style={{ border: "2px solid #38bdf8", marginBottom: "24px" }}>
              <div className="hl-panel-header">
                <div>
                  <h2 className="hl-panel-title">
                    <ShieldAlert size={24} color="#38bdf8" />
                    HashLab Cyber Core: Security Lockdown
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "4px" }}>
                    You are a lead database engineer trapped inside the reactor core! Solve five security chambers to synthesize the 5 Cryptographic Fragments and unlock the Final Vault.
                  </p>
                </div>
                <div>
                  <span className="hl-card-pill pill-difficulty-expert">
                    DIFFICULTY: {difficulty.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Mission Lobby Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>MODE:</span>
                  {["guided", "standard", "expert"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`hl-filter-pill ${difficulty === m ? "active" : ""}`}
                      onClick={() => {
                        sounds.playClick();
                        setDifficulty(m);
                      }}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="button"
                    className="hl-action-btn btn-primary"
                    style={{ fontSize: "1rem", padding: "12px 28px" }}
                    onClick={handleStartMission}
                  >
                    <Play size={18} />
                    <span>{completedRooms.length > 0 ? "Resume Mission" : "Start Escape Mission"}</span>
                  </button>

                  {completedRooms.length >= 5 && (
                    <button
                      type="button"
                      className="hl-action-btn btn-success"
                      onClick={() => setActiveScreen("vault")}
                    >
                      <Unlock size={18} />
                      <span>Enter Final Vault</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mission Map Schematic */}
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "16px" }}>
              Facility Schematic: 5 Lockdown Chambers
            </h3>

            <div className="hl-escape-mission-grid">
              {ROOM_DEFINITIONS.map((room) => {
                const isDone = completedRooms.includes(room.id);
                const IconComponent = room.icon;

                return (
                  <div
                    key={room.id}
                    className={`hl-room-card-node ${isDone ? "completed-room" : ""}`}
                    onClick={() => {
                      sounds.playClick();
                      setIsTimerRunning(true);
                      setActiveScreen(room.id);
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span className="hl-card-pill" style={{ background: isDone ? "rgba(16, 185, 129, 0.2)" : "rgba(100, 116, 139, 0.2)", color: isDone ? "#10b981" : "var(--text-muted)" }}>
                        {isDone ? "OVERRIDDEN ✓" : "LOCKED"}
                      </span>
                      <IconComponent size={20} color={isDone ? "#10b981" : "#38bdf8"} />
                    </div>

                    <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "12px 0 6px" }}>
                      {room.name}
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", minHeight: "40px" }}>
                      {room.shortDesc}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-main)", paddingTop: "10px", marginTop: "12px" }}>
                      <span style={{ fontSize: "0.74rem", fontFamily: "monospace", color: "var(--text-muted)" }}>
                        {room.fragmentName}
                      </span>
                      {isDone && <CheckCircle2 size={16} color="#10b981" />}
                    </div>
                  </div>
                );
              })}

              {/* Final Vault Node */}
              <div
                className={`hl-room-card-node ${completedRooms.length >= 5 ? "completed-room" : ""}`}
                style={{
                  border: completedRooms.length >= 5 ? "2px solid #10b981" : "2px dashed var(--border-main)",
                  boxShadow: completedRooms.length >= 5 ? "0 0 20px rgba(16, 185, 129, 0.25)" : "none",
                  cursor: completedRooms.length >= 5 ? "pointer" : "default"
                }}
                onClick={() => {
                  sounds.playClick();
                  if (completedRooms.length >= 5) {
                    setActiveScreen("vault");
                  }
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span className="hl-card-pill" style={{ background: completedRooms.length >= 5 ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)", color: completedRooms.length >= 5 ? "#10b981" : "#ef4444" }}>
                    {completedRooms.length >= 5 ? "READY TO UNLOCK" : "SEALED"}
                  </span>
                  {completedRooms.length >= 5 ? <Unlock size={20} color="#10b981" /> : <Lock size={20} color="#ef4444" />}
                </div>

                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "12px 0 6px" }}>
                  The Final Vault
                </h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", minHeight: "40px" }}>
                  {completedRooms.length >= 5
                    ? "All 5 fragments acquired! Enter the Master Cipher Console to calibrate the 5-stage hashing pipeline and escape."
                    : "Collect all 5 cryptographic fragments from the security chambers to unlock the master console."}
                </p>

                <div style={{ borderTop: "1px solid var(--border-main)", paddingTop: "10px", marginTop: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Progress: {completedRooms.length}/5 Fragments
                </div>

                {completedRooms.length >= 5 && (
                  <button
                    type="button"
                    className="hl-action-btn btn-success"
                    style={{
                      width: "100%",
                      marginTop: "12px",
                      padding: "10px 14px",
                      fontSize: "0.88rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 0 14px rgba(16, 185, 129, 0.35)"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      setActiveScreen("vault");
                    }}
                  >
                    <Unlock size={16} />
                    <span>Enter Master Vault Console →</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ROOM 1: THE HASH GATE */}
        {activeScreen === "room-1" && (
          <Room1HashGate
            onBackToLobby={() => setActiveScreen("lobby")}
            onComplete={() => completeRoom("room-1", "MODULO_CORE")}
            difficulty={difficulty}
            onNext={() => setActiveScreen("room-2")}
          />
        )}

        {/* ROOM 2: THE COLLISION CHAMBER */}
        {activeScreen === "room-2" && (
          <Room2CollisionChamber
            onBackToLobby={() => setActiveScreen("lobby")}
            onComplete={() => completeRoom("room-2", "LINEAR_ROUTER")}
            difficulty={difficulty}
            onNext={() => setActiveScreen("room-3")}
          />
        )}

        {/* ROOM 3: THE BROKEN CHAIN */}
        {activeScreen === "room-3" && (
          <Room3BrokenChain
            onBackToLobby={() => setActiveScreen("lobby")}
            onComplete={() => completeRoom("room-3", "CHAIN_LINKER")}
            difficulty={difficulty}
            onNext={() => setActiveScreen("room-4")}
          />
        )}

        {/* ROOM 4: THE OVERFLOW REACTOR */}
        {activeScreen === "room-4" && (
          <Room4OverflowReactor
            onBackToLobby={() => setActiveScreen("lobby")}
            onComplete={() => completeRoom("room-4", "REHASH_EXPANDER")}
            difficulty={difficulty}
            onNext={() => setActiveScreen("room-5")}
          />
        )}

        {/* ROOM 5: THE ALGORITHM CRIME SCENE */}
        {activeScreen === "room-5" && (
          <Room5CrimeScene
            onBackToLobby={() => setActiveScreen("lobby")}
            onComplete={() => completeRoom("room-5", "FORENSIC_DECODER")}
            difficulty={difficulty}
            onNext={() => setActiveScreen("vault")}
          />
        )}

        {/* FINAL VAULT ASSEMBLY */}
        {activeScreen === "vault" && (
          <FinalVaultAssembly
            completedRooms={completedRooms}
            elapsedSeconds={elapsedSeconds}
            onBackToLobby={() => setActiveScreen("lobby")}
            onEscapeComplete={() => {
              sounds.playCelebration();
              if (particleRef.current) particleRef.current.celebration();
              setActiveScreen("escaped");
            }}
          />
        )}

        {/* ESCAPED VICTORY DEBRIEF */}
        {activeScreen === "escaped" && (
          <VictoryDebrief
            elapsedSeconds={elapsedSeconds}
            hintsUsed={hintsUsed}
            onReplay={handleResetAllRooms}
            onBackToLobby={() => setActiveScreen("lobby")}
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ROOM 1: THE HASH GATE
   Keys: 17, 24, 31, 19 with m = 7.
   17 % 7 = 3, 24 % 7 = 3, 31 % 7 = 3, 19 % 7 = 5.
   ========================================================= */
function Room1HashGate({ onBackToLobby, onComplete, difficulty, onNext }) {
  const [assigned, setAssigned] = useState({ 17: null, 24: null, 31: null, 19: null });
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const keys = [17, 24, 31, 19];

  function handleSelectSlot(key, slot) {
    sounds.playClick();
    setAssigned((prev) => ({ ...prev, [key]: Number(slot) }));
  }

  function handleVerify() {
    sounds.playClick();
    // Expected: 17->3, 24->3, 31->3, 19->5
    const isCorrect =
      assigned[17] === 3 &&
      assigned[24] === 3 &&
      assigned[31] === 3 &&
      assigned[19] === 5;

    if (isCorrect) {
      setSolved(true);
      onComplete();
    } else {
      sounds.playError();
      setFeedback({
        type: "error",
        message: "Gate Lockout! Calculate h(k) = k mod 7 for every key. Note that 17, 24, and 31 all share the SAME bucket 3 (17%7=3, 24%7=3, 31%7=3), while 19%7=5."
      });
    }
  }

  return (
    <div className="hl-panel">
      <div className="hl-panel-header">
        <div>
          <h3 className="hl-panel-title">
            <Key size={22} color="#38bdf8" />
            Room 1: The Hash Gate (Modulo Routing)
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
            The facility entrance gate checks initial modulo values. Route each security key to its primary hash address: <strong>h(k) = k mod 7</strong>.
          </p>
        </div>
        <button type="button" className="hl-back-btn" onClick={onBackToLobby}>
          <ArrowLeft size={16} />
          <span>Mission Map</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", margin: "24px 0" }}>
        {keys.map((k) => (
          <div key={k} style={{ background: "var(--bg-card-muted)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "monospace", color: "#2563eb", marginBottom: "8px" }}>
              Key {k}
            </div>
            <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              Compute {k} mod 7:
            </label>
            <select
              value={assigned[k] !== null ? assigned[k] : ""}
              onChange={(e) => handleSelectSlot(k, e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-main)",
                fontWeight: 700
              }}
            >
              <option value="">Select Bucket (0-6)</option>
              {[0, 1, 2, 3, 4, 5, 6].map((b) => (
                <option key={b} value={b}>Bucket [{b}]</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {feedback && (
        <div className={`hl-feedback-card ${feedback.type === "error" ? "incorrect" : "correct"}`}>
          <AlertTriangle size={20} />
          <div style={{ fontSize: "0.9rem" }}>{feedback.message}</div>
        </div>
      )}

      <div className="hl-btn-row" style={{ marginTop: "24px", justifyContent: "space-between" }}>
        <button type="button" className="hl-action-btn btn-primary" onClick={handleVerify} disabled={solved}>
          <span>Verify Hash Modulo</span>
        </button>

        {solved && (
          <button type="button" className="hl-action-btn btn-success" onClick={onNext}>
            <span>Proceed to Room 2</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ROOM 2: THE COLLISION CHAMBER
   Keys: 17, 24, 31, 10 into table of size 7 with linear probing.
   Expected: 3: 17, 4: 24, 5: 31, 6: 10.
   ========================================================= */
function Room2CollisionChamber({ onBackToLobby, onComplete, difficulty, onNext }) {
  const [table, setTable] = useState(
    Array.from({ length: 7 }, (_, id) => ({ id, key: null }))
  );
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const keys = [17, 24, 31, 10];

  function handleSetBucket(bucketId, keyVal) {
    sounds.playClick();
    const updated = [...table];
    updated[bucketId].key = keyVal === "" ? null : Number(keyVal);
    setTable(updated);
  }

  function handleVerify() {
    sounds.playClick();
    // Validate complete table:
    // Bucket 3: 17
    // Bucket 4: 24
    // Bucket 5: 31
    // Bucket 6: 10
    const b3 = table[3].key === 17;
    const b4 = table[4].key === 24;
    const b5 = table[5].key === 31;
    const b6 = table[6].key === 10;
    const emptyOk = table[0].key === null && table[1].key === null && table[2].key === null;

    if (b3 && b4 && b5 && b6 && emptyOk) {
      setSolved(true);
      onComplete();
    } else {
      sounds.playError();
      setFeedback({
        type: "error",
        message: "Chamber Overload! Linear probing resolution requires: Key 17 at Bucket 3; Key 24 collides at 3 -> moves to 4; Key 31 collides at 3, 4 -> moves to 5; Key 10 (10%7=3) collides at 3, 4, 5 -> moves to 6!"
      });
    }
  }

  return (
    <div className="hl-panel">
      <div className="hl-panel-header">
        <div>
          <h3 className="hl-panel-title">
            <Zap size={22} color="#f59e0b" />
            Room 2: The Collision Chamber (Linear Probing)
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
            Resolve sequential collisions for Keys [17, 24, 31, 10] in an open-addressing table of capacity 7.
          </p>
        </div>
        <button type="button" className="hl-back-btn" onClick={onBackToLobby}>
          <ArrowLeft size={16} />
          <span>Mission Map</span>
        </button>
      </div>

      <div className="hl-bucket-rack">
        {table.map((b) => (
          <div key={b.id} className="hl-bucket-cell" style={{ cursor: "default" }}>
            <span className="hl-bucket-index-tag">Bucket [{b.id}]</span>
            <div className="hl-bucket-content">
              <select
                value={b.key !== null ? b.key : ""}
                onChange={(e) => handleSetBucket(b.id, e.target.value)}
                style={{
                  width: "100%",
                  padding: "4px",
                  borderRadius: "4px",
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-main)",
                  fontSize: "0.85rem",
                  fontWeight: 700
                }}
              >
                <option value="">Empty</option>
                {keys.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {feedback && (
        <div className={`hl-feedback-card ${feedback.type === "error" ? "incorrect" : "correct"}`}>
          <AlertTriangle size={20} />
          <div style={{ fontSize: "0.9rem" }}>{feedback.message}</div>
        </div>
      )}

      <div className="hl-btn-row" style={{ marginTop: "24px", justifyContent: "space-between" }}>
        <button type="button" className="hl-action-btn btn-primary" onClick={handleVerify} disabled={solved}>
          <span>Verify Linear Probing Table</span>
        </button>

        {solved && (
          <button type="button" className="hl-action-btn btn-success" onClick={onNext}>
            <span>Proceed to Room 3</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ROOM 3: THE BROKEN CHAIN
   Capacity: 5, h(k) = k mod 5.
   Required chain at bucket 1: 11 -> 21 -> NULL.
   A broken link makes 21 unreachable. Repair pointer!
   ========================================================= */
function Room3BrokenChain({ onBackToLobby, onComplete, difficulty, onNext }) {
  // Graph state: node-11's next pointer
  const [node11Next, setNode11Next] = useState("null"); // initially severed!
  const [node21Next, setNode21Next] = useState("null");
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function handleVerify() {
    sounds.playClick();
    const graph = {
      bucketHeadId: "node-11",
      nodes: {
        "node-11": { key: 11, next: node11Next === "null" ? null : node11Next },
        "node-21": { key: 21, next: node21Next === "null" ? null : node21Next }
      },
      expectedKeysOrder: [11, 21]
    };

    const result = validatePointerChain(graph);

    if (result.valid) {
      setSolved(true);
      onComplete();
    } else {
      sounds.playError();
      setFeedback({
        type: "error",
        message: result.error || "Pointer validation failed! Ensure Bucket 1 Head -> Node 11 -> Node 21 -> NULL."
      });
    }
  }

  return (
    <div className="hl-panel">
      <div className="hl-panel-header">
        <div>
          <h3 className="hl-panel-title">
            <GitBranch size={22} color="#10b981" />
            Room 3: The Broken Chain (Separate Chaining Pointer Surgery)
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
            Key 21 has been severed from Bucket 1's linked list! Repair the next pointer wire from Node 11 to Node 21.
          </p>
        </div>
        <button type="button" className="hl-back-btn" onClick={onBackToLobby}>
          <ArrowLeft size={16} />
          <span>Mission Map</span>
        </button>
      </div>

      {/* Visual Pointer Chain Nodes */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "30px 20px", background: "var(--bg-card-muted)", borderRadius: "12px", border: "1px solid var(--border-main)", overflowX: "auto", margin: "20px 0" }}>
        {/* Bucket Head */}
        <div style={{ padding: "12px 18px", borderRadius: "8px", background: "#1e293b", color: "#f8fafc", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>BUCKET [1]</div>
          <strong style={{ fontSize: "1.1rem" }}>HEAD</strong>
        </div>

        <span style={{ color: "#2563eb", fontWeight: 800, fontSize: "1.4rem" }}>→</span>

        {/* Node 11 */}
        <div style={{ padding: "14px 20px", borderRadius: "8px", background: "var(--bg-card)", border: "2px solid #2563eb", minWidth: "160px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>NODE ADDR: 0x1A0</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>Key 11</div>
          <div style={{ marginTop: "8px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, display: "block", color: "var(--text-muted)" }}>NEXT POINTER:</label>
            <select
              value={node11Next}
              onChange={(e) => setNode11Next(e.target.value)}
              style={{ width: "100%", padding: "4px 8px", borderRadius: "4px", background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-main)", fontWeight: 700 }}
            >
              <option value="null">NULL (Severed!)</option>
              <option value="node-21">Node 21 (0x2B4)</option>
              <option value="node-11">Self-Loop (Cycle!)</option>
            </select>
          </div>
        </div>

        <span style={{ color: node11Next === "node-21" ? "#10b981" : "#ef4444", fontWeight: 800, fontSize: "1.4rem" }}>
          {node11Next === "node-21" ? "→" : "↛"}
        </span>

        {/* Node 21 */}
        <div style={{ padding: "14px 20px", borderRadius: "8px", background: "var(--bg-card)", border: "2px solid #2563eb", minWidth: "160px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>NODE ADDR: 0x2B4</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>Key 21</div>
          <div style={{ marginTop: "8px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, display: "block", color: "var(--text-muted)" }}>NEXT POINTER:</label>
            <select
              value={node21Next}
              onChange={(e) => setNode21Next(e.target.value)}
              style={{ width: "100%", padding: "4px 8px", borderRadius: "4px", background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-main)", fontWeight: 700 }}
            >
              <option value="null">NULL (End of Chain)</option>
              <option value="node-11">Node 11 (Cycle!)</option>
            </select>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`hl-feedback-card ${feedback.type === "error" ? "incorrect" : "correct"}`}>
          <AlertTriangle size={20} />
          <div style={{ fontSize: "0.9rem" }}>{feedback.message}</div>
        </div>
      )}

      <div className="hl-btn-row" style={{ marginTop: "24px", justifyContent: "space-between" }}>
        <button type="button" className="hl-action-btn btn-primary" onClick={handleVerify} disabled={solved}>
          <span>Verify Pointer Chain</span>
        </button>

        {solved && (
          <button type="button" className="hl-action-btn btn-success" onClick={onNext}>
            <span>Proceed to Room 4</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ROOM 4: THE OVERFLOW REACTOR
   Initial m = 5, Keys: 12, 22, 32, 7.
   Threshold = 0.70. Load factor = 4/5 = 0.80.
   New capacity: 11. h(k) = k mod 11.
   Expected: 12->1, 22->0, 32->10, 7->7.
   ========================================================= */
function Room4OverflowReactor({ onBackToLobby, onComplete, difficulty, onNext }) {
  const [assigned, setAssigned] = useState({ 12: null, 22: null, 32: null, 7: null });
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const keys = [12, 22, 32, 7];

  function handleSet(k, slot) {
    sounds.playClick();
    setAssigned((prev) => ({ ...prev, [k]: Number(slot) }));
  }

  function handleVerify() {
    sounds.playClick();
    // Expected: 12->1, 22->0, 32->10, 7->7
    const isCorrect =
      assigned[12] === 1 &&
      assigned[22] === 0 &&
      assigned[32] === 10 &&
      assigned[7] === 7;

    if (isCorrect) {
      setSolved(true);
      onComplete();
    } else {
      sounds.playError();
      setFeedback({
        type: "error",
        message: "Reactor Overheat! Calculate h(k) = k mod 11 for all keys: 12%11=1, 22%11=0, 32%11=10, 7%11=7. Ensure no keys are placed in their old capacity 5 slots!"
      });
    }
  }

  return (
    <div className="hl-panel">
      <div className="hl-panel-header">
        <div>
          <h3 className="hl-panel-title">
            <Flame size={22} color="#ef4444" />
            Room 4: The Overflow Reactor (Resizing & Rehashing)
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
            The reactor load factor reached 4/5 = 80% (Threshold 70%). Expand table capacity to 11 and re-hash all 4 keys using: <strong>h(k) = k mod 11</strong>.
          </p>
        </div>
        <button type="button" className="hl-back-btn" onClick={onBackToLobby}>
          <ArrowLeft size={16} />
          <span>Mission Map</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", margin: "24px 0" }}>
        {keys.map((k) => (
          <div key={k} style={{ background: "var(--bg-card-muted)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "monospace", color: "#ef4444", marginBottom: "8px" }}>
              Key {k}
            </div>
            <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              Compute {k} mod 11:
            </label>
            <select
              value={assigned[k] !== null ? assigned[k] : ""}
              onChange={(e) => handleSet(k, e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-main)",
                fontWeight: 700
              }}
            >
              <option value="">Select Bucket (0-10)</option>
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={i}>Bucket [{i}]</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {feedback && (
        <div className={`hl-feedback-card ${feedback.type === "error" ? "incorrect" : "correct"}`}>
          <AlertTriangle size={20} />
          <div style={{ fontSize: "0.9rem" }}>{feedback.message}</div>
        </div>
      )}

      <div className="hl-btn-row" style={{ marginTop: "24px", justifyContent: "space-between" }}>
        <button type="button" className="hl-action-btn btn-primary" onClick={handleVerify} disabled={solved}>
          <span>Cool Down Reactor (Verify)</span>
        </button>

        {solved && (
          <button type="button" className="hl-action-btn btn-success" onClick={onNext}>
            <span>Proceed to Room 5</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ROOM 5: THE ALGORITHM CRIME SCENE
   Capacity: 7, Sequence: 10, 17, 24.
   Snapshot: bucket 3 = 10, bucket 4 = 17, bucket 5 = 24.
   Identify: Linear Probing.
   ========================================================= */
function Room5CrimeScene({ onBackToLobby, onComplete, difficulty, onNext }) {
  const [selectedAlgo, setSelectedAlgo] = useState(null);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function handleVerify() {
    sounds.playClick();
    if (selectedAlgo === "linear") {
      setSolved(true);
      onComplete();
    } else {
      sounds.playError();
      setFeedback({
        type: "error",
        message: "Forensic Mismatch! 10 % 7 = 3. 17 % 7 = 3 (collided, moved +1 to 4). 24 % 7 = 3 (collided, collided, moved +1 to 5). This continuous adjacent block [3, 4, 5] is produced by Linear Probing!"
      });
    }
  }

  return (
    <div className="hl-panel">
      <div className="hl-panel-header">
        <div>
          <h3 className="hl-panel-title">
            <Fingerprint size={22} color="#a855f7" />
            Room 5: The Algorithm Crime Scene
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
            A corrupt memory segment contains: Bucket 3 = 10, Bucket 4 = 17, Bucket 5 = 24 (Capacity 7). Deduce the algorithm!
          </p>
        </div>
        <button type="button" className="hl-back-btn" onClick={onBackToLobby}>
          <ArrowLeft size={16} />
          <span>Mission Map</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", margin: "20px 0" }}>
        {[
          { id: "linear", label: "Linear Probing (+1 step)" },
          { id: "quadratic", label: "Quadratic Probing (+i²)" },
          { id: "chaining", label: "Separate Chaining" },
          { id: "double", label: "Double Hashing" }
        ].map((algo) => (
          <button
            key={algo.id}
            type="button"
            className={`hl-action-btn ${selectedAlgo === algo.id ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "14px", textAlign: "left", justifyContent: "flex-start" }}
            onClick={() => {
              sounds.playClick();
              setSelectedAlgo(algo.id);
            }}
          >
            <span>{algo.label}</span>
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`hl-feedback-card ${feedback.type === "error" ? "incorrect" : "correct"}`}>
          <AlertTriangle size={20} />
          <div style={{ fontSize: "0.9rem" }}>{feedback.message}</div>
        </div>
      )}

      <div className="hl-btn-row" style={{ marginTop: "24px", justifyContent: "space-between" }}>
        <button type="button" className="hl-action-btn btn-primary" onClick={handleVerify} disabled={solved || !selectedAlgo}>
          <span>Submit Algorithm Deduction</span>
        </button>

        {solved && (
          <button type="button" className="hl-action-btn btn-success" onClick={onNext}>
            <span>Proceed to Vault</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   FINAL VAULT ASSEMBLY: MASTER CIPHER PIPELINE
   Meaningful 5-stage hashing architecture calibration console.
   ========================================================= */
const VAULT_PIPELINE_STAGES = [
  {
    stageNum: 1,
    title: "Stage 1: Key Ingestion",
    role: "Primary Hash Function",
    expectedFragment: "MODULO_CORE",
    chamber: "Chamber 1 (The Hash Gate)",
    formula: "h(k) = k mod 7",
    description: "Calculates initial bucket coordinates for incoming raw keys (17, 24, 31, 19).",
    cipherTag: "MOD_7"
  },
  {
    stageNum: 2,
    title: "Stage 2: Collision Resolver",
    role: "Open-Addressing Stepper",
    expectedFragment: "LINEAR_ROUTER",
    chamber: "Chamber 2 (Collision Chamber)",
    formula: "(h(k) + i) mod 7",
    description: "Probes sequential slots (+1 step) to navigate index collisions.",
    cipherTag: "PROBE_+1"
  },
  {
    stageNum: 3,
    title: "Stage 3: Pointer Linker",
    role: "Separate Chaining",
    expectedFragment: "CHAIN_LINKER",
    chamber: "Chamber 3 (The Broken Chain)",
    formula: "Node.next -> Key 21",
    description: "Maintains linked list pointers for bucket overflow without cluster collisions.",
    cipherTag: "PTR_CHAIN"
  },
  {
    stageNum: 4,
    title: "Stage 4: Table Resizer",
    role: "Load Factor Rehasher",
    expectedFragment: "REHASH_EXPANDER",
    chamber: "Chamber 4 (Overflow Reactor)",
    formula: "M = 11 (Prime Resize)",
    description: "Expands capacity when load factor exceeds safety threshold α ≥ 0.70.",
    cipherTag: "REHASH_11"
  },
  {
    stageNum: 5,
    title: "Stage 5: Forensic Auditor",
    role: "Algorithm Verifier",
    expectedFragment: "FORENSIC_DECODER",
    chamber: "Chamber 5 (Algorithm Crime Scene)",
    formula: "Signature: Adjacent Block",
    description: "Audits memory layout to verify integrity against probing signatures.",
    cipherTag: "AUDIT_OK"
  }
];

const VAULT_FRAGMENT_METADATA = {
  MODULO_CORE: {
    id: "MODULO_CORE",
    name: "Modulo Core h(k)",
    targetStage: 1,
    concept: "Primary Hash Function",
    icon: Key,
    room: "Chamber 1",
    formula: "h(k) = k mod 7",
    summary: "Maps keys to initial bucket indexes via modulo division."
  },
  LINEAR_ROUTER: {
    id: "LINEAR_ROUTER",
    name: "Linear Router (+1)",
    targetStage: 2,
    concept: "Open-Addressing Linear Probing",
    icon: Zap,
    room: "Chamber 2",
    formula: "Step Vector: +1 adjacent",
    summary: "Resolves index collisions sequentially."
  },
  CHAIN_LINKER: {
    id: "CHAIN_LINKER",
    name: "Chain Linker",
    targetStage: 3,
    concept: "Separate Chaining Pointers",
    icon: GitBranch,
    room: "Chamber 3",
    formula: "Node.next = Key 21",
    summary: "Restores severed links in bucket collision chains."
  },
  REHASH_EXPANDER: {
    id: "REHASH_EXPANDER",
    name: "Rehash Expander",
    targetStage: 4,
    concept: "Load Factor & Prime Rehashing",
    icon: Flame,
    room: "Chamber 4",
    formula: "Resize to Prime M = 11",
    summary: "Cools overheated tables by doubling to prime capacity."
  },
  FORENSIC_DECODER: {
    id: "FORENSIC_DECODER",
    name: "Forensic Decoder",
    targetStage: 5,
    concept: "Memory Pattern Verification",
    icon: Fingerprint,
    room: "Chamber 5",
    formula: "Cluster Signature = Linear Probing",
    summary: "Audits memory layout to verify algorithm integrity."
  }
};

function FinalVaultAssembly({ completedRooms, elapsedSeconds, onBackToLobby, onEscapeComplete }) {
  // Sockets 1 to 5 mapping: { 1: fragmentId | null, ... }
  const [sockets, setSockets] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
  });
  const [feedback, setFeedback] = useState(null);
  const [isOverriding, setIsOverriding] = useState(false);

  // All 5 fragment IDs
  const allFragmentKeys = Object.keys(VAULT_FRAGMENT_METADATA);

  // Check which fragments are currently installed
  const installedFragments = Object.values(sockets).filter(Boolean);

  // Check how many sockets are correctly calibrated
  const correctlyCalibratedCount = VAULT_PIPELINE_STAGES.filter(
    (stage) => sockets[stage.stageNum] === stage.expectedFragment
  ).length;

  const isPipelineComplete = correctlyCalibratedCount === 5;

  function handleInstallFragment(fragId) {
    sounds.playClick();

    // Find first empty socket
    const emptyStage = VAULT_PIPELINE_STAGES.find((s) => !sockets[s.stageNum]);
    if (!emptyStage) {
      setFeedback({
        type: "info",
        message: "All 5 sockets are filled! Eject a socket if you wish to swap fragments."
      });
      return;
    }

    const stageNum = emptyStage.stageNum;
    const isCorrect = emptyStage.expectedFragment === fragId;
    const fragMeta = VAULT_FRAGMENT_METADATA[fragId];

    setSockets((prev) => ({ ...prev, [stageNum]: fragId }));

    if (isCorrect) {
      setFeedback({
        type: "correct",
        message: `Stage ${stageNum} calibrated! [${fragMeta.name}] energized for ${emptyStage.role}.`
      });
    } else {
      setFeedback({
        type: "incorrect",
        message: `Notice: [${fragMeta.name}] was placed into Stage ${stageNum} (${emptyStage.title}), but belongs to Stage ${fragMeta.targetStage}. Click 'Eject' to reposition.`
      });
    }
  }

  function handleEjectSocket(stageNum) {
    sounds.playClick();
    const ejected = sockets[stageNum];
    setSockets((prev) => ({ ...prev, [stageNum]: null }));
    if (ejected) {
      setFeedback({
        type: "info",
        message: `Ejected [${VAULT_FRAGMENT_METADATA[ejected].name}] from Stage ${stageNum}.`
      });
    }
  }

  function handleAutoCalibrate() {
    sounds.playClick();
    setSockets({
      1: "MODULO_CORE",
      2: "LINEAR_ROUTER",
      3: "CHAIN_LINKER",
      4: "REHASH_EXPANDER",
      5: "FORENSIC_DECODER"
    });
    setFeedback({
      type: "correct",
      message: "Master Hashing Pipeline Auto-Calibrated! All 5 circuits fully energized."
    });
  }

  function handleClearAll() {
    sounds.playClick();
    setSockets({ 1: null, 2: null, 3: null, 4: null, 5: null });
    setFeedback(null);
  }

  function handleExecuteOverride() {
    if (!isPipelineComplete) return;
    sounds.playCelebration();
    setIsOverriding(true);
    setFeedback({
      type: "correct",
      message: "EMERGENCY OVERRIDE GRANTED! Decoupling magnetic blast door clamps..."
    });

    setTimeout(() => {
      onEscapeComplete();
    }, 1400);
  }

  return (
    <div className="hl-vault-console">
      {/* Console Header */}
      <div className="hl-panel-header" style={{ borderColor: "rgba(245, 158, 11, 0.3)" }}>
        <div>
          <h3 className="hl-panel-title" style={{ color: "#f59e0b" }}>
            <Unlock size={24} color="#f59e0b" />
            Master Vault: Cryptographic Hash Core
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "4px" }}>
            Calibrate the facility's 5-stage hashing engine to override the lockdown blast doors.
          </p>
        </div>
        <button type="button" className="hl-back-btn" onClick={onBackToLobby} disabled={isOverriding}>
          <ArrowLeft size={16} />
          <span>Mission Map</span>
        </button>
      </div>

      {/* Meaningful Mission Briefing Box */}
      <div className="hl-vault-objective-box">
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <ShieldAlert size={22} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f59e0b", marginBottom: "4px" }}>
              HOW TO UNLOCK THE FINAL VAULT:
            </h4>
            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
              The facility blast doors are controlled by an end-to-end <strong>5-Stage Hash Index Pipeline</strong>.
              Each chamber you conquered yielded a crucial component of this architecture.
              Install your <strong>5 acquired fragments</strong> into their matching <strong>pipeline stages (Stage 1 to 5)</strong> below to energize the conduit and decouple the doors.
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Status Summary Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Pipeline Power:
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontWeight: 800,
              fontSize: "1rem",
              color: isPipelineComplete ? "#10b981" : "#f59e0b",
              padding: "4px 10px",
              background: isPipelineComplete ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
              borderRadius: "6px",
              border: `1px solid ${isPipelineComplete ? "#10b981" : "#f59e0b"}`
            }}
          >
            {correctlyCalibratedCount} / 5 STAGES CALIBRATED
          </span>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="hl-action-btn btn-secondary"
            style={{ fontSize: "0.82rem", padding: "6px 12px" }}
            onClick={handleAutoCalibrate}
            disabled={isOverriding || isPipelineComplete}
            title="Automatically assemble all fragments into their correct stages"
          >
            <Sparkles size={14} color="#f59e0b" />
            <span>Auto-Calibrate Pipeline</span>
          </button>
          <button
            type="button"
            className="hl-action-btn btn-secondary"
            style={{ fontSize: "0.82rem", padding: "6px 12px" }}
            onClick={handleClearAll}
            disabled={isOverriding || installedFragments.length === 0}
          >
            <RotateCcw size={14} />
            <span>Clear Sockets</span>
          </button>
        </div>
      </div>

      {/* 5-STAGE PIPELINE SOCKETS */}
      <div className="hl-vault-pipeline">
        {VAULT_PIPELINE_STAGES.map((stage) => {
          const installedId = sockets[stage.stageNum];
          const isInstalled = !!installedId;
          const isCorrect = isInstalled && installedId === stage.expectedFragment;
          const isMismatch = isInstalled && !isCorrect;
          const fragMeta = installedId ? VAULT_FRAGMENT_METADATA[installedId] : null;
          const IconComp = fragMeta ? fragMeta.icon : Key;

          return (
            <div
              key={stage.stageNum}
              className={`hl-vault-socket ${isCorrect ? "calibrated" : isMismatch ? "mismatched" : ""}`}
            >
              <div>
                <div className="hl-vault-stage-tag">
                  <span>STAGE 0{stage.stageNum}</span>
                  {isCorrect && (
                    <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={13} /> OK
                    </span>
                  )}
                  {isMismatch && (
                    <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "4px" }}>
                      <AlertTriangle size={13} /> MISMATCH
                    </span>
                  )}
                </div>

                <div className="hl-vault-stage-name">{stage.title}</div>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--accent-secondary)", marginBottom: "4px" }}>
                  {stage.role}
                </div>
                <div className="hl-vault-stage-desc">{stage.description}</div>
              </div>

              {/* Socket Receptacle Content */}
              <div style={{ marginTop: "12px", borderTop: "1px dashed var(--border-main)", paddingTop: "10px" }}>
                {isInstalled ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <IconComp size={16} color={isCorrect ? "#10b981" : "#ef4444"} />
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, fontFamily: "monospace", color: isCorrect ? "#10b981" : "#ef4444" }}>
                        {fragMeta.name}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                      {fragMeta.formula}
                    </div>

                    <button
                      type="button"
                      className="hl-action-btn btn-secondary"
                      style={{
                        width: "100%",
                        marginTop: "8px",
                        padding: "4px 8px",
                        fontSize: "0.74rem",
                        height: "auto"
                      }}
                      onClick={() => handleEjectSocket(stage.stageNum)}
                      disabled={isOverriding}
                    >
                      Eject Fragment
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "10px 4px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                      [ Empty Socket ]
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#f59e0b", marginTop: "4px" }}>
                      Requires: {stage.chamber.split(":")[0]}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* LIVE CRYPTOGRAPHIC CIPHER CONDUIT */}
      <div className="hl-vault-cipher-terminal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "0.78rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
            CRYPTOGRAPHIC POWER CONDUIT STREAM
          </span>
          <span style={{ fontSize: "0.78rem", color: isPipelineComplete ? "#34d399" : "#fbbf24" }}>
            {isPipelineComplete ? "STATUS: 100% SYNCHRONIZED" : "STATUS: AWAITING CALIBRATION"}
          </span>
        </div>

        <div className="hl-vault-cipher-conduit">
          {VAULT_PIPELINE_STAGES.map((s, idx) => {
            const isInstalled = sockets[s.stageNum] === s.expectedFragment;
            return (
              <React.Fragment key={s.stageNum}>
                <div className={`hl-vault-cipher-node ${isInstalled ? "active" : ""}`}>
                  {isInstalled ? `✓ [${s.cipherTag}]` : `○ [${s.cipherTag}]`}
                </div>
                {idx < VAULT_PIPELINE_STAGES.length - 1 && (
                  <span style={{ color: isInstalled ? "#34d399" : "#475569", fontWeight: 800 }}>──►</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div className={`hl-feedback-card ${feedback.type === "incorrect" ? "incorrect" : feedback.type === "correct" ? "correct" : "info"}`}>
          {feedback.type === "incorrect" ? (
            <AlertTriangle size={20} />
          ) : (
            <CheckCircle2 size={20} />
          )}
          <div style={{ fontSize: "0.9rem" }}>{feedback.message}</div>
        </div>
      )}

      {/* UNLOCKED FRAGMENTS INVENTORY */}
      <div style={{ marginTop: "24px" }}>
        <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
          Your Verified Chamber Fragments Inventory (Click to Place in Next Empty Socket):
        </h4>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px" }}>
          {allFragmentKeys.map((fragId) => {
            const frag = VAULT_FRAGMENT_METADATA[fragId];
            const isAssigned = installedFragments.includes(fragId);
            const IconComponent = frag.icon;

            return (
              <button
                key={fragId}
                type="button"
                className={`hl-vault-fragment-card ${isAssigned ? "assigned" : ""}`}
                onClick={() => !isAssigned && handleInstallFragment(fragId)}
                disabled={isAssigned || isOverriding}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span className="hl-card-pill" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", fontSize: "0.72rem" }}>
                      {frag.room}
                    </span>
                    <IconComponent size={18} color="#f59e0b" />
                  </div>

                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>
                    {frag.name}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--accent-secondary)", fontWeight: 600, marginBottom: "6px" }}>
                    {frag.concept}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                    {frag.summary}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border-main)", paddingTop: "8px", marginTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-muted)" }}>
                    {frag.formula}
                  </span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: isAssigned ? "var(--text-muted)" : "#10b981" }}>
                    {isAssigned ? "✓ Installed" : "+ Install →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FINAL OVERRIDE SUBMISSION ROW */}
      <div className="hl-btn-row" style={{ marginTop: "32px", justifyContent: "center" }}>
        <button
          type="button"
          className="hl-action-btn btn-success"
          style={{
            fontSize: "1.1rem",
            padding: "16px 40px",
            fontWeight: 800,
            borderRadius: "10px",
            boxShadow: isPipelineComplete ? "0 0 24px rgba(16, 185, 129, 0.45)" : "none",
            transform: isPipelineComplete ? "scale(1.02)" : "none"
          }}
          onClick={handleExecuteOverride}
          disabled={!isPipelineComplete || isOverriding}
        >
          <Unlock size={22} />
          <span>
            {isOverriding
              ? "DECOUPLING FACILITY BLAST DOORS..."
              : isPipelineComplete
              ? "EXECUTE MASTER OVERRIDE & ESCAPE FACILITY"
              : `CALIBRATE ALL 5 STAGES TO OVERRIDE (${correctlyCalibratedCount}/5)`}
          </span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   VICTORY DEBRIEF & MISSION REPORT
   ========================================================= */
function VictoryDebrief({ elapsedSeconds, hintsUsed, onReplay, onBackToLobby }) {
  const navigate = useNavigate();
  const calculatedScore = Math.max(250, 500 - (hintsUsed || 0) * 25);

  return (
    <div className="hl-panel" style={{ textAlign: "center", padding: "40px 24px" }}>
      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", border: "2px solid #10b981", color: "#10b981", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)" }}>
        <Trophy size={44} />
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
        <Sparkles size={14} /> Mission Accomplished
      </div>

      <h2 style={{ fontSize: "2.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
        Game Finished Successfully!
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto 28px" }}>
        Facility Blast Doors Unlocked! You solved all five lockdown chambers, repaired broken chains, resized saturated tables, and calibrated the Master Cipher Console to escape the facility.
      </p>

      {/* Debrief Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", maxWidth: "800px", margin: "0 auto 32px" }}>
        <div style={{ background: "var(--bg-card-muted)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)", borderLeft: "4px solid #f59e0b" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Final Score</span>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f59e0b", fontFamily: "monospace" }}>
            {calculatedScore} / 500 pts
          </div>
        </div>

        <div style={{ background: "var(--bg-card-muted)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)", borderLeft: "4px solid #2563eb" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Time Taken</span>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2563eb", fontFamily: "monospace" }}>
            {Math.floor(elapsedSeconds / 60)}m {(elapsedSeconds % 60).toString().padStart(2, "0")}s
          </div>
        </div>

        <div style={{ background: "var(--bg-card-muted)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)", borderLeft: "4px solid #10b981" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Chambers Cleared</span>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#10b981", fontFamily: "monospace" }}>5 / 5 ✓</div>
        </div>

        <div style={{ background: "var(--bg-card-muted)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)", borderLeft: "4px solid #a855f7" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>XP Granted</span>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#a855f7", fontFamily: "monospace" }}>+300 XP</div>
        </div>
      </div>

      {/* Concepts Mastered Checklist */}
      <div style={{ maxWidth: "600px", margin: "0 auto 32px", textAlign: "left", background: "var(--bg-card-muted)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-main)" }}>
        <h4 style={{ fontSize: "0.92rem", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase", color: "var(--text-muted)" }}>
          Concepts Mastered:
        </h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem" }}>
          <li>✓ Modulo arithmetic & Pigeonhole Collision principle</li>
          <li>✓ Open addressing linear probing sequence verification</li>
          <li>✓ Separate chaining linked list traversal and pointer repair</li>
          <li>✓ Load factor triggers (α ≥ 0.70) & prime table expansion</li>
          <li>✓ Memory snapshot forensic algorithm deduction</li>
          <li>✓ 5-Stage Hash Pipeline calibration & cipher assembly</li>
        </ul>
      </div>

      {/* Action Buttons: Restart & Exit */}
      <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
        <button type="button" className="hl-action-btn btn-secondary" onClick={onReplay}>
          <RotateCcw size={16} />
          <span>Restart Game</span>
        </button>
        <button type="button" className="hl-action-btn btn-secondary" onClick={onBackToLobby}>
          <span>Return to Facility Map</span>
        </button>
        <button
          type="button"
          className="hl-action-btn btn-primary"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)", borderColor: "#10b981", display: "inline-flex", alignItems: "center", gap: "8px" }}
          onClick={() => navigate("/games")}
        >
          <LogOut size={16} />
          <span>Exit to Games Hub</span>
        </button>
      </div>
    </div>
  );
}
