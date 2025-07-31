// Sample floating items
const scene = document.getElementById('scene');
const globalOverlay = document.getElementById('global-overlay');

const items = [
  { type: 'image', src: './assets/IMG_3264.jpg', text: '"Tracing the line book' },
  { type: 'image', src: './assets/17431766839_66141c241a_b.jpg', text: '"Infinite Accumulation" - Yayoi Kusama at Liverpool Street Station London, 2024' },
  { type: 'text', content: '"Collaborating with diverse thinkers to work toward a greater understanding of the dynamics of race, gender, and class is essential for those of us who want to move beyond one-dimensional ways of thinking, being, and living." - Teaching Critical Thinking: Practical Wisdom bell hooks, 2009' },
  { type: 'image', src: './assets/Issue1_c.png', text: '"The Encyclopedia of \nInvisibility and Six Thousand Years" \n- Tavares Strachan' },
  { type: 'video', src: './assets/IMG_1158.webm', text: 'Video de muestra del proyecto de arte interactivo' },
  { type: 'text', content: '"For me, one of the things about artistic practice is that it\'s not about providing some solution, but instead provoking curiosity about some things that you should find on your own and not be led to." - Tavares Strachan The Brooklyn Rail, 2022' }
];

let currentHoveredItem = null;
let occupiedRects = []; // Array para guardar rectángulos ocupados exactos

// Configuración de tamaños y márgenes más precisos
const ITEM_CONFIGS = {
  'image': { 
    baseWidth: 150, 
    baseHeight: 150, 
    hoverScale: 3.5,
    margin: 25 // Margen de seguridad alrededor del elemento
  },
  'video': { 
    baseWidth: 150, 
    baseHeight: 150, 
    hoverScale: 3.5,
    margin: 25
  },
  'text': { 
    baseWidth: 520, 
    baseHeight: 120, 
    hoverScale: 1,
    margin: 20
  }
};

