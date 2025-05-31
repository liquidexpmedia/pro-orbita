// Sample floating items
const scene = document.getElementById('scene');
const globalOverlay = document.getElementById('global-overlay');

const items = [
  { type: 'image', src: './assets/Issue1_g.png', text: '"Good Things Come To Those Who Wait" - Yinka Illori at Picadilly Circus London, 2024' },
  { type: 'image', src: './assets/Issue1_j.png', text: 'Descripción de la Imagen J' },
  { type: 'text', content: '"Collaborating with diverse thinkers to work toward a greater understanding of the dynamics of race, gender, and class is essential for those of us who want to move beyond one-dimensional ways of thinking, being, and living." - Teaching Critical Thinking: Practical Wisdom bell hooks, 2009' },
  { type: 'image', src: './assets/Issue1_g.png', text: 'Otra imagen del mural' },
  { type: 'image', src: './assets/Issue1_j.png', text: 'Una más para explorar' },
  { type: 'video', src: './assets/IMG_1158.webm', text: 'Video de muestra del proyecto de arte interactivo' } // Nuevo elemento de video
];

let currentHoveredItem = null;
let occupiedPositions = []; // Array para guardar las posiciones ocupadas

// Función para verificar si dos rectángulos se superponen más del 80%
function getOverlapPercentage(rect1, rect2) {
  const left = Math.max(rect1.left, rect2.left);
  const right = Math.min(rect1.right, rect2.right);
  const top = Math.max(rect1.top, rect2.top);
  const bottom = Math.min(rect1.bottom, rect2.bottom);
  
  if (left < right && top < bottom) {
    const overlapArea = (right - left) * (bottom - top);
    const rect1Area = (rect1.right - rect1.left) * (rect1.bottom - rect1.top);
    const rect2Area = (rect2.right - rect2.left) * (rect2.bottom - rect2.top);
    const minArea = Math.min(rect1Area, rect2Area);
    
    return (overlapArea / minArea) * 100;
  }
  return 0;
}

// Función para verificar si una posición es válida (no se superpone más del 80%)
function isPositionValid(newRect, maxOverlap = 15) {
  for (let occupiedRect of occupiedPositions) {
    if (getOverlapPercentage(newRect, occupiedRect) > maxOverlap) {
      return false;
    }
  }
  return true;
}

// Función para calcular posición segura que no se salga de pantalla al hacer zoom
function getSafePosition(scale = 3.5, itemSize = 200) {
  const margin = 30; // Margen más grande para la escala mayor
  const expandedSize = itemSize * scale;
  
  // Calcular el rango seguro para que el item expandido no se salga
  const minPercent = ((expandedSize / 2) + margin) / window.innerWidth * 100;
  const maxPercent = 100 - ((expandedSize / 2) + margin) / window.innerWidth * 100;
  
  const minPercentHeight = ((expandedSize / 2) + margin) / window.innerHeight * 100;
  const maxPercentHeight = 100 - ((expandedSize / 2) + margin) / window.innerHeight * 100;
  
  let attempts = 0;
  const maxAttempts = 50000; // Máximo número de intentos para encontrar una posición válida
  
  while (attempts < maxAttempts) {
    const leftPercent = Math.random() * (maxPercent - minPercent) + minPercent;
    const topPercent = Math.random() * (maxPercentHeight - minPercentHeight) + minPercentHeight;
    
    // Convertir porcentajes a píxeles para verificar superposición
    const leftPx = (leftPercent / 100) * window.innerWidth;
    const topPx = (topPercent / 100) * window.innerHeight;
    
    const newRect = {
      left: leftPx - itemSize / 2,
      right: leftPx + itemSize / 2,
      top: topPx - itemSize / 2,
      bottom: topPx + itemSize / 2
    };
    
    // Verificar si esta posición es válida
    if (isPositionValid(newRect)) {
      // Guardar la posición como ocupada
      occupiedPositions.push(newRect);
      
      return {
        left: leftPercent,
        top: topPercent
      };
    }
    
    attempts++;
  }
  
  // Si no se encuentra una posición válida después de muchos intentos,
  // usar una posición aleatoria de respaldo
  const fallbackLeft = Math.random() * (maxPercent - minPercent) + minPercent;
  const fallbackTop = Math.random() * (maxPercentHeight - minPercentHeight) + minPercentHeight;
  
  // Guardar también la posición de respaldo
  const fallbackLeftPx = (fallbackLeft / 100) * window.innerWidth;
  const fallbackTopPx = (fallbackTop / 100) * window.innerHeight;
  
  occupiedPositions.push({
    left: fallbackLeftPx - itemSize / 2,
    right: fallbackLeftPx + itemSize / 2,
    top: fallbackTopPx - itemSize / 2,
    bottom: fallbackTopPx + itemSize / 2
  });
  
  return {
    left: fallbackLeft,
    top: fallbackTop
  };
}

