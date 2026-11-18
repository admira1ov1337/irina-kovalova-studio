/* Мобильное меню */
const burger = document.querySelector('.burger');
const nav = document.querySelector('#nav');

function clearAnchorFromAddressBar() {
  if (!window.location.hash) return;

  const cleanUrl = window.location.pathname + window.location.search;
  window.history.replaceState(window.history.state, '', cleanUrl);
}

window.addEventListener('hashchange', clearAnchorFromAddressBar);
clearAnchorFromAddressBar();

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
}

burger.addEventListener('click', () => {
  setMenu(!nav.classList.contains('is-open'));
});

// Закрываем меню после клика по пункту
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenu(false);
    burger.focus();
  }
});

// На десктопе меню всегда открыто, сбрасываем состояние
window.matchMedia('(min-width: 1024px)').addEventListener('change', () => setMenu(false));

/* Перевертання фото результатів */
document.querySelectorAll('.result-card').forEach((card, index) => {
  const front = card.querySelector('.result-card__face--front');
  const back = card.querySelector('.result-card__face--back');

  card.addEventListener('click', () => {
    card.classList.add('has-interacted');
    const isFlipped = card.classList.toggle('is-flipped');

    card.setAttribute('aria-pressed', String(isFlipped));
    card.setAttribute(
      'aria-label',
      `Результат ${index + 1}. Показати фото ${isFlipped ? 'до' : 'після'}`
    );
    front.setAttribute('aria-hidden', String(isFlipped));
    back.setAttribute('aria-hidden', String(!isFlipped));
  });
});

/* Перемикання категорій зачісок */
const hairstyleTabs = Array.from(document.querySelectorAll('.hairstyle-tab'));
const hairstylePanels = hairstyleTabs.map((tab) =>
  document.getElementById(tab.getAttribute('aria-controls'))
);

function activateHairstyleTab(activeIndex) {
  hairstyleTabs.forEach((tab, index) => {
    const isActive = index === activeIndex;

    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    hairstylePanels[index].hidden = !isActive;
  });
}

hairstyleTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateHairstyleTab(index));

  tab.addEventListener('keydown', (event) => {
    let nextIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % hairstyleTabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + hairstyleTabs.length) % hairstyleTabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = hairstyleTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    hairstyleTabs[nextIndex].focus();
    activateHairstyleTab(nextIndex);
  });
});

/* Плавна поява під час прокручування */
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if ('IntersectionObserver' in window && !motionPreference.matches) {
  const revealItems = document.querySelectorAll([
    '.section > .eyebrow',
    '.section > h2',
    '#pro-nas > p:not(.eyebrow)',
    '.facts li',
    '.service-card',
    '.result-card',
    '.technique-card',
    '.hairstyle-intro',
    '.hairstyle-tabs',
    '.review-card',
    '.contact-info',
    '.contact-map',
  ].join(', '));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const item = entry.target;
      item.classList.remove('reveal-pending');
      item.classList.add('reveal-entering');
      observer.unobserve(item);
    });
  }, { rootMargin: '0px 0px -24px 0px' });

  revealItems.forEach((item) => {
    if (item.getBoundingClientRect().top < window.innerHeight) return;

    const siblings = Array.from(item.parentElement.children);
    item.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(item), 2) * 80}ms`);
    item.classList.add('reveal-pending');
    revealObserver.observe(item);

    item.addEventListener('focusin', () => {
      item.classList.remove('reveal-pending', 'reveal-entering');
      revealObserver.unobserve(item);
    });

    item.addEventListener('animationend', (event) => {
      if (event.target === item && event.animationName === 'reveal-up') {
        item.classList.remove('reveal-entering');
      }
    });
  });

  motionPreference.addEventListener('change', (event) => {
    if (!event.matches) return;

    revealObserver.disconnect();
    revealItems.forEach((item) => item.classList.remove('reveal-pending', 'reveal-entering'));
  });
}
