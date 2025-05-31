// Sample floating items
const scene = document.getElementById('scene');
const globalOverlay = document.getElementById('global-overlay');

const items = [
  { type: 'image', src: './assets/Issue1_g.png', text: '"Good Things Come To Those Who Wait" - Yinka Illori at Picadilly Circus London, 2024' },
  { type: 'image', src: './assets/Issue1_j.png', text: '"Infinite Accumulation" - Yayoi Kusama at Liverpool Street Station London, 2024' },
  { type: 'text', content: '"Collaborating with diverse thinkers to work toward a greater understanding of the dynamics of race, gender, and class is essential for those of us who want to move beyond one-dimensional ways of thinking, being, and living." - Teaching Critical Thinking: Practical Wisdom bell hooks, 2009' },
  { type: 'image', src: './assets/Issue1_c.png', text: '"The Encyclopedia of Invisibility and Six Thousand Years" - Tavares Strachan' },
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
  const aspectRatio = window.innerWidth / window.innerHeight;
  let cols = Math.ceil(Math.sqrt(itemCount * aspectRatio));
  let rows = Math.ceil(itemCount / cols);
  
  // Ajustar si la cuadrícula es muy desproporcionada
  if (cols / rows > 2.5) {
    cols = Math.ceil(Math.sqrt(itemCount * 1.5));
    rows = Math.ceil(itemCount / cols);
  }
  
  return { cols, rows };
}

// Función principal para encontrar posición segura
function findSafePosition(itemType) {
  const dimensions = getItemDimensions(itemType);
  const bounds = getSafeViewportBounds(dimensions.expandedWidth, dimensions.expandedHeight);
  
  // Verificar que tengamos espacio suficiente
  if (bounds.minX >= bounds.maxX || bounds.minY >= bounds.maxY) {
    console.warn('Viewport too small for safe positioning');
    // Usar dimensiones reducidas como fallback
    const reducedBounds = getSafeViewportBounds(dimensions.width, dimensions.height);
    bounds.minX = reducedBounds.minX;
    bounds.maxX = reducedBounds.maxX;
    bounds.minY = reducedBounds.minY;
    bounds.maxY = reducedBounds.maxY;
  }
  
  const minSeparation = dimensions.margin;
  
  // Fase 1: Intento de posicionamiento aleatorio inteligente
  const maxRandomAttempts = 200;
  
  for (let attempt = 0; attempt < maxRandomAttempts; attempt++) {
    const centerX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    const centerY = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
    
    const rect = {
      left: centerX - dimensions.width / 2,
      right: centerX + dimensions.width / 2,
      top: centerY - dimensions.height / 2,
      bottom: centerY + dimensions.height / 2
    };
    
    if (isPositionFree(rect, minSeparation)) {
      // Guardar la posición ocupada
      occupiedRects.push(rect);
      
      return {
        left: (centerX / window.innerWidth) * 100,
        top: (centerY / window.innerHeight) * 100
      };
    }
  }
  
  // Fase 2: Sistema de cuadrícula garantizada
  const grid = createAdaptiveGrid(items.length);
  const cellWidth = (bounds.maxX - bounds.minX) / grid.cols;
  const cellHeight = (bounds.maxY - bounds.minY) / grid.rows;
  
  // Encontrar la primera celda libre
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const cellCenterX = bounds.minX + (col + 0.5) * cellWidth;
      const cellCenterY = bounds.minY + (row + 0.5) * cellHeight;
      
      // Añadir variación aleatoria dentro de la celda (máximo 30% del tamaño de celda)
      const maxVariationX = cellWidth * 0.3;
      const maxVariationY = cellHeight * 0.3;
      const variationX = (Math.random() - 0.5) * maxVariationX;
      const variationY = (Math.random() - 0.5) * maxVariationY;
      
      const finalX = Math.max(bounds.minX, Math.min(bounds.maxX, cellCenterX + variationX));
      const finalY = Math.max(bounds.minY, Math.min(bounds.maxY, cellCenterY + variationY));
      
      const rect = {
        left: finalX - dimensions.width / 2,
        right: finalX + dimensions.width / 2,
        top: finalY - dimensions.height / 2,
        bottom: finalY + dimensions.height / 2
      };
      
      if (isPositionFree(rect, minSeparation * 0.5)) { // Margen ligeramente reducido para cuadrícula
        occupiedRects.push(rect);
        
        return {
          left: (finalX / window.innerWidth) * 100,
          top: (finalY / window.innerHeight) * 100
        };
      }
    }
  }
  
  // Fase 3: Posicionamiento de emergencia (debería rara vez llegar aquí)
  console.warn('Using emergency positioning for item:', itemType);
  const emergencyIndex = occupiedRects.length;
  const spiralRadius = 150;
  const angle = emergencyIndex * 2.4; // Ángulo en radianes para distribución espiral
  
  const spiralX = window.innerWidth / 2 + Math.cos(angle) * (spiralRadius + emergencyIndex * 20);
  const spiralY = window.innerHeight / 2 + Math.sin(angle) * (spiralRadius + emergencyIndex * 20);
  
  const emergencyRect = {
    left: spiralX - dimensions.width / 2,
    right: spiralX + dimensions.width / 2,
    top: spiralY - dimensions.height / 2,
    bottom: spiralY + dimensions.height / 2
  };
  
  occupiedRects.push(emergencyRect);
  
  return {
    left: (spiralX / window.innerWidth) * 100,
    top: (spiralY / window.innerHeight) * 100
  };
}

