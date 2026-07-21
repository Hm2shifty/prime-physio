/* ==========================================
   PRIME PHYSIOTHERAPY INTERACTIVE ENGINE
   Author: Antigravity AI
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initTeamFilter();
  initReviewFilter();
  initBookingModal();
});

/* --- Header Scroll Effect --- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately in case page is refreshed while scrolled
}

/* --- Mobile Nav Drawer --- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  const toggleDrawer = () => {
    menuToggle.classList.toggle('active');
    mobileDrawer.classList.toggle('active');
  };

  const closeDrawer = () => {
    menuToggle.classList.remove('active');
    mobileDrawer.classList.remove('active');
  };

  menuToggle.addEventListener('click', toggleDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      const targetId = link.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });
}

/* --- Team Member Filtering --- */
function initTeamFilter() {
  const filterButtons = document.querySelectorAll('.team-filters .filter-btn');
  const teamCards = document.querySelectorAll('#teamGrid .team-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      teamCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden-filter');
        } else {
          card.classList.add('hidden-filter');
        }
      });
    });
  });
}

/* --- Google Reviews Filtering --- */
function initReviewFilter() {
  const filterButtons = document.querySelectorAll('.review-filters .filter-btn');
  const reviewCards = document.querySelectorAll('#reviewsGrid .review-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-review-filter');
      
      reviewCards.forEach(card => {
        const reviewCategory = card.getAttribute('data-review-cat');
        
        if (filterValue === 'all' || reviewCategory === filterValue) {
          card.classList.remove('hidden-filter');
        } else {
          card.classList.add('hidden-filter');
        }
      });
    });
  });
}

/* --- Booking Modal Controller --- */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openButtons = document.querySelectorAll('.open-booking-btn');
  const closeButton = document.getElementById('closeModalBtn');
  
  const step1 = document.getElementById('modalStep1');
  const step2 = document.getElementById('modalStep2');
  const step3 = document.getElementById('modalStep3');
  
  const proceedMississauga = document.getElementById('proceedMississaugaForm');
  const backTo1 = document.getElementById('backToStep1');
  const finishBooking = document.getElementById('finishBookingBtn');
  const form = document.getElementById('mississaugaBookingForm');

  const openModal = (presetLocation) => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    // Reset steps
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    form.reset();

    // If pre-selected Mississauga location, jump straight to its form
    if (presetLocation === 'mississauga') {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    } else if (presetLocation === 'aurora') {
      // If Aurora is clicked, we can redirect directly to their JaneApp portal or show step 1
      // For a better UX, we'll keep the step 1 select open, but flash/outline the Aurora option
      const optAurora = document.getElementById('optionAurora');
      optAurora.focus();
      optAurora.style.borderColor = 'var(--color-accent)';
      setTimeout(() => {
        optAurora.style.borderColor = 'var(--color-border)';
      }, 1000);
    }
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Unlock background scroll
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset-location');
      openModal(preset);
    });
  });

  closeButton.addEventListener('click', closeModal);
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Step Transitions
  proceedMississauga.addEventListener('click', () => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  });

  backTo1.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
  });

  // Form submission simulation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate API call / save
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
  });

  finishBooking.addEventListener('click', closeModal);
}

/* --- Scroll Helper --- */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  const headerOffset = 76; // Match header height
  const elementPosition = section.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}
