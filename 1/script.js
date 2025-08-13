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
    console.log('Items:', items); // Debug log
  } else {
    console.error('⛔ No ZINE_CONFIG found. Please define window.ZINE_CONFIG in your HTML file.');
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
  console.log('Creating items:', items); // Debug log

  items.forEach((item, index) => {
    console.log('Processing item:', item); // Debug log
    const el = document.createElement('div');
    
    // Add staggered animation delay for smoother appearance
    el.style.animationDelay = `${index * 0.2}s`;

    // Handle different item types
    if (item.type === 'zine-title') {
      // Handle zine title with separate container class - KEEP ORIGINAL STYLES
      el.className = 'zine-title-container';
      el.setAttribute('data-index', index);
      el.style.animationDelay = `${index * 0.1}s`;
      //el.style.marginTop = '0px';
      
      const titleEl = document.createElement('h1');
      titleEl.className = 'zine-title';
      titleEl.textContent = item.title;
      el.appendChild(titleEl);
      
      const dateEl = document.createElement('p');
      dateEl.className = 'zine-date';
      dateEl.textContent = item.date;
      el.appendChild(dateEl);
      
    } else if (item.type === 'section') {
      // Handle sections with multiple items
      el.className = 'section-container';
      el.setAttribute('data-index', index);
      
      // Add section title if provided
      if (item.title) {
        const sectionTitleEl = document.createElement('h2');
        sectionTitleEl.className = 'section-title';
        sectionTitleEl.textContent = item.title;
        el.appendChild(sectionTitleEl);
      }
      
      // Create items wrapper for organic layout
      const itemsWrapper = document.createElement('div');
      itemsWrapper.className = 'section-items';
      
      // Process each item in the section
      if (item.items && item.items.length > 0) {
        item.items.forEach((subItem, subIndex) => {
          console.log('Processing sub-item:', subItem); // Debug log
          const itemEl = document.createElement('div');
          itemEl.className = 'section-item';
          itemEl.setAttribute('data-item', subIndex);
          
          if (subItem.type === 'image') {
            itemEl.classList.add('item-image');
            
            const img = document.createElement('img');
            img.src = subItem.src;
            img.alt = subItem.caption || '';
            img.loading = 'lazy';
            itemEl.appendChild(img);
            
            if (subItem.caption) {
              const caption = document.createElement('p');
              caption.textContent = subItem.caption;
              caption.className = 'item-caption';
              itemEl.appendChild(caption);
            }
            
          } else if (subItem.type === 'video') {
            itemEl.classList.add('item-video');
            
            // Create custom video controls
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'video-controls';
            
            const playPauseBtn = document.createElement('button');
            playPauseBtn.className = 'video-control-btn play-pause';
            playPauseBtn.title = 'Play/Pause';
            
            const muteBtn = document.createElement('button');
            muteBtn.className = 'video-control-btn mute-btn active';
            muteBtn.title = 'Mute/Unmute';
            
            controlsContainer.appendChild(playPauseBtn);
            controlsContainer.appendChild(muteBtn);
            itemEl.appendChild(controlsContainer);
            
            const video = document.createElement('video');
            video.src = subItem.src;
            video.controls = false;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            itemEl.appendChild(video);
            
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
            
            if (subItem.caption) {
              const caption = document.createElement('p');
              caption.textContent = subItem.caption;
              caption.className = 'item-caption';
              itemEl.appendChild(caption);
            }
            
          } else if (subItem.type === 'quote') {
            itemEl.classList.add('item-quote');
            
            const quoteText = document.createElement('p');
            quoteText.className = 'quote-text';
            quoteText.textContent = subItem.content;
            itemEl.appendChild(quoteText);
            
            if (subItem.author) {
              const authorCaption = document.createElement('p');
              authorCaption.className = 'quote-author';
              authorCaption.textContent = subItem.author;
              itemEl.appendChild(authorCaption);
            }
            
          } else if (subItem.type === 'text') {
            itemEl.classList.add('item-text');
            
            const textEl = document.createElement('p');
            textEl.textContent = subItem.content;
            itemEl.appendChild(textEl);
          }
          
          itemsWrapper.appendChild(itemEl);
        });
      }
      
      el.appendChild(itemsWrapper);
      
    } else {
      // Fallback for unknown types - use original floating-item approach
      console.log('Fallback for item:', item);
      el.className = 'floating-item';
      el.setAttribute('data-index', index);
      
      const p = document.createElement('p');
      p.textContent = `Unknown item type: ${item.type}`;
      el.appendChild(p);
    }

    scene.appendChild(el);
  });

  // Add spacer at the end for better scrolling experience
  const spacer = document.createElement('div');
  spacer.style.width = '100px';
  spacer.style.flexShrink = '0';
  spacer.style.height = '1px';
  scene.appendChild(spacer);

  console.log(`✅ Gallery items created: ${items.length} items with sectioned content!`);
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