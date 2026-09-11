/**
 * ADEY ABEBA ETHIOPIAN NEW YEAR PRANK & GIFT APP
 * Telebirr-Only Flow, Abebayehosh Traditional Music Synthesizer, & Verify.ET Integration
 */

// ==========================================
// 1. CONFIGURATION (Telebirr Dedicated)
// ==========================================
const TELEBIRR_CONFIG = {
  name: 'Telebirr',
  phone: '0933894394',
  merchantName: 'Bitsue Wolde',
  dialCode: '*127#'
};

const state = {
  selectedAmount: 100,
  currentStep: 1, // 1 = Amount, 2 = Verify
  musicPlaying: false,
  isVerifying: false
};

// ==========================================
// 2. ABEBAYEHOSH (አበባየሆሽ) TRADITIONAL MUSIC SYNTHESIZER
// ==========================================
class AbebayehoshAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.stepIndex = 0;

    // Traditional Abebayehosh Melody Notes in Ethiopian Ambassel/Tizita Pentatonic Scale
    // E4 = 329.63, G4 = 392.00, A4 = 440.00, B4 = 493.88, D5 = 587.33, E5 = 659.25
    this.melody = [
      // Phrase 1: "አበባየሆሽ"
      { note: 329.63, duration: 0.28, isKebero: true },  // E4 (አ)
      { note: 392.00, duration: 0.28, isKebero: false }, // G4 (በ)
      { note: 440.00, duration: 0.38, isKebero: true },  // A4 (ባ)
      { note: 493.88, duration: 0.28, isKebero: false }, // B4 (የ)
      { note: 440.00, duration: 0.45, isKebero: true },  // A4 (ሆሽ)

      // Phrase 2: "ለምለም"
      { note: 392.00, duration: 0.32, isKebero: false }, // G4 (ለም)
      { note: 329.63, duration: 0.55, isKebero: true },  // E4 (ለም)

      // Phrase 3: "አበባየሆሽ"
      { note: 329.63, duration: 0.28, isKebero: true },  // E4 (አ)
      { note: 392.00, duration: 0.28, isKebero: false }, // G4 (በ)
      { note: 440.00, duration: 0.38, isKebero: true },  // A4 (ባ)
      { note: 493.88, duration: 0.28, isKebero: false }, // B4 (የ)
      { note: 440.00, duration: 0.45, isKebero: true },  // A4 (ሆሽ)

      // Phrase 4: "ለምለም"
      { note: 392.00, duration: 0.32, isKebero: false }, // G4 (ለም)
      { note: 329.63, duration: 0.55, isKebero: true },  // E4 (ለም)

      // Phrase 5: "እንኳን አደረሳችሁ"
      { note: 493.88, duration: 0.28, isKebero: true },  // B4 (እን)
      { note: 587.33, duration: 0.35, isKebero: false }, // D5 (ኳን)
      { note: 493.88, duration: 0.28, isKebero: true },  // B4 (አ)
      { note: 440.00, duration: 0.28, isKebero: false }, // A4 (ደ)
      { note: 392.00, duration: 0.28, isKebero: true },  // G4 (ረ)
      { note: 440.00, duration: 0.55, isKebero: false }, // A4 (ሳችሁ)

      // Phrase 6: "ለአዲሱ ዓመት"
      { note: 392.00, duration: 0.32, isKebero: true },  // G4 (ለ)
      { note: 329.63, duration: 0.28, isKebero: false }, // E4 (አ)
      { note: 293.66, duration: 0.32, isKebero: true },  // D4 (ዲሱ)
      { note: 329.63, duration: 0.70, isKebero: false }, // E4 (ዓመት)

      // Rest beat before looping
      { note: 0, duration: 0.35, isKebero: false }
    ];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Synthesize traditional plucked Ethiopian Krar string sound
  playKrarPluck(freq, duration) {
    if (!this.ctx || freq <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Use triangle wave with subtle harmonic shimmer for authentic folk acoustic pluck
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Dynamic pluck envelope
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.2);
  }

  // Synthesize soft Kebero (traditional hand drum / clap) rhythmic pulse
  playKeberoPulse() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Play button click chime
  playClick() {
    try {
      this.initContext();
      this.playKrarPluck(523.25, 0.15);
    } catch (e) {}
  }

  // Play celebratory prank fanfare
  playPrankFanfare() {
    try {
      this.initContext();
      const fanfareNotes = [440, 554.37, 659.25, 880, 1108.73];
      fanfareNotes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playKrarPluck(freq, 0.4);
          this.playKeberoPulse();
        }, idx * 110);
      });
    } catch (e) {}
  }

  // Start continuous Abebayehosh melody loop
  startSong() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.stepIndex = 0;
    this.scheduleNextNote();
  }

  scheduleNextNote() {
    if (!this.isPlaying) return;

    const item = this.melody[this.stepIndex];
    if (item.note > 0) {
      this.playKrarPluck(item.note, item.duration);
    }
    if (item.isKebero) {
      this.playKeberoPulse();
    }

    this.stepIndex = (this.stepIndex + 1) % this.melody.length;
    this.timerId = setTimeout(() => {
      this.scheduleNextNote();
    }, item.duration * 1000);
  }

  stopSong() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stopSong();
      return false;
    } else {
      this.startSong();
      return true;
    }
  }
}

