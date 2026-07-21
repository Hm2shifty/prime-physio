/* ==========================================
   PRIME PHYSIOTHERAPY INTERACTIVE ENGINE
   Author: Antigravity AI
   ========================================== */

let siteData = null;

document.addEventListener('DOMContentLoaded', async () => {
  initHeaderScroll();
  initMobileMenu();
  initBookingModal();

  // Load central site data from data.json
  try {
    const response = await fetch('data.json');
    siteData = await response.json();
    
    // Page-specific renders
    if (document.getElementById('reviewsMarquee')) renderMarquee(siteData.reviews);
    if (document.getElementById('servicesGrid')) renderServices(siteData.services);
    if (document.getElementById('teamGrid')) renderTeam(siteData.team);
    if (document.getElementById('reviewsGrid')) renderReviews(siteData.reviews);
    if (document.getElementById('locationMapIframe')) initMapSwitcher(siteData.locations);
    if (document.getElementById('faqAccordion')) renderFAQs(siteData.faqs);
    if (document.getElementById('videoGrid')) renderExerciseVideos(siteData.exerciseVideos);
    if (document.getElementById('blogGrid')) renderBlog(siteData.blog);

  } catch (error) {
    console.error('Error loading site data:', error);
  }
});

/* --- Header Scroll Effect --- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/* --- Mobile Nav Drawer --- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (!menuToggle || !mobileDrawer) return;

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
      closeDrawer();
    });
  });
}

/* --- Infinite Scrolling Marquee --- */
function renderMarquee(reviews) {
  const marqueeContainer = document.getElementById('reviewsMarquee');
  if (!marqueeContainer) return;
  
  // Duplicate array twice to ensure seamless continuous CSS loop
  const displayReviews = [...reviews, ...reviews];
  
  marqueeContainer.innerHTML = displayReviews.map(rev => `
    <div class="marquee-card">
      <span class="marquee-stars">★★★★★</span>
      <span class="marquee-text">"${rev.text.substring(0, 75)}..."</span>
      <span class="marquee-author">— ${rev.author}</span>
    </div>
  `).join('');
}

/* --- Render Services --- */
function renderServices(services) {
  const container = document.getElementById('servicesGrid');
  if (!container) return;

  const iconSvgs = {
    physio: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    pelvic: '<circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0 1 14 0v2"/>',
    massage: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    acupuncture: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
    vestibular: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    surgical: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>'
  };

  container.innerHTML = services.map(srv => `
    <div class="service-card">
      <div class="service-icon-wrapper">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
          ${iconSvgs[srv.icon] || iconSvgs.physio}
        </svg>
      </div>
      <h3>${srv.title}</h3>
      <p>${srv.description}</p>
      <div class="service-card-footer">
        <button class="btn-text open-booking-btn">Book Service →</button>
      </div>
    </div>
  `).join('');

  rebindBookingBtns();
}

