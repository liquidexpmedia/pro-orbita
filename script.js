// Sample floating items
const scene = document.getElementById('scene');
const globalOverlay = document.getElementById('global-overlay'); // Obtener la referencia al overlay global

const items = [
  { type: 'image', src: './assets/Issue1_g.png', text: '"Good Things Come To Those Who Wait" - Yinka Illori at Picadilly Circus London, 2024' },
  { type: 'image', src: './assets/Issue1_j.png', text: 'Descripción de la Imagen J' },
  { type: 'text', content: '“Collaborating with diverse thinkers to work toward a greater understanding of the dynamics of race, gender, and class is essential for those of us who want to move beyond one-dimensional ways of thinking, being, and living.” - Teaching Critical Thinking: Practical Wisdom bell hooks, 2009' }
];

items.forEach((item, i) => {
  const el = document.createElement('div');

  // Establecer posición inicial aleatoria
  el.style.top = `${Math.random() * (60 - 10) + 10}%`;
  el.style.left = `${Math.random() * (60 - 10) + 10}%`;

  if (item.type === 'image') {
    el.className = 'floating-item';

    const img = document.createElement('img');
    img.src = item.src;
    img.style.width = '200px'; // Initial size for the floating state
    el.appendChild(img);

    const textDiv = document.createElement('div');
    textDiv.className = 'image-info';
    textDiv.textContent = item.text;
    el.appendChild(textDiv);

    // Añadir eventos de mouseenter y mouseleave a cada floating-item
    el.addEventListener('mouseenter', () => {
      globalOverlay.style.opacity = '1'; // Mostrar el overlay global
      globalOverlay.style.zIndex = '9'; // Asegurar que el overlay esté por debajo del item activo

      // Mover el item al centro y escalarlo
      el.classList.add('is-hovered'); // Añadir una clase para activar los estilos de hover
      document.body.style.overflow = 'hidden'; // Evitar el scroll del body
    });

    el.addEventListener('mouseleave', () => {
      globalOverlay.style.opacity = '0'; // Ocultar el overlay global
      globalOverlay.style.zIndex = '-1'; // Ponerlo detrás de todo cuando no está activo

      // Quitar la clase de hover para que vuelva a su posición original
      el.classList.remove('is-hovered');
      document.body.style.overflow = ''; // Habilitar el scroll del body
    });

  } else if (item.type === 'text') {
    el.className = 'item';
    const p = document.createElement('p');
    p.textContent = item.content;
    p.style.maxWidth = '500px'; // Initial max-width
    el.appendChild(p);
  }

  scene.appendChild(el);
});

document.getElementById('toggle-info').onclick = () => {
  document.getElementById('info-panel').classList.toggle('hidden');
};