const catalogue = document.querySelector('[data-catalogue]');

if (catalogue) {
  const controls = catalogue.querySelector('[data-controls]');
  const filters = [...catalogue.querySelectorAll('[data-filter]')];
  const cards = [...catalogue.querySelectorAll('[data-category]')];
  const search = catalogue.querySelector('input[type="search"]');
  const results = catalogue.querySelector('[data-results]');
  const empty = catalogue.querySelector('[data-empty]');
  const normalize = (value) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const records = cards.map((card) => ({
    card,
    category: card.dataset.category,
    text: normalize(`${card.textContent} ${card.dataset.search}`),
  }));
  let category = 'all';

  function filterCatalogue() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const record of records) {
      const visible = (category === 'all' || category === record.category)
        && terms.every((term) => record.text.includes(term));
      record.card.hidden = !visible;
      if (visible) count++;
    }
    results.textContent = `${count} ${count === 1 ? 'product' : 'products'}`;
    empty.hidden = count !== 0;
  }

  function selectCategory(filter) {
    category = filter.dataset.filter;
    filters.forEach((button) => button.setAttribute('aria-pressed', String(button === filter)));
    filterCatalogue();
  }

  filters.forEach((filter) => filter.addEventListener('click', () => selectCategory(filter)));
  search.addEventListener('input', filterCatalogue);
  window.addEventListener('pageshow', filterCatalogue);
  empty.querySelector('button').addEventListener('click', () => {
    search.value = '';
    selectCategory(filters[0]);
    search.focus();
  });
  controls.hidden = false;
  filterCatalogue();
}

const contact = document.querySelector('[data-contact]');
if (contact) {
  contact.hidden = false;
  contact.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contact);
    const project = data.get('project');
    const subject = encodeURIComponent(project ? `Project inquiry – ${project}` : 'Project inquiry');
    const extra = [
      ['Phone', data.get('phone').trim()],
      ['Indicative budget', data.get('budget')],
    ].filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`);
    const signature = [data.get('name').trim(), data.get('email').trim(), ...extra];
    const body = encodeURIComponent(`${data.get('message').trim()}\n\n${signature.join('\n')}`);
    window.location.href = `mailto:${contact.dataset.contact}?subject=${subject}&body=${body}`;
  });
}

for (const gallery of document.querySelectorAll('[data-gallery]')) {
  const controls = gallery.querySelector('[data-gallery-controls]');
  const buttons = [...controls.querySelectorAll('button')];
  const slides = [...gallery.querySelectorAll('figure')];
  function showSlide(index) {
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => showSlide(index)));
  showSlide(0);
  controls.hidden = false;
}

const download = document.querySelector('[data-download]');
if (download && typeof download.showModal === 'function') {
  const opener = document.querySelector('[data-open-download]');
  opener.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    download.showModal();
  });
  download.addEventListener('click', (event) => {
    if (event.target === download) download.close();
  });
}

const motion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('reveal-in');
      observer.unobserve(entry.target);
    }
  }, { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
}
