// ==========================================
// ÓRBITA #1 - ZINE VIVO (Diseño Móvil - Scroll Horizontal)
// ==========================================

const scene = document.getElementById('scene');
const globalOverlay = document.getElementById('global-overlay');

// Define items for the zine
const items = [
  { type: 'image', src: './assets/IMG_3264.jpg', text: 'Tracing the line book' },
  { type: 'image', src: './assets/17431766839_66141c241a_b.jpg', text: '"trial,be a plotter" by Michel Winterberg (2015)\nRandom VS Control “Trial, be a plotter” is an interactive installation in which the users head and mouth act as the interface for controlling a plotter. The result? Abstract, unpredictable drawings. What happens when the body becomes part of the drawing system? Would you choose precision or surprise? Which interface would give you more control or more randomness' },
  { type: 'image', src: './assets/Issue1_c.png', text: '"The Encyclopedia of \nInvisibility and Six Thousand Years" \n- Tavares Strachan' },
  { type: 'video', src: './assets/IMG_1158.webm', text: 'Video de muestra del proyecto de arte interactivo' },
  { type: 'text', content: '"For me, one of the things about artistic practice is that it\'s not about providing some solution, but instead provoking curiosity about some things that you should find on your own and not be led to." - Tavares Strachan The Brooklyn Rail, 2022' }
];

// Configuration for placement
const MIN_ITEM_WIDTH_VW = 30; // Minimum width of an item as a percentage of viewport width
const MAX_ITEM_WIDTH_VW = 50; // Maximum width of an item as a percentage of viewport width
const HORIZONTAL_SPREAD_FACTOR = 2.5; // How much wider the scrollable area is than the viewport

function createAndPositionItems() {
  scene.innerHTML = ''; // Clear existing items

  // Define the total width of the scrollable content area
  const scrollableWidth = window.innerWidth * HORIZONTAL_SPREAD_FACTOR;
  scene.style.width = `${scrollableWidth}px`; // Set scene width for horizontal scroll

  items.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'floating-item';
    el.setAttribute('data-index', index); // Add data-index for potential future use

    // Random item width (within a defined range)
    const itemWidthVw = MIN_ITEM_WIDTH_VW + Math.random() * (MAX_ITEM_WIDTH_VW - MIN_ITEM_WIDTH_VW);
    el.style.width = `${itemWidthVw}vw`;
    // Height will auto-adjust based on content, but can add min-height if needed
    el.style.minHeight = '25vh'; // Example: ensure some minimum height

    // Positioning
    // Random left position within the total scrollable width
    const leftPos = Math.random() * (scrollableWidth - (itemWidthVw / 100 * window.innerWidth));
    el.style.left = `${leftPos}px`;

    // Random top position within the viewport height, with some padding
    const topPadding = 100; // pixels from top/bottom
    const topPos = topPadding + Math.random() * (window.innerHeight - el.offsetHeight - (topPadding * 2));
    el.style.top = `${topPos}px`;
    
    // Random rotation for organic feel
    const rotation = Math.random() * 10 - 5; // -5 to +5 degrees
    el.style.transform = `rotate(${rotation}deg)`;

    // Add content based on type
    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.text; // Use text as alt
      el.appendChild(img);
      const caption = document.createElement('p');
      caption.textContent = item.text;
      caption.className = 'caption'; // Add a class for styling
      el.appendChild(caption);
    } else if (item.type === 'video') {
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
      const p = document.createElement('p');
      p.textContent = item.content;
      el.appendChild(p);
    }

    scene.appendChild(el);
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
// POPUP FUNCTIONALITY (Context Panel) - Kept from previous
// ==========================================

// Initializer for popup
document.addEventListener('DOMContentLoaded', () => {
  const toggleInfoBtn = document.getElementById('toggle-info');
  const closePopupBtn = document.getElementById('close-popup');
  const popupOverlay = document.getElementById('popup-overlay');

  if (toggleInfoBtn) {
    toggleInfoBtn.onclick = () => {
      popupOverlay.classList.remove('hidden');
      setTimeout(() => popupOverlay.classList.add('show'), 10);
      document.body.style.overflow = 'hidden'; // Prevent main scroll
    };
  }

  if (closePopupBtn) {
    closePopupBtn.onclick = () => {
      popupOverlay.classList.remove('show');
      setTimeout(() => {
        popupOverlay.classList.add('hidden');
        document.body.style.overflow = ''; // Allow main scroll again
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

  // Initial creation of items
  createAndPositionItems();
});

console.log('🚀 Zine script (mobile-friendly) cargado.');