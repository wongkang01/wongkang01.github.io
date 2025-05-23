document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.side-nav ul li a');
    const sections = Array.from(document.querySelectorAll('.section')); // Convert to array
    const contentContainer = document.querySelector('.content-container');

    // Smooth scroll to section on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);

            if (targetSection) {
                // Scroll the contentContainer to the target section
                contentContainer.scrollTo({
                    top: targetSection.offsetTop, // Assumes offsetTop is relative to contentContainer's scrollable content
                    behavior: 'smooth'
                });
            }
            // Active class on navLinks will be primarily handled by the scroll listener for accuracy,
            // but for immediate feedback on click, we can also set it here.
            // However, to avoid conflicts, let the scroll listener be the source of truth.
        });
    });

    // Update active nav link based on scroll position and animate sections
    if (contentContainer && sections.length > 0) {
        // Initially hide all sections except About
        sections.forEach((section, index) => {
            if (index > 0) { // Hide all sections except the first (About)
                section.classList.add('hidden');
            }
        });

        const updateActiveNavLinkOnScroll = () => {
            const containerScrollTop = contentContainer.scrollTop;
            // An offset to trigger activation when the section is near the top of the viewport.
            // Adjust this value as needed (e.g., a fraction of viewport height or fixed pixels).
            const activationOffset = contentContainer.clientHeight * 0.4; 
            let currentActiveSectionId = '';

            // Default to the first section if scrolled to the very top
            if (containerScrollTop < 50) { // Small threshold for being at the top
                currentActiveSectionId = sections[0].id;
            } else {
                for (const section of sections) {
                    if (section.offsetTop <= containerScrollTop + activationOffset) {
                        currentActiveSectionId = section.id;
                    } else {
                        // Sections are ordered, so if this one isn't active, subsequent ones won't be.
                        break;
                    }
                }
            }
            
            // If scrolled to the very bottom, the last section should be active
            if (containerScrollTop + contentContainer.clientHeight >= contentContainer.scrollHeight - 2) { // 2px tolerance
                currentActiveSectionId = sections[sections.length - 1].id;
            }

            navLinks.forEach(navLink => {
                if (navLink.getAttribute('data-section') === currentActiveSectionId) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            });
        };

        // Section animation observer
        const sectionObserverOptions = {
            root: contentContainer,
            rootMargin: '0px 0px -20% 0px',
            threshold: 0.1
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('hidden');
                    entry.target.classList.add('animate-in');
                }
            });
        }, sectionObserverOptions);

        // Observe all sections except the first one (About)
        sections.forEach((section, index) => {
            if (index > 0) {
                sectionObserver.observe(section);
            }
        });

        contentContainer.addEventListener('scroll', updateActiveNavLinkOnScroll);
        // Initial call to set active link on page load
        updateActiveNavLinkOnScroll();
    }

    // Card animation on scroll
    const observerOptions = {
        root: contentContainer,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        cardObserver.observe(card);
    });

    // Cursor effect - responsive background spotlight
    const cursorEffectArea = document.querySelector('.cursor-effect-area');
    let isMouseActive = false;
    let mouseX = 0;
    let mouseY = 0;

    // Throttle function to improve performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Update cursor position
    const updateCursorPosition = throttle((e) => {
        mouseX = (e.clientX / window.innerWidth) * 100;
        mouseY = (e.clientY / window.innerHeight) * 100;
        
        if (cursorEffectArea) {
            cursorEffectArea.style.setProperty('--mouse-x', mouseX + '%');
            cursorEffectArea.style.setProperty('--mouse-y', mouseY + '%');
        }
    }, 16); // ~60fps

    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        if (!isMouseActive) {
            isMouseActive = true;
            cursorEffectArea?.classList.add('active');
        }
        updateCursorPosition(e);
    });

    // Mouse leave event
    document.addEventListener('mouseleave', () => {
        isMouseActive = false;
        cursorEffectArea?.classList.remove('active');
    });

    // Touch device handling - disable cursor effect on touch devices
    document.addEventListener('touchstart', () => {
        isMouseActive = false;
        cursorEffectArea?.classList.remove('active');
    }, { once: true });

    // Remove the old initial activation logic that might conflict or be redundant
    // The scroll listener's initial call should handle the active state.
    // Example of what's being replaced/removed:
    // if (navLinks.length > 0) {
    //     navLinks[0].classList.add('active');
    //     showSection(navLinks[0].getAttribute('data-section')); // showSection is removed
    // }
    // Also removing the fallback logic that used showSection.
});