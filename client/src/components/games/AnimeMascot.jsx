import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Volume2,
  Lightbulb,
  Shuffle,
  Flame,
  Award,
  Bot,
  UserCheck
} from "lucide-react";
import { sounds } from "../../utils/soundEffects.js";

const HASHLAB_BEGINNER_TIPS = [
  "How it works: A hash table is like a row of numbered lockers. When a number arrives, we calculate its locker: Number % LockerCount!",
  "What is a Collision? If two numbers get assigned the exact same locker, they 'collide'! We need a rule to decide where the second number goes.",
  "Rule 1 - Linear Probing: If your locker is full, just check the next one (Locker + 1). If that's full, check the next (Locker + 2)!",
  "Rule 2 - Quadratic Probing: Instead of checking one-by-one, jump by squares (+1, +4, +9) so numbers don't crowd in a single clump!",
  "Rule 3 - Separate Chaining: Instead of moving to another locker, hang a chain of boxes underneath the locker so multiple items share it!",
  "What is Load Factor? It's simply: (Items in table) ÷ (Total lockers). If it's over 0.70 (70% full), searches slow down and we need to resize!",
  "What is Rehashing? When the table gets crowded, we double the lockers and re-calculate where every item belongs with the new locker count!",
  "Why is Head Insert fast? Adding a new item to the very FRONT of a chain takes 1 step (O(1) time), no matter how long the chain is!",
  "Why is Tail Insert slower? To add to the back, you have to walk through every single item in the chain first (O(N) time)!",
  "Why is O(1) so good? O(1) means 'Constant Time'—whether your database has 10 items or 10,000,000 items, lookup takes the exact same split-second!"
];

