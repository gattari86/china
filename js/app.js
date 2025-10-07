/* ========================================
   DISCOVER CHINA! - Main JavaScript
   Interactive functionality & accessibility
   ======================================== */

// ========================================
// STATE MANAGEMENT
// ========================================
const AppState = {
  contentData: null,
  audioMuted: false,
  motionReduced: false,
  currentFactIndex: 0,
  completedSections: [],
  earnedStickers: [],
  currentlyPlaying: null,
  unsplashCache: {}
};

// Photo mappings - Using Pexels for verified, accurate free images
// Each image manually verified to match the actual content
const UNSPLASH_PHOTOS = {
  // Festivals - matching content.json imgRef names
  'festival_dragon': 'https://images.pexels.com/photos/1047030/pexels-photo-1047030.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Chinese red lanterns
  'festival_boat': 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Dragon boat racing
  'festival_moon': 'https://images.pexels.com/photos/421129/pexels-photo-421129.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Full moon

  // Food - matching content.json imgRef names
  'food_dumpling': 'https://images.pexels.com/photos/6544381/pexels-photo-6544381.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Chinese dumplings
  'food_noodles': 'https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Chinese noodles
  'food_mooncake': 'https://images.pexels.com/photos/6544424/pexels-photo-6544424.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Mooncakes

  // Animals - matching content.json imgRef names
  'animal_panda': 'https://images.pexels.com/photos/3608263/pexels-photo-3608263.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Giant panda eating bamboo
  'animal_red_panda': 'https://images.pexels.com/photos/1661535/pexels-photo-1661535.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Red panda
  'animal_monkey': 'https://images.pexels.com/photos/50582/park-monkey-the-indian-ocean-sri-lanka-50582.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Monkey

  // Landmarks - matching content.json imgRef names
  'landmark_wall': 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Great Wall of China
  'landmark_warriors': 'https://images.pexels.com/photos/2893685/pexels-photo-2893685.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Terracotta Warriors

  // Clothing - matching content.json imgRef names
  'clothing_qipao': 'https://images.pexels.com/photos/8923933/pexels-photo-8923933.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',  // Traditional Qipao dress
  'clothing_hanfu': 'https://images.pexels.com/photos/8923928/pexels-photo-8923928.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'  // Hanfu traditional clothing
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Load content from JSON
 */
async function loadContent() {
  try {
    const response = await fetch('assets/content.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    AppState.contentData = await response.json();
    console.log('✅ Content loaded successfully:', AppState.contentData);
    console.log('📊 Festivals count:', AppState.contentData.festivals?.length);
    console.log('📊 Food count:', AppState.contentData.food?.length);
  } catch (error) {
    console.error('❌ Error loading content:', error);
    AppState.contentData = getFallbackContent();
  }
}

/**
 * Fallback content if JSON fails to load
 */
function getFallbackContent() {
  return {
    festivals: [],
    food: [],
    animals: [],
    landmarks: [],
    clothing: [],
    phrases: [],
    funFacts: ["Welcome to Discover China!"]
  };
}

/**
 * Play audio with Web Speech API for Mandarin
 */
function playAudio(text, lang = 'zh-CN', button = null) {
  if (AppState.audioMuted) {
    console.log('Audio muted');
    return;
  }

  // Stop currently playing audio
  if (AppState.currentlyPlaying) {
    window.speechSynthesis.cancel();
  }

  // Check if Web Speech API is supported
  if (!('speechSynthesis' in window)) {
    console.warn('Web Speech API not supported');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.8; // Slower speed for learning
  utterance.pitch = 1.1; // Slightly higher pitch for child-friendly voice
  utterance.volume = 1.0;

  // Try to find a Chinese voice
  const voices = window.speechSynthesis.getVoices();
  const chineseVoice = voices.find(voice =>
    voice.lang.startsWith('zh') ||
    voice.lang === 'zh-CN' ||
    voice.lang === 'zh-TW'
  );

  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  // Mark button as playing
  if (button) {
    button.classList.add('playing');
    button.setAttribute('aria-pressed', 'true');
  }

  utterance.onend = () => {
    if (button) {
      button.classList.remove('playing');
      button.setAttribute('aria-pressed', 'false');
    }
    AppState.currentlyPlaying = null;
  };

  utterance.onerror = (error) => {
    console.log('Speech synthesis error:', error);
    if (button) {
      button.classList.remove('playing');
      button.setAttribute('aria-pressed', 'false');
    }
  };

  window.speechSynthesis.speak(utterance);
  AppState.currentlyPlaying = utterance;
}

/**
 * Play sound effect
 */
function playSFX(sfxName) {
  playAudio(`${sfxName}.mp3`);
}

/**
 * Save state to localStorage
 */
function saveState() {
  localStorage.setItem('discoverChina_completedSections', JSON.stringify(AppState.completedSections));
  localStorage.setItem('discoverChina_earnedStickers', JSON.stringify(AppState.earnedStickers));
}

/**
 * Load state from localStorage
 */
function loadState() {
  const completed = localStorage.getItem('discoverChina_completedSections');
  const stickers = localStorage.getItem('discoverChina_earnedStickers');

  if (completed) {
    AppState.completedSections = JSON.parse(completed);
  }

  if (stickers) {
    AppState.earnedStickers = JSON.parse(stickers);
    renderStickerBook();
  }
}

/**
 * Announce to screen readers
 */
function announce(message) {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.className = 'sr-only';
  liveRegion.textContent = message;
  document.body.appendChild(liveRegion);

  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 1000);
}

// ========================================
// CONTENT RENDERING
// ========================================

/**
 * Get Unsplash photo URL for image reference
 */
function getPhotoURL(imgRef) {
  // Check if we have an Unsplash URL for this image
  if (UNSPLASH_PHOTOS[imgRef]) {
    return UNSPLASH_PHOTOS[imgRef];
  }

  // Fallback to SVG if no Unsplash photo available
  return `assets/images/${imgRef}.svg`;
}

/**
 * Render category cards with real photography
 */
function renderCards(category, containerSelector) {
  console.log(`🎨 Rendering ${category} cards...`);
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error(`❌ Container not found: ${containerSelector}`);
    return;
  }

  if (!AppState.contentData[category]) {
    console.error(`❌ No content data for category: ${category}`);
    return;
  }

  console.log(`✅ Found ${AppState.contentData[category].length} items for ${category}`);
  container.innerHTML = '';

  AppState.contentData[category].forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-index', index);

    const photoURL = getPhotoURL(item.imgRef);

    card.innerHTML = `
      <img
        src="${photoURL}"
        alt="${item.title}"
        class="card-image"
        loading="lazy"
      >
      <div class="card-content">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-text">${item.copy}</p>
        <button
          class="play-button"
          aria-label="Play ${item.title} sound"
          data-title="${item.title}"
        >
          <span class="play-icon" aria-hidden="true">🔊</span>
          <span>Hear It!</span>
        </button>
      </div>
    `;

    // Add audio event listener with Web Speech API
    const playBtn = card.querySelector('.play-button');
    playBtn.addEventListener('click', function() {
      // Speak the title in Mandarin if available, otherwise English
      const text = item.title;
      playAudio(text, 'zh-CN', this);
      announce(`Playing ${item.title}`);
    });

    container.appendChild(card);
  });
}