// Función para posicionar el texto de descripción de manera que siempre sea visible
function positionTextInfo(floatingItem, textElement) {
  const itemRect = floatingItem.getBoundingClientRect();
  const textRect = textElement.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  const scaledWidth = itemRect.width;
  const scaledHeight = itemRect.height;
  const centerX = itemRect.left + itemRect.width / 2;
  const centerY = itemRect.top + itemRect.height / 2;
  
  let topPosition = scaledHeight / 2 + 15;
  let leftPosition = 0;
  
  // Verificar si el texto se saldría por la parte inferior
  if (centerY + topPosition + textRect.height > windowHeight - 15) {
    topPosition = -(scaledHeight / 2 + textRect.height + 15);
  }
  
  // Verificar si el texto se saldría por los lados
  const textLeftEdge = centerX - textRect.width / 2;
  const textRightEdge = centerX + textRect.width / 2;
  
  if (textLeftEdge < 15) {
    leftPosition = 15 - textLeftEdge;
  } else if (textRightEdge > windowWidth - 15) {
    leftPosition = (windowWidth - 15) - textRightEdge;
  }
  
  textElement.style.top = `${topPosition}px`;
  textElement.style.left = `${leftPosition}px`;
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
  
  // Mezclar items para variedad
  const shuffledItems = shuffleArray(items);
  
  shuffledItems.forEach((item, i) => {
    const el = document.createElement('div');
    
    // Establecer posición segura garantizada
    const position = findSafePosition(item.type);
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

      const textDiv = document.createElement('div');
      textDiv.className = 'image-info';
      textDiv.textContent = item.text;
      el.appendChild(textDiv);

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
        
        if (item.type === 'video') {
          mediaElement.play().catch(error => {
            console.error("Autoplay failed:", error);
          });
        }
        
        setTimeout(() => {
          positionTextInfo(el, textDiv);
        }, 50);
      });

      el.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (currentHoveredItem === el) {
            globalOverlay.style.opacity = '0';
            globalOverlay.style.zIndex = '-1';
            el.classList.remove('is-hovered');
            currentHoveredItem = null;
            document.body.style.overflow = 'hidden';
            
            if (item.type === 'video') {
              mediaElement.pause();
            }
            
            textDiv.style.top = '';
            textDiv.style.left = '';
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