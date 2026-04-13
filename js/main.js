// Car data — captions from vault
const carData = {
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

// Lightbox state
let currentCar = null;
let currentIndex = 0;

const lightbox = document.getElementById('lightbox');
const lbHero = document.getElementById('lb-hero');
const lbThumbs = document.getElementById('lb-thumbs');
const lbCaption = document.getElementById('lb-caption');

// Open lightbox
function openLightbox(carKey, index) {
  currentCar = carData[carKey];
  currentIndex = index;
  renderLightbox();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Render lightbox content
function renderLightbox() {
  lbHero.src = currentCar.images[currentIndex];
  lbHero.alt = currentCar.name;

  lbCaption.textContent = currentCar.caption;

  // Build thumbs
  lbThumbs.innerHTML = '';
  currentCar.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${currentCar.name} angle ${i + 1}`;
    if (i === currentIndex) img.classList.add('active');
    img.addEventListener('click', () => {
      currentIndex = i;
      renderLightbox();
    });
    lbThumbs.appendChild(img);
  });
}

// Navigate
function lbNext() {
  currentIndex = (currentIndex + 1) % currentCar.images.length;
  renderLightbox();
}

function lbPrev() {
  currentIndex = (currentIndex - 1 + currentCar.images.length) % currentCar.images.length;
  renderLightbox();
}

// Event listeners
document.querySelectorAll('.car-card').forEach(card => {
  card.addEventListener('click', () => {
    const carKey = card.dataset.car;
    if (carData[carKey]) openLightbox(carKey, 0);
  });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const carKey = card.dataset.car;
      if (carData[carKey]) openLightbox(carKey, 0);
    }
  });
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-next').addEventListener('click', lbNext);
document.querySelector('.lightbox-prev').addEventListener('click', lbPrev);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lbNext();
  if (e.key === 'ArrowLeft') lbPrev();
});