/**
 * Render soundboard (Mandarin phrases)
 */
function renderSoundboard() {
  const soundboard = document.getElementById('soundboard');
  if (!soundboard || !AppState.contentData.phrases) return;

  soundboard.innerHTML = '';

  AppState.contentData.phrases.forEach((phrase, index) => {
    const button = document.createElement('button');
    button.className = 'phrase-button';
    button.setAttribute('lang', 'zh-Hans');
    button.setAttribute('aria-label', `Say ${phrase.en} in Mandarin: ${phrase.pinyin}`);
    button.setAttribute('data-audio', phrase.audio);

    button.innerHTML = `
      <span class="phrase-zh">${phrase.zh}</span>
      <span class="phrase-pinyin" lang="en">${phrase.pinyin}</span>
      <span class="phrase-kid" lang="en">(${phrase.kid})</span>
      <span class="phrase-en" lang="en">${phrase.en}</span>
    `;

    button.addEventListener('click', function() {
      // Use Web Speech API to speak the Mandarin phrase
      playAudio(phrase.zh, 'zh-CN', this);
      announce(`Playing: ${phrase.en}`);
    });

    soundboard.appendChild(button);
  });
}

/**
 * Render fun facts carousel
 */
function renderFacts() {
  const carousel = document.getElementById('factsCarousel');
  if (!carousel || !AppState.contentData.funFacts) return;

  carousel.innerHTML = '';

  const track = document.createElement('div');
  track.className = 'carousel-track';
  track.style.transform = `translateX(0)`;

  AppState.contentData.funFacts.forEach(fact => {
    const card = document.createElement('div');
    card.className = 'fact-card';
    card.textContent = fact;
    track.appendChild(card);
  });

  carousel.appendChild(track);
}

