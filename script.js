// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create a placeholder for the map image
    const mapPlaceholder = document.createElement('img');
    mapPlaceholder.src = 'https://via.placeholder.com/400x300/8b1a1a/ffffff?text=Surabaya+Map';
    mapPlaceholder.alt = 'Surabaya Map';
    mapPlaceholder.className = 'img-fluid';
    

    
    // Add smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add active class to nav items on click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Add to your existing script.js

document.addEventListener('DOMContentLoaded', function() {
    // ... (keep your existingDOMContentLoaded code)

    // Intersection Observer for animations
    const animatedElements = document.querySelectorAll('.feature-box, .hero-section .display-4, .hero-section .lead, .why-section .Title-why, .why-section p, .why-section h2, .why-section h3, .unimap-section > .text-center, .contribution-title, .contribution-text, .mitra-title');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Optional: remove class if you want animation to re-trigger on scroll up and down
                // entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Adjust threshold as needed (0.1 means 10% of the element is visible)
    });

    animatedElements.forEach(el => {
        el.classList.add('fade-in-up'); // Add initial class for animation
        observer.observe(el);
    });

    // Hero Section Text Animation (Simple fade-in for titles)
    const heroTitle = document.querySelector('.hero-section h1');
    const heroLead = document.querySelector('.hero-section .lead');
    if (heroTitle) heroTitle.classList.add('fade-in-up', 'is-visible'); // Auto-visible on load
    if (heroLead) {
      heroLead.classList.add('fade-in-up');
      heroLead.style.transitionDelay = "0.2s"; // Slight delay
      heroLead.classList.add('is-visible'); // Auto-visible on load
    }


    // Smooth scrolling for all links (you already have this, ensure it's working)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active class to nav items on click (you already have this)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            // If it's a link to an ID, ensure the target section is brought into view
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Give a slight delay for the active class to apply before scrolling
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 50);
                }
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

});