document.addEventListener('DOMContentLoaded', () => {
  // Detect device type
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;
  
  // Add viewport hints for better app behavior
  if (isTouchDevice || isSmallScreen) {
    document.documentElement.style.setProperty('--touch-target-size', '48px');
  }
  
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initStatsCounter();
  initCardTilt();
  initFaqAccordion();
  initBookingEstimator();
  initFloatingParticles();
  initParallaxScroll();
  initResponsiveOptimizations();

  // Trigger intro page-loaded state for background image scale/filter transition
  setTimeout(() => {
    document.body.classList.add('page-loaded');
  }, 100);
  
  // Handle window resize for responsive adjustments
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateResponsiveState();
    }, 150);
  });
});

/* ==========================================
   1. NAVBAR SCROLL DETECTION
   ========================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on load
}

/* ==========================================
   2. MOBILE NAV OVERLAY TOGGLE
   ========================================== */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  
  if (!menuToggle || !mobileOverlay) return;

  const toggleMenu = () => {
    menuToggle.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    
    // Prevent background scrolling when menu is open
    if (mobileOverlay.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking on a link
  const mobileLinks = mobileOverlay.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================
   3. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .stagger-container');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================
   4. STATS COUNTER COUNT-UP ANIMATION
   ========================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number, .about-stat-number');
  if (statNumbers.length === 0) return;

  const countUp = (element) => {
    const targetText = element.getAttribute('data-target');
    if (!targetText) return;

    // Parse target number (stripping symbols like +, ★, %, yrs, etc.)
    const isPercent = targetText.includes('%');
    const isStar = targetText.includes('★');
    const isPlus = targetText.includes('+');
    const isYrs = targetText.includes('yrs');
    
    const targetVal = parseFloat(targetText.replace(/[^0-9.]/g, ''));
    if (isNaN(targetVal)) return;

    const duration = 2000; // ms
    const startTime = performance.now();
    
    // Check if the target has decimal (e.g. 4.9)
    const hasDecimal = targetVal % 1 !== 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = easeProgress * targetVal;

      let displayText = '';
      if (hasDecimal) {
        displayText = currentVal.toFixed(1);
      } else {
        displayText = Math.floor(currentVal).toString();
      }

      // Re-add symbols
      if (isStar) displayText += '★';
      if (isPlus) displayText += '+';
      if (isPercent) displayText += '%';
      if (isYrs) displayText = displayText + ' yrs';

      element.textContent = displayText;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = targetText; // Final lock-in
      }
    };

    requestAnimationFrame(animate);
  };

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));
}

/* ==========================================
   5. 3D CARD TILT EFFECT (DESKTOP ONLY)
   ========================================== */
function initCardTilt() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return; // Disable on touch devices

  const tilts = document.querySelectorAll('.fleet-card-detailed, .service-card, .fleet-card, .testimonial-card');

  tilts.forEach(card => {
    // Add smooth transition properties for transform returns
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease, border-color 0.5s ease';
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) {
        card.style.transform = '';
        return;
      }
      
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // range: -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // range: -0.5 to 0.5
      
      // Scale tilt value (max tilt 6 degrees for subtle luxury feel)
      const tiltX = -y * 6;
      const tiltY = x * 6;

      // Apply transform with perspective
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
      card.style.boxShadow = 'var(--shadow-hover)';
    });

    card.addEventListener('mouseleave', () => {
      // Revert with spring transition
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.boxShadow = '';
    });
  });
}

/* ==========================================
   6. FAQ ACCORDION TRANSITIONS
   ========================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPane = item.querySelector('.faq-answer-pane');

    if (!questionBtn || !answerPane) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other FAQ items for a clean accordion effect
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-answer-pane').style.maxHeight = '0px';
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        answerPane.style.maxHeight = '0px';
      } else {
        item.classList.add('open');
        answerPane.style.maxHeight = answerPane.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================
   7. BOOKING PRICE ESTIMATOR & WIDGET INTERACTION
   ========================================== */
