// ==========================================
// ÓRBITA #1 - ZINE VIVO (Gallery Wall Design - Horizontal Scroll)
// ==========================================

const scene = document.getElementById('scene');
const globalOverlay = document.getElementById('global-overlay');

// Define items for the zine
const items = [
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

  // Define margins from screen edges
  const topMargin = 80; // px from top
  const bottomMargin = 80; // px from bottom
  const maxVerticalOffset = (window.innerHeight - topMargin - bottomMargin) / 4; // Safe range for random positioning

  items.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'floating-item';
    el.setAttribute('data-index', index);

    // Add specific class based on item type for better styling
    if (item.type === 'image') {
      el.classList.add('image-item');
      // Add organic vertical positioning with margins
      const verticalOffset = (Math.random() - 0.5) * maxVerticalOffset;
      el.style.marginTop = `${topMargin + verticalOffset}px`;
      
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
      // Add organic vertical positioning with margins
      const verticalOffset = (Math.random() - 0.5) * maxVerticalOffset;
      el.style.marginTop = `${topMargin + verticalOffset}px`;
      
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = false; // No default controls - we'll add custom ones
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
      
      // Create custom video controls
      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'video-controls';
      
      // Play/Pause button
      const playPauseBtn = document.createElement('button');
      playPauseBtn.className = 'video-control-btn';
      playPauseBtn.textContent = 'Pause';
      playPauseBtn.onclick = () => {
        if (video.paused) {
          video.play();
          playPauseBtn.textContent = 'Pause';
        } else {
          video.pause();
          playPauseBtn.textContent = 'Play';
        }
      };
      
      // Mute/Unmute button
      const muteBtn = document.createElement('button');
      muteBtn.className = 'video-control-btn active'; // Start as active since video starts muted
      muteBtn.textContent = 'Unmute';
      muteBtn.onclick = () => {
        if (video.muted) {
          video.muted = false;
          muteBtn.textContent = 'Mute';
          muteBtn.classList.remove('active');
        } else {
          video.muted = true;
          muteBtn.textContent = 'Unmute';
          muteBtn.classList.add('active');
        }
      };
      
      controlsContainer.appendChild(playPauseBtn);
      controlsContainer.appendChild(muteBtn);
      el.appendChild(controlsContainer);
      
      const caption = document.createElement('p');
      caption.textContent = item.text;
      caption.className = 'caption';
      el.appendChild(caption);
      
    } else if (item.type === 'quote') {
      el.classList.add('text-item'); // Quote style - smaller, italic
      // Add organic vertical positioning with margins
      const verticalOffset = (Math.random() - 0.5) * maxVerticalOffset;
      el.style.marginTop = `${topMargin + verticalOffset}px`;
      
      const p = document.createElement('p');
      p.textContent = item.content;
      el.appendChild(p);
      
    } else if (item.type === 'title') {
      el.classList.add('title-item'); // Title style - bigger, bold, centered
      // Titles are always centered vertically (no random offset)
      el.style.marginTop = `${window.innerHeight / 2 - 100}px`; // Centered with slight adjustment
      
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

  console.log('✅ Gallery items created with responsive vertical scaling!');
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

console.log('🎨 Gallery Wall Zine script loaded - organic positioning, titles & quotes!');