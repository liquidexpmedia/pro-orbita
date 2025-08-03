// ==========================================
// ÓRBITA #1 - ZINE VIVO (Diseño Móvil - Scroll Horizontal V2)
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

// Configuration for placement
const MIN_ITEM_WIDTH_VW = 30; // Minimum width of an item as a percentage of viewport width
const MAX_ITEM_WIDTH_VW = 50; // Maximum width of an item as a percentage of viewport width
const HORIZONTAL_SPREAD_FACTOR = 3; // How much wider the scrollable area is than the viewport (increased for more space)
const ITEM_SPACING = 30; // Minimum spacing between items in pixels
const MAX_PLACEMENT_ATTEMPTS_PER_ITEM = 500; // Max attempts to place a single item without overlap

// Global variable to store occupied rectangles for collision detection
let occupiedRects = [];

// Helper function to check for overlap between two rectangles
function isOverlapping(rect1, rect2) {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function createAndPositionItems() {
  scene.innerHTML = ''; // Clear existing items
  occupiedRects = []; // Reset occupied rectangles for new placement

  // Define the total width of the scrollable content area
  const scrollableWidth = window.innerWidth * HORIZONTAL_SPREAD_FACTOR;
  scene.style.width = `${scrollableWidth}px`; // Set scene width for horizontal scroll

  items.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'floating-item';
    el.setAttribute('data-index', index);
    el.style.visibility = 'hidden'; // Hide initially for dimension calculation

    // Set a temporary width for dimension calculation (based on viewport, as CSS uses vw)
    const itemWidthVw = MIN_ITEM_WIDTH_VW + Math.random() * (MAX_ITEM_WIDTH_VW - MIN_ITEM_WIDTH_VW);
    el.style.width = `${itemWidthVw}vw`;
    el.style.minHeight = '25vh'; // Ensure some minimum height
    el.style.whiteSpace = 'normal'; // Allow text to wrap within text boxes

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

    scene.appendChild(el); // Append to DOM to get offsetWidth/Height

    let placed = false;
    for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS_PER_ITEM; attempt++) {
        // Get actual rendered dimensions of the element
        const itemWidth = el.offsetWidth;
        const itemHeight = el.offsetHeight;

        // Calculate random left position within the total scrollable width
        const leftPos = ITEM_SPACING + Math.random() * (scrollableWidth - itemWidth - (ITEM_SPACING * 2));
        
        // Calculate random top position within the viewport height, considering padding
        const topPadding = 50; // pixels from top/bottom
        const maxTop = window.innerHeight - itemHeight - (topPadding * 2);
        // Ensure topPos stays within valid bounds
        const topPos = topPadding + Math.random() * Math.max(0, maxTop - topPadding); 

        const potentialRect = {
            left: leftPos,
            top: topPos,
            right: leftPos + itemWidth,
            bottom: topPos + itemHeight
        };

        let overlap = false;
        for (const rect of occupiedRects) {
            if (isOverlapping(potentialRect, rect)) {
                overlap = true;
                break;
            }
        }

        if (!overlap) {
            el.style.left = `${leftPos}px`;
            el.style.top = `${topPos}px`;
            el.style.visibility = 'visible'; // Make visible once placed successfully
            occupiedRects.push(potentialRect);
            placed = true;
            break;
        }
    }

    if (!placed) {
        console.warn(`Could not place item ${index} without overlap after ${MAX_PLACEMENT_ATTEMPTS_PER_ITEM} attempts.`);
        // Fallback: place it but it might overlap or be off-screen if no space found
        el.style.left = `${ITEM_SPACING + Math.random() * (scrollableWidth - el.offsetWidth - (ITEM_SPACING * 2))}px`;
        el.style.top = `${ITEM_SPACING + Math.random() * (window.innerHeight - el.offsetHeight - (ITEM_SPACING * 2))}px`;
        el.style.visibility = 'visible';
    }

    // Apply rotation conditionally: no rotation for images
    if (item.type === 'image') {
        el.style.transform = 'none'; // No rotation for images, simulating a gallery wall
    } else {
        const rotation = Math.random() * 8 - 4; // -4 to +4 degrees for other items
        el.style.transform = `rotate(${rotation}deg)`;
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
      document.body.style.overflow = 'hidden'; // Prevent main scroll when popup is open
    };
  }

  if (closePopupBtn) {
    closePopupBtn.onclick = () => {
      popupOverlay.classList.remove('show');
      setTimeout(() => {
        popupOverlay.classList.add('hidden');
        document.body.style.overflow = 'hidden'; // Keep main scroll blocked if it was (handled by body CSS)
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

console.log('🚀 Zine script (mobile-friendly V2) cargado.');