/**
 * Navigate carousel
 */
function navigateCarousel(direction) {
  const track = document.querySelector('.carousel-track');
  const totalFacts = AppState.contentData.funFacts.length;

  if (direction === 'next') {
    AppState.currentFactIndex = (AppState.currentFactIndex + 1) % totalFacts;
  } else {
    AppState.currentFactIndex = (AppState.currentFactIndex - 1 + totalFacts) % totalFacts;
  }

  track.style.transform = `translateX(-${AppState.currentFactIndex * 100}%)`;
  announce(AppState.contentData.funFacts[AppState.currentFactIndex]);
}

/**
 * Initialize drag and drop game
 */
function initDragDropGame() {
  const draggableContainer = document.getElementById('draggableItems');
  const dropZoneContainer = document.getElementById('dropZones');

  if (!draggableContainer || !dropZoneContainer) return;

  // Simple food items for matching
  const gameItems = [
    { id: 'dumpling', name: 'Dumpling', emoji: '🥟' },
    { id: 'noodles', name: 'Noodles', emoji: '🍜' },
    { id: 'mooncake', name: 'Mooncake', emoji: '🥮' }
  ];

  // Create draggable items
  gameItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'draggable-item';
    div.draggable = true;
    div.dataset.id = item.id;
    div.innerHTML = `${item.emoji} ${item.name}`;

    // Drag events
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);

    // Touch events for mobile
    div.addEventListener('touchstart', handleTouchStart);
    div.addEventListener('touchmove', handleTouchMove);
    div.addEventListener('touchend', handleTouchEnd);

    draggableContainer.appendChild(div);
  });

  // Create drop zones
  gameItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'drop-zone';
    div.dataset.accepts = item.id;
    div.textContent = `${item.emoji} Place here`;

    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);
    div.addEventListener('dragleave', handleDragLeave);

    dropZoneContainer.appendChild(div);
  });
}

// Drag and Drop handlers
let draggedElement = null;

function handleDragStart(e) {
  draggedElement = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  this.classList.add('drag-over');
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  this.classList.remove('drag-over');

  if (draggedElement && draggedElement.dataset.id === this.dataset.accepts) {
    // Correct match!
    this.classList.add('filled');
    this.innerHTML = draggedElement.innerHTML + ' ✓';
    draggedElement.style.opacity = '0.3';
    draggedElement.draggable = false;

    playSFX('ding');
    announce('Correct match!');

    // Check if all matched
    setTimeout(checkGameComplete, 500);
  } else {
    // Wrong match
    announce('Try a different spot!');
  }

  return false;
}

// Touch support for mobile drag and drop
let touchStartX, touchStartY;

function handleTouchStart(e) {
  draggedElement = this;
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  this.classList.add('dragging');
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];

  // Move the element
  if (draggedElement) {
    draggedElement.style.position = 'fixed';
    draggedElement.style.left = touch.clientX - 50 + 'px';
    draggedElement.style.top = touch.clientY - 25 + 'px';
    draggedElement.style.zIndex = '1000';
  }
}

