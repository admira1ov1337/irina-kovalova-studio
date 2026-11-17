/* Мобильное меню */
const burger = document.querySelector('.burger');
const nav = document.querySelector('#nav');

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
