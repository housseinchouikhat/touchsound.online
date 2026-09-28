// Home: two doors. The podcast door draws a noisy waveform that cleans up while it is
// hovered or focused; the AI door's silent film frame "gets its sound" the same way.
// On touch screens (no hover) both play on their own. Clicking a door widens it to the
// full screen before the next page opens.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noHover = window.matchMedia('(hover: none)').matches;
  const split = document.getElementById('gate');
  const podcast = document.querySelector('.door-podcast');
  const ai = document.querySelector('.door-ai');

  /* ---------- AI door: bars of the film frame ---------- */
  const bars = document.querySelector('.film-bars');
  if (bars) {
    for (let i = 0; i < 44; i++) {
      const bar = document.createElement('span');
      const u = i / 43;
      const shape = 0.35 + 0.65 * Math.abs(Math.sin(u * 7.3 + 0.6)) * (0.55 + 0.45 * Math.sin(u * 2.1 + 1.2));
      bar.style.setProperty('--h', (18 + shape * 82).toFixed(1) + '%');
      bar.style.setProperty('--d', (-(i * 97) % 900) + 'ms');
      bars.appendChild(bar);
    }
  }

  /* ---------- Podcast door: noisy -> clean waveform ---------- */
  const canvas = document.querySelector('.door-wave');
  const ctx = canvas && canvas.getContext('2d');
  let clean = 0, target = 0, w = 0, h = 0, dpr = 1;

  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // hash noise, so the "dirty" signal flickers without Math.random every frame
  const noise = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const mix = (a, b, u) => a + (b - a) * u;

  function draw(time) {
    if (!ctx) return;
    clean += (target - clean) * 0.06;
    ctx.clearRect(0, 0, w, h);
    const gap = w < 600 ? 7 : 9, n = Math.floor(w / gap), mid = h * 0.28, amp = h * 0.14;
    const tick = Math.floor(time / 70);
    for (let i = 0; i < n; i++) {
      const u = i / n;
      // a voice-like envelope, travelling slowly
      const env = Math.pow(Math.abs(Math.sin(u * 9 - time / 1400) * Math.sin(u * 3.3 + time / 2300 + 1)), 0.8);
      const dirty = Math.min(1.25, 0.25 + 0.75 * noise(i, tick) * (0.4 + env) + (noise(i + 7, tick) > 0.93 ? 0.6 : 0));
      const tidy = 0.06 + 0.94 * env;
      const a = mix(dirty, tidy, clean) * amp;
      const lime = clean > 0.02 && env > 0.35;
      ctx.fillStyle = lime ? `rgba(217,255,47,${(0.25 + 0.75 * clean).toFixed(3)})` : `rgba(160,160,160,${mix(0.38, 0.22, clean).toFixed(3)})`;
      ctx.fillRect(i * gap, mid - a, gap * 0.45, a * 2);
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  if (canvas) {
    resize();
    window.addEventListener('resize', () => { resize(); if (reduce) draw(0); });
    if (reduce) { target = clean = 1; draw(0); } else requestAnimationFrame(draw);
  }

  const setHot = (door, on) => {
    door.classList.toggle('is-hot', on);
    if (door === podcast) target = on ? 1 : 0;
  };
  [podcast, ai].forEach((door) => {
    if (!door) return;
    door.addEventListener('mouseenter', () => setHot(door, true));
    door.addEventListener('mouseleave', () => setHot(door, false));
    door.addEventListener('focus', () => setHot(door, true));
    door.addEventListener('blur', () => setHot(door, false));
  });

  // Touch screens: both doors play by themselves, the podcast one breathing clean / noisy.
  if (noHover && !reduce) {
    ai && ai.classList.add('is-hot');
    let on = false;
    setInterval(() => { on = !on; target = on ? 1 : 0; podcast && podcast.classList.toggle('is-hot', on); }, 2200);
  }

  /* ---------- Opening a door ---------- */
  document.querySelectorAll('[data-door]').forEach((door) => {
    door.addEventListener('click', (e) => {
      if (reduce || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      split.classList.add('is-leaving');
      door.classList.add('is-chosen');
      setTimeout(() => { window.location.href = door.getAttribute('href'); }, 520);
    });
  });
  // Coming back with the browser's back button: reset the doors.
  window.addEventListener('pageshow', () => {
    split && split.classList.remove('is-leaving');
    document.querySelectorAll('.is-chosen').forEach((d) => d.classList.remove('is-chosen'));
  });
})();