function initBookingEstimator() {
  const form = document.getElementById('bookingForm');
  const pickupInput = document.getElementById('pickup');
  const dropoffInput = document.getElementById('dropoff');
  const dateInput = document.getElementById('rideDate');
  const timeInput = document.getElementById('rideTime');
  const passengerSelect = document.getElementById('passengers');
  const vehicleSelect = document.getElementById('vehicleSelect');
  const airportToggle = document.getElementById('airportToggle');
  const flightNoGroup = document.getElementById('flightNoGroup');
  const flightNumberInput = document.getElementById('flightNumber');
  const priceValue = document.getElementById('priceValue');

  if (!form || !priceValue) return;

  // Toggle airport flight number field
  if (airportToggle && flightNoGroup) {
    airportToggle.addEventListener('change', () => {
      if (airportToggle.checked) {
        flightNoGroup.classList.add('visible');
        if (flightNumberInput) flightNumberInput.required = true;
      } else {
        flightNoGroup.classList.remove('visible');
        if (flightNumberInput) {
          flightNumberInput.required = false;
          flightNumberInput.value = '';
        }
      }
      calculateFare();
    });
  }

  // Calculate fare based on input parameters
  const calculateFare = () => {
    const pickupVal = pickupInput ? pickupInput.value.trim() : '';
    const dropoffVal = dropoffInput ? dropoffInput.value.trim() : '';
    const passengers = passengerSelect ? parseInt(passengerSelect.value) || 1 : 1;
    const vehicleClass = vehicleSelect ? vehicleSelect.value : 'business';
    const isAirport = airportToggle ? airportToggle.checked : false;

    // Show default "--" if fields are empty
    if (!pickupVal || !dropoffVal) {
      priceValue.textContent = '$--';
      return;
    }

    // Dynamic base fare based on route character length (simulates routing distance)
    const distanceFactor = Math.min(Math.max((pickupVal.length + dropoffVal.length) * 1.5, 40), 180);
    
    // Class multiplier
    let classMultiplier = 1.0;
    if (vehicleClass === 'first') classMultiplier = 1.6;
    if (vehicleClass === 'suv') classMultiplier = 1.4;
    if (vehicleClass === 'van') classMultiplier = 1.35;

    let fare = distanceFactor * classMultiplier;
    
    // Additional passengers fee
    if (passengers > 1) {
      fare += (passengers - 1) * 8;
    }

    // Airport pickup fee (meet & greet, flight tracking cost)
    if (isAirport) {
      fare += 30;
    }

    // Display final rounded price
    priceValue.textContent = `$${Math.round(fare)}`;
  };

  // Attach event listeners to update price preview dynamically
  const inputs = [pickupInput, dropoffInput, passengerSelect, vehicleSelect];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', calculateFare);
      input.addEventListener('change', calculateFare);
    }
  });

  // Handle Form Submission Mock
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const pickupVal = pickupInput.value.trim();
    const dropoffVal = dropoffInput.value.trim();
    const rideDate = dateInput ? dateInput.value : '';
    const rideTime = timeInput ? timeInput.value : '';
    const selectedVehicleName = vehicleSelect ? vehicleSelect.options[vehicleSelect.selectedIndex].text : '';

    if (!pickupVal || !dropoffVal || !rideDate || !rideTime) {
      alert('Please fill out all booking fields.');
      return;
    }

    const estimatedPrice = priceValue.textContent;
    
    // Present a luxury styled confirmation prompt
    alert(`Thank you for choosing APEX Chauffeur!\n\nBooking Requested:\n- Route: ${pickupVal} → ${dropoffVal}\n- Schedule: ${rideDate} at ${rideTime}\n- Class: ${selectedVehicleName}\n- Estimated Price: ${estimatedPrice}\n\nOur concierge will contact you within 10 minutes to finalize details.`);
    
    form.reset();
    if (flightNoGroup) flightNoGroup.classList.remove('visible');
    priceValue.textContent = '$--';
  });
}

/* ==========================================
   8. HERO BACKGROUND FLOATING PARTICLES
   ========================================== */
