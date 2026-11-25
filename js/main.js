const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobileLayout = window.matchMedia('(max-width: 1080px)');

function setMenu(open) {
  header.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuButton.firstElementChild.textContent = open ? '×' : '☰';
}

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 12);
}

function updateActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const locationKey = page + location.hash;
  const links = [...navigation.querySelectorAll('a:not(.button)')];
  const section = links.find(link => {
    const href = link.getAttribute('href');
    return href.startsWith('#') ? href === location.hash : href === locationKey;
  });

  for (const link of links) {
    link.removeAttribute('aria-current');
    if (link === section) link.setAttribute('aria-current', location.hash ? 'location' : 'page');
    if (!section && link.getAttribute('href') === page) link.setAttribute('aria-current', 'page');
  }
}

menuButton.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) {
    setMenu(false);
    menuButton.focus();
  }
});
mobileLayout.addEventListener('change', () => setMenu(false));
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('hashchange', updateActiveLink);
updateHeader();
updateActiveLink();
window.lucide?.createIcons();

const video = document.querySelector('#hero-video');
const videoToggle = document.querySelector('#video-toggle');

if (video && videoToggle) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateVideoControl() {
    videoToggle.textContent = video.paused ? 'Play background video' : 'Pause background video';
  }

  video.addEventListener('loadeddata', () => {
    videoToggle.hidden = false;
    updateVideoControl();
  });
  video.addEventListener('error', () => {
    video.hidden = true;
    videoToggle.hidden = true;
  });
  video.addEventListener('play', updateVideoControl);
  video.addEventListener('pause', updateVideoControl);
  videoToggle.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(updateVideoControl);
    } else {
      video.pause();
    }
  });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) video.pause();
  });

  video.autoplay = !reducedMotion.matches;
  video.preload = 'auto';
  video.src = video.dataset.src;
}


const projectFilters = document.querySelector('.project-filters');

if (projectFilters) {
  const buttons = [...projectFilters.querySelectorAll('button')];
  const cards = [...document.querySelectorAll('[data-category]')];
  projectFilters.hidden = false;
  projectFilters.addEventListener('click', event => {
    const selected = event.target.closest('button[data-filter]');
    if (!selected) return;
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button === selected));
    }
    for (const card of cards) {
      card.hidden = selected.dataset.filter !== 'all' && card.dataset.category !== selected.dataset.filter;
    }
  });
}

function openLinkedEntry() {
  const id = location.hash.slice(1);
  if (!id) return;
  const entry = document.getElementById(id);
  if (entry?.matches('.concept-collection')) {
    if (entry.hidden) projectFilters.querySelector('[data-filter="all"]').click();
    entry.open = true;
    return;
  }
  const card = entry?.closest('article');
  const details = card?.querySelector('details');
  if (details) details.open = true;
}

window.addEventListener('hashchange', openLinkedEntry);
openLinkedEntry();

const search = document.querySelector('#insights-query');
if (search) {
  const articles = [...document.querySelectorAll('.insight-card')];
  const searchCount = document.querySelector('.search-count');
  search.closest('.insights-search').hidden = false;
  search.addEventListener('input', () => {
    const keywords = search.value.toLowerCase().trim().split(/\s+/);
    let visible = 0;
    for (const article of articles) {
      const content = article.textContent.toLowerCase();
      article.hidden = !keywords.every(keyword => content.includes(keyword));
      if (!article.hidden) visible++;
    }
    searchCount.textContent = visible === 0 ? 'No articles match. Try another topic.' : `${visible} ${visible === 1 ? 'article' : 'articles'}`;
  });
}

const enquiry = document.querySelector('.enquiry-form');
if (enquiry) {
  const service = new URLSearchParams(location.search).get('service');
  if (['Event', 'Exhibition', 'Decoration'].includes(service)) {
    enquiry.elements.namedItem('service').value = service;
  }
  enquiry.hidden = false;
  enquiry.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(enquiry);
    const subject = `Project enquiry: ${data.get('service')}`;
    const body = [
      `Name: ${data.get('name').trim()}`,
      `Email: ${data.get('email').trim()}`,
      `Service: ${data.get('service')}`,
      '',
      data.get('brief').trim()
    ].join('\r\n');
    window.location.href = `mailto:helveticaworks@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

