const newsFilterButtons = [...document.querySelectorAll('[data-news-filter]')];
const newsItems = [...document.querySelectorAll('[data-news-item]')];
const newsYears = [...document.querySelectorAll('[data-news-year]')];
const newsStatus = document.querySelector('[data-news-status]');
const olderNews = document.querySelector('[data-older-news]');
const newsArchiveToggle = document.querySelector('[data-news-archive-toggle]');
const newsArchiveLabel = document.querySelector('[data-news-archive-label]');
const newsArchiveMeta = document.querySelector('[data-news-archive-meta]');
let activeNewsFilter = 'all';
let olderNewsExpanded = false;

function filterNews(category) {
  activeNewsFilter = category;
  let visibleCount = 0;

  newsItems.forEach((item) => {
    const visible = category === 'all' || item.dataset.newsItem === category;
    item.hidden = !visible;
    const inOlderNews = olderNews?.contains(item);
    if (visible && (!inOlderNews || olderNewsExpanded)) visibleCount += 1;
  });

  newsYears.forEach((year) => {
    year.hidden = !year.querySelector('[data-news-item]:not([hidden])');
  });

  newsFilterButtons.forEach((button) => {
    const active = button.dataset.newsFilter === category;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  if (newsStatus) newsStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'update' : 'updates'}`;
}

newsFilterButtons.forEach((button) => {
  button.addEventListener('click', () => filterNews(button.dataset.newsFilter));
});

function setOlderNews(expanded, scrollToToggle = false) {
  olderNewsExpanded = expanded;
  olderNews?.classList.toggle('is-open', expanded);
  newsArchiveToggle?.setAttribute('aria-expanded', String(expanded));

  if (newsArchiveLabel) newsArchiveLabel.textContent = expanded ? 'Show recent updates' : 'View all updates';
  if (newsArchiveMeta) newsArchiveMeta.textContent = expanded ? '2024–2026 · 26 recent updates' : '2018–2023 · 27 earlier updates';

  filterNews(activeNewsFilter);
  if (scrollToToggle && !expanded) newsArchiveToggle?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

newsArchiveToggle?.addEventListener('click', () => {
  setOlderNews(newsArchiveToggle.getAttribute('aria-expanded') !== 'true', true);
});

if (/^#year-(?:2018|2019|2020|2021|2022|2023)$/.test(window.location.hash)) {
  setOlderNews(true);
} else {
  filterNews('all');
}
