// Sample floating items
const scene = document.getElementById('scene');
const items = [
  { type: 'image', src: './assets/Issue1_g.png' },
  { type: 'image', src: './assets/Issue1_j.png' },
  { type: 'text', content: '“Collaborating with diverse thinkers to work toward a greater understanding of the dynamics of race, gender, and class is essential for those of us who want to move beyond one-dimensional ways of thinking, being, and living.” - Teaching Critical Thinking: Practical Wisdom bell hooks, 2009' }
];

items.forEach((item, i) => {
  const el = document.createElement('div');
  

  el.style.top = `${Math.random() * (60 - 10) + 10}%`;
  el.style.left = `${Math.random() * (60 - 10) + 10}%`;

  if (item.type === 'image') {
    el.className = 'floating-item';

    const img = document.createElement('img');
    img.src = item.src;
    img.style.width = '300px'; // Initial size
    el.appendChild(img);
  } else if (item.type === 'text') {

    el.className = 'item';
    const p = document.createElement('p');
    p.textContent = item.content;
    p.style.maxWidth = '500px'; // Initial max-width
    el.appendChild(p);
  }

  // No JavaScript event listeners for hover zoom needed here, CSS handles it!

  scene.appendChild(el);
});


/*function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}*/

document.getElementById('toggle-info').onclick = () => {
  document.getElementById('info-panel').classList.toggle('hidden');
};