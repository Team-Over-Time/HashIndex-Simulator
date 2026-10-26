import React, { useState, useEffect, useRef } from "react";
import {
  Timer,
  RotateCcw,
  Play,
  Sparkles,
  Trophy,
  Star,
  Coins
} from "lucide-react";
import { sounds } from "../../utils/soundEffects.js";

export default function HashRushGame({ awardXp, onCelebrate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [keysSorted, setKeysSorted] = useState(0);
  const [misses, setMisses] = useState(0);
  const [currentKey, setCurrentKey] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem("modulorush_highscore")) || 0;
    } catch {
      return 0;
    }
  });

  const timerRef = useRef(null);

  function spawnKey() {
    const key = Math.floor(Math.random() * 95) + 1;
    setCurrentKey(key);
  }

  function startGame() {
    setIsPlaying(true);
    setGameOver(false);
    setTimeLeft(30);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setKeysSorted(0);
    setMisses(0);
    spawnKey();
    sounds.playLevelUp();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function endGame() {
    setIsPlaying(false);
    setGameOver(true);
    sounds.playCelebration();
    if (onCelebrate) onCelebrate();

    setScore((finalScore) => {
      const earnedXp = Math.floor(finalScore / 8);
      awardXp(earnedXp);

      try {
        const curHigh = Number(localStorage.getItem("modulorush_highscore")) || 0;
        if (finalScore > curHigh) {
          localStorage.setItem("modulorush_highscore", String(finalScore));
          setHighScore(finalScore);
        }
      } catch {}
      return finalScore;
    });
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleSelectSlot(slotNum) {
    if (!isPlaying || currentKey === null) return;

    const correctSlot = currentKey % 5;

    if (slotNum === correctSlot) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);

      const multiplier = nextCombo >= 6 ? 3 : nextCombo >= 3 ? 2 : 1;
      const points = 60 * multiplier;

      setScore((s) => s + points);
      setKeysSorted((k) => k + 1);
      sounds.playCombo(nextCombo);

      if (nextCombo % 5 === 0) {
        setTimeLeft((t) => Math.min(38, t + 3));
        sounds.playPowerUp();
      }

      spawnKey();
    } else {
      setCombo(0);
      setMisses((mis) => mis + 1);
      sounds.playError();
      spawnKey();
    }
  }

  // Keyboard shortcut listener
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isPlaying) return;
      const keyMap = { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4 };
      if (keyMap[e.key] !== undefined) {
        handleSelectSlot(keyMap[e.key]);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, currentKey, combo]);

  const accuracy = keysSorted + misses > 0 ? Math.round((keysSorted / (keysSorted + misses)) * 100) : 100;

  return (
    <div className="ice-panel">
      {/* 3 Golden Stars */}
      <div className="ice-stars-crown">
        <Star size={34} fill="#fbbd23" color="#78350f" className="ice-crown-star star-left" />
        <Star size={44} fill="#fbbd23" color="#78350f" className="ice-crown-star star-mid" />
        <Star size={34} fill="#fbbd23" color="#78350f" className="ice-crown-star star-right" />
      </div>

      <div className="ice-panel-header">
        <h2 className="ice-panel-title">MODULO RUSH (30S BLITZ)</h2>
        <p className="ice-panel-desc">
          Sort incoming numbers by calculating <code>Number % 5</code> as fast as you can!
        </p>
      </div>

      {/* Top HUD Row */}
      <div className="ice-hud-row">
        <div style={{ flex: 1, minWidth: "130px" }}>
          <span className="ice-inset-label">TIME</span>
          <div className="ice-inset-box" style={{ color: timeLeft <= 5 ? "#ef4444" : "#fff" }}>
            {timeLeft}s
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "130px" }}>
          <span className="ice-inset-label">SCORE</span>
          <div className="ice-inset-box">{score}</div>
        </div>

        <div style={{ flex: 1, minWidth: "130px" }}>
          <span className="ice-inset-label">STREAK</span>
          <div className="ice-inset-box">{combo}x</div>
        </div>

        <div style={{ flex: 1, minWidth: "130px" }}>
          <span className="ice-inset-label">HIGH SCORE</span>
          <div className="ice-inset-box">{highScore}</div>
        </div>
      </div>

      {!isPlaying && !gameOver ? (
        /* Ready Card */
        <div style={{ textAlign: "center", padding: "24px 10px" }}>
          <div className="ice-helper-card" style={{ maxWidth: "480px", margin: "0 auto 20px" }}>
            <span className="ice-helper-title">💡 5-SECOND CHEAT SHEET:</span>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#064e3b", marginTop: "6px" }}>
              Ends in 0 or 5 ➔ Slot 0 &nbsp;|&nbsp; Ends in 1 or 6 ➔ Slot 1 <br />
              Ends in 2 or 7 ➔ Slot 2 &nbsp;|&nbsp; Ends in 3 or 8 ➔ Slot 3 <br />
              Ends in 4 or 9 ➔ Slot 4
            </div>
          </div>

          <button
            type="button"
            onClick={startGame}
            className="ice-action-btn btn-green"
            style={{ fontSize: "18px", padding: "16px 36px" }}
          >
            <Play size={20} fill="currentColor" /> START GAME
          </button>
        </div>
      ) : isPlaying ? (
        /* Active Board */
        <div>
          {/* Incoming Number on Ice Slab */}
          <div className="ice-rush-package-card">
            <div style={{ fontSize: "42px" }}>📦</div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 900, color: "#0284c7" }}>INCOMING NUMBER</span>
              <div style={{ fontSize: "36px", fontWeight: 900, color: "#0d3858", lineHeight: 1 }}>
                {currentKey}
              </div>
              <small style={{ fontSize: "13px", fontWeight: 800, color: "#175480" }}>
                Calculate: <code>{currentKey} % 5 = ?</code>
              </small>
            </div>
          </div>

          {/* 5 Big Chunky Buttons */}
          <div className="ice-rush-btn-rack">
            {[0, 1, 2, 3, 4].map((slotNum) => (
              <button
                key={slotNum}
                type="button"
                onClick={() => handleSelectSlot(slotNum)}
                className="ice-number-btn"
              >
                <span className="ice-num-label">SLOT</span>
                <span className="ice-num-big">{slotNum}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Game Over */
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Trophy size={54} color="#f59e0b" style={{ margin: "0 auto 10px" }} />
          <h3 className="ice-panel-title">TIME'S UP!</h3>
          <p className="ice-panel-desc" style={{ marginBottom: "20px" }}>
            You sorted <strong>{keysSorted}</strong> items with <strong>{accuracy}%</strong> accuracy!
          </p>

          <button
            type="button"
            onClick={startGame}
            className="ice-action-btn btn-green"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
