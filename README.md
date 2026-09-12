# THE ROYAL RAIL CAFE 🚂✨
> Luxury Heritage Dining On Tracks — Bareilly, UP, India

A luxury railway-themed culinary experience website featuring authentic vintage carriage dining, animated steam locomotives, interactive carriage window shutters, split-flap station departure boards, and integrated WhatsApp order placement.

---

## 🌟 Key Features

- **🚂 Animated Steam Locomotive Hero**: Fast cinematic train arrival on Platform 1 with realistic wheel coupling rods, smoke puffs, and track clatter.
- **🥢 Coach Window Delicacies Menu**:
  - Interactive velvet carriage shutters that slide open on hover (PC) and tap (mobile) to reveal dish pictures.
  - Dedicated **Order on WhatsApp** integration (+91 75000 45675) with pre-filled item names and prices.
  - Category filters: All Compartments, Sizzling Woks, Handi Biryani, Dim Sum, North Indian Royal, Masala Chai, Gourmet Desserts.
- **🎟️ Vintage Train Ticket Reservations**:
  - PNR-styled reservation flow with date selection, coach classes, dietary choices, and passenger details.
- **📍 Live Cafe Location**:
  - Interactive Google Maps integration for Bareilly, Uttar Pradesh (28.4111° N, 79.4329° E).
- **🔊 Web Audio API Synthesizer**:
  - Zero external sound files — pure Web Audio API synthesis for steam whistle harmonics, rhythmic rail clatter, and ticket punch clicks.
- **📱 Fully Responsive**:
  - Optimized mobile navigation drawer, touch gestures, responsive HUD, and adaptive layouts.

---

## 🚀 Getting Started

1. Clone or download this repository:
   ```bash
   git clone https://github.com/devwithwedivit-blip/rail-cafe-website-.git
   ```
2. Open `index.html` in any modern web browser, or run a local server:
   ```bash
   # Using Python 3
   python -m http.server 8085
   ```
3. Visit `http://localhost:8085` in your browser.

---

## 📂 Project Structure

```
├── index.html              # Main application markup
├── css/
│   ├── style.css           # Core styling, typography & layout
│   ├── train.css           # Steam train kinematics & locomotive styling
│   ├── flap-board.css      # Split-flap railway departure board
│   └── ticket.css          # Vintage railway reservation ticket
├── js/
│   ├── app.js              # Coordinator, cursor, clock & shutter interactions
│   ├── train-controller.js # Train physics, speed kinematics & wheel rotations
│   ├── audio-synth.js      # Web Audio API engine for whistles & clatter
│   ├── parallax.js         # Scenery layers & 3D card tilt
│   ├── particles.js        # Steam puff & ticket punch particle canvas
│   └── reservation.js      # Ticket PNR generation & booking logic
└── assets/
    └── images/             # Food photography & carriage views
```
