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
const revealItems = Array.from(document.querySelectorAll([
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
].join(', ')));
let revealObserver = null;

function startRevealAnimations() {
  if (!('IntersectionObserver' in window) || motionPreference.matches || revealObserver) return;

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const item = entry.target;

      if (entry.isIntersecting) {
        if (!item.classList.contains('reveal-pending')) return;

        item.classList.remove('reveal-pending', 'reveal-entering');
        void item.offsetWidth;
        item.classList.add('reveal-entering');
        return;
      }

      if (!item.matches(':focus-within')) {
        item.classList.remove('reveal-entering');
        item.classList.add('reveal-pending');
      }
    });
  }, { rootMargin: '0px 0px -24px 0px', threshold: 0.08 });

  revealItems.forEach((item) => {
    const siblings = Array.from(item.parentElement.children);
    item.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(item), 2) * 80}ms`);
    const bounds = item.getBoundingClientRect();
    const initiallyVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;

    if (!initiallyVisible && !item.matches(':focus-within')) {
      item.classList.add('reveal-pending');
    }

    revealObserver.observe(item);
    item.addEventListener('animationend', (event) => {
      if (
        event.target === item
        && (event.animationName === 'reveal-up' || event.animationName === 'reveal-card')
      ) {
        item.classList.remove('reveal-entering');
      }
    });
  });
}

function stopRevealAnimations() {
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }

  revealItems.forEach((item) => {
    item.classList.remove('reveal-pending', 'reveal-entering');
  });
}

document.addEventListener('focusin', (event) => {
  const item = event.target.closest('.reveal-pending');
  if (!item) return;

  item.classList.remove('reveal-pending', 'reveal-entering');
  if (revealObserver) revealObserver.unobserve(item);
});

motionPreference.addEventListener('change', (event) => {
  if (event.matches) {
    stopRevealAnimations();
  } else {
    startRevealAnimations();
  }
});

startRevealAnimations();
