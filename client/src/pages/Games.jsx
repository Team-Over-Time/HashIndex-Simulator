import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Search,
  RefreshCw,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Trophy,
  Filter,
  Layers,
  Flame,
  ArrowRight
} from "lucide-react";
import { sounds } from "../utils/soundEffects.js";
import ParticleCanvas from "../components/games/ParticleCanvas.jsx";
import GameHeaderNav from "../components/games/GameHeaderNav.jsx";
import {
  getGamesHubStatistics,
  getCurrentGlobalXp
} from "../utils/gameProgress.js";
import "../components/games/hashLabGames.css";

export default function Games() {
  const [filter, setFilter] = useState("all"); // "all" | "fundamentals" | "problem_solving" | "optimization"
  const [stats, setStats] = useState(getGamesHubStatistics);
  const [xp, setXp] = useState(getCurrentGlobalXp);
  const particleRef = useRef(null);

  useEffect(() => {
    setStats(getGamesHubStatistics());
    setXp(getCurrentGlobalXp());
  }, []);

  const gameCardsData = [
    {
      id: "collision-buster",
      route: "/games/collision-buster",
      title: "Collision Buster",
      category: "fundamentals",
      categoryLabel: "Fundamentals",
      difficulty: "Beginner – Intermediate",
      difficultyClass: "pill-difficulty-beginner",
      playtime: "5–8 min",
      description: "Directly control key insertions, calculate probe sequences, and master linear, quadratic, and double hashing resolution in real time.",
      objectives: [
        "Calculate home hash modulo: h(k) = k mod m",
        "Step through linear, quadratic, and double hashing probes",
        "Handle circular table wraparound without overwriting keys"
      ],
      icon: Zap,
      iconColor: "#2563eb",
      isFeatured: false
    },
    {
      id: "hash-detective",
      route: "/games/hash-detective",
      title: "Hash Detective",
      category: "problem_solving",
      categoryLabel: "Problem Solving",
      difficulty: "Intermediate",
      difficultyClass: "pill-difficulty-intermediate",
      playtime: "7–10 min",
      description: "Put on your detective hat! Inspect crime-scene hash table snapshots, evaluate forensic clues, and deduce which collision algorithm created the pattern.",
      objectives: [
        "Analyze memory snapshots for primary & secondary clusters",
        "Deduce algorithms using mathematical elimination",
        "Reconstruct chronological step-by-step timelines"
      ],
      icon: Search,
      iconColor: "#f59e0b",
      isFeatured: false
    },
    {
      id: "rehash-rescue",
      route: "/games/rehash-rescue",
      title: "Rehash Rescue",
      category: "optimization",
      categoryLabel: "Optimization",
      difficulty: "Intermediate",
      difficultyClass: "pill-difficulty-intermediate",
      playtime: "6–9 min",
      description: "Prevent critical hash table saturation! Monitor load factors, choose prime expansion capacities, and re-hash all existing keys without data loss.",
      objectives: [
        "Monitor live load factors (α = n/m) against saturation thresholds",
        "Select prime capacities to minimize shared divisors",
        "Re-hash existing keys using new modulo functions"
      ],
      icon: RefreshCw,
      iconColor: "#10b981",
      isFeatured: false
    },
    {
      id: "hash-escape-room",
      route: "/games/hash-escape-room",
      title: "Hash Escape Room",
      category: "problem_solving",
      categoryLabel: "Signature Multi-Stage Adventure",
      difficulty: "Guided / Standard / Expert",
      difficultyClass: "pill-difficulty-expert",
      playtime: "8–15 min",
      description: "You are a database engineer trapped in the reactor core during a security lockdown! Solve five connected chambers—modulo gates, linear probers, pointer surgery, reactor cooling, and forensic decoding—to synthesize 5 fragments and breach the Final Vault.",
      objectives: [
        "Override 5 sequential security chambers in the cyber facility",
        "Perform pointer surgery on broken linked-list chains",
        "Synthesize 5 cryptographic fragments to crack the Vault"
      ],
      icon: ShieldAlert,
      iconColor: "#38bdf8",
      isFeatured: true
    }
  ];

  // Filter cards
  const filteredCards = gameCardsData.filter((card) => {
    if (filter === "all") return true;
    return card.category === filter;
  });

  return (
    <div className="hl-games-page">
      <ParticleCanvas ref={particleRef} />

      <GameHeaderNav
        gameTitle="Explore Games"
        xp={xp}
        onCelebrate={() => {
          if (particleRef.current) particleRef.current.celebration();
        }}
        extraBadge={
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#10b981" }}>
            {stats.completedGamesCount} / 4 GAMES COMPLETED
          </span>
        }
      />

      <div className="hl-games-container" style={{ marginTop: "24px" }}>
        {/* Hub Header & Genuine Stats Banner */}
        <section className="hl-hub-hero" aria-labelledby="hub-heading">
          <div className="hl-hub-title-area">
            <h1 id="hub-heading">
              <Trophy size={32} color="#fbbf24" />
              Explore Games
            </h1>
            <p>Master hashing through interactive challenges, forensic mysteries, and multi-stage escape adventures.</p>
          </div>

          <div className="hl-hub-stats-rack">
            <div className="hl-hub-stat-card">
              <span className="stat-value">{stats.completedGamesCount} / 4</span>
              <span className="stat-label">Games Completed</span>
            </div>

            <div className="hl-hub-stat-card">
              <span className="stat-value">{stats.totalGamesXp}</span>
              <span className="stat-label">XP Earned</span>
            </div>

            <div className="hl-hub-stat-card">
              <span className="stat-value">{stats.overallProgressPct}%</span>
              <span className="stat-label">Overall Progress</span>
              <div className="hl-progress-bar-wrap">
                <div className="hl-progress-track">
                  <div className="hl-progress-fill" style={{ width: `${stats.overallProgressPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Navigation Bar */}
        <nav className="hl-hub-filter-bar" aria-label="Game categories">
          <button
            type="button"
            className={`hl-filter-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => {
              sounds.playClick();
              setFilter("all");
            }}
          >
            All Games (4)
          </button>
          <button
            type="button"
            className={`hl-filter-pill ${filter === "fundamentals" ? "active" : ""}`}
            onClick={() => {
              sounds.playClick();
              setFilter("fundamentals");
            }}
          >
            Fundamentals
          </button>
          <button
            type="button"
            className={`hl-filter-pill ${filter === "problem_solving" ? "active" : ""}`}
            onClick={() => {
              sounds.playClick();
              setFilter("problem_solving");
            }}
          >
            Problem Solving
          </button>
          <button
            type="button"
            className={`hl-filter-pill ${filter === "optimization" ? "active" : ""}`}
            onClick={() => {
              sounds.playClick();
              setFilter("optimization");
            }}
          >
            Optimization
          </button>
        </nav>

        {/* Four Game Cards Grid */}
        <div className="hl-games-grid">
          {filteredCards.map((game) => {
            const gameProgress = stats.games[game.id] || {};
            const status = gameProgress.status || "new";
            const bestScore = gameProgress.bestScore || 0;
            const Icon = game.icon;

            let statusLabel = "New";
            let statusClass = "pill-status-new";

            if (status === "completed") {
              statusLabel = "Completed";
              statusClass = "pill-status-completed";
            } else if (status === "in_progress") {
              statusLabel = "In Progress";
              statusClass = "pill-status-in_progress";
            }

            const actionLabel = "Play";

            return (
              <article
                key={game.id}
                className={`hl-game-card ${game.isFeatured ? "featured-card" : ""}`}
                aria-labelledby={`game-title-${game.id}`}
              >
                <div className="hl-card-header">
                  <div className="hl-card-badge-row">
                    <span className={`hl-card-pill ${game.difficultyClass}`}>
                      {game.difficulty}
                    </span>
                    <span className={`hl-card-pill ${statusClass}`}>
                      {statusLabel}
                    </span>
                    {game.isFeatured && (
                      <span className="hl-card-pill" style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.4)" }}>
                        ★ SIGNATURE ADVENTURE
                      </span>
                    )}
                  </div>

                  <div className="hl-card-icon-art">
                    <Icon size={28} color={game.iconColor} />
                  </div>
                </div>

                <div className="hl-card-body">
                  <h2 id={`game-title-${game.id}`} className="hl-card-title">
                    {game.title}
                  </h2>
                  <p className="hl-card-desc">{game.description}</p>

                  <div className="hl-card-objectives">
                    <h4>Learning Objectives:</h4>
                    <ul>
                      {game.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="hl-card-footer">
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div className="hl-card-meta-stat" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={14} />
                      <span>{game.playtime}</span>
                    </div>

                    {bestScore > 0 && (
                      <div className="hl-card-meta-stat">
                        Best: <strong>{bestScore} pts</strong>
                      </div>
                    )}
                  </div>

                  <Link
                    to={game.route}
                    className="hl-play-btn"
                    onClick={() => sounds.playClick()}
                    aria-label={`${actionLabel} ${game.title}`}
                  >
                    <span>{actionLabel}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
