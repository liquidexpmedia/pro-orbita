// ==========================================
// ÓRBITA #1 - ZINE VIVO (Gallery Wall Design - Horizontal Scroll)
// ==========================================

const scene = document.getElementById('scene');
const globalOverlay = document.getElementById('global-overlay');

// Define items for the zine - NOW INCLUDING THE TITLE AS FIRST ITEM
const items = [
  { type: 'zine-title', title: 'Plotter\nSpectrum #1', date: 'July 2025' }, // NEW: Zine title as first item
  { type: 'image', src: './assets/Issue1_g.png', text: '"Good Things Come To Those Who Wait" \n- Yinka Illori at Picadilly Circus London, 2024' },
  { type: 'image', src: './assets/Issue1_j.png', text: '"Infinite Accumulation" - Yayoi Kusama at Liverpool Street Station London, 2024' },
  { type: 'quote', content: '"Collaborating with diverse thinkers to work toward a greater understanding of the dynamics of race, gender, and class is essential for those of us who want to move beyond one-dimensional ways of thinking, being, and living." - Teaching Critical Thinking: Practical Wisdom bell hooks, 2009' },
  { type: 'image', src: './assets/Issue1_c.png', text: '"The Encyclopedia of \nInvisibility and Six Thousand Years" \n- Tavares Strachan' },
  { type: 'title', content: 'Art & Technology: Bridging Worlds' },
  { type: 'video', src: './assets/IMG_1158.webm', text: 'Video de muestra del proyecto de arte interactivo' },
  { type: 'quote', content: '"For me, one of the things about artistic practice is that it\'s not about providing some solution, but instead provoking curiosity about some things that you should find on your own and not be led to." - Tavares Strachan The Brooklyn Rail, 2022' }
];

// Create gallery items with organic positioning
function createAndPositionItems() {
  scene.innerHTML = ''; // Clear existing items

  // Define margins from screen edges with better mobile support
  const isMobile = window.innerWidth <= 768;
  const topMargin = isMobile ? 60 : 80; // px from top
  const bottomMargin = isMobile ? 60 : 80; // px from bottom
  const centerY = window.innerHeight / 2; // Center point
  const maxVerticalOffset = isMobile ? 40 : (window.innerHeight - topMargin - bottomMargin) / 6; // Smaller range for better centering

  items.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'floating-item';
    el.setAttribute('data-index', index);
    
    // Add staggered animation delay for smoother appearance
    el.style.animationDelay = `${index * 0.1}s`;

    // Add specific class based on item type for better styling
    if (item.type === 'zine-title') {
      // Handle zine title as a gallery item
      el.classList.add('zine-title-item');
      // Center the title vertically with no random offset
      el.style.marginTop = `${centerY - (isMobile ? 120 : 150)}px`;
      
      const titleEl = document.createElement('h1');
      titleEl.className = 'zine-title';
      titleEl.textContent = item.title;
      el.appendChild(titleEl);
      
      const dateEl = document.createElement('p');
      dateEl.className = 'zine-date';
      dateEl.textContent = item.date;
      el.appendChild(dateEl);
      
    } else if (item.type === 'image') {
      el.classList.add('image-item');
      // Center around middle with small random offset
      const verticalOffset = (Math.random() - 0.5) * maxVerticalOffset;
      el.style.marginTop = `${centerY - 150 + verticalOffset}px`;
      
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.text;
      img.loading = 'lazy'; // Improve performance
      
      // Handle image load to ensure proper scaling
      img.onload = function() {
        // Additional check for very tall images
        if (this.naturalHeight > this.naturalWidth * 1.5) {
          // For very vertical images, ensure they fit properly
          this.style.maxHeight = `calc(100vh - 300px)`;
        }
      };
      
      el.appendChild(img);
      
      const caption = document.createElement('p');
      caption.textContent = item.text;
      caption.className = 'caption';
      el.appendChild(caption);
      
    } else if (item.type === 'video') {
      el.classList.add('video-item');
      // Center around middle with small random offset
      const verticalOffset = (Math.random() - 0.5) * maxVerticalOffset;
      el.style.marginTop = `${centerY - 180 + verticalOffset}px`;
      
      // Create custom video controls FIRST (above video)
      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'video-controls';
      
      // Play/Pause button with icon
      const playPauseBtn = document.createElement('button');
      playPauseBtn.className = 'video-control-btn play-pause';
      playPauseBtn.title = 'Play/Pause';
      
      // Mute/Unmute button with icon
      const muteBtn = document.createElement('button');
      muteBtn.className = 'video-control-btn mute-btn active'; // Start as active since video starts muted
      muteBtn.title = 'Mute/Unmute';
      
      controlsContainer.appendChild(playPauseBtn);
      controlsContainer.appendChild(muteBtn);
      el.appendChild(controlsContainer);
      
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = false; // No default controls - we have custom ones
      video.autoplay = true;
      video.loop = true;
      video.muted = true; // Start muted for autoplay
      video.playsInline = true; // Crucial for autoplay on iOS
      
      // Handle video metadata to ensure proper scaling
      video.onloadedmetadata = function() {
        // Additional check for very tall videos
        if (this.videoHeight > this.videoWidth * 1.5) {
          // For very vertical videos, ensure they fit properly
          this.style.maxHeight = `calc(100vh - 350px)`;
        }
      };
      
      el.appendChild(video);
      
      // Add event listeners for controls
      playPauseBtn.onclick = () => {
        if (video.paused) {
          video.play();
          playPauseBtn.classList.remove('paused');
        } else {
          video.pause();
          playPauseBtn.classList.add('paused');
        }
      };
      
      muteBtn.onclick = () => {
        if (video.muted) {
          video.muted = false;
          muteBtn.classList.remove('active');
        } else {
          video.muted = true;
          muteBtn.classList.add('active');
        }
      };
      
      const caption = document.createElement('p');
      caption.textContent = item.text;
      caption.className = 'caption';
      el.appendChild(caption);
      
    } else if (item.type === 'quote') {
      el.classList.add('text-item'); // Quote style - smaller, italic
      // Center around middle with small random offset
      const verticalOffset = (Math.random() - 0.5) * maxVerticalOffset;
      el.style.marginTop = `${centerY - 100 + verticalOffset}px`;
      
      const p = document.createElement('p');
      p.textContent = item.content;
      el.appendChild(p);
      
    } else if (item.type === 'title') {
      el.classList.add('title-item'); // Title style - bigger, bold, centered
      // Center vertically with no random offset
      el.style.marginTop = `${centerY - 80}px`;
      
      const p = document.createElement('p');
      p.textContent = item.content;
      el.appendChild(p);
    }

    scene.appendChild(el);
  });

  // Add spacer at the end for better scrolling experience
  const spacer = document.createElement('div');
  spacer.style.width = '100px';
  spacer.style.flexShrink = '0';
  spacer.style.height = '1px'; // Minimal height
  scene.appendChild(spacer);

  console.log('✅ Gallery items created with better vertical centering and video controls!');
}

