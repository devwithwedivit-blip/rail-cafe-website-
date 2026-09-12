/**
 * THE ROYAL RAIL CAFE — Web Audio API Synthesizer
 * Zero external audio files; 100% synthesized sound effects:
 * 1. Steam Train Whistle (Dual-tone Harmonic)
 * 2. Rhythmic Chug-Chug / Rail Clatter
 * 3. Ticket Puncher Click
 * 4. Stamped Confirmation Thud
 */

class RailAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.isPlayingAmbient = false;
    this.ambientInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(buttonElement) {
    this.init();
    this.isMuted = !this.isMuted;
    
    if (buttonElement) {
      if (this.isMuted) {
        buttonElement.classList.remove('playing');
        buttonElement.title = "Unmute Vintage Train Sounds";
        buttonElement.setAttribute('aria-label', 'Sound Muted. Click to enable.');
        this.stopChugChug();
      } else {
        buttonElement.classList.add('playing');
        buttonElement.title = "Mute Train Sounds";
        buttonElement.setAttribute('aria-label', 'Sound Playing. Click to mute.');
        this.playWhistle();
        this.startChugChug();
      }
    }
    return !this.isMuted;
  }

  /**
   * Dual-tone Steam Train Whistle (e.g. 587Hz & 784Hz + harmonic overtones)
   */
  playWhistle() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const createTone = (freq, delay, dur, gainLevel) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.04, now + delay + dur * 0.4);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + delay + dur);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now + delay);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(gainLevel, now + delay + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + dur);
    };

    // First blast
    createTone(587.33, 0.0, 0.4, 0.12);
    createTone(783.99, 0.0, 0.4, 0.10);
    // Second long blast
    createTone(587.33, 0.45, 0.7, 0.14);
    createTone(783.99, 0.45, 0.7, 0.12);
  }

  /**
   * Ticket Puncher Metallic Click
   */
  playPunchSound() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Heavy Rubber Stamp Confirmation Impact
   */
  playStampSound() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  /**
   * Continuous rhythmic wheel clickety-clack on rails
   */
  startChugChug() {
    if (this.ambientInterval) clearInterval(this.ambientInterval);
    this.isPlayingAmbient = true;

    this.ambientInterval = setInterval(() => {
      if (this.isMuted || !this.isPlayingAmbient) return;
      this.playRailClick();
    }, 480);
  }

  stopChugChug() {
    this.isPlayingAmbient = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  playRailClick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Short noise burst filter
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, now);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }
}

// Global Singleton
window.railAudio = new RailAudioEngine();
