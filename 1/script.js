// ==========================================
// ÓRBITA - ZINE VIVO (Gallery Wall Design - Horizontal Scroll)
// Generic script that loads content from window.ZINE_CONFIG
// ==========================================

const scene = document.getElementById('scene');
const globalOverlay = document.getElementById('global-overlay');

// Load items from configuration (defined in HTML file)
let items = [];
let zineConfig = {};

// Function to load configuration
function loadZineConfiguration() {
  if (window.ZINE_CONFIG) {
    zineConfig = window.ZINE_CONFIG;
    items = zineConfig.items || [];
    
    // Update page title if specified
    if (zineConfig.title) {
      document.title = zineConfig.title;
    }
    
    // Update any zine-specific settings
    if (zineConfig.settings) {
      // Apply any global settings here if needed in the future
    }
    
    console.log(`📚 Loaded zine: "${zineConfig.title || 'Untitled'}" with ${items.length} items`);
  } else {
    console.error('❌ No ZINE_CONFIG found. Please define window.ZINE_CONFIG in your HTML file.');
    // Fallback - show error message
    showConfigurationError();
  }
}

// Show error if no configuration is found
function showConfigurationError() {
  scene.innerHTML = `
    <div class="floating-item error-item" style="margin-top: ${window.innerHeight / 2 - 100}px;">
      <h2 style="color: #ff9800; margin-bottom: 20px;">Configuration Missing</h2>
      <p style="color: #f3f2f0; text-align: center; max-width: 400px;">
        Please define <code>window.ZINE_CONFIG</code> with your zine content in the HTML file.
      </p>
    </div>
  `;
}

