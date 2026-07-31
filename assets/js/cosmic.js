(() => {
  'use strict';

  // Raw local servers expose Jekyll front matter as a text node; production builds remove it.
  [...document.body.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.includes('layout: null'))
    .forEach((node) => node.remove());

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = document.querySelector('[data-loader]');
  const loaderCount = document.querySelector('[data-loader-count]');
  const loaderProgress = document.querySelector('[data-loader-progress]');
  const loaderWord = document.querySelector('[data-loader-word]');
  const pageProgress = document.querySelector('[data-page-progress]');
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  let previousScroll = window.scrollY;

  const finishLoader = () => {
    loader?.classList.add('is-complete');
    document.body.classList.remove('is-loading');
  };

  if (loader && !reducedMotion) {
    document.body.classList.add('is-loading');
    const words = ['Perceive', 'Represent', 'Understand'];
    const duration = 1650;
    const startedAt = performance.now();
    let activeWord = 0;
    const tickLoader = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * 100);
      if (loaderCount) loaderCount.textContent = String(value).padStart(3, '0');
      if (loaderProgress) loaderProgress.style.transform = `scaleX(${eased})`;
      const nextWord = Math.min(words.length - 1, Math.floor(progress * words.length));
      if (loaderWord && nextWord !== activeWord) {
        activeWord = nextWord;
        loaderWord.classList.add('swapping');
        window.setTimeout(() => {
          loaderWord.textContent = words[activeWord];
          loaderWord.classList.remove('swapping');
        }, 160);
      }
      if (progress < 1) {
        window.requestAnimationFrame(tickLoader);
      } else {
        window.setTimeout(finishLoader, 220);
      }
    };
    window.requestAnimationFrame(tickLoader);
  } else {
    finishLoader();
  }

  const updateHeader = () => {
    const currentScroll = window.scrollY;
    header?.classList.toggle('scrolled', currentScroll > 40);
    if (currentScroll > previousScroll && currentScroll > 300 && !navLinks?.classList.contains('open')) {
      header?.classList.add('hidden');
    } else {
      header?.classList.remove('hidden');
    }
    previousScroll = Math.max(0, currentScroll);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (pageProgress) pageProgress.style.transform = `scaleX(${scrollable > 0 ? currentScroll / scrollable : 0})`;

    let activeSection = 'home';
    for (const section of sections) {
      if (currentScroll >= section.offsetTop - 180) activeSection = section.id;
    }
    links.forEach((link) => {
      const target = link.getAttribute('href')?.slice(1);
      link.classList.toggle('active', target === activeSection || (activeSection === 'news' && target === 'projects'));
    });
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  navToggle?.addEventListener('click', () => {
    const open = !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', open);
  });

  navLinks?.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -45px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min((index % 4) * 55, 165)}ms`;
      observer.observe(item);
    });
  }

  const role = document.querySelector('[data-roles]');
  if (role && !reducedMotion) {
    const roles = role.dataset.roles.split('|');
    let roleIndex = 0;
    window.setInterval(() => {
      role.classList.add('swapping');
      window.setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        role.textContent = roles[roleIndex];
        role.classList.remove('swapping');
      }, 230);
    }, 2600);
  }

  const perceptionCanvas = document.querySelector('[data-perception-canvas]');
  const perceptionField = document.querySelector('[data-perception-field]');
  const perceptionContext = perceptionCanvas?.getContext('2d', { alpha: false });
  if (perceptionCanvas && perceptionContext) {
    let sceneWidth = 1;
    let sceneHeight = 1;
    let sceneRatio = 1;
    let perceptionFrame = 0;
    let perceptionRunning = true;
    let sceneOffsetX = 0;
    let sceneOffsetY = 0;
    const scenePoints = [];
    const palette = ['#8fbbea', '#9ce7ef', '#a8e6bd', '#aa8dde', '#c8d4e0'];
    const scenePointer = { active: false, x: .56, y: .48, smoothX: .56, smoothY: .48 };
    let seed = 1847;

    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const addPoint = (x, y, z, colorIndex, size = .8, alpha = .42) => {
      scenePoints.push({ x, y, z, colorIndex, size, alpha });
    };

    const addBox = (centerX, centerZ, sizeX, sizeZ, height, colorIndex) => {
      const step = .082;
      for (let x = -sizeX / 2; x <= sizeX / 2; x += step) {
        for (let z = -sizeZ / 2; z <= sizeZ / 2; z += step) {
          addPoint(centerX + x, height + (random() - .5) * .012, centerZ + z, colorIndex, 1.05, .58);
        }
      }
      for (let y = 0; y <= height; y += step) {
        for (let x = -sizeX / 2; x <= sizeX / 2; x += step) {
          addPoint(centerX + x, y, centerZ - sizeZ / 2, colorIndex, .78, .46);
          addPoint(centerX + x, y, centerZ + sizeZ / 2, colorIndex, .78, .46);
        }
        for (let z = -sizeZ / 2; z <= sizeZ / 2; z += step) {
          addPoint(centerX - sizeX / 2, y, centerZ + z, colorIndex, .78, .46);
          addPoint(centerX + sizeX / 2, y, centerZ + z, colorIndex, .78, .46);
        }
      }
    };

    const addTree = (centerX, centerZ, height, radius) => {
      for (let y = .03; y < height * .58; y += .075) {
        addPoint(centerX, y, centerZ, 2, .75, .42);
      }
      const crownY = height * .72;
      for (let phi = .32; phi < Math.PI - .2; phi += .38) {
        for (let theta = 0; theta < Math.PI * 2; theta += .43) {
          const texture = .86 + random() * .24;
          addPoint(
            centerX + Math.sin(phi) * Math.cos(theta) * radius * texture,
            crownY + Math.cos(phi) * radius * .86 * texture,
            centerZ + Math.sin(phi) * Math.sin(theta) * radius * texture,
            2,
            .72,
            .38
          );
        }
      }
    };

    for (let x = -3.25; x <= 3.25; x += .12) {
      for (let z = -2.05; z <= 2.05; z += .135) {
        const roadBand = Math.abs(z - (.22 * x + .24)) < .22 || Math.abs(x + 1.15) < .13;
        if (!roadBand && random() < .22) continue;
        const terrain = Math.sin(x * 1.35) * .014 + Math.cos(z * 1.65) * .011;
        addPoint(x + (random() - .5) * .025, terrain, z + (random() - .5) * .025, roadBand ? 2 : 0, roadBand ? .76 : .62, roadBand ? .34 : .23);
      }
    }

    [
      [-2.72,-1.28,.50,.44,.72,0],[-2.02,-1.38,.66,.48,1.16,1],[-1.17,-1.46,.54,.52,.88,3],
      [-.33,-1.37,.72,.55,1.48,1],[.70,-1.43,.58,.48,1.08,0],[1.56,-1.34,.74,.52,.78,2],
      [2.52,-1.20,.54,.46,1.28,1],[-2.63,.38,.78,.56,.54,3],[-1.72,.62,.54,.58,.94,0],
      [-.76,.82,.66,.50,.60,2],[.38,.72,.58,.56,1.12,1],[1.40,.58,.80,.50,.66,3],[2.43,.33,.54,.60,.98,0]
    ].forEach((building) => addBox(...building));

    [
      [-2.95,-.42,.56,.15],[-2.40,-.22,.48,.14],[-1.88,-.02,.58,.16],[-1.38,.20,.50,.14],
      [-.75,.34,.54,.15],[-.14,.52,.48,.14],[.58,.35,.58,.16],[1.10,.14,.50,.14],
      [1.70,-.12,.56,.15],[2.25,-.34,.50,.14],[2.78,-.55,.58,.16],[-2.15,1.44,.48,.14],
      [-.92,1.52,.54,.15],[.62,1.46,.50,.14],[1.82,1.34,.56,.15]
    ].forEach((tree) => addTree(...tree));

    const path = [
      [-3.12, 1.64], [-2.42, 1.34], [-1.72, 1.08], [-1.03, .78],
      [-.35, .56], [.34, .32], [1.02, .08], [1.70, -.30], [2.38, -.82], [3.05, -1.34]
    ];

    const resizePerception = () => {
      const bounds = perceptionCanvas.getBoundingClientRect();
      sceneWidth = Math.max(1, bounds.width);
      sceneHeight = Math.max(1, bounds.height);
      sceneRatio = Math.min(window.devicePixelRatio || 1, 2);
      perceptionCanvas.width = Math.round(sceneWidth * sceneRatio);
      perceptionCanvas.height = Math.round(sceneHeight * sceneRatio);
      perceptionContext.setTransform(sceneRatio, 0, 0, sceneRatio, 0, 0);
    };

    const projectPoint = (x, y, z, yaw) => {
      const cosine = Math.cos(yaw);
      const sine = Math.sin(yaw);
      const rotatedX = x * cosine - z * sine;
      const rotatedZ = x * sine + z * cosine;
      const scale = Math.min(sceneWidth / 7.72, sceneHeight / 3.55);
      return {
        x: sceneWidth * (.53 + sceneOffsetX) + rotatedX * scale,
        y: sceneHeight * (.72 + sceneOffsetY) - y * scale * 1.15 + rotatedZ * scale * .34,
        depth: rotatedZ
      };
    };

    const traceGroundRing = (context, centerX, centerZ, radius, yaw, color, width = 1) => {
      context.beginPath();
      for (let index = 0; index <= 72; index += 1) {
        const angle = index / 72 * Math.PI * 2;
        const projected = projectPoint(centerX + Math.cos(angle) * radius, .022, centerZ + Math.sin(angle) * radius, yaw);
        if (index === 0) context.moveTo(projected.x, projected.y);
        else context.lineTo(projected.x, projected.y);
      }
      context.strokeStyle = color;
      context.lineWidth = width;
      context.stroke();
    };

    const drawPerception = (time = 0) => {
      const context = perceptionContext;
      scenePointer.smoothX += ((scenePointer.active ? scenePointer.x : .56) - scenePointer.smoothX) * .045;
      scenePointer.smoothY += ((scenePointer.active ? scenePointer.y : .48) - scenePointer.smoothY) * .045;
      sceneOffsetX = (scenePointer.smoothX - .56) * .045;
      sceneOffsetY = (scenePointer.smoothY - .48) * .035;
      const yaw = -.38 + Math.sin(time * .00014) * .045 + (scenePointer.smoothX - .56) * .24;
      const pointerX = scenePointer.smoothX * sceneWidth;
      const pointerY = scenePointer.smoothY * sceneHeight;
      const focusWorldX = (scenePointer.smoothX - .5) * 4.75;
      const focusWorldZ = (scenePointer.smoothY - .5) * 3.2;
      const pulseRadius = .28 + ((time * .00022) % 1) * 2.85;
      const background = context.createLinearGradient(0, 0, sceneWidth, sceneHeight);
      background.addColorStop(0, '#0a111a');
      background.addColorStop(.52, '#081019');
      background.addColorStop(1, '#05080d');
      context.fillStyle = background;
      context.fillRect(0, 0, sceneWidth, sceneHeight);

      context.lineWidth = .55;
      for (let x = -3.2; x <= 3.2; x += .4) {
        const start = projectPoint(x, 0, -2.05, yaw);
        const end = projectPoint(x, 0, 2.05, yaw);
        context.strokeStyle = 'rgba(143,187,234,.085)';
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
      }
      for (let z = -2; z <= 2; z += .4) {
        const start = projectPoint(-3.25, 0, z, yaw);
        const end = projectPoint(3.25, 0, z, yaw);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
      }

      const projectedPoints = scenePoints.map((point) => ({
        ...point,
        projected: projectPoint(point.x, point.y, point.z, yaw)
      })).sort((a, b) => a.projected.depth - b.projected.depth);

      for (const point of projectedPoints) {
        const worldDistance = Math.hypot(point.x - focusWorldX, point.z - focusWorldZ);
        const pulse = Math.max(0, 1 - Math.abs(worldDistance - pulseRadius) / .16);
        const pointerDistance = Math.hypot(point.projected.x - pointerX, point.projected.y - pointerY);
        const pointerFocus = scenePointer.active ? Math.max(0, 1 - pointerDistance / 170) : 0;
        const depthLight = Math.max(0, Math.min(.18, (point.projected.depth + 2.2) * .035));
        context.globalAlpha = Math.min(1, point.alpha + depthLight + pulse * .54 + pointerFocus * .48);
        context.fillStyle = pulse > .48 || pointerFocus > .6 ? '#d8fbff' : palette[point.colorIndex];
        const pointSize = point.size + pulse * .72 + pointerFocus * 1.05;
        context.fillRect(point.projected.x, point.projected.y, pointSize, pointSize);
      }
      context.globalAlpha = 1;

      traceGroundRing(context, focusWorldX, focusWorldZ, pulseRadius, yaw, 'rgba(156,231,239,.28)', 1.15);
      traceGroundRing(context, focusWorldX, focusWorldZ, .24, yaw, 'rgba(168,230,189,.48)', .9);

      const projectedPath = path.map(([x, z]) => projectPoint(x, .035, z, yaw));
      context.setLineDash([4, 6]);
      context.strokeStyle = 'rgba(168,230,189,.62)';
      context.lineWidth = 1.1;
      context.beginPath();
      projectedPath.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.stroke();
      context.setLineDash([]);

      const pathProgress = ((time * .00011) % 1) * (projectedPath.length - 1);
      const segment = Math.min(projectedPath.length - 2, Math.floor(pathProgress));
      const segmentProgress = pathProgress - segment;
      const from = projectedPath[segment];
      const to = projectedPath[segment + 1];
      const roverX = from.x + (to.x - from.x) * segmentProgress;
      const roverY = from.y + (to.y - from.y) * segmentProgress;
      const direction = Math.atan2(to.y - from.y, to.x - from.x);
      context.save();
      context.translate(roverX, roverY);
      context.rotate(direction);
      context.fillStyle = '#a8e6bd';
      context.shadowColor = '#a8e6bd';
      context.shadowBlur = 12;
      context.beginPath();
      context.moveTo(7, 0);
      context.lineTo(-5, -4);
      context.lineTo(-3, 0);
      context.lineTo(-5, 4);
      context.closePath();
      context.fill();
      context.shadowBlur = 0;
      context.strokeStyle = 'rgba(168,230,189,.32)';
      context.beginPath();
      context.moveTo(4, 0);
      context.lineTo(28, -13);
      context.moveTo(4, 0);
      context.lineTo(28, 13);
      context.stroke();
      context.restore();

      const orbitCenterX = sceneWidth * .56;
      const orbitCenterY = sceneHeight * .22;
      const orbitWidth = sceneWidth * .34;
      const orbitHeight = sceneHeight * .075;
      context.setLineDash([2, 7]);
      context.strokeStyle = 'rgba(143,187,234,.16)';
      context.lineWidth = .7;
      context.beginPath();
      context.ellipse(orbitCenterX, orbitCenterY, orbitWidth, orbitHeight, -.04, 0, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);
      for (let index = 0; index < 12; index += 1) {
        const angle = index / 12 * Math.PI * 2 + time * .000045;
        const nodeX = orbitCenterX + Math.cos(angle) * orbitWidth;
        const nodeY = orbitCenterY + Math.sin(angle) * orbitHeight;
        context.globalAlpha = .24 + (index % 3) * .12;
        context.fillStyle = index % 4 === 0 ? '#a8e6bd' : '#8fbbea';
        context.fillRect(nodeX, nodeY, index % 4 === 0 ? 2 : 1, index % 4 === 0 ? 2 : 1);
      }
      context.globalAlpha = 1;

      const aerialX = scenePointer.active ? sceneWidth * (.14 + scenePointer.smoothX * .72) : sceneWidth * (.54 + Math.sin(time * .00019) * .34);
      const aerialY = scenePointer.active ? sceneHeight * (.11 + scenePointer.smoothY * .12) : sceneHeight * .18 + Math.cos(time * .00017) * 8;
      const focusProjection = projectPoint(focusWorldX, .025, focusWorldZ, yaw);
      const beam = context.createLinearGradient(aerialX, aerialY, focusProjection.x, focusProjection.y);
      beam.addColorStop(0, 'rgba(156,231,239,.18)');
      beam.addColorStop(1, 'rgba(156,231,239,0)');
      context.fillStyle = beam;
      context.beginPath();
      context.moveTo(aerialX - 3, aerialY + 5);
      context.lineTo(focusProjection.x - 30, focusProjection.y);
      context.lineTo(focusProjection.x + 30, focusProjection.y);
      context.closePath();
      context.fill();
      context.save();
      context.translate(aerialX, aerialY);
      context.strokeStyle = '#9ce7ef';
      context.fillStyle = '#0b151d';
      context.shadowColor = '#9ce7ef';
      context.shadowBlur = 9;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(-9, -6);
      context.lineTo(9, 6);
      context.moveTo(9, -6);
      context.lineTo(-9, 6);
      context.stroke();
      [-9, 9].forEach((x) => {
        [-6, 6].forEach((y) => {
          context.beginPath();
          context.arc(x, y, 2.6, 0, Math.PI * 2);
          context.stroke();
        });
      });
      context.fillRect(-3.5, -2.5, 7, 5);
      context.shadowBlur = 0;
      context.restore();

      const vignette = context.createRadialGradient(sceneWidth * .55, sceneHeight * .48, 20, sceneWidth * .55, sceneHeight * .5, Math.max(sceneWidth, sceneHeight) * .64);
      vignette.addColorStop(.56, 'rgba(3,6,10,0)');
      vignette.addColorStop(1, 'rgba(3,6,10,.58)');
      context.fillStyle = vignette;
      context.fillRect(0, 0, sceneWidth, sceneHeight);

      if (!reducedMotion && perceptionRunning) perceptionFrame = window.requestAnimationFrame(drawPerception);
    };

    const perceptionResizeObserver = new ResizeObserver(() => {
      resizePerception();
      if (reducedMotion) drawPerception(0);
    });
    perceptionResizeObserver.observe(perceptionCanvas);
    if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const hero = document.querySelector('.hero');
      hero?.addEventListener('pointermove', (event) => {
        const bounds = perceptionField?.getBoundingClientRect();
        if (!bounds) return;
        scenePointer.active = true;
        scenePointer.x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        scenePointer.y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      }, { passive: true });
      hero?.addEventListener('pointerleave', () => {
        scenePointer.active = false;
      });
    }
    resizePerception();
    drawPerception(0);
    document.addEventListener('visibilitychange', () => {
      perceptionRunning = !document.hidden;
      if (!perceptionRunning) window.cancelAnimationFrame(perceptionFrame);
      else if (!reducedMotion) perceptionFrame = window.requestAnimationFrame(drawPerception);
    });
  }

  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  document.querySelectorAll('.research-card, .feature-paper, .service-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--my', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });

  if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        card.style.setProperty('--rx', `${(-y * 4.5).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x * 5.5).toFixed(2)}deg`);
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    const cursor = document.querySelector('[data-cursor]');
    let cursorX = -100;
    let cursorY = -100;
    let displayX = -100;
    let displayY = -100;
    const renderCursor = () => {
      displayX += (cursorX - displayX) * .18;
      displayY += (cursorY - displayY) * .18;
      if (cursor) cursor.style.transform = `translate3d(${displayX}px, ${displayY}px, 0) translate(-50%, -50%)`;
      window.requestAnimationFrame(renderCursor);
    };
    window.addEventListener('pointermove', (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursor?.classList.add('visible');
    }, { passive: true });
    document.addEventListener('pointerover', (event) => {
      cursor?.classList.toggle('active', Boolean(event.target.closest('a, button, [data-tilt]')));
    });
    document.documentElement.addEventListener('pointerleave', () => cursor?.classList.remove('visible'));
    renderCursor();

  }

  const canvas = document.querySelector('#field');
  if (!canvas || reducedMotion) return;
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let ratio = 1;
  let particles = [];
  let frame = 0;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.max(42, Math.min(96, Math.floor(width / 15)));
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      homeX: Math.random() * width,
      homeY: Math.random() * height,
      size: index % 8 === 0 ? 1.5 : .7,
      speed: .08 + Math.random() * .12,
      phase: Math.random() * Math.PI * 2
    }));
  };

  const draw = () => {
    frame += 0.006;
    context.clearRect(0, 0, width, height);
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(156, 231, 239, .45)');
    gradient.addColorStop(1, 'rgba(78, 133, 191, .15)');

    particles.forEach((particle, index) => {
      const driftX = Math.cos(frame + particle.phase) * 12;
      const driftY = Math.sin(frame * .8 + particle.phase) * 9;
      const targetX = particle.homeX + driftX;
      const targetY = particle.homeY + driftY;
      particle.x += (targetX - particle.x) * particle.speed * .05;
      particle.y += (targetY - particle.y) * particle.speed * .05;

      context.beginPath();
      context.fillStyle = index % 9 === 0 ? 'rgba(156,231,239,.8)' : 'rgba(143,187,234,.42)';
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();

      for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
        const other = particles[otherIndex];
        const linkDistance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (linkDistance >= 105) continue;
        context.beginPath();
        context.strokeStyle = gradient;
        context.globalAlpha = (1 - linkDistance / 105) * .14;
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.stroke();
        context.globalAlpha = 1;
      }
    });
    window.requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();
