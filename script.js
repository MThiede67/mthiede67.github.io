const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('nav-open');
    navToggle.textContent = siteNav.classList.contains('nav-open') ? 'Close' : 'Menu';
  });
}

const yearElement = document.getElementById('currentYear');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Gallery filtering + load-more
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const BATCH_SIZE = 24;
let currentFilter = 'all';
let shownCount = 0;

function getMatchingItems(filter) {
  return Array.from(galleryItems).filter(item =>
    filter === 'all' || item.getAttribute('data-category') === filter
  );
}

function renderBatch(filter, reset) {
  const matching = getMatchingItems(filter);
  if (reset) shownCount = 0;
  const nextCount = Math.min(shownCount + BATCH_SIZE, matching.length);

  galleryItems.forEach(item => item.classList.add('hidden'));
  for (let i = 0; i < nextCount; i++) {
    matching[i].classList.remove('hidden');
  }
  shownCount = nextCount;

  // Load More button
  const loadMoreWrapper = document.getElementById('galleryLoadMore');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const countLabel = document.getElementById('galleryCountLabel');
  if (loadMoreWrapper) {
    if (shownCount < matching.length) {
      loadMoreWrapper.style.display = 'block';
      if (countLabel) countLabel.textContent = `Showing ${shownCount} of ${matching.length} projects`;
    } else {
      loadMoreWrapper.style.display = shownCount > BATCH_SIZE ? 'block' : 'none';
      if (countLabel) countLabel.textContent = `Showing all ${matching.length} projects`;
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
  }
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    currentFilter = btn.getAttribute('data-filter');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) loadMoreBtn.style.display = '';
    renderBatch(currentFilter, true);
  });
});

const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    renderBatch(currentFilter, false);
  });
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => renderBatch('all', true));
} else {
  renderBatch('all', true);
}

// Lightbox functionality
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <div class="lightbox-content">
    <button class="lightbox-close">&times;</button>
    <button class="lightbox-prev">&#10094;</button>
    <img class="lightbox-image" src="" alt="">
    <button class="lightbox-next">&#10095;</button>
    <div class="lightbox-caption"></div>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');

let currentImageIndex = 0;
let visibleItems = [];

function updateVisibleItems() {
  visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
}

function openLightbox(index) {
  currentImageIndex = index;
  const item = visibleItems[index];
  const img = item.querySelector('img');
  const caption = item.querySelector('figcaption');

  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : img.alt;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function showPreviousImage() {
  currentImageIndex = (currentImageIndex - 1 + visibleItems.length) % visibleItems.length;
  const item = visibleItems[currentImageIndex];
  const img = item.querySelector('img');
  const caption = item.querySelector('figcaption');
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : img.alt;
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % visibleItems.length;
  const item = visibleItems[currentImageIndex];
  const img = item.querySelector('img');
  const caption = item.querySelector('figcaption');
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : img.alt;
}

// Click on gallery items to open lightbox (use delegation for dynamic show/hide)
document.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (!item || item.classList.contains('hidden')) return;
  updateVisibleItems();
  const visibleIndex = visibleItems.indexOf(item);
  if (visibleIndex !== -1) openLightbox(visibleIndex);
});

// Lightbox controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPreviousImage);
lightboxNext.addEventListener('click', showNextImage);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPreviousImage();
  if (e.key === 'ArrowRight') showNextImage();
});

// Testimonials carousel
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');

let currentTestimonial = 0;

function showTestimonial(index) {
  testimonialSlides.forEach(slide => slide.classList.remove('active'));
  testimonialDots.forEach(dot => dot.classList.remove('active'));
  
  testimonialSlides[index].classList.add('active');
  testimonialDots[index].classList.add('active');
  currentTestimonial = index;
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
    showTestimonial(currentTestimonial);
  });

  nextBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
    showTestimonial(currentTestimonial);
  });
}

// Dot navigation
testimonialDots.forEach(dot => {
  dot.addEventListener('click', () => {
    showTestimonial(parseInt(dot.getAttribute('data-slide')));
  });
});

// Auto-rotate testimonials every 8 seconds
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
  showTestimonial(currentTestimonial);
}, 8000);