// Crear elemento de información fijo en la esquina superior derecha
function createFixedInfoBox() {
  const infoBox = document.createElement('div');
  infoBox.id = 'fixed-info-box';
  infoBox.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 280px;
    max-height: 200px;
    background: rgba(243, 242, 239, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    padding: 16px;
    font-family: 'Rebond Grotesque';
    font-size: 12px;
    line-height: 1.4;
    color: #333;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    z-index: 500;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    pointer-events: none;
    overflow-y: auto;
    white-space: pre-line;
  `;
  document.body.appendChild(infoBox);
  return infoBox;
}

// Mostrar información en la caja fija
function showFixedInfo(text) {
  const infoBox = document.getElementById('fixed-info-box');
  if (infoBox) {
    infoBox.textContent = text;
    infoBox.style.opacity = '1';
    infoBox.style.transform = 'translateY(0)';
  }
}

// Ocultar información de la caja fija
function hideFixedInfo() {
  const infoBox = document.getElementById('fixed-info-box');
  if (infoBox) {
    infoBox.style.opacity = '0';
    infoBox.style.transform = 'translateY(-10px)';
  }
}

// Función para obtener las dimensiones exactas de un elemento
function getItemDimensions(itemType) {
  const config = ITEM_CONFIGS[itemType];
  return {
    width: config.baseWidth,
    height: config.baseHeight,
    expandedWidth: config.baseWidth * config.hoverScale,
    expandedHeight: config.baseHeight * config.hoverScale,
    margin: config.margin
  };
}

// Función para verificar si dos rectángulos se intersectan (incluso mínimamente)
function doRectsIntersect(rect1, rect2) {
  return !(rect1.right <= rect2.left || 
           rect2.right <= rect1.left || 
           rect1.bottom <= rect2.top || 
           rect2.bottom <= rect1.top);
}

// Función para verificar si una posición es completamente libre
function isPositionFree(newRect, minSeparation = 0) {
  for (let occupiedRect of occupiedRects) {
    // Expandir el rectángulo ocupado con la separación mínima
    const expandedOccupied = {
      left: occupiedRect.left - minSeparation,
      right: occupiedRect.right + minSeparation,
      top: occupiedRect.top - minSeparation,
      bottom: occupiedRect.bottom + minSeparation
    };
    
    if (doRectsIntersect(newRect, expandedOccupied)) {
      return false;
    }
  }
  return true;
}

// Función para obtener los límites seguros del viewport
function getSafeViewportBounds(expandedWidth, expandedHeight) {
  const margin = 40; // Margen del borde de la pantalla
  
  return {
    minX: margin + expandedWidth / 2,
    maxX: window.innerWidth - margin - expandedWidth / 2,
    minY: margin + expandedHeight / 2,
    maxY: window.innerHeight - margin - expandedHeight / 2
  };
}

// Sistema de cuadrícula adaptativa para distribución garantizada
function createAdaptiveGrid(itemCount) {
  // Esta función ahora solo se usa como referencia, 
  // la nueva función createOrganicGrid es más específica
  const aspectRatio = window.innerWidth / window.innerHeight;
  let cols = Math.ceil(Math.sqrt(itemCount * aspectRatio));
  let rows = Math.ceil(itemCount / cols);
  
  if (cols / rows > 2.5) {
    cols = Math.ceil(Math.sqrt(itemCount * 1.5));
    rows = Math.ceil(itemCount / cols);
  }
  
  return { cols, rows };
}

// Función para crear grid orgánica considerando tamaños de elementos
function createOrganicGrid(itemCount) {
  const aspectRatio = window.innerWidth / window.innerHeight;
  
  // Calcular grid base pero considerando que necesitamos más espacio
  let cols = Math.ceil(Math.sqrt(itemCount * aspectRatio * 0.8)); // Factor de reducción para más espacio
  let rows = Math.ceil(itemCount / cols);
  
  // Ajustar para evitar grids muy rectangulares
  if (cols / rows > 2.2) {
    cols = Math.ceil(Math.sqrt(itemCount * 1.1));
    rows = Math.ceil(itemCount / cols);
  }
  
  // Asegurar que tengamos suficientes celdas
  while (cols * rows < itemCount) {
    if (cols <= rows) {
      cols++;
    } else {
      rows++;
    }
  }
  
  return { cols, rows };
}

// Función mejorada para verificar colisiones considerando zoom
function checkCollisionWithZoom(newRect, itemType, occupiedPositions) {
  const dimensions = getItemDimensions(itemType);
  const expandedRect = {
    left: newRect.left - dimensions.expandedWidth / 4, // Margen para hover
    right: newRect.right + dimensions.expandedWidth / 4,
    top: newRect.top - dimensions.expandedHeight / 4,
    bottom: newRect.bottom + dimensions.expandedHeight / 4
  };
  
  for (let occupied of occupiedPositions) {
    if (doRectsIntersect(expandedRect, occupied)) {
      return true;
    }
  }
  return false;
}

// Función para obtener posición específica en la grid con anti-colisión mejorada
function getRandomGridPosition(itemIndex, itemType) {
  const dimensions = getItemDimensions(itemType);
  
  // Bounds más conservadores para elementos grandes
  const extraMargin = itemType === 'text' ? 60 : 40;
  const bounds = {
    minX: extraMargin + dimensions.expandedWidth / 2,
    maxX: window.innerWidth - extraMargin - dimensions.expandedWidth / 2,
    minY: extraMargin + dimensions.expandedHeight / 2,
    maxY: window.innerHeight - extraMargin - dimensions.expandedHeight / 2
  };
  
  // Verificar que tengamos espacio suficiente
  if (bounds.minX >= bounds.maxX || bounds.minY >= bounds.maxY) {
    console.warn('Viewport too small for grid positioning');
    const reducedBounds = {
      minX: 30 + dimensions.width / 2,
      maxX: window.innerWidth - 30 - dimensions.width / 2,
      minY: 30 + dimensions.height / 2,
      maxY: window.innerHeight - 30 - dimensions.height / 2
    };
    bounds.minX = reducedBounds.minX;
    bounds.maxX = reducedBounds.maxX;
    bounds.minY = reducedBounds.minY;
    bounds.maxY = reducedBounds.maxY;
  }
  
  const grid = createOrganicGrid(items.length);
  const cellWidth = (bounds.maxX - bounds.minX) / grid.cols;
  const cellHeight = (bounds.maxY - bounds.minY) / grid.rows;
  
  // Calcular posición de celda para este item
  const col = itemIndex % grid.cols;
  const row = Math.floor(itemIndex / grid.cols);
  
  // Centro de la celda
  const cellCenterX = bounds.minX + (col + 0.5) * cellWidth;
  const cellCenterY = bounds.minY + (row + 0.5) * cellHeight;
  
  // Ruido más conservador basado en el tamaño de celda y elemento
  const safeCellWidth = Math.max(cellWidth - dimensions.width, cellWidth * 0.3);
  const safeCellHeight = Math.max(cellHeight - dimensions.height, cellHeight * 0.3);
  
  const noiseIntensity = itemType === 'text' ? 0.15 : 0.25; // Reducido para evitar colisiones
  const maxVariationX = safeCellWidth * noiseIntensity;
  const maxVariationY = safeCellHeight * noiseIntensity;
  
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    // Generar variación aleatoria
    const variationX = (Math.random() - 0.5) * 2 * maxVariationX;
    const variationY = (Math.random() - 0.5) * 2 * maxVariationY;
    
    const finalX = Math.max(bounds.minX, Math.min(bounds.maxX, cellCenterX + variationX));
    const finalY = Math.max(bounds.minY, Math.min(bounds.maxY, cellCenterY + variationY));
    
    // Crear rectángulo de prueba
    const testRect = {
      left: finalX - dimensions.width / 2,
      right: finalX + dimensions.width / 2,
      top: finalY - dimensions.height / 2,
      bottom: finalY + dimensions.height / 2
    };
    
    // Verificar colisiones
    if (!checkCollisionWithZoom(testRect, itemType, occupiedRects)) {
      // Posición válida encontrada
      occupiedRects.push(testRect);
      
      return {
        left: (finalX / window.innerWidth) * 100,
        top: (finalY / window.innerHeight) * 100
      };
    }
    
    attempts++;
    
    // Si no encontramos posición, reducir el ruido
    if (attempts > 10) {
      const reducedVariationX = variationX * 0.5;
      const reducedVariationY = variationY * 0.5;
      
      const reducedX = Math.max(bounds.minX, Math.min(bounds.maxX, cellCenterX + reducedVariationX));
      const reducedY = Math.max(bounds.minY, Math.min(bounds.maxY, cellCenterY + reducedVariationY));
      
      const reducedRect = {
        left: reducedX - dimensions.width / 2,
        right: reducedX + dimensions.width / 2,
        top: reducedY - dimensions.height / 2,
        bottom: reducedY + dimensions.height / 2
      };
      
      if (!checkCollisionWithZoom(reducedRect, itemType, occupiedRects)) {
        occupiedRects.push(reducedRect);
        
        return {
          left: (reducedX / window.innerWidth) * 100,
          top: (reducedY / window.innerHeight) * 100
        };
      }
    }
  }
  
  // Fallback: usar centro de celda sin ruido
  console.warn('Using fallback center position for item:', itemType);
  const fallbackRect = {
    left: cellCenterX - dimensions.width / 2,
    right: cellCenterX + dimensions.width / 2,
    top: cellCenterY - dimensions.height / 2,
    bottom: cellCenterY + dimensions.height / 2
  };
  
  occupiedRects.push(fallbackRect);
  
  return {
    left: (cellCenterX / window.innerWidth) * 100,
    top: (cellCenterY / window.innerHeight) * 100
  };
}

// Mezclar items para distribución aleatoria
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Función principal para crear y posicionar elementos
function createAndPositionItems() {
  // Limpiar elementos existentes
  const existingElements = scene.querySelectorAll('.floating-item, .item');
  existingElements.forEach(el => el.remove());
  
  // Resetear posiciones ocupadas
  occupiedRects = [];
  
  // Crear caja de información fija si no existe
  if (!document.getElementById('fixed-info-box')) {
    createFixedInfoBox();
  }
  
  // Mezclar items aleatoriamente para que aparezcan en celdas diferentes cada vez
  const shuffledItems = shuffleArray(items);
  
  shuffledItems.forEach((item, i) => {
    const el = document.createElement('div');
    
    // Usar posición de grid orgánica con ruido aleatorio
    const position = getRandomGridPosition(i, item.type);
    el.style.top = `${position.top}%`;
    el.style.left = `${position.left}%`;

    if (item.type === 'image' || item.type === 'video') {
      el.className = 'floating-item';

      let mediaElement;
      if (item.type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = item.src;
      } else {
        mediaElement = document.createElement('video');
        mediaElement.src = item.src;
        mediaElement.loop = true;
        mediaElement.muted = true;
        mediaElement.preload = 'auto';
        mediaElement.playsInline = true;
        mediaElement.style.width = '150px';
        mediaElement.style.height = 'auto';
      }
      
      el.appendChild(mediaElement);

      // Hover events
      el.addEventListener('mouseenter', () => {
        if (currentHoveredItem && currentHoveredItem !== el) {
          currentHoveredItem.classList.remove('is-hovered');
          const prevVideo = currentHoveredItem.querySelector('video');
          if (prevVideo) {
            prevVideo.pause();
          }
        }
        
        currentHoveredItem = el;
        globalOverlay.style.opacity = '0.6';
        globalOverlay.style.zIndex = '9';
        el.classList.add('is-hovered');
        document.body.style.overflow = 'hidden';
        
        // Mostrar información en la caja fija
        showFixedInfo(item.text);
        
        if (item.type === 'video') {
          mediaElement.play().catch(error => {
            console.error("Autoplay failed:", error);
          });
        }
      });

      el.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (currentHoveredItem === el) {
            globalOverlay.style.opacity = '0';
            globalOverlay.style.zIndex = '-1';
            el.classList.remove('is-hovered');
            currentHoveredItem = null;
            document.body.style.overflow = 'hidden';
            
            // Ocultar información de la caja fija
            hideFixedInfo();
            
            if (item.type === 'video') {
              mediaElement.pause();
            }
          }
        }, 100);
      });

    } else if (item.type === 'text') {
      el.className = 'item';
      const p = document.createElement('p');
      p.textContent = item.content;
      p.style.maxWidth = '500px';
      el.appendChild(p);
    }

    scene.appendChild(el);
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  createAndPositionItems();
});

// Si el DOM ya está listo, ejecutar inmediatamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createAndPositionItems);
} else {
  createAndPositionItems();
}

// Funcionalidad del popup
document.getElementById('toggle-info').onclick = () => {
  const overlay = document.getElementById('popup-overlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('show'), 10);
  document.body.style.overflow = 'hidden';
};

document.getElementById('close-popup').onclick = () => {
  const overlay = document.getElementById('popup-overlay');
  overlay.classList.remove('show');
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.body.style.overflow = 'hidden';
  }, 300);
};

document.getElementById('popup-overlay').onclick = (e) => {
  if (e.target === document.getElementById('popup-overlay')) {
    document.getElementById('close-popup').click();
  }
};

// Manejo inteligente de redimensionamiento de ventana
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    createAndPositionItems();
  }, 300);
});