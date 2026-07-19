(() => {
  'use strict';

  // Raw local servers expose Jekyll front matter as a text node; production builds remove it.
  [...document.body.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.includes('layout: null'))
    .forEach((node) => node.remove());

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  let previousScroll = window.scrollY;

  const updateHeader = () => {
    const currentScroll = window.scrollY;
    header?.classList.toggle('scrolled', currentScroll > 40);
    if (currentScroll > previousScroll && currentScroll > 300 && !navLinks?.classList.contains('open')) {
      header?.classList.add('hidden');
    } else {
      header?.classList.remove('hidden');
    }
    previousScroll = Math.max(0, currentScroll);

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

  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  const canvas = document.querySelector('#field');
  if (!canvas || reducedMotion) return;
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let ratio = 1;
  let particles = [];
  let mouseX = -1000;
  let mouseY = -1000;
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

      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const distance = Math.hypot(dx, dy);
      if (distance < 145 && distance > 0) {
        const force = (145 - distance) / 145;
        particle.x += (dx / distance) * force * 1.4;
        particle.y += (dy / distance) * force * 1.4;
      }

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
  window.addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }, { passive: true });
  window.addEventListener('pointerleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });
  resize();
  draw();
})();
