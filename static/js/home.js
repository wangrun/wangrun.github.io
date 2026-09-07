document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

function setMenu(open) {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

nav?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

function syncHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 16);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

const revealItems = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  revealItems.forEach((item) => observer.observe(item));
}

document.querySelectorAll('[data-email]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    try {
      window.location.href = `mailto:${window.atob(link.dataset.email)}`;
    } catch {
      document.querySelector('#contact-details')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
