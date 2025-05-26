// DOM Elements
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const searchInput = document.getElementById('searchInput');
const currentTemp = document.getElementById('currentTemp');
const currentLocation = document.getElementById('currentLocation');

// State
let sidebarOpen = true;
let isMobile = window.innerWidth <= 768;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startWeatherSimulation();
    handleResponsiveLayout();
});

// Initialize App
function initializeApp() {
    // Set initial sidebar state based on screen size
    if (isMobile) {
        sidebar.classList.add('hidden');
        sidebarOpen = false;
    }

    // Add loading animation to search input
    searchInput.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });

    searchInput.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Sidebar toggle
    toggleSidebarBtn.addEventListener('click', toggleSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    mobileMenuBtn.addEventListener('click', toggleSidebar);

    // Search functionality
    searchInput.addEventListener('keypress', handleSearch);
    searchInput.addEventListener('input', handleSearchInput);

    // Window resize
    window.addEventListener('resize', handleResize);

    // Navigation items
    const navItems = document.querySelectorAll('.nav-items li');
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => handleNavItemClick(item, index));

        // Add staggered animation
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate-slide-in');
    });

    // Control buttons
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', handleControlClick);
    });

    // Register button
    const registerBtn = document.querySelector('.register-btn');
    registerBtn.addEventListener('click', handleRegister);

    // Add click outside to close sidebar on mobile
    document.addEventListener('click', handleClickOutside);
}

// Toggle Sidebar
function toggleSidebar() {
    if (isMobile) {
        sidebar.classList.toggle('open');
        sidebarOpen = sidebar.classList.contains('open');
    } else {
        sidebar.classList.toggle('hidden');
        sidebarOpen = !sidebar.classList.contains('hidden');
    }

    // Add animation class
    sidebar.style.transition = 'all 0.3s ease';

    // Update toggle button icon
    const icon = toggleSidebarBtn.querySelector('i');
    if (sidebarOpen) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
}

// Close Sidebar
function closeSidebar() {
    if (isMobile) {
        sidebar.classList.remove('open');
    } else {
        sidebar.classList.add('hidden');
    }
    sidebarOpen = false;

    // Reset toggle button icon
    const icon = toggleSidebarBtn.querySelector('i');
    icon.className = 'fas fa-bars';
}

// Handle Search
function handleSearch(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            performSearch(query);
        }
    }
}

// Handle Search Input
function handleSearchInput(e) {
    const query = e.target.value;

    // Add visual feedback
    if (query.length > 0) {
        e.target.style.borderColor = '#ff6b6b';
        e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
    } else {
        e.target.style.borderColor = '#e5e5e5';
        e.target.style.boxShadow = 'none';
    }

    // Simulate real-time search suggestions (debounced)
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        if (query.length > 2) {
            showSearchSuggestions(query);
        }
    }, 300);
}

// Perform Search
function performSearch(query) {
    console.log('Searching for:', query);

    // Add loading state
    searchInput.style.background = 'linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%)';
    searchInput.style.backgroundSize = '200% 100%';
    searchInput.style.animation = 'loading-shimmer 1.5s infinite';

    // Simulate search delay
    setTimeout(() => {
        searchInput.style.background = '#fff';
        searchInput.style.animation = 'none';
        showSearchResults(query);
    }, 1000);
}

// Show Search Suggestions
function showSearchSuggestions(query) {
    // This would typically show a dropdown with suggestions
    console.log('Showing suggestions for:', query);
}

// Show Search Results
function showSearchResults(query) {
    // This would typically update the map or show results
    console.log('Showing results for:', query);

    // Add success animation
    searchInput.style.borderColor = '#28a745';
    setTimeout(() => {
        searchInput.style.borderColor = '#e5e5e5';
    }, 2000);
}

