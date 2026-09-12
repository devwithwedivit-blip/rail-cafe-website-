/**
 * THE ROYAL RAIL CAFE — Ticket Reservation System
 * 1. Live Ticket Preview Synchronizer
 * 2. Authentic PNR Generator
 * 3. Animated "CONFIRMED" Red Ink Stamp & Audio-Visual Celebration
 * 4. Printable Boarding Pass Modal
 */

class TicketReservationEngine {
  constructor() {
    this.form = document.getElementById('ticketBookingForm');
    this.nameInput = document.getElementById('passengerName');
    this.dateInput = document.getElementById('journeyDate');
    this.timeSelect = document.getElementById('journeyTime');
    this.guestsSelect = document.getElementById('passengerCount');
    this.coachRadios = document.querySelectorAll('input[name="coachSelection"]');

    // Preview targets
    this.previewPnr = document.getElementById('ticketPnrDisplay');
    this.previewName = document.getElementById('previewPassengerName');
    this.previewDate = document.getElementById('previewJourneyDate');
    this.previewTime = document.getElementById('previewJourneyTime');
    this.previewCoach = document.getElementById('previewCoachName');
    this.previewGuests = document.getElementById('previewGuestCount');

    // Stamp & Modal
    this.stampSeal = document.getElementById('ticketStampSeal');
    this.modalBackdrop = document.getElementById('ticketModalBackdrop');
    this.modalCloseBtn = document.getElementById('modalCloseBtn');
    this.modalDismissBtn = document.getElementById('modalDismissBtn');
    this.modalPrintBtn = document.getElementById('modalPrintBtn');

    // Modal data fields
    this.modalPnr = document.getElementById('modalPnrVal');
    this.modalName = document.getElementById('modalNameVal');
    this.modalDate = document.getElementById('modalDateVal');
    this.modalCoach = document.getElementById('modalCoachVal');
    this.modalGuests = document.getElementById('modalGuestsVal');
    this.modalBerth = document.getElementById('modalBerthVal');

    this.init();
  }

  init() {
    if (!this.form) return;

    // Set default minimum date to today
    if (this.dateInput) {
      const today = new Date().toISOString().split('T')[0];
      this.dateInput.min = today;
      this.dateInput.value = today;
      this.updateDatePreview(today);
    }

    this.generateInitialPnr();
    this.bindLivePreviewEvents();
    this.bindFormSubmission();
    this.bindModalEvents();
  }

  generateInitialPnr() {
    const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
    this.currentPnr = `RRC-${randomDigits}`;
    if (this.previewPnr) {
      this.previewPnr.textContent = `PNR: ${this.currentPnr}`;
    }
  }

  updateDatePreview(dateStr) {
    if (!dateStr || !this.previewDate) return;
    const dateObj = new Date(dateStr);
    const formatted = dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    this.previewDate.textContent = formatted;
  }

  bindLivePreviewEvents() {
    // Passenger Name Live Typing
    if (this.nameInput) {
      this.nameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (this.previewName) {
          this.previewName.textContent = val ? val.toUpperCase() : 'YOUR NAME';
        }
      });
    }

    // Journey Date Change
    if (this.dateInput) {
      this.dateInput.addEventListener('change', (e) => {
        this.updateDatePreview(e.target.value);
      });
    }

    // Journey Slot Change
    if (this.timeSelect) {
      this.timeSelect.addEventListener('change', (e) => {
        if (this.previewTime) {
          this.previewTime.textContent = e.target.value;
        }
      });
    }

    // Guest Count Change
    if (this.guestsSelect) {
      this.guestsSelect.addEventListener('change', (e) => {
        if (this.previewGuests) {
          this.previewGuests.textContent = `${e.target.value} Berths`;
        }
      });
    }

    // Coach Selection
    this.coachRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (this.previewCoach) {
          this.previewCoach.textContent = e.target.value === 'coach-a' 
            ? 'THE ROYAL SALOON' 
            : 'THE HERITAGE DINER';
        }
      });
    });
  }

  bindFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = this.nameInput ? this.nameInput.value.trim() : 'Honored Guest';
      const date = this.dateInput ? this.dateInput.value : '';
      const time = this.timeSelect ? this.timeSelect.value : 'Sunset Dinner';
      const guests = this.guestsSelect ? this.guestsSelect.value : '2';
      
      let coachName = 'The Royal Saloon';
      const checkedCoach = document.querySelector('input[name="coachSelection"]:checked');
      if (checkedCoach && checkedCoach.value === 'coach-b') {
        coachName = 'The Heritage Diner';
      }

      // Generate realistic Table/Berth Allocation
      const berthNum = `Berth ${Math.floor(Math.random() * 14 + 1)} (Window Side)`;

      // 1. Play Stamp Audio Cue
      if (window.railAudio) {
        window.railAudio.playStampSound();
      }

      // 2. Animate Stamped Seal onto the ticket
      if (this.stampSeal) {
        this.stampSeal.classList.remove('stamped');
        void this.stampSeal.offsetWidth; // Trigger reflow
        this.stampSeal.classList.add('stamped');
      }

      // 3. Trigger ticket flake burst
      const btnRect = this.form.querySelector('.btn-book-ticket').getBoundingClientRect();
      if (window.spawnTicketPunchConfetti) {
        spawnTicketPunchConfetti(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2);
      }

      // 4. Populate Modal Data
      if (this.modalPnr) this.modalPnr.textContent = this.currentPnr;
      if (this.modalName) this.modalName.textContent = name.toUpperCase();
      if (this.modalDate) this.modalDate.textContent = `${date} • ${time}`;
      if (this.modalCoach) this.modalCoach.textContent = coachName;
      if (this.modalGuests) this.modalGuests.textContent = `${guests} Guests`;
      if (this.modalBerth) this.modalBerth.textContent = berthNum;

      // 5. Open Boarding Pass Modal after a brief dramatic stamp pause
      setTimeout(() => {
        if (this.modalBackdrop) {
          this.modalBackdrop.classList.add('active');
          if (window.railAudio) {
            window.railAudio.playWhistle();
          }
        }
      }, 750);
    });
  }

  bindModalEvents() {
    const closeModal = () => {
      if (this.modalBackdrop) {
        this.modalBackdrop.classList.remove('active');
      }
    };

    if (this.modalCloseBtn) this.modalCloseBtn.addEventListener('click', closeModal);
    if (this.modalDismissBtn) this.modalDismissBtn.addEventListener('click', closeModal);

    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.modalBackdrop) closeModal();
      });
    }

    if (this.modalPrintBtn) {
      this.modalPrintBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ticketEngine = new TicketReservationEngine();
});
