/**
 * UniMap - Enhanced Interactive Script
 * Improved performance, accessibility, and user experience
 */

class UniMapApp {
    constructor() {
        this.isLoaded = false
        this.scrollPosition = 0
        this.isScrolling = false
        this.observers = new Map()

        this.init()
    }

    init() {
        this.bindEvents()
        this.initializeComponents()
        this.setupAccessibility()
        this.handleLoading()
    }

    bindEvents() {
        // Wait for DOM to be ready
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.onDOMReady())
        } else {
            this.onDOMReady()
        }

        // Window events
        window.addEventListener("load", () => this.onWindowLoad())
        window.addEventListener(
            "scroll",
            this.throttle(() => this.handleScroll(), 16),
        )
        window.addEventListener(
            "resize",
            this.debounce(() => this.handleResize(), 250),
        )

        // Performance optimization
        window.addEventListener("beforeunload", () => this.cleanup())
    }

    onDOMReady() {
        console.log("🚀 UniMap DOM Ready")
        this.setupNavigation()
        this.setupAnimations()
        this.setupInteractiveElements()
        this.setupCounters()
        this.setupMapControls()
    }

    onWindowLoad() {
        console.log("✅ UniMap Fully Loaded")
        this.hideLoadingScreen()
        this.isLoaded = true
        this.triggerEntryAnimations()
    }

    handleLoading() {
        // Show loading screen immediately
        const loadingScreen = document.getElementById("loadingScreen")
        if (loadingScreen) {
            loadingScreen.style.display = "flex"
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById("loadingScreen")
        if (loadingScreen) {
            loadingScreen.classList.add("hidden")
            setTimeout(() => {
                loadingScreen.style.display = "none"
            }, 500)
        }
    }

    setupNavigation() {
        const navbar = document.querySelector(".navbar")
        const navLinks = document.querySelectorAll(".nav-link[data-section]")
        const backToTopBtn = document.getElementById("backToTop")

        // Smooth scrolling for navigation links
        navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault()
                const targetId = link.getAttribute("href")
                const targetElement = document.querySelector(targetId)

                if (targetElement) {
                    this.smoothScrollTo(targetElement)
                    this.setActiveNavLink(link)
                }
            })
        })

        // Back to top button
        if (backToTopBtn) {
            backToTopBtn.addEventListener("click", () => {
                this.smoothScrollTo(document.body)
            })
        }

        // Navbar scroll effect
        this.setupNavbarScrollEffect(navbar)
    }

    setupNavbarScrollEffect(navbar) {
        if (!navbar) return

        const scrollThreshold = 50
        let isScrolled = false

        const updateNavbar = () => {
            const shouldBeScrolled = window.scrollY > scrollThreshold

            if (shouldBeScrolled !== isScrolled) {
                isScrolled = shouldBeScrolled
                navbar.classList.toggle("scrolled", isScrolled)
            }
        }

        window.addEventListener("scroll", this.throttle(updateNavbar, 16))
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const animationObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in")
                        // Unobserve after animation to improve performance
                        animationObserver.unobserve(entry.target)
                    }
                })
            }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        },
        )

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(".feature-box, .benefit-item, .data-item, .partner-item")

        animatedElements.forEach((el) => {
            el.classList.add("animate-on-scroll")
            animationObserver.observe(el)
        })

        this.observers.set("animation", animationObserver)
    }

    setupInteractiveElements() {
        // Enhanced button interactions
        this.setupButtonEffects()

        // Parallax effects for hero section
        this.setupParallaxEffects()

        // Interactive map enhancements
        this.setupMapInteractions()

        // Form enhancements
        this.setupFormEnhancements()
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll(".btn, .nav-link, .map-control-btn")

        buttons.forEach((button) => {
            // Ripple effect
            button.addEventListener("click", (e) => {
                this.createRippleEffect(e, button)
            })

            // Hover sound effect (optional)
            button.addEventListener("mouseenter", () => {
                button.style.transform = "translateY(-2px)"
            })

            button.addEventListener("mouseleave", () => {
                button.style.transform = ""
            })
        })
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement("span")
        const rect = element.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = event.clientX - rect.left - size / 2
        const y = event.clientY - rect.top - size / 2

        ripple.style.cssText = `
              position: absolute;
              width: ${size}px;
              height: ${size}px;
              left: ${x}px;
              top: ${y}px;
              background: rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              transform: scale(0);
              animation: ripple 0.6s ease-out;
              pointer-events: none;
              z-index: 1000;
          `

        // Add ripple animation CSS if not exists
        if (!document.querySelector("#ripple-styles")) {
            const style = document.createElement("style")
            style.id = "ripple-styles"
            style.textContent = `
                  @keyframes ripple {
                      to {
                          transform: scale(2);
                          opacity: 0;
                      }
                  }
              `
            document.head.appendChild(style)
        }

        element.style.position = "relative"
        element.style.overflow = "hidden"
        element.appendChild(ripple)

        setTimeout(() => {
            ripple.remove()
        }, 600)
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll(".map-glow, .hero-content")

        if (parallaxElements.length === 0) return

        const handleParallax = () => {
            const scrolled = window.pageYOffset
            const rate = scrolled * -0.5

            parallaxElements.forEach((element) => {
                if (element.classList.contains("map-glow")) {
                    element.style.transform = `translate(-50%, -50%) translateY(${rate * 0.3}px)`
                } else if (element.classList.contains("hero-content")) {
                    element.style.transform = `translateY(${rate * 0.1}px)`
                }
            })
        }

        window.addEventListener("scroll", this.throttle(handleParallax, 16))
    }

    setupMapInteractions() {
        const mapOverlay = document.getElementById("mapOverlay")
        const interactiveMap = document.querySelector(".interactive-map")
        const refreshBtn = document.getElementById("refreshBtn")

        // Hide map overlay after iframe loads
        if (interactiveMap && mapOverlay) {
            interactiveMap.addEventListener("load", () => {
                setTimeout(() => {
                    mapOverlay.classList.add("hidden")
                }, 1000)
            })
        }



        // Refresh map
        if (refreshBtn) {
            refreshBtn.addEventListener("click", () => {
                this.refreshMap()
            })
        }
    }


    refreshMap() {
        const interactiveMap = document.querySelector(".interactive-map")
        const mapOverlay = document.getElementById("mapOverlay")

        if (interactiveMap && mapOverlay) {
            mapOverlay.classList.remove("hidden")

            // Reload iframe
            const currentSrc = interactiveMap.src
            interactiveMap.src = ""
            setTimeout(() => {
                interactiveMap.src = currentSrc
            }, 100)
        }
    }

    setupCounters() {
        const counters = document.querySelectorAll(".stat-number[data-target]")

        if (counters.length === 0) return

        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target)
                        counterObserver.unobserve(entry.target)
                    }
                })
            }, { threshold: 0.5 },
        )

        counters.forEach((counter) => {
            counterObserver.observe(counter)
        })

        this.observers.set("counter", counterObserver)
    }

    animateCounter(element) {
        const target = Number.parseInt(element.getAttribute("data-target"))
        const duration = 2000
        const startTime = performance.now()
        const startValue = 0

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart)

            element.textContent = currentValue

            if (progress < 1) {
                requestAnimationFrame(updateCounter)
            } else {
                element.textContent = target
            }
        }

        requestAnimationFrame(updateCounter)
    }

    setupMapControls() {
        // Enhanced map control functionality
        const mapSection = document.getElementById("PetaInteraktif")

        if (mapSection) {
            // Add keyboard navigation for map section
            mapSection.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    mapSection.scrollIntoView({ behavior: "smooth" })
                }
            })
        }
    }

    setupFormEnhancements() {
        // Enhanced form interactions for future forms
        const forms = document.querySelectorAll("form")

        forms.forEach((form) => {
            const inputs = form.querySelectorAll("input, textarea, select")

            inputs.forEach((input) => {
                // Add floating label effect
                this.setupFloatingLabel(input)

                // Add validation feedback
                this.setupValidationFeedback(input)
            })
        })
    }

    setupFloatingLabel(input) {
        const wrapper = input.parentElement
        if (!wrapper) return

        input.addEventListener("focus", () => {
            wrapper.classList.add("focused")
        })

        input.addEventListener("blur", () => {
            if (!input.value) {
                wrapper.classList.remove("focused")
            }
        })

        // Check initial state
        if (input.value) {
            wrapper.classList.add("focused")
        }
    }

    setupValidationFeedback(input) {
        input.addEventListener("blur", () => {
            this.validateInput(input)
        })

        input.addEventListener("input", () => {
            // Clear validation state on input
            input.classList.remove("is-valid", "is-invalid")
        })
    }

    validateInput(input) {
        const isValid = input.checkValidity()
        input.classList.toggle("is-valid", isValid)
        input.classList.toggle("is-invalid", !isValid)

        return isValid
    }

    setupAccessibility() {
        // Enhanced keyboard navigation
        this.setupKeyboardNavigation()

        // ARIA labels and descriptions
        this.setupARIALabels()

        // Focus management
        this.setupFocusManagement()

        // Screen reader announcements
        this.setupScreenReaderAnnouncements()
    }

    setupKeyboardNavigation() {
        // Skip to main content link
        this.createSkipLink()

        // Enhanced tab navigation
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
        )

        focusableElements.forEach((element) => {
            element.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && element.tagName === "A") {
                    e.preventDefault()
                    element.click()
                }
            })
        })
    }

    createSkipLink() {
        const skipLink = document.createElement("a")
        skipLink.href = "#main"
        skipLink.textContent = "Skip to main content"
        skipLink.className = "skip-link"
        skipLink.style.cssText = `
              position: absolute;
              top: -40px;
              left: 6px;
              background: var(--primary-color);
              color: white;
              padding: 8px;
              text-decoration: none;
              border-radius: 4px;
              z-index: 10000;
              transition: top 0.3s;
          `

        skipLink.addEventListener("focus", () => {
            skipLink.style.top = "6px"
        })

        skipLink.addEventListener("blur", () => {
            skipLink.style.top = "-40px"
        })

        document.body.insertBefore(skipLink, document.body.firstChild)
    }

    setupARIALabels() {
        // Add ARIA labels to interactive elements
        const interactiveElements = document.querySelectorAll(".map-control-btn, .back-to-top")

        interactiveElements.forEach((element) => {
            if (!element.getAttribute("aria-label") && element.title) {
                element.setAttribute("aria-label", element.title)
            }
        })

        // Add role attributes where needed
        const sections = document.querySelectorAll("section")
        sections.forEach((section) => {
            if (!section.getAttribute("role")) {
                section.setAttribute("role", "region")
            }
        })
    }

    setupFocusManagement() {
        // Manage focus for modal-like interactions
        const focusableElements = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'

        document.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                this.handleTabNavigation(e)
            }

            if (e.key === "Escape") {
                this.handleEscapeKey(e)
            }
        })
    }

    handleTabNavigation(e) {
        const focusable = Array.from(
            document.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'),
        ).filter((el) => !el.disabled && el.offsetParent !== null)

        const firstFocusable = focusable[0]
        const lastFocusable = focusable[focusable.length - 1]

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault()
                lastFocusable.focus()
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault()
                firstFocusable.focus()
            }
        }
    }

    handleEscapeKey(e) {
        // Close any open modals or overlays
        const openModals = document.querySelectorAll(".modal.show, .overlay.active")
        openModals.forEach((modal) => {
            modal.classList.remove("show", "active")
        })
    }

    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement("div")
        liveRegion.setAttribute("aria-live", "polite")
        liveRegion.setAttribute("aria-atomic", "true")
        liveRegion.className = "sr-only"
        liveRegion.style.cssText = `
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border: 0;
          `
        document.body.appendChild(liveRegion)

        this.liveRegion = liveRegion
    }

    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message
            setTimeout(() => {
                this.liveRegion.textContent = ""
            }, 1000)
        }
    }

    handleScroll() {
        this.scrollPosition = window.pageYOffset

        // Update back to top button visibility
        this.updateBackToTopButton()

        // Update active navigation link
        this.updateActiveNavigation()

        // Trigger scroll-based animations
        this.handleScrollAnimations()
    }

    updateBackToTopButton() {
        const backToTopBtn = document.getElementById("backToTop")
        if (!backToTopBtn) return

        const shouldShow = this.scrollPosition > 300
        backToTopBtn.classList.toggle("visible", shouldShow)
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll("section[id]")
        const navLinks = document.querySelectorAll(".nav-link[data-section]")

        let currentSection = ""

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100
            const sectionHeight = section.offsetHeight

            if (this.scrollPosition >= sectionTop && this.scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id
            }
        })

        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${currentSection}`
            link.classList.toggle("active", isActive)
        })
    }

    handleScrollAnimations() {
        // Additional scroll-based animations can be added here
        const parallaxElements = document.querySelectorAll("[data-parallax]")

        parallaxElements.forEach((element) => {
            const speed = element.getAttribute("data-parallax") || 0.5
            const yPos = -(this.scrollPosition * speed)
            element.style.transform = `translateY(${yPos}px)`
        })
    }

    setActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll(".nav-link")
        navLinks.forEach((link) => link.classList.remove("active"))
        activeLink.classList.add("active")
    }

    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - 80 // Account for fixed navbar
        const startPosition = window.pageYOffset
        const distance = targetPosition - startPosition
        const duration = 800
        let start = null

        const animation = (currentTime) => {
            if (start === null) start = currentTime
            const timeElapsed = currentTime - start
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration)

            window.scrollTo(0, run)

            if (timeElapsed < duration) {
                requestAnimationFrame(animation)
            }
        }

        requestAnimationFrame(animation)
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2
        if (t < 1) return (c / 2) * t * t + b
        t--
        return (-c / 2) * (t * (t - 2) - 1) + b
    }

    triggerEntryAnimations() {
        // Trigger initial animations after page load
        const heroElements = document.querySelectorAll(".hero-title, .hero-subtitle, .hero-buttons")

        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add("animate-in")
            }, index * 200)
        })
    }

    handleResize() {
        // Handle responsive behavior
        this.updateLayoutForScreenSize()

        // Recalculate positions for scroll-based features
        this.updateScrollPositions()
    }

    updateLayoutForScreenSize() {
        const isMobile = window.innerWidth <= 768
        const isTablet = window.innerWidth <= 1024

        // Update body class for CSS targeting
        document.body.classList.toggle("mobile", isMobile)
        document.body.classList.toggle("tablet", isTablet)

        // Adjust map height on mobile
        const mapContainer = document.querySelector(".map-container-interactive")
        if (mapContainer && isMobile) {
            mapContainer.style.height = "300px"
        } else if (mapContainer) {
            mapContainer.style.height = "600px"
        }
    }

    updateScrollPositions() {
        // Recalculate scroll positions after resize
        this.updateActiveNavigation()
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle
        return function () {
            const args = arguments

            if (!inThrottle) {
                func.apply(this, args)
                inThrottle = true
                setTimeout(() => (inThrottle = false), limit)
            }
        }
    }

    debounce(func, wait, immediate) {
        let timeout
        return function () {

            const args = arguments
            const later = () => {
                timeout = null
                if (!immediate) func.apply(this, args)
            }
            const callNow = immediate && !timeout
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
            if (callNow) func.apply(this, args)
        }
    }

    cleanup() {
        // Clean up observers and event listeners
        this.observers.forEach((observer) => {
            observer.disconnect()
        })
        this.observers.clear()

        console.log("🧹 UniMap cleaned up")
    }

    // Public API methods
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId)
        if (section) {
            this.smoothScrollTo(section)
        }
    }

    showNotification(message, type = "info") {
        this.announceToScreenReader(message)

        // Create visual notification
        const notification = document.createElement("div")
        notification.className = `notification notification-${type}`
        notification.textContent = message
        notification.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: var(--primary-color);
              color: white;
              padding: 1rem 1.5rem;
              border-radius: var(--border-radius);
              box-shadow: var(--shadow-medium);
              z-index: 10000;
              transform: translateX(100%);
              transition: transform 0.3s ease;
          `

        document.body.appendChild(notification)

        // Animate in
        setTimeout(() => {
            notification.style.transform = "translateX(0)"
        }, 100)

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = "translateX(100%)"
            setTimeout(() => {
                notification.remove()
            }, 300)
        }, 3000)
    }
}

// Initialize the application
const uniMapApp = new UniMapApp()

// Expose to global scope for debugging
window.UniMapApp = uniMapApp

// Additional CSS for animations
const additionalStyles = `
      .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
      }
  
      .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
      }
  
      .notification {
          font-weight: 500;
          border-left: 4px solid var(--secondary-color);
      }
  
      .notification-success {
          background: #28a745 !important;
      }
  
      .notification-error {
          background: #dc3545 !important;
      }
  
      .notification-warning {
          background: #ffc107 !important;
          color: #212529 !important;
      }
  
      @media (prefers-reduced-motion: reduce) {
          .animate-on-scroll {
              transition: none !important;
          }
      }
  `

// Inject additional styles
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)

console.log(" UniMap Enhanced Script Loaded Successfully!")