// NEW: Add scroll progress indicator
function addScrollIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'scroll-indicator';
  indicator.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff9800, #f3f2f0);
    z-index: 200;
    transition: width 0.1s ease;
    width: 0%;
  `;
  document.body.appendChild(indicator);

  // Update scroll progress
  scene.addEventListener('scroll', () => {
    const scrollLeft = scene.scrollLeft;
    const maxScroll = scene.scrollWidth - scene.clientWidth;
    const progress = (scrollLeft / maxScroll) * 100;
    indicator.style.width = `${Math.min(progress, 100)}%`;
  });
}

// NEW: Add keyboard navigation
function addKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    const scrollAmount = 300;
    
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        scene.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        break;
      case 'ArrowRight':
        e.preventDefault();
        scene.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        break;
    }
  });
}


// Ensure items are repositioned on resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    createAndPositionItems();
  }, 200); // Debounce resize for performance
});

// ==========================================
// POPUP FUNCTIONALITY (Context Panel)
// ==========================================

// Initializer for popup
document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const zineContainer = document.getElementById('zine-container');
  
  // Simulate loading time then show content
  setTimeout(() => {
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (zineContainer) zineContainer.style.display = 'block';
    
    // Create gallery items after loading
    createAndPositionItems();
    
    // Initialize popup functionality
    initializePopup();
    
    // NEW: Add enhanced features
    addScrollIndicator();
    addKeyboardNavigation();
    
    console.log('🎨 Enhanced zine experience loaded!');
  }, 1500);
});

function initializePopup() {
  const toggleInfoBtn = document.getElementById('toggle-info');
  const closePopupBtn = document.getElementById('close-popup');
  const popupOverlay = document.getElementById('popup-overlay');

  if (toggleInfoBtn) {
    toggleInfoBtn.onclick = () => {
      popupOverlay.classList.remove('hidden');
      setTimeout(() => popupOverlay.classList.add('show'), 10);
      // Don't block scroll since we already have overflow-y: hidden
    };
  }

  if (closePopupBtn) {
    closePopupBtn.onclick = () => {
      popupOverlay.classList.remove('show');
      setTimeout(() => {
        popupOverlay.classList.add('hidden');
      }, 300);
    };
  }

  if (popupOverlay) {
    popupOverlay.onclick = (e) => {
      if (e.target === popupOverlay) {
        closePopupBtn.click();
      }
    };
  }
}

console.log('🎨 Gallery Wall Zine script loaded - title now scrolls as first gallery item!');