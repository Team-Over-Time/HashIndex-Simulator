import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Star,
  Coins,
  Sparkles,
  Settings,
  RotateCcw
} from "lucide-react";
import { sounds } from "../../utils/soundEffects.js";

export default function GameHeaderNav({
  gameTitle,
  xp = 120,
  onReset = null,
  onCelebrate = null,
  extraBadge = null
}) {
  const [muted, setMuted] = useState(() => sounds.isMuted());
  const [showOptions, setShowOptions] = useState(false);
  const [soundVolume, setSoundVolume] = useState(80);

  const level = Math.floor(xp / 100) + 1;

  function toggleAudio() {
    const isMute = sounds.toggleMute();
    setMuted(isMute);
  }

  function handleCelebrate() {
    sounds.playCelebration();
    if (onCelebrate) onCelebrate();
  }

  return (
    <header className="hl-game-header-bar" role="banner">
      <div className="hl-game-header-inner">
        {/* Breadcrumb Navigation */}
        <nav className="hl-game-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/" className="hl-crumb-link">
            HashLab
          </Link>
          <ChevronRight size={14} className="hl-crumb-sep" />
          <Link to="/games" className="hl-crumb-link">
            Games
          </Link>
          <ChevronRight size={14} className="hl-crumb-sep" />
          <span className="hl-crumb-active" aria-current="page">
            {gameTitle}
          </span>
        </nav>

        {/* Back Link Button */}
        <Link to="/games" className="hl-back-btn" title="Return to Games Hub">
          <ArrowLeft size={16} />
          <span>Hub</span>
        </Link>

        {/* Player Status & Interactive Badges */}
        <div className="hl-game-header-actions">
          {extraBadge && <div className="hl-header-extra-badge">{extraBadge}</div>}

          <div className="hl-header-badge level-badge" title={`Player Level ${level}`}>
            <Star size={15} fill="#f59e0b" color="#b45309" />
            <span>LVL {level}</span>
          </div>

          <div className="hl-header-badge xp-badge" title="Total Coins & XP">
            <Coins size={15} color="#d97706" />
            <span>{xp} XP</span>
          </div>

          <button
            type="button"
            className="hl-header-icon-btn"
            onClick={toggleAudio}
            title={muted ? "Unmute audio" : "Mute audio"}
            aria-label={muted ? "Unmute audio" : "Mute audio"}
          >
            {muted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} />}
          </button>

          {onCelebrate && (
            <button
              type="button"
              className="hl-header-icon-btn"
              onClick={handleCelebrate}
              title="Celebrate!"
              aria-label="Celebrate"
            >
              <Sparkles size={18} color="#fbbf24" />
            </button>
          )}

          {onReset && (
            <button
              type="button"
              className="hl-header-icon-btn"
              onClick={onReset}
              title="Reset Challenge"
              aria-label="Reset Challenge"
            >
              <RotateCcw size={17} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
