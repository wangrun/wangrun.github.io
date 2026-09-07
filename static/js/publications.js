const publicationToggle = document.querySelector('[data-publication-toggle]');
const earlierPublications = document.querySelector('[data-earlier]');
const publicationToggleLabel = document.querySelector('[data-toggle-label]');

function setEarlierPublications(open, shouldScroll = false) {
  if (!publicationToggle || !earlierPublications || !publicationToggleLabel) return;
  earlierPublications.classList.toggle('is-open', open);
  publicationToggle.setAttribute('aria-expanded', String(open));
  publicationToggleLabel.textContent = open ? 'Hide earlier work' : 'Show earlier work';
  if (shouldScroll) {
    const target = open ? earlierPublications : publicationToggle;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

publicationToggle?.addEventListener('click', () => {
  setEarlierPublications(publicationToggle.getAttribute('aria-expanded') !== 'true', true);
});

if (/^#year-202[0-2]$/.test(window.location.hash)) {
  setEarlierPublications(true);
}
