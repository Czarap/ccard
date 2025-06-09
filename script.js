const questions = {
  friends: [
    "What quality in our friendship do you value the most and why?",
    "How has this friendship changed your perspective on life?",
    "What's a challenge we've faced together that made us stronger?",
    "What's a dream you'd love to achieve with this group of friends?",
    "How do we complement each other's strengths and weaknesses?",
    "In what ways have we helped each other grow?",
    "What's something you've learned about yourself through our friendship?",
    "How can we better support each other's goals and dreams?",
    "What's a skill or quality you admire in each person here?",
    "How has this friendship influenced your other relationships?"
  ],
  romance: [
    "What moment made you realize you were capable of deep love?",
    "How has your definition of love evolved over time?",
    "What's your most vulnerable fear about intimate relationships?",
    "What childhood experience shaped your view of love?",
    "What makes you feel most emotionally safe with someone?",
    "How do you prefer to receive affection and appreciation?",
    "What's your approach to resolving relationship conflicts?",
    "How do you balance independence and togetherness in relationships?",
    "What's your unique way of showing love to others?",
    "How do you maintain your identity while being part of a couple?"
  ],
  emotions: [
    "What emotion do you find most difficult to express and why?",
    "How has your emotional awareness evolved over time?",
    "What triggers your strongest emotional responses?",
    "How do you differentiate between temporary feelings and deeper emotions?",
    "What emotion do you wish you could experience more often?",
    "How has adversity shaped your emotional resilience?",
    "What emotional patterns have you noticed in yourself?",
    "How do you process and release difficult emotions?",
    "What helps you maintain emotional balance?",
    "How has your emotional intelligence grown over the years?"
  ]
};

let selectedCategory = null;
let isTransitioning = false;

// Get the initial title from the HTML
const cardTitle = document.querySelector('.card-title').textContent;

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Handle navigation clicks
document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        showPage(pageId);
        
        // Update URL without page reload
        history.pushState(null, '', `#${pageId}`);
    });
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    const pageId = window.location.hash.slice(1) || 'home';
    showPage(pageId);
});

// Show initial page based on URL hash
window.addEventListener('load', () => {
    const pageId = window.location.hash.slice(1) || 'home';
    showPage(pageId);
});

// Music Control
const bgMusic = document.getElementById('bgMusic');
const silentAudio = document.getElementById('silentAudio');
const musicToggle = document.getElementById('musicToggle');
const volumeHighIcon = document.getElementById('volumeHighIcon');
const volumeMuteIcon = document.getElementById('volumeMuteIcon');
let isMusicPlaying = true;

// Function to update icon state
function updateMusicIcon(playing) {
    if (playing) {
        volumeHighIcon.style.display = '';
        volumeMuteIcon.style.display = 'none';
    } else {
        volumeHighIcon.style.display = 'none';
        volumeMuteIcon.style.display = '';
    }
}

// Make sure icons are in correct initial state
updateMusicIcon(true);

// Function to unlock audio
async function unlockAudio() {
    try {
        updateMusicIcon(true);
        
        // Try to play silent audio first
        try {
            await silentAudio.play();
            silentAudio.pause();
        } catch (e) {
            console.log("Silent audio failed, trying main audio anyway");
        }
        
        // Now try to play the actual music
        bgMusic.volume = 0;
        await bgMusic.play();
        fadeAudio('in');
        isMusicPlaying = true;
        updateMusicIcon(true);
    } catch (error) {
        console.log("Autoplay failed:", error);
        isMusicPlaying = false;
        updateMusicIcon(false);
    }
}

// Save current time before unloading
window.addEventListener('beforeunload', () => {
    localStorage.setItem('musicTime', bgMusic.currentTime);
});

// Restore music state when page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTime = parseFloat(localStorage.getItem('musicTime')) || 0;
    bgMusic.currentTime = savedTime;
    
    if (localStorage.getItem('isMusicPlaying') !== 'false') {
        unlockAudio();
    } else {
        updateMusicIcon(false);
    }
});

// Fade audio function
function fadeAudio(direction) {
    const fadeStep = 0.05;
    const fadeInterval = 50;
    
    if (direction === 'in') {
        const fadeIn = setInterval(() => {
            if (bgMusic.volume < 0.3) {
                bgMusic.volume = Math.min(bgMusic.volume + fadeStep, 0.3);
            } else {
                clearInterval(fadeIn);
            }
        }, fadeInterval);
    } else if (direction === 'out') {
        const fadeOut = setInterval(() => {
            if (bgMusic.volume > 0.05) {
                bgMusic.volume = Math.max(bgMusic.volume - fadeStep, 0);
            } else {
                bgMusic.pause();
                bgMusic.volume = 0;
                clearInterval(fadeOut);
            }
        }, fadeInterval);
    }
}

// Function to toggle music
function toggleMusic() {
    isMusicPlaying = !isMusicPlaying;
    
    if (!isMusicPlaying) {
        fadeAudio('out');
        updateMusicIcon(false);
    } else {
        bgMusic.volume = 0;
        bgMusic.play().then(() => {
            fadeAudio('in');
            updateMusicIcon(true);
        }).catch(error => {
            console.log("Toggle playback failed:", error);
            isMusicPlaying = false;
            updateMusicIcon(false);
        });
    }
}

