import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Award,
  Clock,
  RotateCcw,
  LogOut,
  Sparkles,
  CheckCircle2,
  Zap
} from "lucide-react";
import { sounds } from "../../utils/soundEffects.js";

/**
 * GameCompletionModal
 * Universal victory & debrief modal for HashLab games.
 *
 * Displays:
 * - "Game Finished Successfully!"
 * - Final Score & Time Taken
 * - Performance metrics (XP, Accuracy, Stages)
 * - Restart & Exit to Games Hub buttons
 */
export default function GameCompletionModal({
  isOpen,
  gameTitle = "Hashing Challenge",
  score = 100,
  maxScore = null,
  elapsedSeconds = 0,
  xpAwarded = 50,
  stats = [],
  onRestart,
  onExit
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Format mm:ss or Xm Ys
  const formatTime = (secs) => {
    const s = Math.max(0, Math.floor(secs || 0));
    const m = Math.floor(s / 60);
    const remainder = s % 60;
    return `${m > 0 ? `${m}m ` : ""}${remainder.toString().padStart(2, "0")}s`;
  };

  const handleRestart = () => {
    sounds.playClick();
    if (onRestart) onRestart();
  };

  const handleExit = () => {
    sounds.playClick();
    if (onExit) {
      onExit();
    } else {
      navigate("/games");
    }
  };

  return (
    <div className="hl-victory-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="victory-modal-title">
      <div className="hl-victory-modal-card">
        {/* Glowing Trophy Icon Badge */}
        <div className="hl-victory-icon-circle">
          <Trophy size={42} />
        </div>

        {/* Victory Banner */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
          <Sparkles size={14} /> Mission Accomplished
        </div>

        <h2 id="victory-modal-title" className="hl-victory-title">
          Game Finished Successfully!
        </h2>
        <p className="hl-victory-subtitle">
          Outstanding work! You have successfully mastered all levels in <strong>{gameTitle}</strong>.
        </p>

        {/* Primary Metrics Grid: Score & Time Taken */}
        <div className="hl-victory-stats-grid">
          {/* Final Score */}
          <div className="hl-victory-stat-box" style={{ borderLeft: "4px solid #f59e0b" }}>
            <div className="hl-victory-stat-label">Final Score</div>
            <div className="hl-victory-stat-value" style={{ color: "#f59e0b" }}>
              {score}
              {maxScore && (
                <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  {" "}/ {maxScore} pts
                </span>
              )}
              {!maxScore && <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}> pts</span>}
            </div>
          </div>

          {/* Time Taken */}
          <div className="hl-victory-stat-box" style={{ borderLeft: "4px solid #2563eb" }}>
            <div className="hl-victory-stat-label">Time Taken</div>
            <div className="hl-victory-stat-value" style={{ color: "#2563eb" }}>
              {formatTime(elapsedSeconds)}
            </div>
          </div>

          {/* XP Granted */}
          <div className="hl-victory-stat-box" style={{ borderLeft: "4px solid #a855f7" }}>
            <div className="hl-victory-stat-label">XP Granted</div>
            <div className="hl-victory-stat-value" style={{ color: "#a855f7" }}>
              +{xpAwarded} XP
            </div>
          </div>

          {/* Status Verification */}
          <div className="hl-victory-stat-box" style={{ borderLeft: "4px solid #10b981" }}>
            <div className="hl-victory-stat-label">Result</div>
            <div className="hl-victory-stat-value" style={{ color: "#10b981", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={20} /> 100% Cleared
            </div>
          </div>
        </div>

        {/* Optional Extra Game-Specific Stats */}
        {stats && stats.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-around", background: "var(--bg-card-muted)", padding: "12px 16px", borderRadius: "var(--radius-md)", marginBottom: "28px", border: "1px solid var(--border-main)", flexWrap: "wrap", gap: "10px" }}>
            {stats.map((s, idx) => (
              <div key={idx} style={{ textAlign: "center", minWidth: "90px" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "monospace", color: s.color || "var(--text-primary)" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Controls: Restart or Exit */}
        <div className="hl-victory-actions">
          <button
            type="button"
            className="hl-action-btn btn-secondary"
            style={{ padding: "12px 24px", fontSize: "0.95rem", fontWeight: 700, gap: "8px" }}
            onClick={handleRestart}
          >
            <RotateCcw size={18} />
            <span>Restart Game</span>
          </button>

          <button
            type="button"
            className="hl-action-btn btn-primary"
            style={{ padding: "12px 28px", fontSize: "0.95rem", fontWeight: 700, gap: "8px", background: "linear-gradient(135deg, #10b981, #059669)", borderColor: "#10b981" }}
            onClick={handleExit}
          >
            <LogOut size={18} />
            <span>Exit to Games Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
}