/* --- Render Team Directory (With Photo & Initials Fallback) --- */
function renderTeam(teamMembers) {
  const container = document.getElementById('teamGrid');
  if (!container) return;

  container.innerHTML = teamMembers.map(mem => {
    // If imagePath is provided, render image tag; otherwise render colored avatar with initials
    const avatarHtml = mem.imagePath && mem.imagePath.trim() !== ''
      ? `<img src="${mem.imagePath}" alt="${mem.name}" class="team-avatar-img">`
      : `${mem.initials}`;

    const tagsHtml = mem.tags.map(t => `<span class="tag">${t}</span>`).join('');

    return `
      <div class="team-card" data-category="${mem.category}">
        <div class="team-avatar-wrapper">
          <div class="team-avatar ${mem.avatarColor}">
            ${avatarHtml}
          </div>
        </div>
        <div class="team-info">
          <h3>${mem.name}</h3>
          <span class="team-role">${mem.role}</span>
          <p class="team-desc">${mem.description}</p>
          <div class="team-tags">
            ${tagsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');

  initTeamFilter();
}

/* --- Team Filter Listener --- */
function initTeamFilter() {
  const filterButtons = document.querySelectorAll('.team-filters .filter-btn');
  const teamCards = document.querySelectorAll('#teamGrid .team-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
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

/* --- Render Reviews Grid --- */
function renderReviews(reviews) {
  const container = document.getElementById('reviewsGrid');
  if (!container) return;

  container.innerHTML = reviews.map(rev => `
    <div class="review-card" data-review-cat="${rev.category}">
      <div class="review-header">
        <div class="reviewer-badge">${rev.initials}</div>
        <div class="reviewer-info">
          <h4>${rev.author}</h4>
          <span class="review-date">${rev.date} • Verified Patient</span>
        </div>
        <div class="google-logo">G</div>
      </div>
      <div class="stars">★★★★★</div>
      <p class="review-text">"${rev.text}"</p>
      <span class="injury-tag">${rev.category.toUpperCase().replace('-', ' ')}</span>
    </div>
  `).join('');

  initReviewFilter();
}

/* --- Review Filter Listener --- */
function initReviewFilter() {
  const filterButtons = document.querySelectorAll('.review-filters .filter-btn');
  const reviewCards = document.querySelectorAll('#reviewsGrid .review-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
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

/* --- Interactive OpenStreetMap Switcher --- */
function initMapSwitcher(locations) {
  const tabMississauga = document.getElementById('tabMississauga');
  const tabAurora = document.getElementById('tabAurora');
  const iframe = document.getElementById('locationMapIframe');
  
  const title = document.getElementById('locTitle');
  const badge = document.getElementById('locBadge');
  const address = document.getElementById('locAddress');
  const phone = document.getElementById('locPhone');
  const hours = document.getElementById('locHours');
  const directionsBtn = document.getElementById('locDirectionsBtn');
  const bookingBtn = document.getElementById('locBookingBtn');

  if (!tabMississauga || !tabAurora || !iframe) return;

  const updateLocationView = (key) => {
    const loc = locations[key];
    if (!loc) return;

    iframe.src = loc.mapEmbedUrl;
    title.innerText = loc.name;
    address.innerText = loc.address;
    phone.innerText = loc.phone;
    phone.href = `tel:${loc.phone.replace(/[^0-9]/g, '')}`;
    directionsBtn.href = `https://maps.google.com/?q=${encodeURIComponent(loc.address)}`;
    
    if (key === 'aurora') {
      tabMississauga.classList.remove('active');
      tabAurora.classList.add('active');
      badge.innerText = 'Online Booking Enabled';
      badge.className = 'status-indicator status-green';
      bookingBtn.setAttribute('data-preset-location', 'aurora');
    } else {
      tabAurora.classList.remove('active');
      tabMississauga.classList.add('active');
      badge.innerText = 'Direct Booking by Phone';
      badge.className = 'status-indicator';
      bookingBtn.setAttribute('data-preset-location', 'mississauga');
    }

    // Format Hours
    hours.innerHTML = Object.entries(loc.hours).map(([day, time]) => `
      <span>${day}:</span> <span class="${time === 'Closed' ? 'closed-label' : ''}">${time}</span>
    `).join('');
  };

  tabMississauga.addEventListener('click', () => updateLocationView('mississauga'));
  tabAurora.addEventListener('click', () => updateLocationView('aurora'));
}

/* --- Render FAQs Accordion --- */
function renderFAQs(faqs) {
  const container = document.getElementById('faqAccordion');
  if (!container) return;

  container.innerHTML = faqs.map(faq => `
    <div class="faq-item" id="${faq.id}">
      <div class="faq-question">
        <span>${faq.question}</span>
        <span class="faq-toggle-icon">+</span>
      </div>
      <div class="faq-answer">
        <p>${faq.answer}</p>
      </div>
    </div>
  `).join('');

  // Accordion Toggle Handlers
  const faqItems = container.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* --- Render Exercise Videos --- */
function renderExerciseVideos(videos) {
  const container = document.getElementById('videoGrid');
  const filterBtns = document.querySelectorAll('.video-filters .filter-btn');
  if (!container) return;

  const renderCards = (filter = 'all') => {
    const filtered = filter === 'all' 
      ? videos 
      : videos.filter(v => v.category === filter);

    container.innerHTML = filtered.map(v => `
      <div class="video-card">
        <div class="video-embed-wrapper">
          <iframe src="${v.youtubeUrl}" title="${v.title}" allowfullscreen></iframe>
        </div>
        <div class="video-info">
          <h3>${v.title}</h3>
          <p>${v.description}</p>
          <div class="exercise-steps">
            <h4>Instructions & Steps</h4>
            <ol>
              ${v.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        </div>
      </div>
    `).join('');
  };

  renderCards();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.getAttribute('data-video-filter'));
    });
  });
}

