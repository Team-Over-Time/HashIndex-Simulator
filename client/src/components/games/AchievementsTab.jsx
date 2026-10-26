import React from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Link2,
  Zap,
  Search,
  Timer,
  RefreshCw,
  Flame,
  Award,
  ArrowRight,
  Star,
  Lock,
  CheckCircle2
} from "lucide-react";

const COLLECTIBLE_CARDS = [
  {
    id: "o1-master",
    title: "Master of O(1) Speed",
    desc: "Reach Player Level 4. Mastered uniform hash distribution!",
    unlockedAt: (xp, level) => level >= 4,
    powerScore: 9999,
    icon: Trophy,
  },
  {
    id: "master-detective",
    title: "Hash Detective",
    desc: "Differentiated between linear clusters and quadratic leaps.",
    unlockedAt: (xp) => xp >= 350,
    powerScore: 7800,
    icon: Search,
  },
  {
    id: "rush-reflex",
    title: "Modulo Speed Demon",
    desc: "Scored high streaks in the 30-Second Modulo Rush game.",
    unlockedAt: (xp) => xp >= 300,
    powerScore: 7200,
    icon: Timer,
  },
  {
    id: "pointer-engineer",
    title: "Memory Wire Engineer",
    desc: "Wired head pointers and bypassed nodes with zero leaks.",
    unlockedAt: (xp) => xp >= 250,
    powerScore: 6800,
    icon: Award,
  },
  {
    id: "rehash-architect",
    title: "Capacity Architect",
    desc: "Resized table capacity from 7 to 13 to clear high load factor.",
    unlockedAt: (xp) => xp >= 180,
    powerScore: 6000,
    icon: RefreshCw,
  },
  {
    id: "streak-master",
    title: "Combo Master",
    desc: "Maintained 5x consecutive correct streaks across arcade games.",
    unlockedAt: (xp) => xp >= 280,
    powerScore: 5400,
    icon: Flame,
  },
  {
    id: "collision-survivor",
    title: "Collision Solver",
    desc: "Earned 200+ points resolving collision probes in open addressing.",
    unlockedAt: (xp) => xp >= 200,
    powerScore: 4800,
    icon: Zap,
  },
  {
    id: "first-chain",
    title: "First Link in Chain",
    desc: "Attached your first collided number to a linked list node.",
    unlockedAt: (xp) => xp >= 140,
    powerScore: 3600,
    icon: Link2,
  },
];

export default function AchievementsTab({ xp, level, totalScore = 0 }) {
  const unlockedCount = COLLECTIBLE_CARDS.filter((c) =>
    c.unlockedAt(xp, level)
  ).length;

  return (
    <div className="ice-panel">
      {/* 3 Golden Stars */}
      <div className="ice-stars-crown">
        <Star size={34} fill="#fbbd23" color="#78350f" className="ice-crown-star star-left" />
        <Star size={44} fill="#fbbd23" color="#78350f" className="ice-crown-star star-mid" />
        <Star size={34} fill="#fbbd23" color="#78350f" className="ice-crown-star star-right" />
      </div>

      <div className="ice-panel-header">
        <h2 className="ice-panel-title">TROPHY HALL OF FAME</h2>
        <p className="ice-panel-desc">
          Unlocked: <strong>{unlockedCount} / {COLLECTIBLE_CARDS.length}</strong> Badges · Total Score: <strong>{totalScore}</strong>
        </p>
      </div>

      {/* Cards Grid */}
      <div className="ice-trophy-grid">
        {COLLECTIBLE_CARDS.map((card) => {
          const isUnlocked = card.unlockedAt(xp, level);
          const IconComp = card.icon;

          return (
            <div key={card.id} className="ice-trophy-card" style={{ opacity: isUnlocked ? 1 : 0.65 }}>
              <div className="ice-trophy-icon-circle">
                {isUnlocked ? (
                  <IconComp size={30} color="#78350f" />
                ) : (
                  <Lock size={26} color="#78350f" />
                )}
              </div>

              <h4 style={{ fontSize: "16px", fontWeight: 900, color: "#0b4570", margin: "0 0 4px" }}>
                {card.title}
              </h4>
              <p style={{ fontSize: "12px", color: "#175480", fontWeight: 700, margin: "0 0 10px", lineHeight: 1.4 }}>
                {card.desc}
              </p>

              <div>
                {isUnlocked ? (
                  <span style={{ fontSize: "11px", fontWeight: 900, color: "#0d9648", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={13} /> UNLOCKED
                  </span>
                ) : (
                  <span style={{ fontSize: "11px", fontWeight: 900, color: "#64748b" }}>
                    LOCKED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulator Link */}
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Link to="/simulator" className="ice-action-btn btn-gold" style={{ textDecoration: "none" }}>
          TEST REAL DATABASES IN SIMULATOR <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
