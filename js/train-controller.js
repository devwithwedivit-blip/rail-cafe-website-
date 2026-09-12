/**
 * THE ROYAL RAIL CAFE — Interactive 2D Train Kinematics & Touch/Mouse Controller
 * Controls train speed, wheel spin, track sleepers & speedometer based on Touch/Mouse X
 */

class TrainKinematicsController {
  constructor() {
    this.trainConsist = document.getElementById('trainConsist');
    this.trackSleepers = document.getElementById('trackSleepers');
    this.speedGaugeVal = document.getElementById('speedGaugeVal');
    this.gaugeNeedle = document.getElementById('gaugeNeedle');
    this.whistleBtn = document.getElementById('heroWhistleBtn');

    // Kinematic properties — Starts at -920px so locomotive engine enters within 0.5s of page load!
    this.trainX = -920;
    this.baseSpeed = 3.8;
    this.currentSpeed = 4.2;
    this.targetSpeed = 3.8;
    this.sleeperOffset = 0;
    this.wheelRotation = 0;
    
    // Limits
    this.minSpeed = 0.5;
    this.maxSpeed = 8.5;
    this.trainWidth = 1050; // Total length of engine + tender + 2 coaches

    this.init();
  }

  init() {
    if (!this.trainConsist) return;

    this.bindMouseEvents();
    this.bindWhistleEvent();
    this.loop();
  }

  bindMouseEvents() {
    const heroSection = document.getElementById('hero') || document.body;

    const handlePointerMove = (clientX) => {
      const rect = heroSection.getBoundingClientRect();
      // Pointer X ratio: 0.0 (left) to 1.0 (right)
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

      // Calculate target speed: moving left slows down, moving right speeds up
      this.targetSpeed = this.minSpeed + ratio * (this.maxSpeed - this.minSpeed);

      // Visual styling for high speed
      if (this.trainConsist) {
        if (this.targetSpeed > 6.0) {
          this.trainConsist.classList.add('high-speed');
        } else {
          this.trainConsist.classList.remove('high-speed');
        }
      }
    };

    // React to horizontal mouse movement
    heroSection.addEventListener('mousemove', (e) => handlePointerMove(e.clientX));

    // React to touch swipe across hero on mobile devices
    heroSection.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    }, { passive: true });

    // Reset to cruising speed when cursor/touch leaves
    heroSection.addEventListener('mouseleave', () => {
      this.targetSpeed = this.baseSpeed;
      if (this.trainConsist) {
        this.trainConsist.classList.remove('high-speed');
      }
    });

    heroSection.addEventListener('touchend', () => {
      this.targetSpeed = this.baseSpeed;
      if (this.trainConsist) {
        this.trainConsist.classList.remove('high-speed');
      }
    }, { passive: true });
  }

  bindWhistleEvent() {
    if (this.whistleBtn) {
      this.whistleBtn.addEventListener('click', () => {
        if (window.railAudio) {
          window.railAudio.init();
          window.railAudio.playWhistle();
        }
        // Visual whistle bounce on engine
        const engine = document.querySelector('.locomotive-engine');
        if (engine) {
          engine.style.transform = 'translateY(-6px)';
          setTimeout(() => {
            engine.style.transform = 'translateY(0)';
          }, 350);
        }
      });
    }
  }

  loop() {
    // Smooth inertia interpolation (lerp)
    this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.06;

    // Advance train position
    this.trainX += this.currentSpeed;

    const screenWidth = window.innerWidth;
    // Loop train seamlessly when it travels completely off screen
    if (this.trainX > screenWidth + 100) {
      this.trainX = -this.trainWidth - 100;
    }

    // Apply transform to train
    if (this.trainConsist) {
      this.trainConsist.style.transform = `translate3d(${this.trainX}px, 0, 0)`;
    }

    // Move track sleepers backwards to enhance relative motion feel
    this.sleeperOffset = (this.sleeperOffset - this.currentSpeed * 0.75) % 36;
    if (this.trackSleepers) {
      this.trackSleepers.style.transform = `translate3d(${this.sleeperOffset}px, 0, 0)`;
    }

    // Rotate all wheels proportional to linear speed
    this.wheelRotation = (this.wheelRotation + this.currentSpeed * 2.8) % 360;
    const wheels = document.querySelectorAll('.wheel-spoked');
    wheels.forEach(wheel => {
      wheel.style.transform = `rotate(${this.wheelRotation}deg)`;
    });

    // Update HUD Speedometer Readout (Scale 15 to 80 km/h)
    const kmh = Math.round(15 + (this.currentSpeed - this.minSpeed) / (this.maxSpeed - this.minSpeed) * 65);
    if (this.speedGaugeVal) {
      this.speedGaugeVal.textContent = `${kmh} km/h`;
    }

    // Update Gauge Needle Angle (-45deg to 135deg)
    if (this.gaugeNeedle) {
      const needleAngle = -45 + (kmh / 80) * 180;
      this.gaugeNeedle.style.transform = `rotate(${needleAngle}deg)`;
    }

    requestAnimationFrame(() => this.loop());
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.trainController = new TrainKinematicsController();
});
