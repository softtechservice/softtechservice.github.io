const demo = document.querySelector('[data-demo]');

if (demo) {
  demo.hidden = false;
  demo.addEventListener('toggle', () => {
    if (!demo.open) return;
    const setup = {
      bubble: setupBubbles,
      chess: setupChess,
      speed: setupSpeed,
      keyboard: setupKeyboard,
      fluid: setupFluid,
    };
    for (const [name, initialize] of Object.entries(setup)) {
      const preview = demo.querySelector(`[data-${name}]`);
      if (preview) initialize(preview);
    }
  }, { once: true });
}

function setPressed(buttons, active) {
  buttons.forEach((button) => button.setAttribute('aria-pressed', String(button === active)));
}

function setupSpeed(display) {
  const buttons = demo.querySelectorAll('[data-speed-mode]');
  buttons.forEach((button) => button.addEventListener('click', () => {
    display.dataset.mode = button.dataset.speedMode;
    setPressed(buttons, button);
  }));
}

function setupChess(board) {
  const pieces = { 4: '♚', 36: '♘', 35: '♟', 60: '♔' };
  const destinations = new Set([19, 21, 26, 30, 42, 46, 51, 53]);
  for (let i = 0; i < 64; i++) {
    const square = document.createElement('span');
    square.textContent = pieces[i] || '';
    square.classList.toggle('dark-square', (i + Math.floor(i / 8)) % 2 !== 0);
    square.classList.toggle('knight-move', destinations.has(i));
    board.append(square);
  }
  const toggle = demo.querySelector('[data-knight]');
  toggle.addEventListener('click', () => {
    const showing = board.classList.toggle('show-moves');
    toggle.setAttribute('aria-pressed', String(showing));
  });
}

function setupKeyboard(keyboard) {
  const colour = demo.querySelector('[data-key-colour]');
  const switchType = demo.querySelector('[data-switch]');
  let audioContext;

  colour.addEventListener('change', () => keyboard.style.setProperty('--key-color', colour.value));
  keyboard.addEventListener('click', async (event) => {
    if (!event.target.closest('button') || !window.AudioContext) return;
    audioContext ??= new AudioContext();
    try {
      await audioContext.resume();
    } catch {
      return;
    }

    const profiles = { Linear: ['sine', 150, .09], Tactile: ['triangle', 220, .1], Clicky: ['square', 430, .045] };
    const [wave, frequency, duration] = profiles[switchType.value];
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    const start = audioContext.currentTime;
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(frequency / 2, start + duration);
    volume.gain.setValueAtTime(.09, start);
    volume.gain.exponentialRampToValueAtTime(.001, start + duration);
    oscillator.connect(volume).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
  });
}

function pointOnCanvas(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return [
    (event.clientX - rect.left) * canvas.width / rect.width,
    (event.clientY - rect.top) * canvas.height / rect.height,
  ];
}

function setupFluid(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const size = demo.querySelector('[data-fluid-size]');
  const glow = demo.querySelector('[data-fluid-glow]');
  let hue = 280;

  function swirl(x, y) {
    const radius = Number(size.value);
    const color = hue % 360;
    hue += 9;
    ctx.fillStyle = '#1d163312';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `hsla(${color}, 95%, 73%, ${glow.value / 100})`);
    gradient.addColorStop(.48, `hsla(${(color + 55) % 360}, 92%, 60%, .4)`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function paintSwirl() {
    for (let i = 0; i < 28; i++) {
      const angle = i / 4;
      swirl(canvas.width / 2 + Math.cos(angle) * i * 5, canvas.height / 2 + Math.sin(angle) * i * 3);
    }
  }
  canvas.addEventListener('pointerdown', (event) => swirl(...pointOnCanvas(canvas, event)));
  canvas.addEventListener('pointermove', (event) => {
    if (event.buttons & 1) swirl(...pointOnCanvas(canvas, event));
  });
  demo.querySelector('[data-fluid-draw]').addEventListener('click', paintSwirl);
  paintSwirl();
}

function setupBubbles(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const colors = ['#ff8293', '#80aeff', '#a5ed9e', '#ffc372'];
  const status = demo.querySelector('[data-bubble-status]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const radius = 14;
  const launcher = { x: canvas.width / 2, y: canvas.height - 25 };
  let bubbles;
  let shot;
  let aim = canvas.width / 2;
  let frame;

  function drawBubble(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff85';
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.setLineDash([4, 7]);
    ctx.strokeStyle = '#ffffff85';
    ctx.moveTo(launcher.x, launcher.y);
    ctx.lineTo(aim, 0);
    ctx.stroke();
    ctx.setLineDash([]);
    bubbles.forEach((bubble) => drawBubble(bubble.x, bubble.y, bubble.color));
    if (shot) drawBubble(shot.x, shot.y, shot.color);
    drawBubble(launcher.x, launcher.y, launcher.color);
  }

  function reset() {
    cancelAnimationFrame(frame);
    shot = null;
    bubbles = Array.from({ length: 28 }, (_, i) => ({
      x: 26 + i % 7 * 42 + Math.floor(i / 7) % 2 * 12,
      y: 25 + Math.floor(i / 7) * 30,
      color: colors[(Math.floor(i / 7) + Math.floor(i % 7 / 2)) % colors.length],
    }));
    launcher.color = bubbles[0].color;
    status.textContent = 'Board ready.';
    draw();
  }

  function step() {
    shot.x += shot.vx;
    shot.y -= 9;
    if (shot.x < radius || shot.x > canvas.width - radius) shot.vx *= -1;
    const hit = bubbles.find((bubble) => Math.hypot(bubble.x - shot.x, bubble.y - shot.y) <= radius * 2);
    if (!hit && shot.y > 0) return;
    if (hit?.color === shot.color) {
      bubbles = bubbles.filter((bubble) => bubble !== hit);
      status.textContent = bubbles.length ? `Match. ${bubbles.length} bubbles left.` : 'Board cleared.';
    } else {
      status.textContent = 'Miss. Aim for the same colour.';
    }
    shot = null;
  }

  function animate() {
    step();
    draw();
    if (shot) frame = requestAnimationFrame(animate);
  }

  function shoot() {
    if (shot || bubbles.length === 0) return;
    shot = { ...launcher, vx: (aim - launcher.x) * 9 / launcher.y };
    const options = [...new Set(bubbles.map((bubble) => bubble.color))];
    launcher.color = options[Math.floor(Math.random() * options.length)];
    if (reducedMotion.matches) {
      while (shot) step();
      draw();
    } else {
      frame = requestAnimationFrame(animate);
    }
  }

  function aimAt(event) {
    const [x, y] = pointOnCanvas(canvas, event);
    const projected = launcher.x + (x - launcher.x) * launcher.y / Math.max(80, launcher.y - y);
    aim = Math.max(8, Math.min(canvas.width - 8, projected));
    draw();
  }
  canvas.addEventListener('pointermove', aimAt);
  canvas.addEventListener('click', (event) => { aimAt(event); shoot(); });
  canvas.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      shoot();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      aim = Math.max(8, Math.min(canvas.width - 8, aim + (event.key === 'ArrowLeft' ? -12 : 12)));
      draw();
    }
  });
  demo.querySelector('[data-reset-bubbles]').addEventListener('click', reset);
  reset();
}