// Función para posicionar el texto de descripción de manera que siempre sea visible
function positionTextInfo(floatingItem, textElement) {
  const itemRect = floatingItem.getBoundingClientRect();
  const textRect = textElement.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Calcular la posición del elemento escalado
  const scaledWidth = itemRect.width;
  const scaledHeight = itemRect.height;
  const centerX = itemRect.left + itemRect.width / 2;
  const centerY = itemRect.top + itemRect.height / 2;
  
  // Posición inicial: debajo del elemento
  let topPosition = scaledHeight / 2 + 15; // Menos espacio para texto más discreto
  let leftPosition = 0; // Centrado por defecto con transform: translateX(-50%)
  
  // Verificar si el texto se saldría por la parte inferior
  if (centerY + topPosition + textRect.height > windowHeight - 15) {
    // Mover el texto arriba del elemento
    topPosition = -(scaledHeight / 2 + textRect.height + 15);
  }
  
  // Verificar si el texto se saldría por los lados
  const textLeftEdge = centerX - textRect.width / 2;
  const textRightEdge = centerX + textRect.width / 2;
  
  if (textLeftEdge < 15) {
    // El texto se sale por la izquierda, ajustar hacia la derecha
    leftPosition = 15 - textLeftEdge;
  } else if (textRightEdge > windowWidth - 15) {
    // El texto se sale por la derecha, ajustar hacia la izquierda
    leftPosition = (windowWidth - 15) - textRightEdge;
  }
  
  // Aplicar las posiciones calculadas
  textElement.style.top = `${topPosition}px`;
  textElement.style.left = `${leftPosition}px`;
}

items.forEach((item, i) => {
  const el = document.createElement('div');
  const itemSize = item.type === 'image' || item.type === 'video' ? 200 : 150; // Diferentes tamaños para imagen/video y texto

  // Establecer posición inicial segura sin superposición excesiva
  const position = getSafePosition(3.5, itemSize);
  el.style.top = `${position.top}%`;
  el.style.left = `${position.left}%`;

  if (item.type === 'image' || item.type === 'video') {
    el.className = 'floating-item';

    let mediaElement;
    if (item.type === 'image') {
      mediaElement = document.createElement('img');
      mediaElement.src = item.src;
    } else { // item.type === 'video'
      mediaElement = document.createElement('video');
      mediaElement.src = item.src;
      mediaElement.loop = true; // Loop the video
      mediaElement.muted = true; // Mute by default for autoplay
      mediaElement.preload = 'auto'; // Preload video for smoother playback
      mediaElement.playsInline = true; // Important for iOS autoplay
      mediaElement.style.width = '150px'; // Initial size for video
      mediaElement.style.height = 'auto';
    }
    
    el.appendChild(mediaElement);

    const textDiv = document.createElement('div');
    textDiv.className = 'image-info';
    textDiv.textContent = item.text;
    el.appendChild(textDiv);

    // Hover para hacer zoom in-place
    el.addEventListener('mouseenter', () => {
      // Si hay otro item activo, quitarle el hover
      if (currentHoveredItem && currentHoveredItem !== el) {
        currentHoveredItem.classList.remove('is-hovered');
        // If the previously hovered item was a video, pause it
        const prevVideo = currentHoveredItem.querySelector('video');
        if (prevVideo) {
          prevVideo.pause();
        }
      }
      
      currentHoveredItem = el;
      
      // Mostrar overlay sutil
      globalOverlay.style.opacity = '0.6';
      globalOverlay.style.zIndex = '9';

      el.classList.add('is-hovered');
      document.body.style.overflow = 'hidden';
      
      // Play video on hover
      if (item.type === 'video') {
        mediaElement.play().catch(error => {
          console.error("Autoplay failed:", error);
          // Fallback if autoplay is blocked: show play button or message
        });
      }
      
      // Posicionar el texto después de que la transición de escala haya comenzado
      setTimeout(() => {
        positionTextInfo(el, textDiv);
      }, 50);
    });

    // Salir del hover individual
    el.addEventListener('mouseleave', () => {
      // Pequeño delay para evitar flickering
      setTimeout(() => {
        if (currentHoveredItem === el) {
          globalOverlay.style.opacity = '0';
          globalOverlay.style.zIndex = '-1';
          
          el.classList.remove('is-hovered');
          currentHoveredItem = null;
          document.body.style.overflow = 'hidden';
          
          // Pause video on mouse leave
          if (item.type === 'video') {
            mediaElement.pause();
          }
          
          // Resetear la posición del texto
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
    
    // La posición ya se estableció arriba con getSafePosition
  }

  scene.appendChild(el);
});

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
    document.body.style.overflow = 'hidden'; // Mantener overflow hidden para el mural
  }, 300);
};

// Cerrar popup al hacer click en el overlay
document.getElementById('popup-overlay').onclick = (e) => {
  if (e.target === document.getElementById('popup-overlay')) {
    document.getElementById('close-popup').click();
  }
};