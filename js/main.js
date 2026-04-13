/* ============================================================
   BASE MODEL WORLD — main.js
   - Scroll-triggered reveal animations
   - Lightbox with prev/next navigation
   - Hero image load animation
   - Smooth scroll
   ============================================================ */

// ---- CAR DATA ----
const carData = {
  ferrari: {
    name: 'Ferrari 360 Modena',
    caption: 'The Ferrari 360 Modena doesn\'t perform. It has a 3.6 V8, a manual box, and nothing to prove. Modern Ferrari is extraordinary. Also exhausting. This exists because basic still beats complicated.',
    images: [
      'img/ferrari-360-front.png',
      'img/ferrari-360-side.png',
      'img/ferrari-360-rear.png',
    ]
  },
  porsche: {
    name: 'Porsche 911 Carrera',
    caption: 'The 911 everyone ignores. This is a Carrera. Not a Turbo. Not a GT3. Not a T. Steel wheels, black plastic mirrors, cloth seats. Strip the mythology and the 911\'s form is still the argument.',
    images: [
      'img/porsche-911-hero.png',
      'img/porsche-911-alt-1.png',
      'img/porsche-911-alt-2.png',
      'img/porsche-911-alt-3.png',
    ]
  },
  mclaren: {
    name: 'McLaren P1',
    caption: 'Not the loudest. Not the fastest. But the one that makes you question what you\'re actually looking at.',
    images: [
      'img/mclaren-p1-hero.png',
      'img/mclaren-p1-alt-1.png',
      'img/mclaren-p1-alt-2.png',
      'img/mclaren-p1-alt-3.png',
    ]
  },
  bentley: {
    name: 'Bentley Flying Spur',
    caption: 'A saloon that refuses to be ordinary. The Flying Spur proves that restraint is its own form of ambition.',
    images: [
      'img/bentley-flying-spur-hero.png',
      'img/bentley-flying-spur-alt-1.png',
      'img/bentley-flying-spur-alt-2.png',
      'img/bentley-flying-spur-alt-3.png',
    ]
  }
};

// ---- SCROLL REVEAL ----
function initReveal() {
  const items = document.querySelectorAll('.reveal-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(item => observer.observe(item));
}

// ---- HERO IMAGE LOAD ----
function initHero() {
  const heroImg = document.getElementById('hero-img');
  if (!heroImg) return;

  if (heroImg.complete) {
    heroImg.classList.add('loaded');
  } else {
    heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  }
}

// ---- LIGHTBOX ----
let currentCar = null;
let currentIndex = 0;

const lightbox = document.getElementById('lightbox');
const lbHero = document.getElementById('lb-hero');
const lbTitle = document.getElementById('lb-title');
const lbThumbs = document.getElementById('lb-thumbs');
const lbCaption = document.getElementById('lb-caption');

function openLightbox(carKey, index) {
  currentCar = carData[carKey];
  currentIndex = index;
  renderLightbox();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => {
    lbHero.src = '';
    lbThumbs.innerHTML = '';
  }, 400);
}

function renderLightbox() {
  lbHero.src = currentCar.images[currentIndex];
  lbHero.alt = currentCar.name;
  lbTitle.textContent = currentCar.name;
  lbCaption.textContent = currentCar.caption;

  lbThumbs.innerHTML = '';
  currentCar.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${currentCar.name} — ${i + 1}`;
    if (i === currentIndex) img.classList.add('active');
    img.addEventListener('click', () => {
      currentIndex = i;
      renderLightbox();
    });
    lbThumbs.appendChild(img);
  });

  // Scroll active thumb into view
  const active = lbThumbs.querySelector('.active');
  if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function lbNext() {
  currentIndex = (currentIndex + 1) % currentCar.images.length;
  renderLightbox();
}

function lbPrev() {
  currentIndex = (currentIndex - 1 + currentCar.images.length) % currentCar.images.length;
  renderLightbox();
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initHero();

  // Car cards
  document.querySelectorAll('.car-card').forEach(card => {
    const carKey = card.dataset.car;
    if (!carData[carKey]) return;

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('click', () => openLightbox(carKey, 0));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(carKey, 0);
      }
    });
  });

  // Lightbox controls
  document.querySelector('.lb-close').addEventListener('click', closeLightbox);
  document.querySelector('.lb-next').addEventListener('click', lbNext);
  document.querySelector('.lb-prev').addEventListener('click', lbPrev);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') lbNext();
    if (e.key === 'ArrowLeft')  lbPrev();
  });

  // Nav active link — highlight based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active',
            link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => navObserver.observe(section));
});
