const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.member-section').forEach((section) => {
  const heading = section.querySelector('.member-heading');
  const title = heading?.querySelector('h2');
  const marquees = section.querySelectorAll('[data-marquee]');
  if (!heading || !title || !marquees.length) return;

  const toggle = document.createElement('button');
  toggle.className = 'view-all-button';
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = 'View all <span aria-hidden="true">+</span>';
  heading.appendChild(toggle);

  toggle.addEventListener('click', () => {
    const expanded = section.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.firstChild.textContent = expanded ? 'Collapse ' : 'View all ';
    if (!expanded) marquees.forEach((marquee) => normalizePosition(marquee));
  });

  marquees.forEach((marquee) => initializeMarquee(marquee, title.textContent.trim()));
});

function getCycleWidth(marquee) {
  const group = marquee.querySelector('.member-group');
  const track = marquee.querySelector('.member-track');
  if (!group || !track) return 0;
  return group.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 0);
}

function normalizePosition(marquee) {
  const cycleWidth = getCycleWidth(marquee);
  if (!cycleWidth) return;
  if (marquee.scrollLeft >= cycleWidth) marquee.scrollLeft -= cycleWidth;
  if (marquee.scrollLeft < 0) marquee.scrollLeft += cycleWidth;
}

function initializeMarquee(marquee, category) {
  const track = marquee.querySelector('.member-track');
  const group = track?.querySelector('.member-group');
  if (!track || !group) return;

  marquee.tabIndex = 0;
  marquee.setAttribute('aria-label', `${category}. Drag horizontally or select View all.`);

  if (!reducedMotion) {
    const duplicate = group.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    duplicate.querySelectorAll('a').forEach((link) => link.tabIndex = -1);
    track.appendChild(duplicate);
  }

  let dragging = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;
  let pauseUntil = 0;

  marquee.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' || event.button !== 0 || marquee.closest('.is-expanded')) return;
    event.preventDefault();
    dragging = true;
    moved = false;
    startX = event.clientX;
    startScroll = marquee.scrollLeft;
    pauseUntil = Date.now() + 3500;
    marquee.classList.add('is-dragging');
    marquee.setPointerCapture(event.pointerId);
  });

  marquee.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 4) moved = true;
    marquee.scrollLeft = startScroll - delta;
  });

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    marquee.classList.remove('is-dragging');
    if (marquee.hasPointerCapture(event.pointerId)) marquee.releasePointerCapture(event.pointerId);
    normalizePosition(marquee);
  };

  marquee.addEventListener('pointerup', stopDragging);
  marquee.addEventListener('pointercancel', stopDragging);
  marquee.addEventListener('wheel', () => { pauseUntil = Date.now() + 3500; }, { passive: true });
  marquee.addEventListener('touchstart', () => { pauseUntil = Date.now() + 3500; }, { passive: true });
  marquee.addEventListener('click', (event) => {
    if (!moved) return;
    event.preventDefault();
    event.stopPropagation();
    moved = false;
  }, true);

  if (reducedMotion) return;

  const reverse = marquee.dataset.direction === 'reverse';
  requestAnimationFrame(() => {
    if (reverse) marquee.scrollLeft = getCycleWidth(marquee);
  });

  let previousTime = 0;
  const autoScroll = (currentTime) => {
    const elapsed = previousTime ? Math.min(currentTime - previousTime, 50) : 0;
    previousTime = currentTime;
    const expanded = Boolean(marquee.closest('.is-expanded'));

    if (!expanded && !dragging && Date.now() >= pauseUntil && !document.hidden) {
      const cycleWidth = getCycleWidth(marquee);
      if (cycleWidth) {
        marquee.scrollLeft += elapsed * (reverse ? -0.04 : 0.04);
        if (marquee.scrollLeft >= cycleWidth) marquee.scrollLeft -= cycleWidth;
        if (marquee.scrollLeft <= 0 && reverse) marquee.scrollLeft += cycleWidth;
      }
    }
    requestAnimationFrame(autoScroll);
  };

  requestAnimationFrame(autoScroll);
}
