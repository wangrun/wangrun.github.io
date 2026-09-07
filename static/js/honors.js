const achievementToggle = document.querySelector('[data-achievement-toggle]');
const earlierAchievements = document.querySelector('[data-earlier-achievements]');
const achievementLabel = document.querySelector('[data-achievement-label]');
const achievementMeta = document.querySelector('[data-achievement-meta]');
const honorsToggle = document.querySelector('[data-honors-toggle]');
const earlierHonors = document.querySelector('[data-earlier-honors]');
const honorsLabel = document.querySelector('[data-honors-label]');
const honorsMeta = document.querySelector('[data-honors-meta]');

function setHonorsExpanded(expanded, scrollToToggle = false) {
  earlierHonors?.classList.toggle('is-open', expanded);
  honorsToggle?.setAttribute('aria-expanded', String(expanded));

  if (honorsLabel) honorsLabel.textContent = expanded ? 'Show top honors' : 'View all honors';
  if (honorsMeta) honorsMeta.textContent = expanded ? '2023–2026 · 10 highlighted honors' : '2017–2023 · 11 earlier honors';

  if (scrollToToggle && !expanded) honorsToggle?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

honorsToggle?.addEventListener('click', () => {
  setHonorsExpanded(honorsToggle.getAttribute('aria-expanded') !== 'true', true);
});

function setAchievementsExpanded(expanded, scrollToToggle = false) {
  earlierAchievements?.classList.toggle('is-open', expanded);
  achievementToggle?.setAttribute('aria-expanded', String(expanded));

  if (achievementLabel) achievementLabel.textContent = expanded ? 'Show recent achievements' : 'View earlier achievements';
  if (achievementMeta) achievementMeta.textContent = expanded ? '2024–2026 · 17 recent achievements' : '2022–2023 · 13 achievements';

  if (scrollToToggle && !expanded) achievementToggle?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

achievementToggle?.addEventListener('click', () => {
  setAchievementsExpanded(achievementToggle.getAttribute('aria-expanded') !== 'true', true);
});

if (/^#year-(?:2022|2023)$/.test(window.location.hash)) setAchievementsExpanded(true);
