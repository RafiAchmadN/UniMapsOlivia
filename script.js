// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create a placeholder for the map image
    const mapPlaceholder = document.createElement('img');
    mapPlaceholder.src = 'https://via.placeholder.com/400x300/8b1a1a/ffffff?text=Surabaya+Map';
    mapPlaceholder.alt = 'Surabaya Map';
    mapPlaceholder.className = 'img-fluid';
    
    // Replace the placeholder in the HTML
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const existingImg = mapContainer.querySelector('img');
        if (existingImg) {
            mapContainer.replaceChild(mapPlaceholder, existingImg);
        }
    }
    
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