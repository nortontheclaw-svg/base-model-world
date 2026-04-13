const cars = {
  ferrari: {
    name: "Ferrari 360 Modena",
    caption: "The Ferrari 360 Modena doesn't perform. It has a 3.6 V8, a manual box, and nothing to prove. Modern Ferrari is extraordinary. Also exhausting. This exists because basic still beats complicated.",
    images: [
      "img/ferrari-360-front.png",
      "img/ferrari-360-side.png",
      "img/ferrari-360-rear.png"
    ]
  },
  porsche: {
    name: "Porsche 911 Carrera",
    caption: "The 911 everyone ignores. This is a Carrera. Not a Turbo. Not a GT3. Not a T. Steel wheels, black plastic mirrors, cloth seats. Strip the mythology and the 911's form is still the argument.",
    images: [
      "img/porsche-911-hero.png",
      "img/porsche-911-alt-1.png",
      "img/porsche-911-alt-2.png",
      "img/porsche-911-alt-3.png"
    ]
  },
  mclaren: {
    name: "McLaren P1",
    caption: "Not the loudest. Not the fastest. But the one that makes you question what you're actually looking at.",
    images: [
      "img/mclaren-p1-hero.png",
      "img/mclaren-p1-alt-1.png",
      "img/mclaren-p1-alt-2.png",
      "img/mclaren-p1-alt-3.png"
    ]
  },
  bentley: {
    name: "Bentley Flying Spur",
    caption: "A saloon that refuses to be ordinary. The Flying Spur proves that restraint is its own form of ambition.",
    images: [
      "img/bentley-flying-spur-hero.png",
      "img/bentley-flying-spur-alt-1.png",
      "img/bentley-flying-spur-alt-2.png",
      "img/bentley-flying-spur-alt-3.png"
    ]
  }
};

const state = {
  carKey: null,
  imageIndex: 0,
  lastFocus: null
};

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxThumbs = document.getElementById("lightboxThumbs");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeButton = document.querySelector(".lightbox-close");
const nextButton = document.querySelector(".lightbox-next");
const prevButton = document.querySelector(".lightbox-prev");

function initHeroLoad() {
  const heroImage = document.getElementById("heroImage");
  if (!heroImage) return;

  const markLoaded = () => requestAnimationFrame(() => heroImage.classList.add("is-loaded"));
  if (heroImage.complete) {
    markLoaded();
  } else {
    heroImage.addEventListener("load", markLoaded, { once: true });
  }
}

function initReveals() {
  const revealItems = Array.from(document.querySelectorAll(".reveal-item"));

  revealItems.forEach((item) => {
    const siblings = Array.from(item.parentElement?.querySelectorAll(":scope > .reveal-item") || []);
    const delayIndex = Math.max(0, siblings.indexOf(item));
    item.style.setProperty("--reveal-delay", `${delayIndex * 0.07}s`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -12% 0px"
  });

  revealItems.forEach((item) => observer.observe(item));
}

function activeCar() {
  return cars[state.carKey];
}

function renderLightbox() {
  const car = activeCar();
  if (!car) return;

  const imageSrc = car.images[state.imageIndex];
  lightboxImage.src = imageSrc;
  lightboxImage.alt = `${car.name} image ${state.imageIndex + 1}`;
  lightboxTitle.textContent = car.name;
  lightboxCaption.textContent = car.caption;
  lightboxThumbs.innerHTML = "";

  car.images.forEach((src, index) => {
    const button = document.createElement("button");
    const thumb = document.createElement("img");

    button.type = "button";
    button.className = index === state.imageIndex ? "is-active" : "";
    button.setAttribute("aria-label", `View image ${index + 1} of ${car.name}`);
    button.setAttribute("aria-current", index === state.imageIndex ? "true" : "false");
    button.addEventListener("click", () => {
      state.imageIndex = index;
      renderLightbox();
    });

    thumb.src = src;
    thumb.alt = "";
    thumb.loading = "lazy";
    button.appendChild(thumb);
    lightboxThumbs.appendChild(button);
  });
}

function openLightbox(carKey, trigger) {
  if (!cars[carKey]) return;
  state.carKey = carKey;
  state.imageIndex = 0;
  state.lastFocus = trigger || document.activeElement;
  renderLightbox();
  document.body.classList.add("lightbox-open");
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  window.setTimeout(() => {
    if (!lightbox.classList.contains("is-open")) {
      lightboxImage.removeAttribute("src");
      lightboxThumbs.innerHTML = "";
    }
  }, 350);

  if (state.lastFocus && typeof state.lastFocus.focus === "function") {
    state.lastFocus.focus();
  }
}

function moveImage(direction) {
  const car = activeCar();
  if (!car) return;
  state.imageIndex = (state.imageIndex + direction + car.images.length) % car.images.length;
  renderLightbox();
}

function initCards() {
  document.querySelectorAll(".car-card").forEach((card) => {
    card.addEventListener("click", () => openLightbox(card.dataset.car, card));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLightbox(card.dataset.car, card);
    });
  });
}

function initLightbox() {
  closeButton.addEventListener("click", closeLightbox);
  nextButton.addEventListener("click", () => moveImage(1));
  prevButton.addEventListener("click", () => moveImage(-1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      moveImage(1);
    }

    if (event.key === "ArrowLeft") {
      moveImage(-1);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroLoad();
  initReveals();
  initCards();
  initLightbox();
});
