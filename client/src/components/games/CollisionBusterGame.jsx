import React, { useState } from "react";
import {
  Zap,
  Flame,
  RotateCcw,
  Play,
  Sparkles,
  RefreshCw,
  Target,
  CheckCircle2,
  Star,
  Coins
} from "lucide-react";
import { sounds } from "../../utils/soundEffects.js";

export default function CollisionBusterGame({ awardXp, onCelebrate, level = 1, totalScore = 0 }) {
  const [difficulty, setDifficulty] = useState("normal"); // "easy" (size 5) | "normal" (size 7) | "hard" (size 11)
  const [strategy, setStrategy] = useState("linear"); // "linear" | "quadratic" | "chaining"
  const [score, setScore] = useState(25873);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [currentKey, setCurrentKey] = useState(24);
  const [isProbing, setIsProbing] = useState(false);
  const [activeProbeSlot, setActiveProbeSlot] = useState(null);
  const [probeHistory, setProbeHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const tableSize = difficulty === "easy" ? 5 : difficulty === "normal" ? 7 : 11;

  const [table, setTable] = useState(() =>
    Array.from({ length: 7 }, (_, id) => ({ id, keys: [] }))
  );

  const homeSlot = currentKey % tableSize;
  const totalKeys = table.reduce((acc, b) => acc + b.keys.length, 0);
  const loadFactor = (totalKeys / tableSize).toFixed(2);
  const isCrowded = totalKeys / tableSize >= 0.70;

  function handleDifficultyChange(diff) {
    sounds.playClick();
    setDifficulty(diff);
    const newSize = diff === "easy" ? 5 : diff === "normal" ? 7 : 11;
    const newTable = Array.from({ length: newSize }, (_, id) => ({ id, keys: [] }));
    setTable(newTable);
    setCurrentKey(generateKey(newTable, newSize));
    setFeedback(null);
    setProbeHistory([]);
    setActiveProbeSlot(null);
  }

  function generateKey(curTable = table, size = tableSize) {
    const occupied = curTable
      .map((b, i) => (b.keys.length > 0 ? i : null))
      .filter((v) => v !== null);

    if (occupied.length > 0 && Math.random() > 0.3) {
      const target = occupied[Math.floor(Math.random() * occupied.length)];
      return target + (Math.floor(Math.random() * 6) + 1) * size;
    }
    return Math.floor(Math.random() * 50) + 1;
  }

  async function triggerProbe(userTargetSlot = null) {
    if (isProbing || feedback || gameOver) return;

    setIsProbing(true);
    setProbeHistory([]);
    sounds.playWhoosh();

    const home = currentKey % tableSize;

    if (strategy === "chaining") {
      const target = home;
      setActiveProbeSlot(target);
      await new Promise((r) => setTimeout(r, 450));

      const bucket = table[target];
      const willCollide = bucket.keys.length > 0;

      if (willCollide) {
        sounds.playChainLink();
      } else {
        sounds.playSuccess();
      }

      const isCorrect = userTargetSlot === null || userTargetSlot === target;
      finishTurn(target, isCorrect, willCollide, [
        { slot: target, status: willCollide ? "chained" : "vacant", step: 0 }
      ]);
    } else {
      let currentStep = 0;
      let finalSlot = null;
      const history = [];

      while (currentStep < tableSize) {
        let probeIndex;
        if (strategy === "linear") {
          probeIndex = (home + currentStep) % tableSize;
        } else {
          probeIndex = (home + currentStep * currentStep) % tableSize;
        }

        setActiveProbeSlot(probeIndex);
        const isOccupied = table[probeIndex].keys.length > 0;

        history.push({
          slot: probeIndex,
          status: isOccupied ? "collision" : "vacant",
          step: currentStep,
        });
        setProbeHistory([...history]);

        if (isOccupied) {
          sounds.playCartoonBoing();
          await new Promise((r) => setTimeout(r, 400));
          currentStep++;
        } else {
          finalSlot = probeIndex;
          sounds.playSuccess();
          break;
        }
      }

      const isCorrect =
        finalSlot !== null &&
        (userTargetSlot === null || userTargetSlot === finalSlot);

      finishTurn(finalSlot, isCorrect, currentStep > 0, history);
    }
  }

  function finishTurn(landSlot, isCorrect, hadCollision, history) {
    setIsProbing(false);
    setActiveProbeSlot(null);

    if (landSlot === null) {
      setFeedback({
        type: "error",
        title: "Table Full!",
        text: `All ${tableSize} slots occupied! Click 'REHASH' to resize the table.`,
      });
      sounds.playError();
      return;
    }

    if (isCorrect) {
      const addedPoints = (hadCollision ? 600 : 350) * (streak + 1);
      setScore((s) => s + addedPoints);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      awardXp(25);
      sounds.playCombo(nextStreak);

      if (nextStreak >= 3 && onCelebrate) {
        onCelebrate();
      }

      const updated = table.map((b) =>
        b.id === landSlot ? { ...b, keys: [...b.keys, currentKey] } : b
      );
      setTable(updated);

      let expl = "";
      if (strategy === "chaining") {
        expl = hadCollision
          ? `Collision at Slot [${homeSlot}]! Key ${currentKey} was linked to the chain list.`
          : `Clean placement! Slot [${homeSlot}] was open.`;
      } else if (strategy === "linear") {
        expl = hadCollision
          ? `Slot [${homeSlot}] was taken. Linear Probing stepped forward to empty Slot [${landSlot}]!`
          : `Clean Hit! Slot [${homeSlot}] was empty.`;
      } else {
        expl = hadCollision
          ? `Slot [${homeSlot}] was taken. Quadratic Probing leaped using (step²) into Slot [${landSlot}]!`
          : `Clean Hit! Slot [${homeSlot}] was open.`;
      }

      setFeedback({
        type: "success",
        title: hadCollision ? "Collision Solved!" : "Direct Hit!",
        text: expl,
      });
    } else {
      setStreak(0);
      sounds.playError();
      setFeedback({
        type: "error",
        title: "Wrong Slot!",
        text: `Under ${strategy.toUpperCase()}, Key ${currentKey} actually lands in Slot [${landSlot}].`,
      });
    }
  }

  function nextTurn() {
    if (round >= 8) {
      setGameOver(true);
      sounds.playCelebration();
      awardXp(60);
      if (onCelebrate) onCelebrate();
      return;
    }
    setRound((r) => r + 1);
    setCurrentKey(generateKey(table, tableSize));
    setFeedback(null);
    setProbeHistory([]);
    setActiveProbeSlot(null);
  }

  function handleRehash() {
    sounds.playPowerUp();
    const newSize = tableSize === 5 ? 11 : tableSize === 7 ? 13 : 17;
    const allKeys = table.flatMap((b) => b.keys);
    const newTable = Array.from({ length: newSize }, (_, id) => ({ id, keys: [] }));

    allKeys.forEach((k) => {
      const h = k % newSize;
      if (strategy === "chaining") {
        newTable[h].keys.push(k);
      } else {
        for (let i = 0; i < newSize; i++) {
          const probe = (h + i) % newSize;
          if (newTable[probe].keys.length === 0) {
            newTable[probe].keys.push(k);
            break;
          }
        }
      }
    });

    setTable(newTable);
    setCurrentKey(generateKey(newTable, newSize));
    setFeedback({
      type: "success",
      title: "Table Resized (Rehashed)!",
      text: `Expanded table to ${newSize} slots! Items redistributed with % ${newSize}.`,
    });
    awardXp(40);
  }

  function restart() {
    setScore(25873);
    setStreak(0);
    setRound(1);
    const empty = Array.from({ length: tableSize }, (_, id) => ({ id, keys: [] }));
    setTable(empty);
    setCurrentKey(generateKey(empty, tableSize));
    setFeedback(null);
    setProbeHistory([]);
    setActiveProbeSlot(null);
    setGameOver(false);
  }

  return (
    <div className="ice-panel">
      {/* 3 Golden Stars on top of the card (Matching bottom-left of reference image) */}
      <div className="ice-stars-crown">
        <Star size={34} fill="#fbbd23" color="#78350f" className="ice-crown-star star-left" />
        <Star size={44} fill="#fbbd23" color="#78350f" className="ice-crown-star star-mid" />
        <Star size={34} fill="#fbbd23" color="#78350f" className="ice-crown-star star-right" />
      </div>

      {/* Level Header */}
      <div className="ice-panel-header">
        <h2 className="ice-panel-title">LEVEL {level} : COLLISION LAB</h2>
        <p className="ice-panel-desc">
          Calculate the home slot for incoming numbers. If a slot is already full, resolve the collision!
        </p>
      </div>

      {/* Difficulty Selector (Matching top-right of reference image) */}
      <div className="ice-difficulty-card">
        <div className="ice-difficulty-header">DIFFICULTY</div>
        <div className="ice-difficulty-buttons">
          <button
            type="button"
            className={`ice-diff-btn ${difficulty === "easy" ? "active" : ""}`}
            onClick={() => handleDifficultyChange("easy")}
          >
            EASY (5 SLOTS)
          </button>
          <button
            type="button"
            className={`ice-diff-btn ${difficulty === "normal" ? "active" : ""}`}
            onClick={() => handleDifficultyChange("normal")}
          >
            NORMAL (7 SLOTS)
          </button>
          <button
            type="button"
            className={`ice-diff-btn ${difficulty === "hard" ? "active" : ""}`}
            onClick={() => handleDifficultyChange("hard")}
          >
            HARD (11 SLOTS)
          </button>
        </div>
      </div>

      {/* Strategy Switcher */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { id: "linear", label: "Linear Probing (+1 Step)" },
          { id: "quadratic", label: "Quadratic Probing (Step²)" },
          { id: "chaining", label: "Separate Chaining (Chain List)" },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            className={`ice-diff-btn ${strategy === s.id ? "active" : ""}`}
            style={{ fontSize: "12px", minWidth: "150px" }}
            onClick={() => {
              sounds.playClick();
              setStrategy(s.id);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Score & Reward Indented Displays (Matching reference image) */}
      <div className="ice-hud-row">
        <div style={{ flex: 1, minWidth: "140px" }}>
          <span className="ice-inset-label">SCORE</span>
          <div className="ice-inset-box">{score}</div>
        </div>

        <div style={{ flex: 1, minWidth: "140px" }}>
          <span className="ice-inset-label">REWARD</span>
          <div className="ice-inset-box">+{streak * 20 + 50} COINS</div>
        </div>

        <div style={{ flex: 1, minWidth: "140px" }}>
          <span className="ice-inset-label">LOAD FACTOR</span>
          <div className="ice-inset-box">{loadFactor}</div>
        </div>
      </div>

      {!gameOver ? (
        <>
          {/* Incoming Number Card & Formula */}
          <div className="ice-launch-stage">
            <div className="ice-key-orb-box">
              <div className="ice-key-orb">
                <small>NUMBER</small>
                <strong>{currentKey}</strong>
              </div>

              <div className="ice-formula-box">
                <div className="ice-formula-display">
                  <span>Target Home Slot:</span>
                  <code>{currentKey} % {tableSize} = Slot [{homeSlot}]</code>
                </div>
                <div className="ice-formula-hint">
                  {strategy === "linear" && "Linear Probing: If Slot [" + homeSlot + "] is full, check the next slot (+1)!"}
                  {strategy === "quadratic" && "Quadratic Probing: If Slot [" + homeSlot + "] is full, jump by squares (+1, +4, +9)!"}
                  {strategy === "chaining" && "Separate Chaining: Key attaches to Slot [" + homeSlot + "]'s chain list!"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => triggerProbe(null)}
                disabled={isProbing || !!feedback}
                className="ice-action-btn"
              >
                <Play size={18} fill="currentColor" /> LAUNCH
              </button>

              <button
                type="button"
                onClick={handleRehash}
                className="ice-action-btn btn-gold"
                title="Resize table when it gets full"
              >
                <RefreshCw size={16} /> REHASH ({tableSize})
              </button>
            </div>
          </div>

          {/* Slots Array (Frosty Ice Pedestals) */}
          <div className="ice-slots-grid">
            {table.map((bucket) => {
              const isHome = bucket.id === homeSlot;
              const isActive = activeProbeSlot === bucket.id;
              const isOccupied = bucket.keys.length > 0;

              return (
                <div
                  key={bucket.id}
                  onClick={() => !isProbing && !feedback && triggerProbe(bucket.id)}
                  className={`ice-slot-card ${isHome ? "is-home-target" : ""} ${
                    isActive ? "is-probing-active" : ""
                  }`}
                >
                  <span className="ice-slot-number-pill">SLOT [{bucket.id}]</span>
                  {isHome && <span className="ice-home-badge">HOME</span>}

                  <div style={{ display: "flex", alignItems: "center", gap: "4px", margin: "10px 0" }}>
                    {!isOccupied ? (
                      <span className="ice-slot-empty-label">Empty</span>
                    ) : strategy === "chaining" ? (
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                        {bucket.keys.map((k, i) => (
                          <div key={i} className="ice-slot-val-chip" style={{ width: "38px", height: "38px", fontSize: "14px" }}>
                            {k}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="ice-slot-val-chip">{bucket.keys[0]}</div>
                    )}
                  </div>

                  <small style={{ fontSize: "10px", color: "#175480", fontWeight: 800 }}>
                    {!isOccupied ? "Click to guess" : "Occupied"}
                  </small>
                </div>
              );
            })}
          </div>

          {/* Turn Feedback Popup with OK Button (Matching bottom-left of reference image) */}
          {feedback && (
            <div className={`ice-feedback-popup ${feedback.type}`}>
              <div>
                <h4 className="ice-feedback-title">{feedback.title}</h4>
                <p className="ice-feedback-text">{feedback.text}</p>
              </div>
              <button
                type="button"
                onClick={nextTurn}
                className="ice-action-btn btn-green"
              >
                OK
              </button>
            </div>
          )}
        </>
      ) : (
        /* Victory Screen with OK / Replay */
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Sparkles size={54} color="#f59e0b" style={{ margin: "0 auto 10px" }} />
          <h3 className="ice-panel-title">LEVEL CLEARED!</h3>
          <p className="ice-panel-desc" style={{ marginBottom: "20px" }}>
            You solved all collision rounds with a score of <strong>{score}</strong>!
          </p>
          <button
            type="button"
            onClick={restart}
            className="ice-action-btn btn-green"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