// Create gallery items with organic positioning
function createAndPositionItems() {
  if (items.length === 0) {
    showConfigurationError();
    return;
  }

  scene.innerHTML = ''; // Clear existing items

  // Define margins from screen edges with better mobile support
  const isMobile = window.innerWidth <= 768;
  const topMargin = isMobile ? 60 : 80; // px from top
  const bottomMargin = isMobile ? 60 : 80; // px from bottom
  const centerY = window.innerHeight / 2; // Center point
  const maxVerticalOffset = isMobile ? 40 : (window.innerHeight - topMargin - bottomMargin) / 6; // Smaller range for better centering

  // Process items and group title+text combinations
  const processedItems = [];
  let i = 0;
  
  while (i < items.length) {
    const currentItem = items[i];
    
    // Check if current item is a title and next item is text
    if (currentItem.type === 'title' && i + 1 < items.length && items[i + 1].type === 'text') {
      // Combine title and text into a single item
      processedItems.push({
        type: 'title-text-block',
        title: currentItem.content,
        text: items[i + 1].content
      });
      i += 2; // Skip both items since we combined them
    } else {
      // Keep item as is
      processedItems.push(currentItem);
      i += 1;
    }
  }

  processedItems.forEach((item, index) => {
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
      const titleY = centerY - (isMobile ? 120 : 150);
      el.style.marginTop = `${titleY}px`;
      
      const titleEl = document.createElement('h1');
      titleEl.className = 'zine-title';
      titleEl.textContent = item.title;
      el.appendChild(titleEl);
      
      const dateEl = document.createElement('p');
      dateEl.className = 'zine-date';
      dateEl.textContent = item.date;
      el.appendChild(dateEl);
      
    } else if (item.type === 'title-text-block') {
      // Combined title and text block
      el.classList.add('title-text-block');
      // Center vertically with small random offset for organic feel
      const blockOffset = (Math.random() - 0.5) * (isMobile ? 40 : 60);
      const blockY = centerY - 120 + blockOffset;
      el.style.marginTop = `${blockY}px`;
      
      // Apply horizontal variation for organic layout
      const horizontalVariation = (Math.random() - 0.5) * (isMobile ? 60 : 100);
      el.style.marginLeft = `${horizontalVariation}px`;
      
      // Create title element
      const titleEl = document.createElement('h2');
      titleEl.className = 'block-title';
      titleEl.textContent = item.title;
      el.appendChild(titleEl);
      
      // Create text element
      const textEl = document.createElement('p');
      textEl.className = 'block-text';
      textEl.textContent = item.text;
      el.appendChild(textEl);
      
    } else if (item.type === 'image') {
      el.classList.add('image-item');
      // Better vertical positioning for images with captions
      const imageMargin = isMobile ? 80 : 120; // Space for top/bottom margins
      const minY = imageMargin;
      const maxY = window.innerHeight - imageMargin;
      const randomRange = (maxY - minY) * 0.3; // 30% of available space for randomness
      const centerRange = (maxY + minY) / 2;
      const verticalOffset = (Math.random() - 0.5) * randomRange;
      el.style.marginTop = `${centerRange - 200 + verticalOffset}px`; // -200 to account for image height
      
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.text || item.caption || '';
      img.loading = 'lazy'; // Improve performance
      
      // Handle image load to ensure proper scaling
      img.onload = function() {
        // Ensure images fit within the available space
        const availableHeight = window.innerHeight - (imageMargin * 2) - 80; // 80px for caption space
        if (this.naturalHeight > availableHeight) {
          this.style.maxHeight = `${availableHeight}px`;
        }
      };
      
      el.appendChild(img);
      
      if (item.text || item.caption) {
        const caption = document.createElement('p');
        caption.textContent = item.text || item.caption;
        caption.className = 'caption';
        el.appendChild(caption);
      }
      
    } else if (item.type === 'video') {
      el.classList.add('video-item');
      // Better vertical positioning for videos with controls and captions
      const videoMargin = isMobile ? 80 : 120; // Space for top/bottom margins
      const minY = videoMargin;
      const maxY = window.innerHeight - videoMargin;
      const randomRange = (maxY - minY) * 0.3; // 30% of available space for randomness
      const centerRange = (maxY + minY) / 2;
      const verticalOffset = (Math.random() - 0.5) * randomRange;
      el.style.marginTop = `${centerRange - 250 + verticalOffset}px`; // -250 to account for video height + controls
      
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
        // Ensure videos fit within the available space
        const availableHeight = window.innerHeight - (videoMargin * 2) - 120; // 120px for controls + caption space
        if (this.videoHeight > availableHeight) {
          this.style.maxHeight = `${availableHeight}px`;
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
      
      if (item.text || item.caption) {
        const caption = document.createElement('p');
        caption.textContent = item.text || item.caption;
        caption.className = 'caption';
        el.appendChild(caption);
      }
      
    } else if (item.type === 'quote') {
      el.classList.add('quote-item');
      // Center around middle with small random offset
      const verticalOffset = (Math.random() - 0.5) * maxVerticalOffset;
      el.style.marginTop = `${centerY - 100 + verticalOffset}px`;
      
      const p = document.createElement('p');
      p.textContent = item.content;
      el.appendChild(p);
      
    } else if (item.type === 'text') {
      // Standalone text (not following a title)
      el.classList.add('text-item');
      const verticalOffset = (Math.random() - 0.5) * maxVerticalOffset;
      el.style.marginTop = `${centerY - 100 + verticalOffset}px`;
      
      const p = document.createElement('p');
      p.textContent = item.content;
      el.appendChild(p);
      
    } else if (item.type === 'title') {
      // Standalone title (not followed by text)
      el.classList.add('title-item');
      const titleOffset = (Math.random() - 0.5) * (isMobile ? 40 : 60);
      const titleY = centerY - 80 + titleOffset;
      el.style.marginTop = `${titleY}px`;
      
      const horizontalVariation = (Math.random() - 0.5) * (isMobile ? 60 : 100);
      el.style.marginLeft = `${horizontalVariation}px`;
      
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

  console.log(`✅ Gallery items created: ${processedItems.length} items (${items.length} original) with title-text grouping!`);
}

// Add scroll progress indicator
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

// Add keyboard navigation
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

// Initialize popup with configuration-based content
function initializePopup() {
  const toggleInfoBtn = document.getElementById('toggle-info');
  const closePopupBtn = document.getElementById('close-popup');
  const popupOverlay = document.getElementById('popup-overlay');

  if (toggleInfoBtn) {
    toggleInfoBtn.onclick = () => {
      popupOverlay.classList.remove('hidden');
      setTimeout(() => popupOverlay.classList.add('show'), 10);
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

  // Update popup content if specified in configuration
  if (zineConfig.popupContent) {
    const popupContentEl = document.querySelector('.popup-content');
    if (popupContentEl && zineConfig.popupContent.html) {
      popupContentEl.innerHTML = zineConfig.popupContent.html;
    }
    
    // Update popup title if specified
    const popupTitleEl = document.querySelector('.popup-header h2');
    if (popupTitleEl && zineConfig.popupContent.title) {
      popupTitleEl.textContent = zineConfig.popupContent.title;
    }
  }
}

// Main initializer
document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const zineContainer = document.getElementById('zine-container');
  
  // Load configuration first
  loadZineConfiguration();
  
  // Simulate loading time then show content
  setTimeout(() => {
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (zineContainer) zineContainer.style.display = 'block';
    
    // Create gallery items after loading
    createAndPositionItems();
    
    // Initialize popup functionality
    initializePopup();
    
    // Add enhanced features
    addScrollIndicator();
    addKeyboardNavigation();
    
    console.log('🎨 Generic zine system loaded successfully!');
  }, 1500);
});

console.log('📚 Generic Zine Script Loaded - Waiting for ZINE_CONFIG...');