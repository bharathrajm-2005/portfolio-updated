/* ═══════════════════════════════════════════════════
   PORTFOLIO JS — Bharath Raj M
   Space Background · Terminal · Counters · Animations
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════
     DEEP SPACE STARFIELD — Canvas Animation
     ════════════════════════════════════════════ */
  const canvas = document.getElementById('space-canvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;

    const COLORS = [
      '#ffffff', '#ffffff', '#ffffff', '#ffffff',
      '#e8f0ff', '#e8f0ff', '#e8f0ff',
      '#d6e3ff', '#d6e3ff',
      '#f5f8ff', '#c8daff',
    ];

    const LAYERS = [
      { count: 800, speedX: 0.110, speedY: 0.038, sizeMin: 0.10, sizeMax: 0.45, twinklePct: 0.28, mouseStrength: 0.022 },
      { count: 550, speedX: 0.200, speedY: 0.068, sizeMin: 0.25, sizeMax: 0.75, twinklePct: 0.42, mouseStrength: 0.042 },
      { count: 250, speedX: 0.360, speedY: 0.120, sizeMin: 0.40, sizeMax: 1.40, twinklePct: 0.60, mouseStrength: 0.075 },
    ];

    let stars = [];
    const spaceMouse = { x: 0, y: 0 };
    const spaceTarget = { x: 0, y: 0 };

    window.addEventListener('mousemove', e => {
      spaceTarget.x = (e.clientX / window.innerWidth) - 0.5;
      spaceTarget.y = (e.clientY / window.innerHeight) - 0.5;
    });
    window.addEventListener('touchmove', e => {
      const t = e.touches[0];
      spaceTarget.x = (t.clientX / window.innerWidth) - 0.5;
      spaceTarget.y = (t.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    function rand(a, b) { return a + Math.random() * (b - a); }

    function makeStar(li) {
      const L = LAYERS[li];
      const sz = rand(L.sizeMin, L.sizeMax);
      const tw = Math.random() < L.twinklePct;
      return {
        x: Math.random() * W, y: Math.random() * H,
        size: sz, base: sz, layer: li,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        sx: L.speedX * (0.55 + Math.random() * 0.9),
        sy: L.speedY * (0.55 + Math.random() * 0.9),
        op: 0.20 + Math.random() * 0.70,
        twinkles: tw,
        ph: Math.random() * Math.PI * 2, ph2: Math.random() * Math.PI * 2,
        sp1: 0.004 + Math.random() * 0.038, sp2: 0.009 + Math.random() * 0.055,
        amp: tw ? 0.35 + Math.random() * 0.60 : 0,
      };
    }

    function buildPool() {
      stars = [];
      LAYERS.forEach((_, i) => { for (let n = 0; n < LAYERS[i].count; n++) stars.push(makeStar(i)); });
    }

    function moveStar(s) {
      s.x -= s.sx; s.y -= s.sy * 0.30;
      if (s.x < -1) s.x = W + 1;
      if (s.y < -1) s.y = H + 1;
    }

    function drawStar(s) {
      let op = s.op, sz = s.base;
      const ms = LAYERS[s.layer].mouseStrength;
      const rx = s.x + spaceMouse.x * ms * W;
      const ry = s.y + spaceMouse.y * ms * H;

      if (s.twinkles) {
        s.ph += s.sp1; s.ph2 += s.sp2;
        const t = Math.sin(s.ph) * 0.65 + Math.sin(s.ph2 * 1.9 + 0.8) * 0.35;
        op = Math.max(0.015, Math.min(1.0, s.op + t * s.amp * s.op));
        sz = Math.max(0.08, s.base * (0.80 + 0.38 * (t * 0.5 + 0.5)));
      }
      ctx.globalAlpha = op;
      if (sz > 0.80) {
        const gr = sz * 3.0;
        const g = ctx.createRadialGradient(rx, ry, 0, rx, ry, gr);
        g.addColorStop(0, `rgba(215,232,255,${op * 0.55})`);
        g.addColorStop(0.45, `rgba(200,220,255,${op * 0.13})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(rx, ry, gr, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(rx, ry, sz, 0, Math.PI * 2);
      ctx.fillStyle = s.color; ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawNebula() {
      [
        { x: W * 0.10, y: H * 0.18, r: W * 0.42, c: 'rgba(12,6,46,0.22)' },
        { x: W * 0.82, y: H * 0.72, r: W * 0.38, c: 'rgba(6,18,48,0.18)' },
        { x: W * 0.48, y: H * 0.04, r: W * 0.30, c: 'rgba(22,5,38,0.13)' },
        { x: W * 0.25, y: H * 0.88, r: W * 0.32, c: 'rgba(4,12,42,0.11)' },
      ].forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.c); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });
    }

    function renderSpace() {
      spaceMouse.x += (spaceTarget.x - spaceMouse.x) * 0.10;
      spaceMouse.y += (spaceTarget.y - spaceMouse.y) * 0.10;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, W, H);
      drawNebula();
      for (let i = 0; i < stars.length; i++) { moveStar(stars[i]); drawStar(stars[i]); }
      requestAnimationFrame(renderSpace);
    }

    function resizeSpace() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildPool();
    }

    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resizeSpace, 150); });
    resizeSpace();
    requestAnimationFrame(renderSpace);
  }

  /* ════════════════════════════════════════════
  /* ════════════════════════════════════════════
     PILL NAV 
     ════════════════════════════════════════════ */
  (function initPillNav() {
    if (typeof gsap === 'undefined') return;

    const navContainer = document.querySelector('.pill-nav-container');
    if (!navContainer) return;

    const sections = document.querySelectorAll('.section, .hero-section');
    const pills = document.querySelectorAll('.pill');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');
    const circleRefs = [];
    const tlRefs = [];
    const ease = 'power2.easeOut';

    const layout = () => {
      pills.forEach((pill, i) => {
        const circle = pill.querySelector('.hover-circle');
        circleRefs[i] = circle;
        const w = pill.getBoundingClientRect().width;
        const h = pill.getBoundingClientRect().height;
        if (h === 0) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        if (tlRefs[i]) tlRefs[i].kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }
        tlRefs[i] = tl;
      });
    };

    layout();
    window.addEventListener('resize', layout);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    pills.forEach((pill, i) => {
      let activeTween;
      pill.addEventListener('mouseenter', () => {
        if (!tlRefs[i]) return;
        if (activeTween) activeTween.kill();
        activeTween = tlRefs[i].tweenTo(tlRefs[i].duration(), { duration: 0.3, ease, overwrite: 'auto' });
      });
      pill.addEventListener('mouseleave', () => {
        if (!tlRefs[i]) return;
        if (activeTween) activeTween.kill();
        activeTween = tlRefs[i].tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
      });
    });

    const logo = document.getElementById('pill-logo-text');
    let logoTween;
    if (logo) {
      document.getElementById('pill-logo').addEventListener('mouseenter', () => {
        if (logoTween) logoTween.kill();
        gsap.set(logo, { rotate: 0 });
        logoTween = gsap.to(logo, { rotate: 360, duration: 0.3, ease, overwrite: 'auto' });
      });
    }

    const logoContainer = document.getElementById('pill-logo');
    const navItems = document.getElementById('pill-nav-items');
    if (logoContainer) {
      gsap.set(logoContainer, { scale: 0 });
      gsap.to(logoContainer, { scale: 1, duration: 0.6, ease });
    }
    if (navItems) {
      gsap.set(navItems, { width: 0, overflow: 'hidden' });
      gsap.to(navItems, { width: 'auto', duration: 0.6, ease });
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuPopover = document.getElementById('mobile-menu-popover');
    let isMobileMenuOpen = false;

    if (mobileMenuBtn && mobileMenuPopover) {
      gsap.set(mobileMenuPopover, { visibility: 'hidden', opacity: 0, scaleY: 1 });
      mobileMenuBtn.addEventListener('click', () => {
        isMobileMenuOpen = !isMobileMenuOpen;
        const lines = mobileMenuBtn.querySelectorAll('.hamburger-line');
        if (isMobileMenuOpen) {
          gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
          gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
          gsap.set(mobileMenuPopover, { visibility: 'visible' });
          gsap.fromTo(mobileMenuPopover,
            { opacity: 0, y: 10, scaleY: 1 },
            { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease, transformOrigin: 'top center' }
          );
        } else {
          gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
          gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
          gsap.to(mobileMenuPopover, {
            opacity: 0, y: 10, scaleY: 1, duration: 0.2, ease, transformOrigin: 'top center',
            onComplete: () => gsap.set(mobileMenuPopover, { visibility: 'hidden' })
          });
        }
      });
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => { if (isMobileMenuOpen) mobileMenuBtn.click(); });
      });
    }

    function updateActiveNav() {
      let current = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id'); });
      pills.forEach(link => {
        link.classList.remove('is-active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('is-active');
      });
      mobileLinks.forEach(link => {
        link.classList.remove('is-active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('is-active');
      });
    }

    window.addEventListener('scroll', updateActiveNav);
  })();

  /* ════════════════════════════════════════════
     BORDER GLOW (Social Buttons)
     ════════════════════════════════════════════ */
  (function initBorderGlow() {
    const cards = document.querySelectorAll('.border-glow-card');
    if (!cards.length) return;

    const GRAD_POS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
    const GRAD_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
    const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];
    const DEFAULT_COLORS = ['#c084fc', '#f472b6', '#38bdf8'];

    const buildGradientVars = (colors) => {
      const v = {};
      for (let i = 0; i < 7; i++) {
        const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
        v[GRAD_KEYS[i]] = `radial-gradient(at ${GRAD_POS[i]}, ${c} 0px, transparent 50%)`;
      }
      v['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
      return v;
    };

    const buildGlowVars = (hslStr) => {
      const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
      const { h, s, l } = match ? { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) } : { h: 40, s: 80, l: 80 };
      const base = `${h}deg ${s}% ${l}%`;
      return {
        '--glow-color': `hsl(${base} / 100%)`,
        '--glow-color-60': `hsl(${base} / 60%)`,
        '--glow-color-50': `hsl(${base} / 50%)`,
        '--glow-color-40': `hsl(${base} / 40%)`,
        '--glow-color-30': `hsl(${base} / 30%)`,
        '--glow-color-20': `hsl(${base} / 20%)`,
        '--glow-color-10': `hsl(${base} / 10%)`,
      };
    };

    const animate = ({ start = 0, end = 100, duration = 1000, delay = 0, ease = (x) => 1 - Math.pow(1 - x, 3), onUpdate, onEnd }) => {
      const t0 = performance.now() + delay;
      const tick = () => {
        const elapsed = performance.now() - t0;
        const t = Math.min(elapsed / duration, 1);
        if (elapsed >= 0) {
          onUpdate(start + (end - start) * ease(t));
          if (t < 1) requestAnimationFrame(tick);
          else if (onEnd) onEnd();
        } else {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    };

    const gVars = buildGradientVars(DEFAULT_COLORS);

    cards.forEach(card => {
      Object.entries(gVars).forEach(([k, v]) => card.style.setProperty(k, v));
      if (card.dataset.glowColor) {
        Object.entries(buildGlowVars(card.dataset.glowColor)).forEach(([k, v]) => card.style.setProperty(k, v));
      }

      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const cx = r.width / 2, cy = r.height / 2;
        const dx = x - cx, dy = y - cy;
        const kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
        const ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
        const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
        let deg = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;
        if (deg < 0) deg += 360;
        card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
        card.style.setProperty('--cursor-angle', `${deg.toFixed(3)}deg`);
      });

      const aS = 110, aE = 465;
      card.classList.add('sweep-active');
      card.style.setProperty('--cursor-angle', `${aS}deg`);

      animate({ duration: 500, onUpdate: v => card.style.setProperty('--edge-proximity', v) });
      animate({ duration: 1500, end: 50, onUpdate: v => card.style.setProperty('--cursor-angle', `${(aE - aS) * (v / 100) + aS}deg`) });
      animate({ delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => card.style.setProperty('--cursor-angle', `${(aE - aS) * (v / 100) + aS}deg`) });
      animate({ delay: 2500, duration: 1500, start: 100, end: 0,
        onUpdate: v => card.style.setProperty('--edge-proximity', v),
        onEnd: () => card.classList.remove('sweep-active'),
      });
    });
  })();

  /* ════════════════════════════════════════════
     ANIMATED COUNTERS
     ════════════════════════════════════════════ */
  const statCards = document.querySelectorAll('.stat-card');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    statCards.forEach(card => {
      const target = parseInt(card.dataset.target);
      const suffix = card.dataset.suffix || '';
      const numEl = card.querySelector('.stat-number');
      let count = 0;
      const step = target / (1500 / 16);
      function tick() {
        count += step;
        if (count >= target) { numEl.textContent = target + suffix; return; }
        numEl.textContent = Math.floor(count) + suffix;
        requestAnimationFrame(tick);
      }
      tick();
    });
  }

  /* ════════════════════════════════════════════
     SCROLL ANIMATIONS
     ════════════════════════════════════════════ */
  const animElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  animElements.forEach(el => observer.observe(el));

  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) animateCounters();
  }, { threshold: 0.4 });
  heroObserver.observe(document.getElementById('hero'));

  /* ════════════════════════════════════════════
     ADVANCED TERMINAL (MINI OS)
     ════════════════════════════════════════════ */
  (function initTerminal() {
    const openTerminalBtn = document.getElementById('open-terminal-btn');
    const terminalOverlay = document.getElementById('terminal-overlay');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');
    const terminalPrompt = document.querySelector('.terminal-prompt');
    const terminalInputLine = document.querySelector('.terminal-input-line');

    if (!terminalOutput || !terminalInput) return;

    let currentDir = '/home/bharath';
    let isAnimating = false;
    let skipAnimation = false;
    let commandHistory = [];
    let historyIndex = -1;
    let soundEnabled = true;

    let audioCtx = null;
    function playBeep(freq = 400, type = 'sine', duration = 0.05, vol = 0.05) {
      if (!soundEnabled) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) { }
    }

    const fileSystem = {
      '/': { type: 'dir', content: ['home'] },
      '/home': { type: 'dir', content: ['bharath'] },
      '/home/bharath': { type: 'dir', content: ['projects.txt', 'skills.txt', 'contact.txt', 'secret'] },
      '/home/bharath/secret': { type: 'dir', content: ['diary.txt'] },
      '/home/bharath/projects.txt': { type: 'file', content: 'Projects:\n- AccuCert (https://github.com/bharathrajm-2005/accucert)\n- Urban Waste Management (https://github.com/bharathrajm-2005/urban_waste_management)\n- Smart Crop Advisory (https://github.com/bharathrajm-2005/smart_crop_advisory_2)\n- Infosys Webcam Project (https://github.com/bharathrajm-2005/infosys_python_project)' },
      '/home/bharath/skills.txt': { type: 'file', content: 'Skills:\nJava, Python, C, Kotlin, HTML, CSS, MERN' },
      '/home/bharath/contact.txt': { type: 'file', content: 'Contact:\nmbharathrajcw@gmail.com\n+91 9043129158' },
      '/home/bharath/secret/diary.txt': { type: 'file', content: 'Dear diary, today I built an awesome terminal.' }
    };

    const registry = {
      help: { desc: 'Show this help menu', action: cmdHelp },
      clear: { desc: 'Clear the terminal', action: () => { terminalOutput.innerHTML = ''; return null; } },
      date: { desc: 'Show current date/time', action: () => [{ text: new Date().toString(), cls: 'terminal-text-cyan' }] },
      whoami: { desc: 'Display user identity', action: () => [{ text: 'bharath - The code ninja 🥷', cls: 'terminal-text-gold' }] },
      github: { desc: 'Open GitHub profile', action: () => { window.open('https://github.com/', '_blank'); return [{ text: 'Opening GitHub...', cls: 'terminal-text-green' }]; } },
      linkedin: { desc: 'Open LinkedIn profile', action: () => { window.open('https://linkedin.com/in/', '_blank'); return [{ text: 'Opening LinkedIn...', cls: 'terminal-text-green' }]; } },
      resume: { desc: 'Download resume', action: simulateDownload },
      about: { desc: 'About Bharath Raj M', action: cmdAbout },
      projects: { desc: 'View projects', action: cmdLoaderAction('projects', cmdProjects) },
      skills: { desc: 'View technical skills', action: cmdSkills },
      internships: { desc: 'View work experience', action: cmdInternships },
      education: { desc: 'View education details', action: cmdEducation },
      contact: { desc: 'Contact information', action: cmdContact },
      ls: { desc: 'List directory contents', action: cmdLs },
      cd: { desc: 'Change directory', action: cmdCd },
      pwd: { desc: 'Print working directory', action: () => [{ text: currentDir, cls: 'terminal-text-white' }] },
      cat: { desc: 'Print file contents', action: cmdCat },
      sudo: { desc: 'Execute a command as superuser', action: () => [{ text: 'bharath is not in the sudoers file. This incident will be reported.', cls: 'terminal-text-red' }] },
      hack: { desc: 'Hack the mainframe', action: cmdHack },
      ask: { desc: 'Ask the AI something', action: cmdAsk },
      sound: { desc: 'Toggle terminal sound', action: () => { soundEnabled = !soundEnabled; playBeep(600, 'square', 0.1); return [{ text: `Sound ${soundEnabled ? 'enabled' : 'disabled'}.`, cls: 'terminal-text-cyan' }]; } }
    };

    const aliases = { p: 'projects', c: 'contact', h: 'help', cls: 'clear' };
    const easterEggs = {
      love: '❤️ Thank you! I love coding too.',
      hello: 'Hello there, traveler of the web.',
      bharath: 'Yes, that is my name! How can I help you?',
      exit: 'You are trapped here forever... just kidding. Press Esc or the close button.'
    };
    const allCommands = Object.keys(registry).concat(Object.keys(aliases));

    function cmdHelp() {
      const out = [{ text: 'Available commands:', cls: 'terminal-text-gold' }];
      for (const [key, cmd] of Object.entries(registry)) {
        if (!['hack', 'ask', 'sound'].includes(key)) out.push({ text: `  ${key.padEnd(12, ' ')} ${cmd.desc}`, cls: 'terminal-text-white' });
      }
      out.push({ text: '', cls: '' });
      out.push({ text: 'Fun:', cls: 'terminal-text-gold' });
      out.push({ text: '  ask <q>      Ask the dev persona a question', cls: 'terminal-text-dim' });
      out.push({ text: '  hack         ???', cls: 'terminal-text-dim' });
      out.push({ text: '  sound        Toggle retro terminal sounds', cls: 'terminal-text-dim' });
      return out;
    }
    function cmdAbout() {
      return [
        { text: '╔══════════════════════════════════════╗', cls: 'terminal-text-gold' },
        { text: '║         BHARATH RAJ M                ║', cls: 'terminal-text-gold' },
        { text: '╚══════════════════════════════════════╝', cls: 'terminal-text-gold' },
        { text: '', cls: '' },
        { text: 'Pre-final-year B.E. Computer Science student', cls: 'terminal-text-white' },
        { text: 'at Panimalar Engineering College (CGPA: 8.7).', cls: 'terminal-text-white' },
        { text: '', cls: '' },
        { text: 'Specializing in Data Structures & Algorithms,', cls: 'terminal-text-cyan' },
        { text: 'Mobile App Development, and Full-Stack Web.', cls: 'terminal-text-cyan' },
        { text: '', cls: '' },
        { text: '📍 Chennai, Tamil Nadu | 🎓 Graduating 2027', cls: 'terminal-text-dim' },
      ];
    }
    function cmdProjects() {
      return [
        { text: '── PROJECTS ──────────────────────────', cls: 'terminal-text-gold' },
        { text: '', cls: '' },
        { text: '▸ AccuCert', cls: 'terminal-text-cyan' },
        { text: '  Kotlin mobile app for automated certificate generation.', cls: 'terminal-text-white' },
        { text: '  URL: github.com/bharathrajm-2005/accucert', cls: 'terminal-text-green' },
        { text: '  Tech: Kotlin, Android Studio', cls: 'terminal-text-dim' },
        { text: '', cls: '' },
        { text: '▸ Urban Waste Management System', cls: 'terminal-text-cyan' },
        { text: '  IoT-based monitoring for optimized waste collection.', cls: 'terminal-text-white' },
        { text: '  URL: github.com/bharathrajm-2005/urban_waste_management', cls: 'terminal-text-green' },
        { text: '  Tech: IoT, Python, Sensors, Cloud', cls: 'terminal-text-dim' },
        { text: '', cls: '' },
        { text: '▸ Smart Crop Advisory', cls: 'terminal-text-cyan' },
        { text: '  AI agricultural system for soil/env recommendations.', cls: 'terminal-text-white' },
        { text: '  URL: github.com/bharathrajm-2005/smart_crop_advisory_2', cls: 'terminal-text-green' },
        { text: '  Architecture: ML + Web App | Backend: Python (Flask)', cls: 'terminal-text-dim' },
        { text: '  Performance: Data-Driven | Core: Crop Prediction', cls: 'terminal-text-dim' },
        { text: '  Tech: Python, Machine Learning, Flask, OpenCV', cls: 'terminal-text-dim' },
        { text: '', cls: '' },
        { text: '▸ Infosys Webcam Project', cls: 'terminal-text-cyan' },
        { text: '  Real-time video processing and frame handling application.', cls: 'terminal-text-white' },
        { text: '  URL: github.com/bharathrajm-2005/infosys_python_project', cls: 'terminal-text-green' },
        { text: '  Architecture: Python App | Core Library: OpenCV', cls: 'terminal-text-dim' },
        { text: '  Processing: Real-Time | Interface: Flask Templates', cls: 'terminal-text-dim' },
        { text: '  Tech: Python, OpenCV, Flask, Computer Vision', cls: 'terminal-text-dim' },
      ];
    }
    function cmdSkills() {
      return [
        { text: '── SKILLS ────────────────────────────', cls: 'terminal-text-gold' },
        { text: '', cls: '' },
        { text: 'Languages    │ Java, Python, C, Kotlin', cls: 'terminal-text-white' },
        { text: 'Web          │ HTML, CSS, MERN Stack', cls: 'terminal-text-white' },
        { text: 'Databases    │ MySQL, MongoDB', cls: 'terminal-text-white' },
        { text: 'Tools        │ Git, VS Code, Android Studio', cls: 'terminal-text-white' },
        { text: 'OS           │ Windows', cls: 'terminal-text-white' },
      ];
    }
    function cmdInternships() {
      return [
        { text: '── EXPERIENCE ────────────────────────', cls: 'terminal-text-gold' },
        { text: '', cls: '' },
        { text: '▸ Codebind Technologies', cls: 'terminal-text-cyan' },
        { text: '  Role: Web Developer', cls: 'terminal-text-white' },
        { text: '  Duration: Mar 2024 – Apr 2024', cls: 'terminal-text-dim' },
        { text: '  Web application development, frontend.', cls: 'terminal-text-white' },
        { text: '', cls: '' },
        { text: '▸ Edunet Foundation', cls: 'terminal-text-cyan' },
        { text: '  Role: AI & Cloud Intern', cls: 'terminal-text-white' },
        { text: '  Duration: Jul 2025 – Aug 2025', cls: 'terminal-text-dim' },
        { text: '  AI fundamentals & cloud computing.', cls: 'terminal-text-white' },
      ];
    }
    function cmdEducation() {
      return [
        { text: '── EDUCATION ─────────────────────────', cls: 'terminal-text-gold' },
        { text: '', cls: '' },
        { text: '▸ B.E. Computer Science', cls: 'terminal-text-cyan' },
        { text: '  Panimalar Engineering College', cls: 'terminal-text-white' },
        { text: '  CGPA: 8.7/10 | Graduating: 2027', cls: 'terminal-text-dim' },
        { text: '', cls: '' },
        { text: '▸ Class XII – CBSE', cls: 'terminal-text-cyan' },
        { text: '  KRM Public School | 2023 | 81%', cls: 'terminal-text-dim' },
        { text: '', cls: '' },
        { text: '▸ Class X – CBSE', cls: 'terminal-text-cyan' },
        { text: '  KRM Public School | 2021 | 60.6%', cls: 'terminal-text-dim' },
      ];
    }
    function cmdContact() {
      return [
        { text: '── CONTACT ───────────────────────────', cls: 'terminal-text-gold' },
        { text: '', cls: '' },
        { text: '📧  mbharathrajcw@gmail.com', cls: 'terminal-text-white' },
        { text: '📱  +91 9043129158', cls: 'terminal-text-white' },
        { text: '📍  Chennai, Tamil Nadu, India', cls: 'terminal-text-white' },
        { text: '', cls: '' },
        { text: '🔗  LinkedIn  |  GitHub  |  LeetCode', cls: 'terminal-text-cyan' },
      ];
    }

    function resolvePath(path) {
      if (!path) return currentDir;
      if (path === '~') return '/home/bharath';
      if (path.startsWith('/')) return path.replace(/\/$/, '') || '/';
      let parts = currentDir === '/' ? [] : currentDir.split('/');
      for (let p of path.split('/')) {
        if (p === '' || p === '.') continue;
        if (p === '..') parts.pop();
        else parts.push(p);
      }
      return parts.length === 0 ? '/' : '/' + parts.filter(Boolean).join('/');
    }

    function cmdLs(args) {
      const path = resolvePath(args[0]);
      const node = fileSystem[path];
      if (!node || node.type !== 'dir') return [{ text: `ls: cannot access '${path}': No such file or directory`, cls: 'terminal-text-red' }];
      if (node.content.length === 0) return [];
      const output = node.content.map(name => `<span class="${fileSystem[(path==='/'?'':path)+'/'+name]?.type === 'dir' ? 'terminal-text-cyan' : 'terminal-text-white'}">${name}</span>`).join('  ');
      return [{ html: output, cls: '' }];
    }
    function cmdCd(args) {
      const path = resolvePath(args[0] || '~');
      const node = fileSystem[path];
      if (!node || node.type !== 'dir') return [{ text: `cd: ${args[0]}: No such file or directory`, cls: 'terminal-text-red' }];
      currentDir = path;
      updatePrompt();
      return null;
    }
    function cmdCat(args) {
      if (!args[0]) return [{ text: 'cat: missing file operand', cls: 'terminal-text-red' }];
      const node = fileSystem[resolvePath(args[0])];
      if (!node) return [{ text: `cat: ${args[0]}: No such file or directory`, cls: 'terminal-text-red' }];
      if (node.type === 'dir') return [{ text: `cat: ${args[0]}: Is a directory`, cls: 'terminal-text-red' }];
      return node.content.split('\n').map(line => ({ text: line, cls: 'terminal-text-white' }));
    }
    function cmdAsk(args) {
      if (!args.length) return [{ text: 'Usage: ask <question>', cls: 'terminal-text-yellow' }];
      const q = args.join(' ').toLowerCase();
      let res = 'Operating at 100% capacity.';
      if (q.includes('job') || q.includes('hire')) res = 'I am open to exciting opportunities!';
      else if (q.includes('joke')) res = 'Why do programmers prefer dark mode? Light attracts bugs.';
      else if (q.includes('secret')) res = 'There are secrets hidden in the file system. Try exploring with ls and cd.';
      else if (q.includes('react') || q.includes('vue')) res = 'Vanilla JS gives you wings.';
      else if (q.includes('who are you')) res = 'I am a humble terminal Assistant, built by Bharath.';
      return [{ text: `🤖 AI: ${res}`, cls: 'terminal-text-gold' }];
    }

    function cmdLoaderAction(name, action) {
      return async () => {
        isAnimating = true; terminalInput.disabled = true;
        await renderLine({ text: `Initializing ${name}...`, cls: 'terminal-text-dim' }, 0);
        const barSpan = document.createElement('span'); barSpan.className = 'terminal-text-cyan';
        const div = document.createElement('div'); div.className = 'terminal-line'; div.appendChild(barSpan);
        terminalOutput.appendChild(div); scrollBottom();
        for (let i = 0; i <= 20; i++) {
          if (skipAnimation) i = 20;
          barSpan.textContent = `[${'█'.repeat(i)}${'░'.repeat(20-i)}] ${Math.floor(i*5)}%`;
          if (!skipAnimation) { playBeep(200+i*20, 'square', 0.02, 0.02); await new Promise(r => setTimeout(r, 25)); }
        }
        if (!skipAnimation) await new Promise(r => setTimeout(r, 100));
        isAnimating = false; skipAnimation = false; terminalInput.disabled = false; terminalInput.focus();
        const lines = action();
        if (lines) { isAnimating = true; for (let l of lines) await renderLine(l, 5); isAnimating = false; skipAnimation = false; }
        return null;
      };
    }
    async function simulateDownload() {
      isAnimating = true; terminalInput.disabled = true;
      await renderLine({ text: 'Handshake successful. Downloading...', cls: 'terminal-text-green' }, 10);
      const barSpan = document.createElement('span'); barSpan.className = 'terminal-text-gold';
      const div = document.createElement('div'); div.className = 'terminal-line'; div.appendChild(barSpan);
      terminalOutput.appendChild(div); scrollBottom();
      for (let i = 0; i <= 10; i++) {
        if (skipAnimation) i = 10;
        barSpan.textContent = `Progress: ${i*10}% ${'.'.repeat(i%4)}`;
        if (!skipAnimation) { playBeep(800, 'triangle', 0.05, 0.01); await new Promise(r => setTimeout(r, 100)); }
      }
      window.open('assets/certificates/Copy of Bharath Raj M Resume 2026 updated (4).pdf', '_blank');
      isAnimating = false; skipAnimation = false; terminalInput.disabled = false; terminalInput.focus();
      return null;
    }
    async function cmdHack() {
      isAnimating = true; terminalInput.disabled = true;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      await renderLine({ text: 'Bypassing mainframe proxy...', cls: 'terminal-text-red' }, 10);
      for (let i = 0; i < 15; i++) {
        if (skipAnimation) break;
        let junk = ''; const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:"<>?';
        for (let j = 0; j < 40; j++) junk += chars.charAt(Math.floor(Math.random() * chars.length));
        const div = document.createElement('div'); div.className = 'terminal-line'; div.innerHTML = `<span class="terminal-text-green">${junk}</span>`;
        terminalOutput.appendChild(div); scrollBottom();
        playBeep(400+Math.random()*800, 'sawtooth', 0.03, 0.05); await new Promise(r => setTimeout(r, 40));
      }
      await renderLine({ text: 'ACCESS GRANTED. (Just kidding!)', cls: 'terminal-text-gold' }, 20);
      isAnimating = false; skipAnimation = false; terminalInput.disabled = false; terminalInput.focus();
      return null;
    }

    function scrollBottom() { terminalBody.scrollTop = terminalBody.scrollHeight; }
    async function renderLine(lineData, speed = 10) {
      const div = document.createElement('div'); div.className = 'terminal-line';
      const span = document.createElement('span'); if (lineData.cls) span.className = lineData.cls;
      div.appendChild(span); terminalOutput.appendChild(div); scrollBottom();
      if (lineData.html) { span.innerHTML = lineData.html; return; }
      if (!lineData.text) { span.innerHTML = '&nbsp;'; return; }
      if (skipAnimation || speed === 0) { span.textContent = lineData.text; return; }
      for (let i = 0; i < lineData.text.length; i++) {
        if (skipAnimation) { span.textContent = lineData.text; break; }
        span.textContent += lineData.text[i];
        if (i % 3 === 0) playBeep(500, 'sine', 0.01, 0.01);
        scrollBottom(); await new Promise(r => setTimeout(r, speed));
      }
    }

    async function processCommandAsync(cmdStr) {
      const trimmed = cmdStr.trim();
      if (!trimmed) { renderLine({ text: '' }, 0); return; }
      const parts = trimmed.split(/\s+/); const baseCmd = parts[0].toLowerCase(); const args = parts.slice(1);
      if (easterEggs[baseCmd]) { await renderLine({ text: easterEggs[baseCmd], cls: 'terminal-text-gold' }, 15); return; }
      
      let targetCmd = aliases[baseCmd] || baseCmd;
      if (!registry[targetCmd]) {
        const matches = allCommands.filter(c => c.startsWith(targetCmd));
        if (matches.length === 1) { targetCmd = aliases[matches[0]] || matches[0]; await renderLine({ text: `(auto-resolved to '${targetCmd}')`, cls: 'terminal-text-dim' }, 0); }
        else if (matches.length > 1) { await renderLine({ text: `Ambiguous. Did you mean: ${matches.join(', ')}?`, cls: 'terminal-text-yellow' }, 0); return; }
        else {
           const best = allCommands.find(c => c.includes(targetCmd) || targetCmd.includes(c));
           await renderLine({ text: best ? `Did you mean '${aliases[best]||best}'?` : `Command not found: ${baseCmd}`, cls: 'terminal-text-red' }, 0); return;
        }
      }
      try { const lines = await registry[targetCmd].action(args); if (lines) { for (let l of lines) await renderLine(l, 10); } } 
      catch(e) { await renderLine({ text: `Error: ${e.message}`, cls: 'terminal-text-red' }, 0); }
    }

    function updatePrompt() {
      let d = currentDir === '/home/bharath' ? '~' : (currentDir.startsWith('/home/bharath/') ? '~/' + currentDir.substring(14) : currentDir);
      terminalPrompt.textContent = `bharath@portfolio:${d}$ `;
    }

    terminalInputLine.style.position = 'relative';
    const suggOverlay = document.createElement('div');
    suggOverlay.style.cssText = 'position:absolute;top:0;left:0;color:rgba(255,255,255,0.2);pointer-events:none;font-family:var(--font-mono);font-size:0.85rem;white-space:pre;';
    terminalInputLine.insertBefore(suggOverlay, terminalInput);
    terminalInput.style.background = 'transparent'; terminalInput.style.position = 'relative'; terminalInput.style.zIndex = '2';

    function getSuggestion(text) {
      if (!text || text.endsWith(' ')) return '';
      const parts = text.split(/\s+/);
      if (parts.length === 1) return allCommands.find(c => c.startsWith(parts[0].toLowerCase())) || '';
      return '';
    }
    function updateSuggestion() {
      const val = terminalInput.value; const sugg = getSuggestion(val);
      requestAnimationFrame(() => {
        suggOverlay.style.left = terminalInput.offsetLeft + 'px';
        if (sugg && sugg.startsWith(val.toLowerCase())) {
          suggOverlay.innerHTML = `<span style="opacity:0;">${val}</span>${sugg.substring(val.length)}`;
        } else suggOverlay.innerHTML = '';
      });
    }

    terminalInput.addEventListener('input', updateSuggestion);
    terminalInput.addEventListener('keydown', async (e) => {
      if (isAnimating) { if (e.key === 'Enter') { e.preventDefault(); skipAnimation = true; } return; }
      if (e.key === 'Tab') {
        e.preventDefault(); const sugg = getSuggestion(terminalInput.value);
        if (sugg) { terminalInput.value = sugg; updateSuggestion(); }
      } else if (e.key === 'Enter') {
        const val = terminalInput.value.trim();
        const div = document.createElement('div'); div.className = 'terminal-line';
        div.innerHTML = `<span class="terminal-text-gold">${terminalPrompt.textContent}</span><span class="terminal-text-white">${terminalInput.value}</span>`;
        terminalOutput.appendChild(div);
        terminalInput.value = ''; suggOverlay.innerHTML = '';
        if (val && commandHistory[commandHistory.length - 1] !== val) commandHistory.push(val);
        historyIndex = commandHistory.length;
        isAnimating = true; terminalInput.disabled = true;
        await processCommandAsync(val);
        isAnimating = false; skipAnimation = false; terminalInput.disabled = false; terminalInput.focus(); scrollBottom();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); if (historyIndex > 0) { terminalInput.value = commandHistory[--historyIndex]; updateSuggestion(); }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault(); if (historyIndex < commandHistory.length - 1) { terminalInput.value = commandHistory[++historyIndex]; updateSuggestion(); }
        else { historyIndex = commandHistory.length; terminalInput.value = ''; updateSuggestion(); }
      }
    });

    openTerminalBtn.addEventListener('click', () => { terminalOverlay.classList.add('active'); terminalInput.value = ''; updateSuggestion(); setTimeout(() => terminalInput.focus(), 300); });
    closeTerminalBtn.addEventListener('click', () => { terminalOverlay.classList.remove('active'); audioCtx = null; });
    terminalOverlay.addEventListener('click', e => { if (e.target === terminalOverlay) terminalOverlay.classList.remove('active'); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (terminalOverlay.classList.contains('active')) terminalOverlay.classList.remove('active');
        const certModal = document.getElementById('cert-modal');
        if (certModal && certModal.classList.contains('active')) certModal.classList.remove('active');
      }
    });

    updatePrompt();
  })();

  /* ════════════════════════════════════════════
     TILTED CARDS
     ════════════════════════════════════════════ */
  (function initTiltedCards() {
    const containers = document.querySelectorAll('.tilted-card-container');
    const rotateAmplitude = 16;
    const lerp = (a, b, n) => (1 - n) * a + n * b;

    containers.forEach(container => {
      const inner = container.querySelector('.tilted-card-inner');
      let curRX = 0, tgtRX = 0, curRY = 0, tgtRY = 0, curSc = 1, tgtSc = 1;

      container.addEventListener('mousemove', e => {
        const r = container.getBoundingClientRect();
        tgtRX = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -rotateAmplitude;
        tgtRY = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * rotateAmplitude;
      });
      container.addEventListener('mouseenter', () => { tgtSc = 1.08; });
      container.addEventListener('mouseleave', () => { tgtSc = 1; tgtRX = 0; tgtRY = 0; });

      (function animate() {
        curRX = lerp(curRX, tgtRX, 0.1);
        curRY = lerp(curRY, tgtRY, 0.1);
        curSc = lerp(curSc, tgtSc, 0.1);
        inner.style.transform = `rotateX(${curRX}deg) rotateY(${curRY}deg) scale(${curSc})`;
        requestAnimationFrame(animate);
      })();
    });
  })();

  /* ════════════════════════════════════════════
     CERTIFICATIONS MODAL
     ════════════════════════════════════════════ */
  const certCards = document.querySelectorAll('.tilted-card-container');
  const certModal = document.getElementById('cert-modal');
  const closeModal = document.getElementById('close-modal');
  const modalMainView = document.getElementById('modal-main-view');
  const modalGroupView = document.getElementById('modal-group-view');
  const modalItemsGrid = document.getElementById('modal-items-grid');
  const modalGroupTitle = document.getElementById('modal-group-title');
  const previewContainer = document.getElementById('cert-preview-container');
  const previewContentArea = document.getElementById('preview-content-area');
  const closePreviewBtn = document.getElementById('close-preview-btn');
  const modalViewBtn = document.getElementById('modal-view-inline');
  const modalTitle = document.getElementById('modal-title');
  const modalIssuer = document.getElementById('modal-issuer');
  const modalDesc = document.getElementById('modal-desc');

  let currentCertUrl = '';
  let currentCertTitle = '';
  let currentCertIssuer = '';
  let isGroupViewActive = false;

  const certDetails = {
    'nptel-ml': {
      title: 'Introduction to Machine Learning', issuer: 'NPTEL — 2025', icon: '🏅',
      desc: 'NPTEL certification for machine learning fundamentals, covering data science, modeling, and evaluation.',
      downloadUrl: 'assets/certificates/Introduction to Machine Learning (2).pdf'
    },
    'aicte-ai': {
      title: 'AICTE Technical AI', issuer: 'Edunet Foundation — 2025', icon: '🏅',
      desc: 'AI and emerging technologies training under the AICTE internship program.',
      downloadUrl: 'assets/certificates/EDUNET_INTERNSHIP (2).pdf'
    },
    'apollo-training': {
      title: 'Apollo Computer Education', issuer: 'Apollo Training — 2025', icon: '🏅',
      desc: 'Professional training completion certificate for technical courses at Apollo.',
      downloadUrl: 'assets/certificates/Certificate_Of_Training_Apollo_Computer_Education.jpg'
    },
    'codebind-internships': {
      title: 'Codebind Internship Collection', issuer: 'Codebind Technologies', icon: '📁', isGroup: true,
      items: [
        { title: 'Internship Certificate', desc: 'Professional internship completion.', downloadUrl: 'assets/certificates/Cerificate_Of_Internship_Codebind.jpg' },
        { title: 'Project Completion', desc: 'Project-specific technical training.', downloadUrl: 'assets/certificates/Certificate_Of_Project_Completion_CodeBind.jpg' },
        { title: 'Corporate Training Test', desc: 'Evaluation and technical verification.', downloadUrl: 'assets/certificates/Corporate_Training_Test_Codebind.jpg' },
        { title: 'Implant Training', desc: 'Real-world industrial exposure.', downloadUrl: 'assets/certificates/Implant_Training_Certificate_Codebind.jpg' },
        { title: 'Technical Workshop', desc: 'Skill development workshop participation.', downloadUrl: 'assets/certificates/Workshop_Certificate_Codebind.jpg' },
      ]
    },
    'oracle-cloud': {
      title: 'Oracle Cloud (OCI) Collection', issuer: 'Oracle University', icon: '📁', isGroup: true,
      items: [
        { title: 'OCI Foundations 2023', desc: 'Infrastructure foundations.', downloadUrl: 'assets/certificates/Oracle Cloud Infrastructure 2023.pdf' },
        { title: 'OCI Architect Associate 2024', desc: 'Cloud architecture and design.', downloadUrl: 'assets/certificates/Oracle Cloud Infrastructure 2024.pdf' },
        { title: 'OCI Operations 2025', desc: 'Advanced cloud operations.', downloadUrl: 'assets/certificates/Oracle Cloud Infrastructure 2025.pdf' },
      ]
    },
    'uipath-automation': {
      title: 'UiPath Automation Developer', issuer: 'UiPath — 2025', icon: '⚡',
      desc: 'Certified UiPath Automation Developer Associate diploma.',
      downloadUrl: 'assets/certificates/UiPath Automation Developer Associate Training_Bharath  Raj_en-US_diploma (1).pdf'
    },
    'ibm-skills-build': {
      title: 'IBM Skills Build Collection', issuer: 'IBM Professional', icon: '📁', isGroup: true,
      items: [
        { title: 'SkillsBuild Certification A', desc: 'Professional skill development.', downloadUrl: 'assets/certificates/Completion Certificate _ SkillsBuild (2).pdf' },
        { title: 'SkillsBuild Certification B', desc: 'Advanced data and technology modules.', downloadUrl: 'assets/certificates/Completion Certificate _ SkillsBuild0pdf (3).pdf' },
        { title: 'SkillsBuild Certification C', desc: 'Digital literacy and professional growth.', downloadUrl: 'assets/certificates/Completion Certificate _ SkillsBuild1 (3).pdf' },
      ]
    }
  };

  /* ── helpers ── */
  const modalContent = certModal.querySelector('.modal-content');

  function enterPreviewMode() {
    modalContent.classList.add('preview-mode');
    modalContent.style.overflow = 'hidden';
  }
  function exitPreviewMode() {
    modalContent.classList.remove('preview-mode');
    modalContent.style.overflow = '';
  }

  function hideAll() {
    previewContainer.style.display = 'none';
    modalMainView.style.display = 'none';
    modalGroupView.style.display = 'none';
    exitPreviewMode();
    previewContentArea.innerHTML = '';
  }

  function hidePreview() {
    previewContainer.style.display = 'none';
    previewContentArea.innerHTML = '';
    exitPreviewMode();
    if (isGroupViewActive) {
      modalGroupView.style.display = 'block';
    } else {
      modalMainView.style.display = 'block';
    }
  }

  /* ── THE CRITICAL FIX: display must be 'flex' not 'block' ── */
  function showPreview(url, title, issuer) {
    currentCertUrl = url;
    currentCertTitle = title || 'Certificate';
    currentCertIssuer = issuer || 'Issuer';

    modalMainView.style.display = 'none';
    modalGroupView.style.display = 'none';

    document.getElementById('preview-title-large').textContent = currentCertTitle;
    document.getElementById('preview-issuer-name').textContent = currentCertIssuer;
    document.getElementById('preview-download-direct').href = url;

    enterPreviewMode();

    /* MUST be flex — the inner layout is a flex column */
    previewContainer.style.display = 'flex';

    const isPdf = url.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      previewContentArea.innerHTML =
        `<iframe src="${url}#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf"></iframe>`;
    } else {
      previewContentArea.innerHTML = `<img src="${url}" alt="Certificate Preview">`;
    }
  }

  /* ── Card click: open modal ── */
  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const data = certDetails[card.dataset.cert];
      if (!data) return;

      hideAll();

      if (data.isGroup) {
        isGroupViewActive = true;
        modalGroupView.style.display = 'block';
        modalGroupTitle.textContent = data.title;

        modalItemsGrid.innerHTML = data.items.map(item => `
          <div class="modal-item-card">
            <div class="modal-item-info">
              <h4>${item.title}</h4>
              <p>${item.desc}</p>
            </div>
            <div class="modal-item-actions">
              <button class="btn-icon preview-item-btn"
                data-url="${item.downloadUrl}"
                data-title="${item.title}"
                data-issuer="${data.issuer}"
                title="View Certificate">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <a href="${item.downloadUrl}" class="btn-icon" title="Download" download>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            </div>
          </div>`
        ).join('');

        modalItemsGrid.querySelectorAll('.preview-item-btn').forEach(btn => {
          btn.addEventListener('click', e => {
            e.stopPropagation();
            showPreview(btn.dataset.url, btn.dataset.title, btn.dataset.issuer);
          });
        });

      } else {
        isGroupViewActive = false;
        modalMainView.style.display = 'block';
        document.getElementById('modal-icon').textContent = data.icon || '🏅';
        modalTitle.textContent = data.title;
        modalIssuer.textContent = data.issuer;
        modalDesc.textContent = data.desc;
        document.getElementById('modal-download').href = data.downloadUrl || 'javascript:void(0)';
        currentCertUrl = data.downloadUrl;
        currentCertTitle = data.title;
        currentCertIssuer = data.issuer;
      }
      certModal.classList.add('active');
    });
  });

  /* ── "View Certificate" button in main card view ── */
  if (modalViewBtn) {
    modalViewBtn.addEventListener('click', () => {
      if (currentCertUrl) showPreview(currentCertUrl, currentCertTitle, currentCertIssuer);
    });
  }

  /* ── "Open Full" button in preview ── */
  const previewOpenFull = document.getElementById('preview-open-full');
  if (previewOpenFull) {
    previewOpenFull.addEventListener('click', () => { if (currentCertUrl) window.open(currentCertUrl, '_blank'); });
  }

  /* ── Back arrow in preview ── */
  if (closePreviewBtn) {
    closePreviewBtn.addEventListener('click', hidePreview);
  }

  /* ── Close modal ── */
  closeModal.addEventListener('click', () => {
    certModal.classList.remove('active');
    setTimeout(hideAll, 300);
  });
  certModal.addEventListener('click', e => {
    if (e.target === certModal) {
      certModal.classList.remove('active');
      setTimeout(hideAll, 300);
    }
  });

  /* ════════════════════════════════════════════
     CONTACT FORM (EmailJS)
     ════════════════════════════════════════════ */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  // Updated with your EmailJS credentials
  emailjs.init("SCq7z_Hjj5WOYCY-n");

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // UI Feedback
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;

    // Get field values
    const name = document.getElementById("user-name").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const message = document.getElementById("user-message").value.trim();

    // Debug Log
    console.log('Sending EmailJS with:', { name, email, message });

    // Use EmailJS to send — mapping values manually to your template variables {{name}}, {{email}}, {{message}}
    emailjs.send('service_1fdnlrj', 'template_27y1cdm', {
      name: name,
      email: email,
      message: message
    })
      .then(() => {
        formStatus.textContent = '✅ Message sent successfully!';
        formStatus.className = 'form-status success';
        contactForm.reset();
      })
      .catch((err) => {
        console.error('EmailJS Error:', err);
        formStatus.textContent = '❌ Failed to send. Please check your credentials or network.';
        formStatus.className = 'form-status error';
      })
      .finally(() => {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
        setTimeout(() => { 
          formStatus.textContent = ''; 
          formStatus.className = 'form-status'; 
        }, 6000);
      });
  });

  /* ════════════════════════════════════════════
     SMOOTH SCROLL
     ════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href.startsWith('javascript:')) return; 

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ════════════════════════════════════════════
     SCROLL-STACK CARDS (Tech Stack)
     ════════════════════════════════════════════ */
  (function initScrollStack() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    const sectionTitle = skillsSection.querySelector('.section-title');
    const cards = Array.from(document.querySelectorAll('.scroll-stack-card'));
    const scrollerEnd = document.querySelector('.scroll-stack-end');
    const scrollerInner = document.querySelector('.scroll-stack-inner');
    if (cards.length === 0 || !scrollerEnd || !scrollerInner) return;

    const lastTransforms = new Map();
    let isUpdating = false;
    const stackPositionPct = 0.12;
    const itemScaleStep = 0.025;
    const itemStackDistance = 12;

    let cachedMetrics = { initialTops: [], titleBottomOffset: 0, pinEnd: 0, containerHeight: 0, stackPositionPx: 0 };

    function updateMetrics() {
      const scrollTop = window.scrollY;
      const containerHeight = window.innerHeight;
      cachedMetrics.containerHeight = containerHeight;
      cachedMetrics.stackPositionPx = containerHeight * stackPositionPct;
      cachedMetrics.initialTops = cards.map(card => card.getBoundingClientRect().top + scrollTop);
      const titleRect = sectionTitle.getBoundingClientRect();
      cachedMetrics.titleBottomOffset = titleRect.bottom + scrollTop;
      const runwayHeight = Math.max(200, containerHeight * 0.25);
      scrollerInner.style.paddingBottom = `${runwayHeight}px`;
      const scrollerInnerBottom = scrollerInner.getBoundingClientRect().bottom + scrollTop;
      cachedMetrics.pinEnd = scrollerInnerBottom - containerHeight * 0.6;
    }

    function updateTransforms() {
      if (isUpdating) return;
      const isMobile = window.innerWidth <= 768;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isMobile || prefersReducedMotion) {
        cards.forEach(card => { card.style.transform = ''; card.style.opacity = ''; card.classList.remove('is-active'); });
        return;
      }
      isUpdating = true;
      const scrollTop = window.scrollY;
      const { initialTops, titleBottomOffset, pinEnd, containerHeight, stackPositionPx } = cachedMetrics;
      const effectiveScroll = Math.min(scrollTop, pinEnd);
      let topMostIndex = -1, minDistance = Infinity;

      cards.forEach((card, i) => {
        const cardTop = initialTops[i];
        const pinStart = cardTop - stackPositionPx - (i * itemStackDistance);
        let translateY = 0, scale = 1, opacity = 1;
        if (effectiveScroll >= pinStart) translateY = effectiveScroll - pinStart;
        const cardCurrentTop = cardTop + translateY;
        const minAllowedTop = titleBottomOffset + 12;
        if (cardCurrentTop < minAllowedTop) translateY = minAllowedTop - cardTop;

        let pinnedAbove = 0;
        for (let j = i + 1; j < cards.length; j++) {
          const np = initialTops[j] - stackPositionPx - (j * itemStackDistance);
          if (effectiveScroll > np) {
            pinnedAbove += Math.min(1, (effectiveScroll - np) / (containerHeight * 0.25));
          }
        }
        if (pinnedAbove > 0) {
          scale = Math.max(0.85, 1 - (pinnedAbove * itemScaleStep));
          opacity = Math.max(0.5, 1 - (pinnedAbove * 0.1));
        }

        const dist = Math.abs(scrollTop - pinStart);
        if (dist < minDistance && scrollTop > pinStart - 100 && scrollTop < pinEnd + 100) {
          minDistance = dist; topMostIndex = i;
        }

        const nT = { y: Math.round(translateY * 10) / 10, s: Math.round(scale * 1000) / 1000, o: Math.round(opacity * 100) / 100 };
        const last = lastTransforms.get(i);
        if (!last || last.y !== nT.y || last.s !== nT.s || last.o !== nT.o) {
          card.style.transform = `translate3d(0,${nT.y}px,0) scale(${nT.s})`;
          card.style.opacity = nT.o;
          lastTransforms.set(i, nT);
        }
      });

      cards.forEach((card, i) => card.classList.toggle('is-active', i === topMostIndex));
      isUpdating = false;
    }

    if (document.readyState === 'complete') { updateMetrics(); updateTransforms(); }
    else window.addEventListener('load', () => { updateMetrics(); updateTransforms(); });

    let rafId = null;
    window.addEventListener('scroll', () => { if (rafId) cancelAnimationFrame(rafId); rafId = requestAnimationFrame(updateTransforms); }, { passive: true });

    let rsTimer;
    window.addEventListener('resize', () => { clearTimeout(rsTimer); rsTimer = setTimeout(() => { updateMetrics(); updateTransforms(); }, 200); });
  })();

  /* 🚀 ROCKET ENGINE (Extracted) */
  (function initRocketSystem() {
    const launcher = document.getElementById('rocket-launcher');
    if (!launcher) return;

    const canvas = document.getElementById('rocket-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const flash = document.getElementById('screen-flash');
    const warp = document.getElementById('warp-overlay');
    const badge = document.getElementById('rl-badge');
    const devBanner = document.getElementById('dev-banner');

    let width, height;
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let rocket = null;
    let particles = [];
    let currentTarget = null;
    let t = 0;
    let animId = null;

    // Bezier curve points
    function bezier(t, p0, p1, p2, p3) {
      const mt = 1 - t;
      return {
        x: mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x,
        y: mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y,
      };
    }

    function createParticle(x, y) {
      return {
        x, y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        alpha: 1,
        life: 0.95 + Math.random() * 0.04,
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#ff8c00' : '#ffd700'
      };
    }

    function launch() {
      if (rocket) return;

      // Find possible target elements
      const targetSelectors = ['button', 'a.btn', 'a.pill', '.custom-social-button', '.tilted-card-container', '.stat-card'];
      const allTargets = Array.from(document.querySelectorAll(targetSelectors.join(',')))
        .filter(el => {
          const r = el.getBoundingClientRect();
          return el.id !== 'rocket-launcher' && 
                 r.width > 0 && r.height > 0 &&
                 el.offsetParent !== null;
        });

      currentTarget = allTargets[Math.floor(Math.random() * allTargets.length)] || document.getElementById('open-terminal-btn');
      const targetRect = currentTarget.getBoundingClientRect();
      const launcherRect = launcher.getBoundingClientRect();

      rocket = {
        p0: { x: launcherRect.left + launcherRect.width / 2, y: launcherRect.top + launcherRect.height / 2 },
        p1: { x: width * Math.random(), y: height * Math.random() },
        p2: { x: width * Math.random(), y: height * Math.random() },
        p3: { x: targetRect.left + targetRect.width / 2, y: targetRect.top + targetRect.height / 2 }
      };
      
      t = 0;
      if (warp) warp.style.opacity = '1';
      animate();
    }

    function drawRocket(x, y, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // Flame
      ctx.fillStyle = '#ff8c00';
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-25, -5);
      ctx.lineTo(-20, 0);
      ctx.lineTo(-25, 5);
      ctx.closePath();
      ctx.fill();
      
      // Body
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();
      
      // Fins
      ctx.fillStyle = '#ff3333';
      ctx.beginPath();
      ctx.moveTo(-5, -6);
      ctx.lineTo(-15, -12);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-5, 6);
      ctx.lineTo(-15, 12);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      const oldPos = bezier(t, rocket.p0, rocket.p1, rocket.p2, rocket.p3);
      t += 0.012; // Speed boost
      const newPos = bezier(t, rocket.p0, rocket.p1, rocket.p2, rocket.p3);
      
      const angle = Math.atan2(newPos.y - oldPos.y, newPos.x - oldPos.x);

      // Trail
      if (Math.random() > 0.2) particles.push(createParticle(newPos.x, newPos.y));
      
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        p.alpha *= p.life;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.alpha < 0.01) particles.splice(i, 1);
      });
      ctx.globalAlpha = 1;

      drawRocket(newPos.x, newPos.y, angle);

      if (t < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        // Impact
        ctx.clearRect(0, 0, width, height);

        if (flash) {
          flash.style.opacity = '1';
          setTimeout(() => flash.style.opacity = '0', 200);
        }
        if (warp) warp.style.opacity = '0';
        
        // TRIGGER TARGET CLICK
        if (currentTarget) {
          currentTarget.click();
          // Visual hit effect
          currentTarget.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          currentTarget.style.transform = 'scale(0.9)';
          setTimeout(() => currentTarget.style.transform = '', 200);
        }

        rocket = null;
        particles = [];
      }
    }

    launcher.addEventListener('click', launch);

    // Initial Badge (randomly changes for fun)
    if (badge) {
      const setBadge = () => {
        badge.textContent = Math.floor(Math.random() * 5) + 1;
        badge.style.opacity = '1';
      };
      setTimeout(setBadge, 2000);
      setInterval(setBadge, 12000);
    }
  })();

})();