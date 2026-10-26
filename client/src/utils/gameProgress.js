/**
 * HashLab Unified Game Progress & Scoring Persistence
 * Manages versioned local storage, XP sync, and duplicate-reward prevention.
 */

const STORAGE_KEY = "hashlab_game_progress_v2";
const XP_STORAGE_KEY = "hashlab_xp";

const DEFAULT_STATE = {
  version: 2,
  games: {
    "collision-buster": {
      id: "collision-buster",
      title: "Collision Buster",
      status: "new", // "new" | "in_progress" | "completed"
      bestScore: 0,
      xpEarned: 0,
      accuracy: 100,
      totalAttempts: 0,
      totalHintsUsed: 0,
      completedChallenges: [], // e.g. ["level-1", "level-2"]
      lastPlayed: null
    },
    "hash-detective": {
      id: "hash-detective",
      title: "Hash Detective",
      status: "new",
      bestScore: 0,
      xpEarned: 0,
      accuracy: 100,
      totalAttempts: 0,
      totalHintsUsed: 0,
      completedChallenges: [], // e.g. ["case-1", "case-2"]
      lastPlayed: null
    },
    "rehash-rescue": {
      id: "rehash-rescue",
      title: "Rehash Rescue",
      status: "new",
      bestScore: 0,
      xpEarned: 0,
      accuracy: 100,
      totalAttempts: 0,
      totalHintsUsed: 0,
      completedChallenges: [], // e.g. ["level-1", "level-2"]
      lastPlayed: null
    },
    "hash-escape-room": {
      id: "hash-escape-room",
      title: "Hash Escape Room",
      status: "new",
      bestScore: 0,
      xpEarned: 0,
      accuracy: 100,
      totalAttempts: 0,
      totalHintsUsed: 0,
      completedChallenges: [], // e.g. ["room-1", "room-2", "room-3", "room-4", "room-5", "vault"]
      difficulty: "standard", // "guided" | "standard" | "expert"
      lastPlayed: null
    }
  },
  awardedXpKeys: [], // list of challenge IDs for which XP was already granted (prevents duplicate XP)
  conceptsPracticed: []
};

/**
 * Loads persisted progress with version check and schema fallback.
 */
export function loadGameProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 2 && parsed.games) {
      // Ensure all 4 games exist in case of migration
      const mergedGames = { ...DEFAULT_STATE.games };
      for (const key of Object.keys(DEFAULT_STATE.games)) {
        if (parsed.games[key]) {
          mergedGames[key] = { ...DEFAULT_STATE.games[key], ...parsed.games[key] };
        }
      }
      return {
        ...DEFAULT_STATE,
        ...parsed,
        games: mergedGames
      };
    }
  } catch (err) {
    console.warn("Could not read hashlab_game_progress, using default state", err);
  }
  return { ...DEFAULT_STATE };
}

/**
 * Saves current progress to localStorage.
 */
export function saveGameProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to persist game progress", err);
  }
}

/**
 * Syncs and updates global HashLab XP.
 */
export function addGlobalXp(amount) {
  if (!amount || amount <= 0) return getCurrentGlobalXp();
  let current = getCurrentGlobalXp();
  const next = current + Math.floor(amount);
  try {
    localStorage.setItem(XP_STORAGE_KEY, String(next));
  } catch {}
  return next;
}

export function getCurrentGlobalXp() {
  try {
    return Number(localStorage.getItem(XP_STORAGE_KEY)) || 120;
  } catch {
    return 120;
  }
}

/**
 * Records completion of an individual stage/level/case in a game.
 * Guarantees XP is awarded ONLY ONCE per unique challengeId.
 */
export function recordChallengeResult({
  gameId,
  challengeId,
  score = 0,
  baseXp = 50,
  hintsUsed = 0,
  attempts = 1,
  totalStagesInGame = 5,
  conceptTag = null
}) {
  const state = loadGameProgress();
  const game = state.games[gameId];
  if (!game) return { state, xpAwarded: 0 };

  const xpUniqueKey = `${gameId}:${challengeId}`;
  const isFirstTime = !state.awardedXpKeys.includes(xpUniqueKey);

  // Score calculation: deduct penalties for hints & mistakes
  const hintPenalty = hintsUsed * 20;
  const attemptPenalty = Math.max(0, attempts - 1) * 15;
  const calculatedScore = Math.max(10, score - hintPenalty - attemptPenalty);

  // XP calculation
  let actualXp = 0;
  if (isFirstTime) {
    const hintXpPenalty = hintsUsed * 5;
    const attemptXpPenalty = Math.max(0, attempts - 1) * 5;
    actualXp = Math.max(15, baseXp - hintXpPenalty - attemptXpPenalty);
    state.awardedXpKeys.push(xpUniqueKey);
    addGlobalXp(actualXp);
  }

  // Update game state
  if (!game.completedChallenges.includes(challengeId)) {
    game.completedChallenges.push(challengeId);
  }

  game.bestScore = Math.max(game.bestScore, calculatedScore);
  game.xpEarned += actualXp;
  game.totalAttempts += attempts;
  game.totalHintsUsed += hintsUsed;
  game.lastPlayed = new Date().toISOString();

  // Status calculation
  if (game.completedChallenges.length >= totalStagesInGame) {
    game.status = "completed";
  } else if (game.completedChallenges.length > 0) {
    game.status = "in_progress";
  }

  // Concepts tracking
  if (conceptTag && !state.conceptsPracticed.includes(conceptTag)) {
    state.conceptsPracticed.push(conceptTag);
  }

  saveGameProgress(state);

  return {
    state,
    game,
    score: calculatedScore,
    xpAwarded: actualXp,
    isFirstTime,
    isGameComplete: game.status === "completed"
  };
}

/**
 * Checks if a specific challenge was already completed.
 */
export function isChallengeCompleted(gameId, challengeId) {
  const state = loadGameProgress();
  const game = state.games[gameId];
  return Boolean(game?.completedChallenges?.includes(challengeId));
}

/**
 * Calculates genuine global statistics for the Explore Games hub.
 */
export function getGamesHubStatistics() {
  const state = loadGameProgress();
  const gameList = Object.values(state.games);

  const completedGamesCount = gameList.filter((g) => g.status === "completed").length;
  const totalGamesXp = gameList.reduce((acc, g) => acc + (g.xpEarned || 0), 0);

  // Overall progress percentage based on completed challenges
  // Total expected challenges across 4 games:
  // Collision Buster: 4-5 levels
  // Hash Detective: 4-5 cases
  // Rehash Rescue: 3 levels
  // Hash Escape Room: 5 rooms + vault = 6
  // Total = ~18 milestones
  const totalCompletedChallenges = gameList.reduce(
    (acc, g) => acc + (g.completedChallenges?.length || 0),
    0
  );
  const totalTargetChallenges = 18;
  const overallProgressPct = Math.min(
    100,
    Math.round((totalCompletedChallenges / totalTargetChallenges) * 100)
  );

  return {
    completedGamesCount,
    totalGamesCount: 4,
    totalGamesXp,
    overallProgressPct,
    totalCompletedChallenges,
    games: state.games
  };
}

/**
 * Resets all progress back to defaults.
 */
export function resetAllGameProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return { ...DEFAULT_STATE };
}
