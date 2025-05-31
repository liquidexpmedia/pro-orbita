// Sample floating items
const scene = document.getElementById('scene');
const globalOverlay = document.getElementById('global-overlay');

const items = [
  { type: 'image', src: './assets/Issue1_g.png', text: '"Good Things Come To Those Who Wait" - Yinka Illori at Picadilly Circus London, 2024' },
  { type: 'image', src: './assets/Issue1_j.png', text: 'Descripción de la Imagen J' },
  { type: 'text', content: '"Collaborating with diverse thinkers to work toward a greater understanding of the dynamics of race, gender, and class is essential for those of us who want to move beyond one-dimensional ways of thinking, being, and living." - Teaching Critical Thinking: Practical Wisdom bell hooks, 2009' }
];

let currentHoveredItem = null; // Variable para trackear el item actualmente en hover

items.forEach((item, i) => {
  const el = document.createElement('div');

  // Establecer posición inicial aleatoria
  el.style.top = `${Math.random() * (60 - 10) + 10}%`;
  el.style.left = `${Math.random() * (60 - 10) + 10}%`;

  if (item.type === 'image') {
    el.className = 'floating-item';

    const img = document.createElement('img');
    img.src = item.src;
    img.style.width = '200px';
    el.appendChild(img);

    const textDiv = document.createElement('div');
    textDiv.className = 'image-info';
    textDiv.textContent = item.text;
    el.appendChild(textDiv);

    // Solo añadir mouseenter, NO mouseleave
    el.addEventListener('mouseenter', () => {
      // Si ya hay otro item en hover, quitarle el hover primero
      if (currentHoveredItem && currentHoveredItem !== el) {
        currentHoveredItem.classList.remove('is-hovered');
      }
      
      currentHoveredItem = el;
      
      globalOverlay.style.opacity = '1';
      globalOverlay.style.zIndex = '9';
      globalOverlay.style.pointerEvents = 'auto'; // Hacer el overlay clickeable

      el.classList.add('is-hovered');
      document.body.style.overflow = 'hidden';
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

// Manejar el mouseleave en el overlay global
globalOverlay.addEventListener('mouseleave', () => {
  if (currentHoveredItem) {
    globalOverlay.style.opacity = '0';
    globalOverlay.style.zIndex = '-1';
    globalOverlay.style.pointerEvents = 'none';

    currentHoveredItem.classList.remove('is-hovered');
    currentHoveredItem = null;
    document.body.style.overflow = '';
  }
});

// También permitir cerrar haciendo click en el overlay
globalOverlay.addEventListener('click', () => {
  if (currentHoveredItem) {
    globalOverlay.style.opacity = '0';
    globalOverlay.style.zIndex = '-1';
    globalOverlay.style.pointerEvents = 'none';

    currentHoveredItem.classList.remove('is-hovered');
    currentHoveredItem = null;
    document.body.style.overflow = '';
  }
});

document.getElementById('toggle-info').onclick = () => {
  document.getElementById('info-panel').classList.toggle('hidden');
};