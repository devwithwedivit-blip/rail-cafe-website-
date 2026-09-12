/**
 * THE RAIL CAFE — Particles & Physics Engine
 * 1. Background Steam Puff Particles with Mouse Proximity Repulsion
 * 2. Punched Ticket Confetti Generator on Click
 */

class SteamParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 45;
    this.mouse = { x: -1000, y: -1000, radius: 120 };

    this.resize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(Math.random() * this.height));
    }
  }

  createParticle(startY) {
    return {
      x: Math.random() * this.width,
      y: startY !== undefined ? startY : this.height + Math.random() * 40,
      radius: Math.random() * 18 + 10,
      baseRadius: Math.random() * 18 + 10,
      speedY: -(Math.random() * 0.7 + 0.3),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.25 + 0.08,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      wobbleDist: Math.random() * 20 + 5,
      angle: Math.random() * Math.PI * 2
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Natural upward drift + subtle sway
      p.angle += p.wobbleSpeed;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.angle) * 0.3;

      // Mouse Proximity Repulsion Physics
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        const pushX = (dx / dist) * force * 3.5;
        const pushY = (dy / dist) * force * 3.5;
        p.x += pushX;
        p.y += pushY;
      }

      // Render Soft Billowy Steam Puff
      const gradient = this.ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.radius
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
      gradient.addColorStop(0.5, `rgba(240, 235, 225, ${p.opacity * 0.6})`);
      gradient.addColorStop(1, 'rgba(240, 235, 225, 0)');

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      // Reset when floating past top or off screen
      if (p.y < -p.radius * 2 || p.x < -p.radius * 2 || p.x > this.width + p.radius * 2) {
        this.particles[i] = this.createParticle();
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

/**
 * Punched Ticket Flakes Confetti Burst
 */
function spawnTicketPunchConfetti(x, y) {
  const container = document.getElementById('punch-particles-container');
  if (!container) return;

  const count = 14;
  const colors = ['#C89C3F', '#E8A326', '#F7E7CE', '#7C1B26', '#332F2A', '#FAF6EE'];

  for (let i = 0; i < count; i++) {
    const flake = document.createElement('div');
    flake.className = 'ticket-flake';

    // Randomize shape: tiny ticket rectangles or circular punch-outs
    const isCircle = Math.random() > 0.4;
    const size = Math.random() * 8 + 5;
    flake.style.width = `${size}px`;
    flake.style.height = isCircle ? `${size}px` : `${size * 1.5}px`;
    flake.style.borderRadius = isCircle ? '50%' : '2px';
    flake.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    flake.style.border = '1px solid rgba(0,0,0,0.15)';

    flake.style.left = `${x}px`;
    flake.style.top = `${y}px`;

    // Angle and trajectory
    const angle = (Math.random() * 360) * (Math.PI / 180);
    const velocity = Math.random() * 65 + 30;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity + 45; // gravity pulls down
    const rot = (Math.random() - 0.5) * 540;

    flake.style.setProperty('--tx', `${tx}px`);
    flake.style.setProperty('--ty', `${ty}px`);
    flake.style.setProperty('--rot', `${rot}deg`);

    container.appendChild(flake);

    setTimeout(() => {
      if (flake.parentNode) {
        flake.parentNode.removeChild(flake);
      }
    }, 1200);
  }
}

// Attach click listener globally
window.addEventListener('click', (e) => {
  // Ignore clicks on buttons to keep interaction clear
  spawnTicketPunchConfetti(e.clientX, e.clientY);
  if (window.railAudio) {
    window.railAudio.playPunchSound();
  }
});

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  new SteamParticleSystem('steam-canvas');
});
