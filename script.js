/* ==========================================================================
   Hiba Haneefa - Portfolio JavaScript
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     Preloader Logic
     ========================================================================== */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.visibility = 'hidden';
      }, 800);
    }
  });

  // Fallback for preloader in case load event takes too long
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.opacity !== '0') {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.visibility = 'hidden';
      }, 800);
    }
  }, 3000);


  /* ==========================================================================
     Subtle Background Particles (Canvas)
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 40; // Low count for luxury tech look, not noisy
    
    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.15 - 0.075;
        this.speedY = Math.random() * 0.15 - 0.075;
        this.alpha = Math.random() * 0.4 + 0.1;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around screens
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }
    
    // Initialize particles array
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
  }


  /* ==========================================================================
     Header Scroll & Mobile Menu Toggle
     ========================================================================== */
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-item');
  
  // Header scroll class toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu on clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileToggle && navMenu) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });


  /* ==========================================================================
     Typing Effect
     ========================================================================== */
  const typingText = document.getElementById('typing-text');
  if (typingText) {
    const roles = ["Data Analyst", "SQL Developer", "Power BI Specialist", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    const type = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Deletes faster
      } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }
      
      // Handle status flags
      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at full word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next word
      }
      
      setTimeout(type, typingSpeed);
    };
    
    // Start typing effect
    setTimeout(type, 1000);
  }


  /* ==========================================================================
     Skills Rating Indicator Custom Blocks Generator
     ========================================================================== */
  const skillMeters = document.querySelectorAll('.skill-meter');
  skillMeters.forEach(meter => {
    const score = parseInt(meter.getAttribute('data-score')) || 5;
    const blockCount = 10;
    
    for (let i = 1; i <= blockCount; i++) {
      const block = document.createElement('span');
      block.classList.add('meter-block');
      if (i <= score) {
        block.classList.add('active');
      }
      meter.appendChild(block);
    }
  });


  /* ==========================================================================
     Intersection Observer Animations
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // If statistics section becomes active, trigger count-up counters
        if (entry.target.classList.contains('hero-stats-row')) {
          triggerCounters();
        }
        observer.unobserve(entry.target);
      }
    });
  };
  
  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));


  /* ==========================================================================
     Animated Statistics Counters
     ========================================================================== */
  let countersTriggered = false;
  
  const triggerCounters = () => {
    if (countersTriggered) return;
    countersTriggered = true;
    
    const counterElements = document.querySelectorAll('.stat-number');
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      if (isNaN(target)) return;
      
      const duration = 1500; // 1.5 seconds count duration
      const steps = 60;
      const stepTime = duration / steps;
      let currentVal = 0;
      
      const increment = target / steps;
      
      const updateCount = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          counter.textContent = target + '+';
          clearInterval(updateCount);
        } else {
          counter.textContent = Math.floor(currentVal) + '+';
        }
      }, stepTime);
    });
  };


  /* ==========================================================================
     Project Filtering System
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button style
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'grid'; // reset display (supports normal card layout)
          if (!card.classList.contains('featured') && window.innerWidth > 1024) {
             card.style.display = 'flex';
             card.style.flexDirection = 'column';
          }
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 350); // matches transition duration
        }
      });
    });
  });


  /* ==========================================================================
     Timeline Scroll Indicator & Active Items
     ========================================================================== */
  const timelineProgress = document.getElementById('timeline-progress-bar');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineContainer = document.querySelector('.timeline-container');
  
  const updateTimeline = () => {
    if (!timelineProgress || !timelineContainer) return;
    
    const containerRect = timelineContainer.getBoundingClientRect();
    const containerHeight = containerRect.height;
    
    // Top of timeline container relative to viewport center
    const triggerPoint = window.innerHeight / 2.2;
    const relativeScroll = triggerPoint - containerRect.top;
    
    // Calculate progress percentage
    let percentage = (relativeScroll / containerHeight) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    
    timelineProgress.style.height = `${percentage}%`;
    
    // Toggle active state for timeline milestones passed by scroll indicator
    timelineItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const nodePosition = itemRect.top + 25; // center of node
      
      if (nodePosition < triggerPoint) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };
  
  window.addEventListener('scroll', updateTimeline);
  updateTimeline(); // run once on load


  /* ==========================================================================
     Scroll Active Link Mapping & Sticky Navigation Highlight
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  
  const scrollActiveLink = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      const link = document.querySelector(`.nav-links a[href*=${sectionId}]`);
      if (link && !link.classList.contains('btn-nav-resume')) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  };
  
  window.addEventListener('scroll', scrollActiveLink);
  scrollActiveLink();


  /* ==========================================================================
     Back to Top & Top Scroller Utility
     ========================================================================== */
  const topScroller = document.getElementById('top-scroller');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topScroller.classList.add('visible');
    } else {
      topScroller.classList.remove('visible');
    }
  });
  
  if (topScroller) {
    topScroller.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
