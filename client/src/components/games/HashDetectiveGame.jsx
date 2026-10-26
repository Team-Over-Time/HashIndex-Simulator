import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  Star,
  Scroll
} from "lucide-react";
import { sounds } from "../../utils/soundEffects.js";

const FORENSIC_CASES = [
  {
    id: 1,
    title: "CASE 1: The Straight-Line Jam",
    difficulty: "EASY",
    m: 7,
    keys: [8, 15, 22, 29],
    homeFormula: "Home slot: Key % 7 = 1 for all numbers!",
    clue: "Look at Slots [1, 2, 3, 4]—they formed a continuous straight row! Which collision rule fills adjacent slots one-by-one?",
    timelineSteps: [
      { t: 0, desc: "Empty 7-slot table.", slots: ["empty", "empty", "empty", "empty", "empty", "empty", "empty"] },
      { t: 1, desc: "Key 8 placed in home Slot 1.", slots: ["empty", "8", "empty", "empty", "empty", "empty", "empty"] },
      { t: 2, desc: "Key 15 collided! Stepped to Slot 2.", slots: ["empty", "8", "15", "empty", "empty", "empty", "empty"] },
      { t: 3, desc: "Key 22 collided! Stepped to Slot 3.", slots: ["empty", "8", "15", "22", "empty", "empty", "empty"] },
      { t: 4, desc: "Key 29 collided! Stepped to Slot 4.", slots: ["empty", "8", "15", "22", "29", "empty", "empty"] },
    ],
    actualAlgorithm: "linear",
    explanations: {
      linear: "CORRECT! Linear Probing steps +1 sequentially into adjacent open slots, forming a cluster block.",
      quadratic: "Incorrect! Quadratic jumps by squares (+1, +4, +9), so Key 22 would have landed at Slot 5, not Slot 3!",
      chaining: "Incorrect! In Chaining, all numbers stay inside Slot 1's chain list. Slots 2, 3, 4 would remain empty!",
      double: "Incorrect! Double hashing uses key strides, which does not produce a continuous block [1, 2, 3, 4]!",
    },
  },
  {
    id: 2,
    title: "CASE 2: The Solitary Chain List",
    difficulty: "EASY",
    m: 5,
    keys: [12, 17, 22],
    homeFormula: "Home slot: Key % 5 = 2 for all numbers!",
    clue: "Slots 0, 1, 3, 4 are 100% empty! All items are hanging from Slot [2]!",
    timelineSteps: [
      { t: 0, desc: "Empty 5-slot table.", slots: ["empty", "empty", "empty", "empty", "empty"] },
      { t: 1, desc: "Key 12 in Slot 2.", slots: ["empty", "empty", "[12]", "empty", "empty"] },
      { t: 2, desc: "Key 17 chained behind 12.", slots: ["empty", "empty", "[12]->[17]", "empty", "empty"] },
      { t: 3, desc: "Key 22 chained behind 17.", slots: ["empty", "empty", "[12]->[17]->[22]", "empty", "empty"] },
    ],
    actualAlgorithm: "chaining",
    explanations: {
      chaining: "CORRECT! Separate Chaining attaches collided items in a list without touching any other slots!",
      linear: "Incorrect! Linear probing would have spilled into slots 3 and 4.",
      quadratic: "Incorrect! Open addressing populates the main array, not pointer nodes.",
      double: "Incorrect! Double hashing uses the primary array slots.",
    },
  },
  {
    id: 3,
    title: "CASE 3: The Squared Leap",
    difficulty: "NORMAL",
    m: 11,
    keys: [14, 25, 36],
    homeFormula: "Home slot: Key % 11 = 3 for all numbers!",
    clue: "Notice the leap intervals: Slot 3 -> Slot 4 (+1 jump) -> Slot 7 (+4 jump!). The jumps are 1² and 2²!",
    timelineSteps: [
      { t: 0, desc: "Table size 11 initialized.", slots: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"] },
      { t: 1, desc: "Key 14 in Slot 3.", slots: ["empty", "empty", "empty", "14", "empty", "empty", "empty", "empty", "empty", "empty", "empty"] },
      { t: 2, desc: "Key 25 leaped +1² -> Slot 4.", slots: ["empty", "empty", "empty", "14", "25", "empty", "empty", "empty", "empty", "empty", "empty"] },
      { t: 3, desc: "Key 36 leaped +2² (+4) -> Slot 7!", slots: ["empty", "empty", "empty", "14", "25", "empty", "empty", "36", "empty", "empty", "empty"] },
    ],
    actualAlgorithm: "quadratic",
    explanations: {
      quadratic: "CORRECT! The squared step intervals (+1², +2² = +4) jump right over crowded blocks!",
      linear: "Incorrect! Linear probing would have placed 36 into adjacent Slot 5.",
      chaining: "Incorrect! In chaining, all keys would stay in Slot 3's chain.",
      double: "Incorrect! Double hashing strides are linear multiples, not squares.",
    },
  },
  {
    id: 4,
    title: "CASE 4: The Second Formula Stride",
    difficulty: "HARD",
    m: 7,
    keys: [10, 17],
    homeFormula: "h1 = k % 7 = 3. Stride h2 = 5 - (k % 5).",
    clue: "Key 17 collided at Slot 3 and jumped forward by exactly +3 slots into Slot 6 using a second formula!",
    timelineSteps: [
      { t: 0, desc: "Table size 7 ready.", slots: ["empty", "empty", "empty", "empty", "empty", "empty", "empty"] },
      { t: 1, desc: "Key 10 in Slot 3.", slots: ["empty", "empty", "empty", "10", "empty", "empty", "empty"] },
      { t: 2, desc: "Key 17 stepped by 3 -> Slot 6!", slots: ["empty", "empty", "empty", "10", "empty", "empty", "17"] },
    ],
    actualAlgorithm: "double",
    explanations: {
      double: "CORRECT! Double Hashing uses a second hash formula to determine jump strides.",
      linear: "Incorrect! Linear probing stride is strictly +1.",
      quadratic: "Incorrect! Quadratic probe with step 1 lands in Slot 4.",
      chaining: "Incorrect! Chaining would keep 17 in Slot 3's list.",
    },
  },
];

export default function HashDetectiveGame({ awardXp, onCelebrate }) {
  const [caseIdx, setCaseIdx] = useState(0);
  const [timelineStep, setTimelineStep] = useState(0);
  const [selectedVerdict, setSelectedVerdict] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const curCase = FORENSIC_CASES[caseIdx];

  useEffect(() => {
    setTimelineStep(curCase.timelineSteps.length - 1);
    setSelectedVerdict(null);
    setIsRevealed(false);
  }, [caseIdx]);

  function handleVerdict(algo) {
    if (isRevealed) return;

    setSelectedVerdict(algo);
    setIsRevealed(true);
    sounds.playClick();

    const isCorrect = algo === curCase.actualAlgorithm;
    if (isCorrect) {
      sounds.playCelebration();
      awardXp(60);
      if (onCelebrate) onCelebrate();
    } else {
      sounds.playError();
    }
  }

  function handleNextCase() {
    sounds.playClick();
    if (caseIdx < FORENSIC_CASES.length - 1) {
      setCaseIdx((i) => i + 1);
    } else {
      setCaseIdx(0);
    }
  }

  const isCorrectVerdict = selectedVerdict === curCase.actualAlgorithm;

  return (
    <div className="ice-panel">
      {/* 3 Golden Stars */}
      <div className="ice-stars-crown">
        <Star size={34} fill="#fbbd23" color="#78350f" className="ice-crown-star star-left" />
        <Star size={44} fill="#fbbd23" color="#78350f" className="ice-crown-star star-mid" />
        <Star size={34} fill="#fbbd23" color="#78350f" className="ice-crown-star star-right" />
      </div>

      <div className="ice-panel-header">
        <h2 className="ice-panel-title">{curCase.title}</h2>
        <p className="ice-panel-desc">{curCase.homeFormula}</p>
      </div>

      {/* Case Tabs */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        {FORENSIC_CASES.map((c, idx) => (
          <button
            key={c.id}
            type="button"
            className={`ice-diff-btn ${caseIdx === idx ? "active" : ""}`}
            style={{ fontSize: "12px", minWidth: "110px", padding: "8px 12px" }}
            onClick={() => {
              sounds.playClick();
              setCaseIdx(idx);
            }}
          >
            Case {c.id} ({c.difficulty})
          </button>
        ))}
      </div>

      {/* Clue Box */}
      <div className="ice-detective-clue-card">
        <strong>🔍 DETECTIVE CLUE:</strong> {curCase.clue}
      </div>

      {/* Timeline Controls */}
      <div style={{ background: "rgba(255,255,255,0.4)", borderRadius: "16px", padding: "14px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: 900, color: "#0d3858" }}>REPLAY ARRIVAL TIMELINE:</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {curCase.timelineSteps.map((step, idx) => (
              <button
                key={idx}
                type="button"
                className={`ice-diff-btn ${timelineStep === idx ? "active" : ""}`}
                style={{ padding: "4px 10px", fontSize: "11px", minWidth: "auto" }}
                onClick={() => {
                  sounds.playClick();
                  setTimelineStep(idx);
                }}
              >
                Step {step.t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "13px", fontWeight: 800, color: "#175480", marginBottom: "12px" }}>
          {curCase.timelineSteps[timelineStep].desc}
        </div>

        {/* Visual Slots Row */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "4px 0" }}>
          {curCase.timelineSteps[timelineStep].slots.map((slotContent, sIdx) => {
            const isFilled = slotContent !== "empty";

            return (
              <div
                key={sIdx}
                className="ice-slot-card"
                style={{ minHeight: "80px", flex: 1, minWidth: "75px", padding: "8px" }}
              >
                <span className="ice-slot-number-pill" style={{ fontSize: "9px" }}>[{sIdx}]</span>
                <strong style={{ fontSize: "13px", color: isFilled ? "#0b4570" : "#6da2c4" }}>
                  {isFilled ? slotContent : "Empty"}
                </strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verdict Options */}
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ fontSize: "14px", fontWeight: 900, color: "#0d3858", marginBottom: "10px", textAlign: "center" }}>
          WHICH COLLISION RULE PRODUCED THIS LAYOUT?
        </h4>
        <div className="ice-verdict-grid">
          {[
            { id: "linear", name: "Linear Probing", sub: "Steps +1 to adjacent slots" },
            { id: "quadratic", name: "Quadratic Probing", sub: "Jumps by squares (+1, +4, +9)" },
            { id: "chaining", name: "Separate Chaining", sub: "Keeps items in a linked chain" },
            { id: "double", name: "Double Hashing", sub: "Jumps by a second formula stride" },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={isRevealed}
              onClick={() => handleVerdict(v.id)}
              className={`ice-verdict-btn ${selectedVerdict === v.id ? "active" : ""}`}
            >
              <strong>{v.name}</strong>
              <small>{v.sub}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Solved Judgment Popup with OK Button */}
      {isRevealed && (
        <div className={`ice-feedback-popup ${isCorrectVerdict ? "success" : "error"}`}>
          <div>
            <h4 className="ice-feedback-title">
              {isCorrectVerdict ? "CASE CRACKED!" : "WRONG DEDUCTION!"}
            </h4>
            <p className="ice-feedback-text">
              {curCase.explanations[selectedVerdict]}
            </p>
          </div>
          <button
            type="button"
            onClick={handleNextCase}
            className="ice-action-btn btn-green"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