/* --- Render Blog Posts --- */
function renderBlog(blogPosts) {
  const container = document.getElementById('blogGrid');
  const blogModal = document.getElementById('blogModal');
  const closeBlogBtn = document.getElementById('closeBlogModalBtn');
  const finishReadBtn = document.getElementById('finishReadBtn');
  if (!container) return;

  container.innerHTML = blogPosts.map(post => `
    <div class="blog-card" data-blog-id="${post.id}">
      <span class="badge-tag">${post.date}</span>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="blog-footer">
        <span class="blog-author">By ${post.author}</span>
        <span class="btn-text">Read Article →</span>
      </div>
    </div>
  `).join('');

  // Add Reader Modal Triggers
  const blogCards = container.querySelectorAll('.blog-card');
  blogCards.forEach(card => {
    card.addEventListener('click', () => {
      const postId = card.getAttribute('data-blog-id');
      const post = blogPosts.find(p => p.id === postId);
      if (post && blogModal) {
        document.getElementById('articleDate').innerText = post.date;
        document.getElementById('articleTitle').innerText = post.title;
        document.getElementById('articleAuthor').innerText = `Written by ${post.author}`;
        document.getElementById('articleBody').innerHTML = `<p>${post.content}</p>`;
        
        blogModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeBlog = () => {
    if (blogModal) {
      blogModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  if (closeBlogBtn) closeBlogBtn.addEventListener('click', closeBlog);
  if (finishReadBtn) finishReadBtn.addEventListener('click', closeBlog);
  if (blogModal) {
    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) closeBlog();
    });
  }
}

/* --- Booking Modal Controller --- */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

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
    document.body.style.overflow = 'hidden';
    
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    if (form) form.reset();

    if (presetLocation === 'mississauga') {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    }
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  rebindBookingBtns(openModal);

  if (closeButton) closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (proceedMississauga) {
    proceedMississauga.addEventListener('click', () => {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  }

  if (backTo1) {
    backTo1.addEventListener('click', () => {
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      step2.classList.add('hidden');
      step3.classList.remove('hidden');
    });
  }

  if (finishBooking) finishBooking.addEventListener('click', closeModal);
}

function rebindBookingBtns(openModalFn) {
  const modal = document.getElementById('bookingModal');
  const openButtons = document.querySelectorAll('.open-booking-btn');
  
  openButtons.forEach(btn => {
    btn.onclick = () => {
      const preset = btn.getAttribute('data-preset-location');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const step1 = document.getElementById('modalStep1');
        const step2 = document.getElementById('modalStep2');
        const step3 = document.getElementById('modalStep3');
        
        if (step1 && step2 && step3) {
          step1.classList.remove('hidden');
          step2.classList.add('hidden');
          step3.classList.add('hidden');
          
          if (preset === 'mississauga') {
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
          }
        }
      }
    };
  });
}

/* --- Scroll Helper --- */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  const headerOffset = 76;
  const elementPosition = section.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}
