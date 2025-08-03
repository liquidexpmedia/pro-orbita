// ==========================================
// ÓRBITA #1 - ZINE VIVO (Gallery Wall Design - Horizontal Scroll)
// ==========================================

const scene = document.getElementById('scene');
const globalOverlay = document.getElementById('global-overlay');

// Define items for the zine
const items = [
  { type: 'image', src: './assets/Issue1_g.png', text: '"Good Things Come To Those Who Wait" \n- Yinka Illori at Picadilly Circus London, 2024' },
  { type: 'image', src: './assets/Issue1_j.png', text: '"Infinite Accumulation" - Yayoi Kusama at Liverpool Street Station London, 2024' },
  { type: 'text', content: '"Collaborating with diverse thinkers to work toward a greater understanding of the dynamics of race, gender, and class is essential for those of us who want to move beyond one-dimensional ways of thinking, being, and living." - Teaching Critical Thinking: Practical Wisdom bell hooks, 2009' },
  { type: 'image', src: './assets/Issue1_c.png', text: '"The Encyclopedia of \nInvisibility and Six Thousand Years" \n- Tavares Strachan' },
  { type: 'video', src: './assets/IMG_1158.webm', text: 'Video de muestra del proyecto de arte interactivo' },
  { type: 'text', content: '"For me, one of the things about artistic practice is that it\'s not about providing some solution, but instead provoking curiosity about some things that you should find on your own and not be led to." - Tavares Strachan The Brooklyn Rail, 2022' }
];

// Create gallery items with flexbox layout (no overlapping)
function createAndPositionItems() {
  scene.innerHTML = ''; // Clear existing items

  items.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'floating-item';
    el.setAttribute('data-index', index);

    // Add specific class based on item type for better styling
    if (item.type === 'image') {
      el.classList.add('image-item');
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.text;
      img.loading = 'lazy'; // Improve performance
      el.appendChild(img);
      
      const caption = document.createElement('p');
      caption.textContent = item.text;
      caption.className = 'caption';
      el.appendChild(caption);
      
    } else if (item.type === 'video') {
      el.classList.add('video-item');
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = false; // No controls by default
      video.autoplay = true;
      video.loop = true;
      video.muted = true; // Crucial for autoplay
      video.playsInline = true; // Crucial for autoplay on iOS
      el.appendChild(video);
      
      const caption = document.createElement('p');
      caption.textContent = item.text;
      caption.className = 'caption';
      el.appendChild(caption);
      
    } else if (item.type === 'text') {
      el.classList.add('text-item');
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

  console.log('✅ Gallery items created successfully - no overlapping!');
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

console.log('🎨 Gallery Wall Zine script loaded - horizontal scroll, no overlapping, responsive!');