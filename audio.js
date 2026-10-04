// Audio Manager using Web Audio API for zero-dependency retro/arcade sound effects
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('quizmaster_sound_enabled') !== 'false';
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('quizmaster_sound_enabled', this.enabled);
    if (this.enabled) {
      this.init();
      this.playClick();
    }
    return this.enabled;
  }

  playTone(freq, type, duration, startTime = 0, gainVal = 0.15) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startTime);
      osc.stop(this.ctx.currentTime + startTime + duration);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playClick() {
    this.playTone(600, 'sine', 0.04, 0, 0.08);
  }

  playCorrect() {
    if (!this.enabled) return;
    // Ascending major chord (C5 -> E5 -> G5 -> C6)
    this.playTone(523.25, 'sine', 0.1, 0, 0.18);
    this.playTone(659.25, 'sine', 0.1, 0.08, 0.18);
    this.playTone(783.99, 'sine', 0.15, 0.16, 0.22);
    this.playTone(1046.50, 'triangle', 0.25, 0.24, 0.25);
  }

  playWrong() {
    if (!this.enabled) return;
    // Low harsh buzzer
    this.playTone(160, 'sawtooth', 0.25, 0, 0.2);
    this.playTone(130, 'sawtooth', 0.35, 0.12, 0.22);
  }

  playTick() {
    this.playTone(880, 'triangle', 0.03, 0, 0.05);
  }

  playWarningTick() {
    this.playTone(1100, 'square', 0.06, 0, 0.1);
  }

  playPowerup() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playLevelUp() {
    if (!this.enabled) return;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.25, idx * 0.09, 0.2);
    });
  }

  playVictory() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
    const delays = [0, 0.1, 0.2, 0.32, 0.52, 0.68];
    const durations = [0.1, 0.1, 0.12, 0.2, 0.15, 0.5];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', durations[idx], delays[idx], 0.22);
    });
  }

  playDefeat() {
    if (!this.enabled) return;
    const notes = [392.00, 369.99, 349.23, 311.13];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sawtooth', 0.3, idx * 0.15, 0.15);
    });
  }

  playStreak() {
    if (!this.enabled) return;
    this.playTone(440, 'triangle', 0.12, 0, 0.15);
    this.playTone(659.25, 'triangle', 0.12, 0.08, 0.18);
    this.playTone(880, 'sine', 0.3, 0.16, 0.22);
  }
}

const sounds = new SoundManager();
