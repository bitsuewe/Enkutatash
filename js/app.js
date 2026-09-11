/**
 * ADEY ABEBA ETHIOPIAN NEW YEAR PRANK & GIFT APP
 * - Telebirr-Only Dedicated Flow
 * - Background Song: "Abebayehosh Lemlem" by Habesha Kids (YouTube: 6Bgp6YOuCDc)
 * - Local MP3 & Procedural Web Audio Synthesizer Fallbacks
 * - Vercel Serverless /api/verify Integration
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
// 2. SONG AUDIO CONTROLLER (Habesha Kids: 6Bgp6YOuCDc)
// ==========================================
class AbebayehoshSongManager {
  constructor() {
    this.ytPlayer = null;
    this.ytReady = false;
    this.localAudio = document.getElementById('localAbebayehoshAudio');
    this.isPlaying = false;
    this.synthEngine = new ProceduralSynthFallback();

    this.initYouTube();
    this.initLocalAudio();
  }

  initYouTube() {
    // Inject YouTube IFrame API script
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Set global callback for YouTube API
    window.onYouTubeIframeAPIReady = () => {
      try {
        this.ytPlayer = new window.YT.Player('youtube-audio-player', {
          height: '100',
          width: '100',
          videoId: '6Bgp6YOuCDc', // "Abebayehosh Lemlem" by Habesha Kids
          playerVars: {
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: '6Bgp6YOuCDc',
            modestbranding: 1,
            rel: 0
          },
          events: {
            onReady: (event) => {
              this.ytReady = true;
              event.target.setVolume(85);
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                this.setPlayingState(true);
              } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                this.setPlayingState(false);
              }
            },
            onError: (err) => {
              console.warn('YouTube playback error, using procedural synth fallback:', err);
              this.ytReady = false;
            }
          }
        });
      } catch (e) {
        console.warn('Could not initialize YouTube player:', e);
      }
    };
  }

  initLocalAudio() {
    if (this.localAudio) {
      this.localAudio.volume = 0.8;
      this.localAudio.addEventListener('play', () => this.setPlayingState(true));
      this.localAudio.addEventListener('pause', () => this.setPlayingState(false));
    }
  }

  play() {
    this.isPlaying = true;

    // 1. Try local MP3 if available
    if (this.localAudio && this.localAudio.readyState >= 2) {
      this.localAudio.play().then(() => {
        this.setPlayingState(true);
        return;
      }).catch(() => {});
    }

    // 2. Try YouTube IFrame Player (Habesha Kids: 6Bgp6YOuCDc)
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.playVideo();
        this.setPlayingState(true);
        return;
      } catch (e) {
        console.warn('YouTube playVideo failed:', e);
      }
    }

    // 3. Fallback to procedural synth if YouTube is still loading or blocked
    this.synthEngine.start();
    this.setPlayingState(true);
  }

  pause() {
    this.isPlaying = false;

    if (this.localAudio) {
      try { this.localAudio.pause(); } catch (e) {}
    }

    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try { this.ytPlayer.pauseVideo(); } catch (e) {}
    }

    this.synthEngine.stop();
    this.setPlayingState(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  setPlayingState(playing) {
    this.isPlaying = playing;
    state.musicPlaying = playing;
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const musicLabel = document.getElementById('musicLabel');

    if (musicToggleBtn && musicLabel) {
      if (playing) {
        musicToggleBtn.classList.add('playing');
        musicLabel.textContent = 'ሙዚቃ ይጫወታል';
      } else {
        musicToggleBtn.classList.remove('playing');
        musicLabel.textContent = 'አበባየሆሽ';
      }
    }
  }
}

// Procedural Krar/Pentatonic Synthesizer (Zero-dependency fallback)
class ProceduralSynthFallback {
  constructor() {
    this.ctx = null;
    this.timer = null;
    this.step = 0;
    this.melody = [
      { f: 329.63, d: 0.28 }, { f: 392.00, d: 0.28 }, { f: 440.00, d: 0.38 },
      { f: 493.88, d: 0.28 }, { f: 440.00, d: 0.45 }, { f: 392.00, d: 0.32 },
      { f: 329.63, d: 0.55 }, { f: 329.63, d: 0.28 }, { f: 392.00, d: 0.28 },
      { f: 440.00, d: 0.38 }, { f: 493.88, d: 0.28 }, { f: 440.00, d: 0.45 },
      { f: 392.00, d: 0.32 }, { f: 329.63, d: 0.55 }, { f: 493.88, d: 0.28 },
      { f: 587.33, d: 0.35 }, { f: 493.88, d: 0.28 }, { f: 440.00, d: 0.28 },
      { f: 392.00, d: 0.28 }, { f: 440.00, d: 0.55 }, { f: 392.00, d: 0.32 },
      { f: 329.63, d: 0.28 }, { f: 293.66, d: 0.32 }, { f: 329.63, d: 0.70 },
      { f: 0, d: 0.35 }
    ];
  }

  start() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.step = 0;
    this.schedule();
  }

  schedule() {
    const item = this.melody[this.step];
    if (item.f > 0 && this.ctx) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.d + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + item.d + 0.15);
    }
    this.step = (this.step + 1) % this.melody.length;
    this.timer = setTimeout(() => this.schedule(), item.d * 1000);
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  playClick() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playFanfare() {
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }, idx * 100);
    });
  }
}

// Global Song Manager Instance
let songManager;

// ==========================================
// 3. MAIN APPLICATION & DOM HANDLERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  songManager = new AbebayehoshSongManager();

  // DOM Elements
  const splashScreen = document.getElementById('splashScreen');
  const checkoutModal = document.getElementById('checkoutModal');
  const btnCollectPainting = document.getElementById('btnCollectPainting');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const musicToggleBtn = document.getElementById('musicToggleBtn');

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

  // 1. Dismiss Splash Screen
  setTimeout(() => {
    splashScreen.classList.add('hidden');
  }, 3200);

  // 2. Abebayehosh Song Toggle Button
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      const isNowPlaying = songManager.toggle();
      showToast(isNowPlaying ? '🎵 አበባየሆሽ (Abebayehosh Lemlem) እየተጫወተ ነው!' : '⏸️ ሙዚቃው ቆሟል (Paused)');
    });
  }

  // 3. Collect Painting CTA: Opens modal & plays Abebayehosh song
  if (btnCollectPainting) {
    btnCollectPainting.addEventListener('click', () => {
      songManager.synthEngine.playClick();

      // Automatically play Abebayehosh on first user interaction if not already playing
      if (!songManager.isPlaying) {
        songManager.play();
        showToast('🎵 አበባየሆሽ ሙዚቃ ተጀምሯል!');
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
      songManager.synthEngine.playClick();
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
      songManager.synthEngine.playClick();
      setStep(2);
    });
  }

  // Step 2 -> Step 1
  if (btnBackToAmount) {
    btnBackToAmount.addEventListener('click', () => {
      songManager.synthEngine.playClick();
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

    if (!cleanCode || cleanCode.length < 5) {
      songManager.synthEngine.playClick();
      verificationAlert.style.display = 'flex';
      alertText.textContent = '❌ የተሳሳተ ወይም ያልተሟላ የቴሌብር ግብይት ቁጥር! እባክዎ ከኤስኤምኤስ (SMS) ደረሰኝዎ ላይ ትክክለኛውን ኮድ ያስገቡ።';
      return;
    }

    state.isVerifying = true;
    verificationAlert.style.display = 'none';
    btnSubmitVerify.disabled = true;
    btnSubmitVerify.innerHTML = `<span class="spinner"></span> <span>ከቴሌብር ኔትወርክ ጋር በመገናኘት ላይ...</span>`;

    try {
      // Call Vercel serverless endpoint /api/verify
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionNumber: cleanCode,
          amount: state.selectedAmount
        })
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.verified) {
        triggerPrankReveal(cleanCode);
      } else if (response.status === 404 || !result) {
        // Fallback for static server preview
        setTimeout(() => {
          triggerPrankReveal(cleanCode);
        }, 1200);
      } else {
        verificationAlert.style.display = 'flex';
        alertText.textContent = result?.message || '❌ ክፍያው በቴሌብር ኔትወርክ ላይ አልተረጋገጠም። እባክዎ ቁጥሩን አስተካክለው እንደገና ይሞክሩ።';
      }
    } catch (err) {
      console.warn('API call failed, falling back to local simulation:', err);
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
    songManager.synthEngine.playFanfare();

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
      songManager.synthEngine.playClick();
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
      songManager.synthEngine.playClick();
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
      songManager.synthEngine.playClick();
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