const audio = new AbebayehoshAudioEngine();

// ==========================================
// 3. MAIN UI HANDLERS & DOM SETUP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const splashScreen = document.getElementById('splashScreen');
  const checkoutModal = document.getElementById('checkoutModal');
  const btnCollectPainting = document.getElementById('btnCollectPainting');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');

  // Steps
  const stepContentAmount = document.getElementById('stepContentAmount');
  const stepContentVerify = document.getElementById('stepContentVerify');
  const prankRevealScreen = document.getElementById('prankRevealScreen');

  const btnNextToVerify = document.getElementById('btnNextToVerify');
  const btnBackToAmount = document.getElementById('btnBackToAmount');
  const btnSubmitVerify = document.getElementById('btnSubmitVerify');

  const txnInput = document.getElementById('txnInput');
  const verificationAlert = document.getElementById('verificationAlert');
  const alertText = document.getElementById('alertText');
  const copyAccountBtn = document.getElementById('copyAccountBtn');
  const toastMsg = document.getElementById('toastMsg');
  const toastText = document.getElementById('toastText');

  const btnPrankFriends = document.getElementById('btnPrankFriends');
  const btnToggleConsolation = document.getElementById('btnToggleConsolation');
  const realPaintingDrawer = document.getElementById('realPaintingDrawer');

  // 1. Splash Screen Dismissal
  setTimeout(() => {
    splashScreen.classList.add('hidden');
  }, 3200);

  // 2. Abebayehosh Music Button Toggle
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      const isNowPlaying = audio.toggle();
      state.musicPlaying = isNowPlaying;
      if (isNowPlaying) {
        musicToggleBtn.classList.add('playing');
        musicLabel.textContent = 'ሙዚቃ ይጫወታል';
        showToast('🎵 አበባየሆሽ ሙዚቃ ተጀምሯል! (Playing)');
      } else {
        musicToggleBtn.classList.remove('playing');
        musicLabel.textContent = 'አበባየሆሽ';
        showToast('⏸️ ሙዚቃው ቆሟል (Paused)');
      }
    });
  }

  // 3. Open Modal & Auto-start Music on User Gesture
  if (btnCollectPainting) {
    btnCollectPainting.addEventListener('click', () => {
      audio.playClick();

      // Automatically play Abebayehosh on first user interaction if not playing
      if (!state.musicPlaying) {
        const isNowPlaying = audio.toggle();
        state.musicPlaying = isNowPlaying;
        if (isNowPlaying && musicToggleBtn) {
          musicToggleBtn.classList.add('playing');
          musicLabel.textContent = 'ሙዚቃ ይጫወታል';
        }
      }

      openModal();
    });
  }

  function openModal() {
    checkoutModal.classList.add('active');
    setStep(1);
  }

  function closeModal() {
    checkoutModal.classList.remove('active');
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeModal);
  }

  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) closeModal();
  });

  // 4. Amount Selection Handler
  const amountChips = document.querySelectorAll('.amount-chip');
  const customAmountInput = document.getElementById('customAmountInput');

  amountChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      audio.playClick();
      amountChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      state.selectedAmount = parseInt(chip.dataset.amount, 10);
      if (customAmountInput) customAmountInput.value = '';
      updateMerchantDisplay();
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
      if (val && val > 0) {
        amountChips.forEach(c => c.classList.remove('selected'));
        state.selectedAmount = val;
        updateMerchantDisplay();
      }
    });
  }

  // Step 1 -> Step 2
  if (btnNextToVerify) {
    btnNextToVerify.addEventListener('click', () => {
      audio.playClick();
      setStep(2);
    });
  }

  // Step 2 -> Step 1
  if (btnBackToAmount) {
    btnBackToAmount.addEventListener('click', () => {
      audio.playClick();
      setStep(1);
    });
  }

  // 5. Transaction Verification Submission
  if (btnSubmitVerify) {
    btnSubmitVerify.addEventListener('click', handleVerification);
  }

  if (txnInput) {
    txnInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleVerification();
    });
    txnInput.addEventListener('input', () => {
      verificationAlert.style.display = 'none';
    });
  }

  async function handleVerification() {
    const rawCode = (txnInput.value || '').trim();
    const cleanCode = rawCode.replace(/[^A-Za-z0-9_-]/g, '').toUpperCase();

    // Client-side quick check
    if (!cleanCode || cleanCode.length < 5) {
      audio.playClick();
      verificationAlert.style.display = 'flex';
      alertText.textContent = '❌ የተሳሳተ ወይም ያልተሟላ የቴሌብር ግብይት ቁጥር! እባክዎ ከኤስኤምኤስ (SMS) ደረሰኝዎ ላይ ትክክለኛውን ኮድ ያስገቡ።';
      return;
    }

    state.isVerifying = true;
    verificationAlert.style.display = 'none';
    btnSubmitVerify.disabled = true;
    btnSubmitVerify.innerHTML = `<span class="spinner"></span> <span>ከቴሌብር ኔትወርክ ጋር በመገናኘት ላይ...</span>`;

    try {
      // Call Vercel serverless function /api/verify
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionNumber: cleanCode,
          amount: state.selectedAmount
        })
      });

      const result = await response.json().catch(() => null);

      // If backend exists and responds
      if (response.ok && result?.verified) {
        triggerPrankReveal(cleanCode);
      } else if (response.status === 404 || !result) {
        // Fallback for local static testing (when running without Vercel serverless backend)
        console.log('Local test mode fallback for transaction verification');
        setTimeout(() => {
          triggerPrankReveal(cleanCode);
        }, 1200);
      } else {
        // Live verification failed (mismatch or unverified on Telebirr network)
        verificationAlert.style.display = 'flex';
        alertText.textContent = result?.message || '❌ ክፍያው በቴሌብር ኔትወርክ ላይ አልተረጋገጠም። እባክዎ ቁጥሩን አስተካክለው እንደገና ይሞክሩ።';
      }
    } catch (err) {
      console.warn('Network call failed, falling back to local simulation:', err);
      // Allows testing locally on python -m http.server without crashing!
      setTimeout(() => {
        triggerPrankReveal(cleanCode);
      }, 1200);
    } finally {
      state.isVerifying = false;
      btnSubmitVerify.disabled = false;
      btnSubmitVerify.innerHTML = `<span>ክፍያውን አረጋግጥ & ስዕሉን ውሰድ</span> <span>→</span>`;
    }
  }

  // 6. The Hilarious Prank Reveal ("ተበልተሃል!")
  function triggerPrankReveal(code) {
    audio.playPrankFanfare();

    if (window.adeyPetals) {
      window.adeyPetals.burst();
    }

    document.querySelector('.step-tracker').style.display = 'none';
    stepContentAmount.style.display = 'none';
    stepContentVerify.style.display = 'none';
    prankRevealScreen.style.display = 'block';

    document.getElementById('prankTxnCode').textContent = code;
    document.getElementById('prankAmount').textContent = `${state.selectedAmount} ETB`;
  }

  // 7. Prank Share Button
  if (btnPrankFriends) {
    btnPrankFriends.addEventListener('click', () => {
      audio.playClick();
      const shareUrl = window.location.href;
      const shareText = `🌼 የአዲስ ዓመት ስጦታ ስዕልዎን በነፃ ይቀበሉ! መልካም አዲስ ዓመት 🌼\n👉 ${shareUrl}`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        showToast('የማጭበርበሪያው ሊንክ ተቀድቷል! ለጓደኞችህ ላክላቸው 😂');
      }

      if (navigator.share) {
        navigator.share({
          title: 'መልካም አዲስ ዓመት - የአበባ ስጦታዎን ይቀበሉ!',
          text: shareText,
          url: shareUrl
        }).catch(() => {});
      }
    });
  }

  // 8. Consolation Gift Toggle
  if (btnToggleConsolation) {
    btnToggleConsolation.addEventListener('click', () => {
      audio.playClick();
      const isOpen = realPaintingDrawer.classList.contains('show');
      if (isOpen) {
        realPaintingDrawer.classList.remove('show');
        btnToggleConsolation.textContent = 'እሺ በቃ አትዘን... እውነተኛው ስዕልህ ይኸው ❤️';
      } else {
        realPaintingDrawer.classList.add('show');
        btnToggleConsolation.textContent = 'ስዕሉን ደብቅ ▲';
      }
    });
  }

  // 9. Copy Telebirr Phone Button
  if (copyAccountBtn) {
    copyAccountBtn.addEventListener('click', () => {
      audio.playClick();
      const phone = TELEBIRR_CONFIG.phone;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phone);
        showToast(`የቴሌብር ቁጥር ተቀድቷል: ${phone}`);
      }
    });
  }

  function setStep(stepNum) {
    state.currentStep = stepNum;

    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach((item) => {
      const s = parseInt(item.dataset.step, 10);
      item.classList.remove('active', 'completed');
      if (s === stepNum) item.classList.add('active');
      if (s < stepNum) item.classList.add('completed');
    });

    stepContentAmount.style.display = stepNum === 1 ? 'block' : 'none';
    stepContentVerify.style.display = stepNum === 2 ? 'block' : 'none';
    prankRevealScreen.style.display = 'none';

    updateMerchantDisplay();
  }

  function updateMerchantDisplay() {
    const merchantAmountVal = document.getElementById('merchantAmountVal');
    if (merchantAmountVal) {
      merchantAmountVal.textContent = `${state.selectedAmount.toFixed(2)} ETB`;
    }
  }

  function showToast(message) {
    if (!toastMsg) return;
    toastText.textContent = message;
    toastMsg.classList.add('show');
    setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 3000);
  }
});
