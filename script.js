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

// Gallery filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryGrid = document.querySelector('.gallery-grid');

// Initialize gallery - show all projects by default
function initializeGallery() {
  galleryItems.forEach(item => {
    item.classList.remove('hidden');
  });
}

// Show all projects function
function showAllProjects() {
  filterBtns.forEach(b => b.classList.remove('active'));
  const allBtn = document.querySelector('[data-filter="all"]');
  if (allBtn) allBtn.classList.add('active');
  
  galleryItems.forEach((item, index) => {
    item.classList.remove('hidden');
    item.style.animation = 'none';
    setTimeout(() => {
      item.style.animation = 'fadeIn 0.3s ease';
    }, index * 50);
  });
}

// Filter button click handlers
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.getAttribute('data-filter');
    
    galleryItems.forEach((item, index) => {
      const itemCategory = item.getAttribute('data-category');
      
      if (filter === 'all' || itemCategory === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'none';
        setTimeout(() => {
          item.style.animation = 'fadeIn 0.3s ease';
        }, index * 30);
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// Initialize gallery on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGallery);
} else {
  initializeGallery();
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
  lightboxCaption.textContent = caption.textContent;
  
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
  lightboxCaption.textContent = caption.textContent;
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % visibleItems.length;
  const item = visibleItems[currentImageIndex];
  const img = item.querySelector('img');
  const caption = item.querySelector('figcaption');
  
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = caption.textContent;
}

// Click on gallery items to open lightbox
galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    updateVisibleItems();
    const visibleIndex = visibleItems.indexOf(item);
    openLightbox(visibleIndex);
  });
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