// Handle Navigation Item Click
function handleNavItemClick(item, index) {
    // Remove active class from all items
    document.querySelectorAll('.nav-items li').forEach(li => {
        li.classList.remove('active');
    });

    // Add active class to clicked item
    item.classList.add('active');

    // Add click animation
    item.style.transform = 'scale(0.95)';
    setTimeout(() => {
        item.style.transform = 'scale(1)';
    }, 150);

    console.log('Navigation item clicked:', item.textContent);

    // Simulate loading new map data
    showMapLoading();
}

// Handle Control Button Click
function handleControlClick(e) {
    const btn = e.currentTarget;
    const icon = btn.querySelector('i');

    // Add click animation
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);

    // Handle different control actions
    if (icon.classList.contains('fa-compass')) {
        handleNavigationControl();
    }
}

// Handle Navigation Control
function handleNavigationControl() {
    console.log('Navigation control activated');

    // Simulate GPS location
    updateLocation();
}

// Handle Register
function handleRegister() {
    console.log('Register button clicked');

    // Add success animation
    const btn = document.querySelector('.register-btn');
    const originalText = btn.textContent;

    btn.textContent = 'MEMPROSES...';
    btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

    setTimeout(() => {
        btn.textContent = 'BERHASIL!';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'linear-gradient(135deg, #2c3e50, #34495e)';
        }, 2000);
    }, 1500);
}

// Handle Click Outside
function handleClickOutside(e) {
    if (isMobile && sidebarOpen && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeSidebar();
    }
}

// Handle Resize
function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;

    if (wasMobile !== isMobile) {
        // Screen size category changed
        if (isMobile) {
            // Switched to mobile
            sidebar.classList.remove('hidden');
            sidebar.classList.remove('open');
            sidebarOpen = false;
        } else {
            // Switched to desktop
            sidebar.classList.remove('open');
            if (sidebarOpen) {
                sidebar.classList.remove('hidden');
            } else {
                sidebar.classList.add('hidden');
            }
        }
    }
}

// Start Weather Simulation
function startWeatherSimulation() {
    const temperatures = ['27°C', '28°C', '29°C', '30°C', '26°C'];
    let tempIndex = 0;

    setInterval(() => {
        tempIndex = (tempIndex + 1) % temperatures.length;
        currentTemp.textContent = temperatures[tempIndex];

        // Add update animation
        currentTemp.style.transform = 'scale(1.1)';
        currentTemp.style.color = '#ff6b6b';

        setTimeout(() => {
            currentTemp.style.transform = 'scale(1)';
            currentTemp.style.color = '#ff6b6b';
        }, 300);
    }, 15000); // Update every 15 seconds
}

// Update Location
function updateLocation() {
    const locations = ['Sukolilo', 'Gubeng', 'Wonokromo', 'Rungkut', 'Tenggilis'];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    currentLocation.textContent = randomLocation;

    // Add update animation
    currentLocation.style.transform = 'scale(1.1)';
    setTimeout(() => {
        currentLocation.style.transform = 'scale(1)';
    }, 300);
}

// Show Map Loading
function showMapLoading() {
    const mapArea = document.querySelector('.map-placeholder');
    const originalContent = mapArea.innerHTML;

    mapArea.innerHTML = `
        <div class="map-icon">
            <i class="fas fa-spinner loading"></i>
        </div>
        <h3>Memuat Data...</h3>
        <p>Sedang mengambil informasi peta</p>
    `;

    setTimeout(() => {
        mapArea.innerHTML = originalContent;
    }, 2000);
}

// Add CSS for loading shimmer animation
const style = document.createElement('style');
style.textContent = `
    @keyframes loading-shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
    
    .animate-slide-in {
        animation: slideInLeft 0.5s ease-out forwards;
        opacity: 0;
        transform: translateX(-20px);
    }
    
    @keyframes slideInLeft {
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .nav-items li.active {
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        color: white;
        transform: translateX(5px);
        padding-left: 15px;
    }
`;
document.head.appendChild(style);

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
});

console.log('🗺️ Peta Interaktif - Interface loaded successfully!');