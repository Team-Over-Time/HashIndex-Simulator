/* =========================================================
   HASHLAB AUDIO ENGINE — Web Audio API Synthesizer
   Self-contained procedural sound effects (zero external files).
   Safely handles browser autoplay policies and audio context resume.
========================================================= */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    try {
      this.muted = localStorage.getItem("hashlab_muted") === "true";
    } catch {
      this.muted = false;
    }
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = !!muted;
    try {
      localStorage.setItem("hashlab_muted", this.muted ? "true" : "false");
    } catch {
      // ignore
    }
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  playTone(freq, type = "sine", duration = 0.15, gainVal = 0.1, delay = 0) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // AudioContext safe fail
    }
  }

  playSuccess() {
    if (this.muted) return;
    // Pleasant ascending chord C5 -> E5 -> G5 -> C6
    this.playTone(523.25, "sine", 0.12, 0.1, 0.0);
    this.playTone(659.25, "sine", 0.14, 0.12, 0.06);
    this.playTone(783.99, "triangle", 0.18, 0.14, 0.12);
    this.playTone(1046.5, "sine", 0.28, 0.16, 0.18);
  }

  playCollision() {
    if (this.muted) return;
    // Amber collision blip: 440Hz -> 370Hz
    this.playTone(440, "triangle", 0.1, 0.15, 0);
    this.playTone(369.99, "sawtooth", 0.18, 0.12, 0.08);
  }

  playError() {
    if (this.muted) return;
    // Gentle low buzz
    this.playTone(180, "sawtooth", 0.12, 0.15, 0);
    this.playTone(140, "sawtooth", 0.2, 0.15, 0.12);
  }

  playClick() {
    if (this.muted) return;
    this.playTone(720, "sine", 0.04, 0.05, 0);
  }

  playChainLink() {
    if (this.muted) return;
    // Distinctive pointer attach sound: two quick harmonic pings
    this.playTone(587.33, "sine", 0.08, 0.12, 0);
    this.playTone(880.0, "triangle", 0.18, 0.14, 0.06);
  }

  playBounce() {
    if (this.muted) return;
    this.playTone(320, "triangle", 0.08, 0.14, 0);
    this.playTone(480, "sine", 0.12, 0.12, 0.05);
  }

  playZap() {
    if (this.muted) return;
    this.playTone(880, "sawtooth", 0.06, 0.16, 0);
    this.playTone(1320, "triangle", 0.1, 0.12, 0.03);
  }

  playCut() {
    if (this.muted) return;
    this.playTone(600, "square", 0.04, 0.08, 0);
    this.playTone(200, "sawtooth", 0.08, 0.1, 0.02);
  }

  playWhoosh() {
    if (this.muted) return;
    this.playTone(300, "sine", 0.1, 0.08, 0);
    this.playTone(600, "sine", 0.08, 0.1, 0.04);
  }

  playCombo(streak = 1) {
    if (this.muted) return;
    const baseFreq = 400 + Math.min(streak, 10) * 80;
    this.playTone(baseFreq, "sine", 0.1, 0.12, 0);
    this.playTone(baseFreq * 1.25, "triangle", 0.15, 0.14, 0.05);
    if (streak >= 5) {
      this.playTone(baseFreq * 1.5, "sawtooth", 0.2, 0.1, 0.1);
    }
  }

  playLevelUp() {
    if (this.muted) return;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      this.playTone(freq, "triangle", 0.2, 0.15, idx * 0.07);
    });
  }

  playCelebration() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, "triangle", 0.22, 0.15, idx * 0.08);
    });
  }

  playCartoonBoing() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.3);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  playNinjaSlash() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  playObjection() {
    if (this.muted) return;
    // Dramatic anime courtroom gavel slam (low boom + chord strike)
    this.playTone(110, "sawtooth", 0.35, 0.25, 0);
    this.playTone(220, "triangle", 0.28, 0.2, 0.02);
    this.playTone(587.33, "sine", 0.3, 0.18, 0.05);
    this.playTone(880, "triangle", 0.4, 0.22, 0.08);
  }

  playPowerUp() {
    if (this.muted) return;
    const arpeggio = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    arpeggio.forEach((f, i) => {
      this.playTone(f, "sine", 0.12, 0.14, i * 0.04);
    });
  }

  playAnimeFanfare() {
    if (this.muted) return;
    const chords = [
      { f: 523.25, d: 0.1 },
      { f: 659.25, d: 0.1 },
      { f: 783.99, d: 0.1 },
      { f: 1046.5, d: 0.25 },
      { f: 1318.5, d: 0.35 },
    ];
    chords.forEach((c, i) => {
      this.playTone(c.f, "triangle", c.d, 0.15, i * 0.08);
    });
  }

  speakAnimeQuote(phrase) {
    if (this.muted) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(phrase);
        utter.pitch = 1.35; // slightly higher anime voice pitch
        utter.rate = 1.15;
        utter.volume = 0.6;
        window.speechSynthesis.speak(utter);
      } catch {}
    }
  }
}

export const sounds = new SoundEngine();