// Add click event listener to music toggle button
musicToggle.addEventListener('click', toggleMusic);

// Initialize music state
bgMusic.volume = 0;

// Try to unlock audio immediately
unlockAudio();

// Try on first interaction
document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

// Keep trying when window gets focus
window.addEventListener('focus', () => {
    if (!bgMusic.playing && isMusicPlaying) {
        unlockAudio();
    }
    updateMusicIcon(isMusicPlaying);
});

function showCategories() {
  const card = document.querySelector('.card');
  
  // Reset card content
  card.innerHTML = `
    <div class="eyes">
      <div class="eye">
        <div class="pupil">
          <div class="shine"></div>
        </div>
      </div>
      <div class="eye">
        <div class="pupil">
          <div class="shine"></div>
        </div>
      </div>
    </div>
    <h2 class="card-title">${cardTitle}</h2>
    <p class="card-subtitle">Question Cards</p>
    <div class="question-mark">?</div>
    <p class="card-instruction">Choose a category to start</p>
  `;

  // Show category buttons
  document.querySelector('.category-buttons').style.display = 'grid';
  
  // Remove controls if they exist
  const controlsContainer = document.querySelector('.controls-container');
  if (controlsContainer) {
    controlsContainer.remove();
  }
}

function handleCategorySelect(category) {
  if (isTransitioning) return;
  isTransitioning = true;

  selectedCategory = category;
  let questionsToDrawFrom = category === 'random' 
    ? Object.values(questions).flat()
    : questions[category];

  if (!questionsToDrawFrom || questionsToDrawFrom.length === 0) {
    console.warn(`No questions available for category: ${category}`);
    isTransitioning = false;
    return;
  }

  const randomIndex = Math.floor(Math.random() * questionsToDrawFrom.length);
  const newQuestion = questionsToDrawFrom[randomIndex];

  // Hide category buttons
  document.querySelector('.category-buttons').style.display = 'none';

  // Update card content
  const card = document.querySelector('.card');
  card.innerHTML = `
    <div class="eyes">
      <div class="eye">
        <div class="pupil">
          <div class="shine"></div>
        </div>
      </div>
      <div class="eye">
        <div class="pupil">
          <div class="shine"></div>
        </div>
      </div>
    </div>
    <h2 class="card-title">${cardTitle}</h2>
    <p class="card-subtitle">Question Cards</p>
    <div class="question-text">${newQuestion}</div>
  `;

  // Add controls if they don't exist
  let controlsContainer = document.querySelector('.controls-container');
  if (!controlsContainer) {
    controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';
    controlsContainer.innerHTML = `
      <button class="category-button" onclick="drawNewQuestion('${category}')">Draw Another</button>
      <button class="category-button" onclick="showCategories()">Change Category</button>
    `;
    document.getElementById('mainContent').appendChild(controlsContainer);
  }

  // Reset transition state
  isTransitioning = false;
}

function drawNewQuestion(category) {
  if (isTransitioning) return;
  isTransitioning = true;

  let questionsToDrawFrom = category === 'random' 
    ? Object.values(questions).flat()
    : questions[category];

  const randomIndex = Math.floor(Math.random() * questionsToDrawFrom.length);
  const newQuestion = questionsToDrawFrom[randomIndex];

  // Update card content
  const card = document.querySelector('.card');
  card.innerHTML = `
    <div class="eyes">
      <div class="eye">
        <div class="pupil">
          <div class="shine"></div>
        </div>
      </div>
      <div class="eye">
        <div class="pupil">
          <div class="shine"></div>
        </div>
      </div>
    </div>
    <h2 class="card-title">${cardTitle}</h2>
    <p class="card-subtitle">Question Cards</p>
    <div class="question-text">${newQuestion}</div>
  `;

  // Reset transition state
  isTransitioning = false;
}

// Initialize
window.onload = () => {
  // Get the initial title when the page loads
  const initialTitle = document.querySelector('.card-title').textContent;
  cardTitle = initialTitle;
  showCategories();
};

// Eye tracking animation
document.addEventListener('mousemove', (e) => {
  const eyes = document.querySelectorAll('.eye');
  eyes.forEach(eye => {
    const pupil = eye.querySelector('.pupil');
    const eyeRect = eye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + (eyeRect.width / 2);
    const eyeCenterY = eyeRect.top + (eyeRect.height / 2);
    
    const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
    const eyeRadius = eye.offsetWidth / 3;
    const distance = Math.min(
      eyeRadius,
      Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 6
    );
    
    const pupilX = Math.cos(angle) * distance;
    const pupilY = Math.sin(angle) * distance;
    
    pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
  });
});

// Blink animation
function blinkEyes() {
  const eyes = document.querySelectorAll('.eye');
  eyes.forEach(eye => {
    eye.style.transform = 'scaleY(0.1)';
    setTimeout(() => {
      eye.style.transform = '';
    }, 100);
  });
}

setInterval(blinkEyes, 4000);
document.addEventListener('click', blinkEyes);

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

// Create overlay element
const overlay = document.createElement('div');
overlay.classList.add('menu-overlay');
document.body.appendChild(overlay);

function toggleMenu() {
  navLinks.classList.toggle('active');
  overlay.classList.toggle('active');
  body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

function closeMenu() {
  navLinks.classList.remove('active');
  overlay.classList.remove('active');
  body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
  }
}); 