function handleTouchEnd(e) {
  if (!draggedElement) return;

  const touch = e.changedTouches[0];
  const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);

  // Reset position
  draggedElement.style.position = '';
  draggedElement.style.left = '';
  draggedElement.style.top = '';
  draggedElement.style.zIndex = '';
  draggedElement.classList.remove('dragging');

  if (dropZone && dropZone.classList.contains('drop-zone')) {
    if (draggedElement.dataset.id === dropZone.dataset.accepts) {
      dropZone.classList.add('filled');
      dropZone.innerHTML = draggedElement.innerHTML + ' ✓';
      draggedElement.style.opacity = '0.3';
      draggedElement.draggable = false;

      playSFX('ding');
      announce('Correct match!');

      setTimeout(checkGameComplete, 500);
    }
  }

  draggedElement = null;
}

function checkGameComplete() {
  const allZones = document.querySelectorAll('.drop-zone');
  const filledZones = document.querySelectorAll('.drop-zone.filled');

  if (allZones.length === filledZones.length) {
    setTimeout(() => {
      showReward('🎉', 'You matched them all!');
      addSticker('🎮');
    }, 500);
  }
}

/**
 * Show reward modal
 */
function showReward(sticker, message) {
  const modal = document.getElementById('rewardModal');
  const stickerEl = document.getElementById('rewardSticker');
  const messageEl = document.getElementById('rewardMessage');

  stickerEl.textContent = sticker;
  messageEl.textContent = message;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');

  // Confetti!
  createConfetti();

  announce(message);

  // Focus management
  document.getElementById('modalCloseBtn').focus();
}

/**
 * Add sticker to collection
 */
function addSticker(emoji) {
  if (!AppState.earnedStickers.includes(emoji)) {
    AppState.earnedStickers.push(emoji);
    saveState();
    renderStickerBook();
  }
}

/**
 * Render sticker book
 */
function renderStickerBook() {
  const stickerBook = document.getElementById('stickerBook');
  if (!stickerBook) return;

  stickerBook.innerHTML = '';

  if (AppState.earnedStickers.length === 0) {
    stickerBook.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">Complete activities to earn stickers!</p>';
    return;
  }

  AppState.earnedStickers.forEach(sticker => {
    const div = document.createElement('div');
    div.className = 'sticker';
    div.textContent = sticker;
    div.setAttribute('role', 'img');
    div.setAttribute('aria-label', `Earned sticker: ${sticker}`);
    stickerBook.appendChild(div);
  });
}

/**
 * Create confetti animation
 */
function createConfetti() {
  if (AppState.motionReduced) return;

  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const confetti = [];
  const colors = ['#FF6961', '#FFD966', '#B2E7E8', '#FFFFFF'];

  // Create confetti pieces
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1
    });
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((p, index) => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y > canvas.height) {
        confetti.splice(index, 1);
      }
    });

    if (confetti.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      canvas.style.display = 'none';
    }
  }

  animateConfetti();
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Global mute toggle
 */
document.getElementById('globalMute')?.addEventListener('click', function() {
  AppState.audioMuted = !AppState.audioMuted;
  this.setAttribute('aria-pressed', AppState.audioMuted);

  if (AppState.audioMuted) {
    this.querySelector('.icon').textContent = '🔇';
    this.querySelector('.label').textContent = 'Sound Off';
    if (AppState.currentlyPlaying) {
      AppState.currentlyPlaying.pause();
    }
  } else {
    this.querySelector('.icon').textContent = '🔊';
    this.querySelector('.label').textContent = 'Sound On';
  }

  announce(AppState.audioMuted ? 'Sound muted' : 'Sound enabled');
});

/**
 * Motion reduction toggle
 */
document.getElementById('reduceMotion')?.addEventListener('click', function() {
  AppState.motionReduced = !AppState.motionReduced;
  this.setAttribute('aria-pressed', AppState.motionReduced);

  if (AppState.motionReduced) {
    document.body.classList.add('reduce-motion');
    this.querySelector('.icon').textContent = '⏸️';
    this.querySelector('.label').textContent = 'Motion Off';
  } else {
    document.body.classList.remove('reduce-motion');
    this.querySelector('.icon').textContent = '🎬';
    this.querySelector('.label').textContent = 'Motion On';
  }

  announce(AppState.motionReduced ? 'Animations reduced' : 'Animations enabled');
});

/**
 * Carousel navigation
 */