function initFloatingParticles() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  const numParticles = 7;
  const particleContainer = document.createElement('div');
  particleContainer.style.position = 'absolute';
  particleContainer.style.top = '0';
  particleContainer.style.left = '0';
  particleContainer.style.width = '100%';
  particleContainer.style.height = '100%';
  particleContainer.style.pointerEvents = 'none';
  particleContainer.style.zIndex = '1';
  hero.appendChild(particleContainer);

  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Randomize initial positions & animation offsets
    const left = Math.random() * 90 + 5; // Avoid screen edge
    const top = Math.random() * 80 + 10;
    const delay = Math.random() * 8;
    const duration = Math.random() * 6 + 6; // 6s - 12s
    
    particle.style.left = `${left}%`;
    particle.style.top = `${top}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    particleContainer.appendChild(particle);
  }
}

/* ==========================================
   9. PARALLAX SCROLL EFFECT
   ========================================== */
function initParallaxScroll() {
  const heroes = document.querySelectorAll('.hero-section, .about-hero, .services-hero, .fleet-hero, .contact-hero');
  if (heroes.length === 0) return;

  const handleParallax = () => {
    const scrolled = window.scrollY;
    heroes.forEach(hero => {
      if (window.innerWidth >= 768) {
        // Set scroll variable for GPU-accelerated parallax translation
        hero.style.setProperty('--scroll-y', `${scrolled}px`);
      } else {
        hero.style.removeProperty('--scroll-y');
      }
    });
  };

  window.addEventListener('scroll', handleParallax);
  handleParallax();
}

/* ==========================================
   10. RESPONSIVE OPTIMIZATIONS & TOUCH HANDLING
   ========================================== */
function initResponsiveOptimizations() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Improve touch targets for mobile
  if (isTouchDevice) {
    const buttons = document.querySelectorAll('.btn, button, a[role="button"]');
    buttons.forEach(btn => {
      const currentHeight = btn.offsetHeight;
      if (currentHeight < 44) {
        btn.style.minHeight = '44px';
        btn.style.padding = '10px 16px';
      }
    });
    
    // Add touch feedback
    buttons.forEach(btn => {
      btn.addEventListener('touchstart', () => {
        btn.style.opacity = '0.8';
      });
      btn.addEventListener('touchend', () => {
        btn.style.opacity = '1';
      });
    });
  }
  
  // Optimize form inputs for mobile
  const formInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="date"], input[type="time"], select, textarea');
  formInputs.forEach(input => {
    const currentHeight = input.offsetHeight;
    if (currentHeight < 44) {
      input.style.minHeight = '44px';
      input.style.padding = '10px 12px';
    }
    
    // Improve touch experience for selects
    if (input.tagName === 'SELECT' || input.type === 'select-one') {
      input.style.fontSize = '16px'; // Prevents zoom on iOS
    }
  });
  
  // Prevent zoom on input focus (iOS)
  if (isTouchDevice) {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.style.fontSize = '16px';
    });
  }
}

/* ==========================================
   11. RESPONSIVE STATE MANAGER
   ========================================== */
function updateResponsiveState() {
  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  // Update body attribute for responsive behaviors
  document.documentElement.setAttribute('data-responsive', isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop');
  
  // Disable parallax on mobile
  if (isMobile) {
    const heroes = document.querySelectorAll('.hero-section, .about-hero, .services-hero, .fleet-hero, .contact-hero');
    heroes.forEach(hero => hero.style.removeProperty('--scroll-y'));
  }
  
  // Re-initialize animations if screen size crosses breakpoints
  const revealElements = document.querySelectorAll('.reveal, .stagger-container');
  revealElements.forEach(el => {
    if (!el.classList.contains('active')) {
      // Reset reveal state for responsive recalculation
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('active');
      }
    }
  });
}

/* ==========================================
   12. VIEWPORT HEIGHT FIX (for mobile address bar)
   ========================================== */
function updateViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', updateViewportHeight);
updateViewportHeight();