export default function AnimeMascot({
  reaction = "happy", // "happy" | "shocked" | "fire" | "focus" | "celebrate"
  customMessage = null,
  streak = 0,
}) {
  const [character, setCharacter] = useState("robot"); // "robot" | "professor"
  const [tipIndex, setTipIndex] = useState(0);
  const [isWink, setIsWink] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsWink(true);
      setTimeout(() => setIsWink(false), 240);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  function handleNextTip() {
    sounds.playClick();
    setTipIndex((prev) => (prev + 1) % HASHLAB_BEGINNER_TIPS.length);
  }

  function handleVoice() {
    const msg = customMessage || HASHLAB_BEGINNER_TIPS[tipIndex];
    sounds.speakAnimeQuote(msg);
  }

  function toggleCharacter() {
    sounds.playWhoosh();
    setCharacter((prev) => (prev === "robot" ? "professor" : "robot"));
  }

  const effectiveReaction = streak >= 5 ? "fire" : reaction;
  const currentSpeech = customMessage || HASHLAB_BEGINNER_TIPS[tipIndex];

  return (
    <div className={`hl-anime-companion ${effectiveReaction}`}>
      {/* Cartoon Avatar Box */}
      <div
        className="hl-mascot-avatar-wrap"
        onClick={toggleCharacter}
        title="Click to switch between Byte the Robot and Professor Hash!"
      >
        {character === "robot" ? (
          /* BYTE THE FRIENDLY ROBOT SVG */
          <svg
            className="hl-mascot-svg"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="botGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Antenna */}
            <line x1="50" y1="12" x2="50" y2="25" stroke="#18181b" strokeWidth="3" />
            <circle cx="50" cy="10" r="5" fill="#ffbe0b" stroke="#18181b" strokeWidth="2" />

            {/* Head Box */}
            <rect x="20" y="24" width="60" height="52" rx="14" fill="url(#botGrad)" stroke="#18181b" strokeWidth="3" />

            {/* Ear Bolts */}
            <rect x="14" y="42" width="6" height="16" rx="3" fill="#94a3b8" stroke="#18181b" strokeWidth="2" />
            <rect x="80" y="42" width="6" height="16" rx="3" fill="#94a3b8" stroke="#18181b" strokeWidth="2" />

            {/* Screen Visor */}
            <rect x="28" y="32" width="44" height="26" rx="8" fill="#0f172a" stroke="#18181b" strokeWidth="2" />

            {/* Eyes */}
            {effectiveReaction === "shocked" ? (
              <g>
                <circle cx="39" cy="45" r="5" fill="#f43f5e" />
                <circle cx="61" cy="45" r="5" fill="#f43f5e" />
                <circle cx="39" cy="45" r="2" fill="#fff" />
                <circle cx="61" cy="45" r="2" fill="#fff" />
              </g>
            ) : effectiveReaction === "fire" || effectiveReaction === "celebrate" ? (
              <g>
                <text x="39" y="49" textAnchor="middle" fill="#ffbe0b" fontSize="11" fontWeight="bold">★</text>
                <text x="61" y="49" textAnchor="middle" fill="#ffbe0b" fontSize="11" fontWeight="bold">★</text>
              </g>
            ) : isWink ? (
              <g>
                <path d="M34 45Q39 40 44 45" stroke="#00f5d4" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="61" cy="45" r="4.5" fill="#00f5d4" />
              </g>
            ) : (
              <g>
                <circle cx="39" cy="45" r="4.5" fill="#00f5d4" />
                <circle cx="61" cy="45" r="4.5" fill="#00f5d4" />
              </g>
            )}

            {/* Mouth */}
            {effectiveReaction === "shocked" ? (
              <circle cx="50" cy="65" r="3" fill="#18181b" />
            ) : (
              <path d="M42 63Q50 69 58 63" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
            )}

            {/* Rosy Cheeks */}
            <circle cx="28" cy="63" r="3" fill="#ff3377" opacity="0.6" />
            <circle cx="72" cy="63" r="3" fill="#ff3377" opacity="0.6" />
          </svg>
        ) : (
          /* PROFESSOR HASH (CARTOON SCIENTIST) */
          <svg
            className="hl-mascot-svg"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Fluffy hair */}
            <circle cx="25" cy="40" r="12" fill="#e2e8f0" stroke="#18181b" strokeWidth="2.5" />
            <circle cx="75" cy="40" r="12" fill="#e2e8f0" stroke="#18181b" strokeWidth="2.5" />
            <circle cx="50" cy="24" r="15" fill="#e2e8f0" stroke="#18181b" strokeWidth="2.5" />

            {/* Face */}
            <circle cx="50" cy="50" r="26" fill="#fed7aa" stroke="#18181b" strokeWidth="3" />

            {/* Giant Round Glasses */}
            <circle cx="41" cy="48" r="9" fill="#e0f2fe" stroke="#18181b" strokeWidth="2.5" />
            <circle cx="59" cy="48" r="9" fill="#e0f2fe" stroke="#18181b" strokeWidth="2.5" />
            <line x1="50" y1="48" x2="50" y2="48" stroke="#18181b" strokeWidth="2" />

            {/* Eyes behind glasses */}
            {effectiveReaction === "shocked" ? (
              <g>
                <circle cx="41" cy="48" r="4" fill="#ef4444" />
                <circle cx="59" cy="48" r="4" fill="#ef4444" />
              </g>
            ) : (
              <g>
                <circle cx="41" cy="48" r="3" fill="#18181b" />
                <circle cx="59" cy="48" r="3" fill="#18181b" />
                <circle cx="42" cy="46" r="1" fill="#fff" />
                <circle cx="60" cy="46" r="1" fill="#fff" />
              </g>
            )}

            {/* Mustache */}
            <path d="M40 60C45 63 48 58 50 60C52 58 55 63 60 60" fill="#e2e8f0" stroke="#18181b" strokeWidth="2" />

            {/* Lab Coat Collar & Tie */}
            <path d="M35 76L45 92L50 82L55 92L65 76Z" fill="#fff" stroke="#18181b" strokeWidth="2" />
            <polygon points="50,80 47,88 50,94 53,88" fill="#ff3377" />
          </svg>
        )}

        <div className="hl-mascot-badge-tag">
          {character === "robot" ? "Byte the Bot" : "Prof. Hash"}
        </div>
      </div>

      {/* Comic Speech Bubble */}
      <div className="hl-comic-bubble">
        <div className="hl-bubble-header">
          <div className="hl-bubble-title-row">
            <span className="hl-anime-sound-fx">
              {effectiveReaction === "fire"
                ? "🔥 AWESOME STREAK!"
                : effectiveReaction === "shocked"
                ? "⚠️ WHOOPS! COLLISION DETECTED!"
                : effectiveReaction === "celebrate"
                ? "🎉 GREAT JOB! MISSION COMPLETE!"
                : "💡 HELPFUL GUIDE"}
            </span>
          </div>

          <div className="hl-bubble-actions">
            <button
              type="button"
              onClick={handleVoice}
              className="hl-comic-icon-btn"
              title="Listen to this explanation"
            >
              <Volume2 size={13} /> Listen
            </button>
            <button
              type="button"
              onClick={handleNextTip}
              className="hl-comic-icon-btn"
              title="Get another helpful tip"
            >
              <Lightbulb size={13} /> Next Tip
            </button>
            <button
              type="button"
              onClick={toggleCharacter}
              className="hl-comic-icon-btn hl-switch-char-btn"
              title="Switch guide helper"
            >
              <Shuffle size={13} /> Switch Guide
            </button>
          </div>
        </div>

        <p className="hl-bubble-message">{currentSpeech}</p>
      </div>
    </div>
  );
}