document.querySelector('.prev-btn')?.addEventListener('click', () => navigateCarousel('prev'));
document.querySelector('.next-btn')?.addEventListener('click', () => navigateCarousel('next'));

/**
 * Keyboard navigation for carousel
 */
document.addEventListener('keydown', (e) => {
  if (e.target.closest('.carousel-container')) {
    if (e.key === 'ArrowLeft') {
      navigateCarousel('prev');
    } else if (e.key === 'ArrowRight') {
      navigateCarousel('next');
    }
  }
});

/**
 * Modal close handlers
 */
document.getElementById('modalCloseBtn')?.addEventListener('click', function() {
  const modal = document.getElementById('rewardModal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
});

/**
 * Grown-ups link
 */
document.querySelector('.grown-ups-link')?.addEventListener('click', function(e) {
  e.preventDefault();
  const modal = document.getElementById('grownUpsModal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.modal-close')?.focus();
  }
});

/**
 * Close grown-ups modal
 */
document.querySelector('#grownUpsModal .modal-close')?.addEventListener('click', function() {
  const modal = document.getElementById('grownUpsModal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
});

/**
 * Close modals on escape key
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
  }
});

/**
 * Close modals on background click
 */
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
      this.setAttribute('aria-hidden', 'true');
    }
  });
});

/**
 * Section completion tracking
 */
const sections = ['festivals', 'food', 'animals', 'landmarks', 'clothing', 'phrases'];

sections.forEach(section => {
  const sectionEl = document.getElementById(section);
  if (sectionEl) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !AppState.completedSections.includes(section)) {
          AppState.completedSections.push(section);
          saveState();

          // Award sticker for visiting
          if (Math.random() > 0.5) { // Randomly award stickers
            const sectionStickers = {
              festivals: '🏮',
              food: '🥟',
              animals: '🐼',
              landmarks: '🏯',
              clothing: '👘',
              phrases: '💬'
            };

            addSticker(sectionStickers[section]);
          }
        }
      });
    }, { threshold: 0.5 });

    observer.observe(sectionEl);
  }
});

/**
 * Check for prefers-reduced-motion
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  AppState.motionReduced = true;
  document.body.classList.add('reduce-motion');
  const btn = document.getElementById('reduceMotion');
  if (btn) {
    btn.setAttribute('aria-pressed', 'true');
    btn.querySelector('.icon').textContent = '⏸️';
    btn.querySelector('.label').textContent = 'Motion Off';
  }
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 2000); // Show loading animation for 2 seconds
  }
}

/**
 * Initialize Web Speech API voices
 */
function initSpeechSynthesis() {
  // Load voices (needed for some browsers)
  if ('speechSynthesis' in window) {
    // Load voices immediately
    window.speechSynthesis.getVoices();

    // Also load when voices change (Chrome needs this)
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
      console.log('Speech synthesis voices loaded');
    };
  }
}

/**
 * Setup lazy loading for images
 */
function setupLazyLoading() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // Add fade-in animation
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.5s ease-in-out';

          img.onload = () => {
            img.style.opacity = '1';
          };

          // If image is already loaded
          if (img.complete) {
            img.style.opacity = '1';
          }

          observer.unobserve(img);
        }
      });
    }, {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    });

    // Observe all images with loading="lazy"
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

async function init() {
  console.log('Initializing Discover China!');

  // Initialize Web Speech API
  initSpeechSynthesis();

  // Load content
  await loadContent();

  // Load saved state
  loadState();

  // Render all content
  renderCards('festivals', '[data-category="festivals"]');
  renderCards('food', '[data-category="food"]');
  renderCards('animals', '[data-category="animals"]');
  renderCards('landmarks', '[data-category="landmarks"]');
  renderCards('clothing', '[data-category="clothing"]');

  renderSoundboard();
  renderFacts();
  initDragDropGame();
  renderStickerBook();

  // Setup lazy loading for all dynamically loaded images
  setupLazyLoading();

  // Hide loading screen
  hideLoadingScreen();

  console.log('Discover China initialized!');
  announce('Welcome to Discover China! Use tab to navigate.');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle window resize for confetti canvas
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
