const matrix = document.querySelector('#matrix');
const cells = [];

for (let index = 0; index < 182; index += 1) {
  const cell = document.createElement('i');
  cell.className = 'cell';
  if (Math.random() > 0.84) cell.classList.add('low');
  matrix.appendChild(cell);
  cells.push(cell);
}

let cursor = 0;
setInterval(() => {
  const previous = cells[(cursor - 8 + cells.length) % cells.length];
  previous.className = Math.random() > 0.76 ? 'cell low' : 'cell';
  const active = cells[cursor];
  active.className = 'cell high';
  cursor = (cursor + 1) % cells.length;
}, 85);

function updateClock() {
  document.querySelector('#clock').textContent = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
}
updateClock();
setInterval(updateClock, 1000);

const globeContainer = document.querySelector('#globe');
if (window.THREE && globeContainer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 100);
  camera.position.z = 5.4;
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
  globeContainer.prepend(renderer.domElement);

  const globe = new THREE.Group();
  globe.add(new THREE.Mesh(new THREE.IcosahedronGeometry(2.1, 2), new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })));
  const pointGeometry = new THREE.BoxGeometry(.14, .14, .14);
  const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  for (let i = 0; i < 24; i += 1) {
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 2.18;
    point.position.set(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi));
    point.rotation.set(Math.random(), Math.random(), Math.random());
    globe.add(point);
  }
  scene.add(globe);
  let dragging = false;
  let pointer = { x: 0, y: 0 };
  globeContainer.addEventListener('pointerdown', event => { dragging = true; pointer = { x: event.clientX, y: event.clientY }; globeContainer.setPointerCapture(event.pointerId); });
  globeContainer.addEventListener('pointerup', () => { dragging = false; });
  globeContainer.addEventListener('pointermove', event => {
    if (!dragging) return;
    globe.rotation.y += (event.clientX - pointer.x) * .009;
    globe.rotation.x += (event.clientY - pointer.y) * .009;
    pointer = { x: event.clientX, y: event.clientY };
  });
  function render() { requestAnimationFrame(render); if (!dragging) globe.rotation.y += .004; renderer.render(scene, camera); }
  render();
  window.addEventListener('resize', () => { const { clientWidth: width, clientHeight: height } = globeContainer; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); });
}
