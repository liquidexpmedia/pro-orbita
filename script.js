
// Sample floating items
const scene = document.getElementById('scene');
const items = [
  { type: 'image', src: 'assets/img1.jpg' },
  { type: 'image', src: 'assets/img2.jpg' },
  { type: 'text', content: 'La práctica de trazar a mano libera una temporalidad distinta...' }
];

items.forEach((item, i) => {
  const el = document.createElement('div');
  el.className = 'floating-item';
  el.style.top = `${Math.random() * 80 + 10}%`;
  el.style.left = `${Math.random() * 80 + 10}%`;

  if (item.type === 'image') {
    const img = document.createElement('img');
    img.src = item.src;
    img.style.width = '150px';
    el.appendChild(img);
  } else if (item.type === 'text') {
    const p = document.createElement('p');
    p.textContent = item.content;
    p.style.maxWidth = '200px';
    el.appendChild(p);
  }

  scene.appendChild(el);
});

document.getElementById('toggle-info').onclick = () => {
  document.getElementById('info-panel').classList.toggle('hidden');
};
