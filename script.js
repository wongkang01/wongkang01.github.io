document.addEventListener('DOMContentLoaded', () => {
    // Get all sections and navigation links
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Function to update active navigation link
    const updateNavLinks = () => {
        const scrollPosition = window.scrollY;

        // Find which section is currently in view
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop - window.innerHeight / 2 && 
                scrollPosition < sectionTop + sectionHeight - window.innerHeight / 2) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current link
                navLinks[index].classList.add('active');
            }
        });
    };

    // Update active link on scroll
    window.addEventListener('scroll', updateNavLinks);

    // Initial call to set active link on page load
    updateNavLinks();

    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Tab functionality for About section
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to current button
            button.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // ANIMATION ON SCROLL - IMPROVED TO RUN EVERY TIME
    // Track currently visible section for animation reset
    let currentVisibleSectionId = null;
    let previouslyVisibleSectionId = null;

    // Function to check if sections are in viewport and manage animations
    const checkSectionsInView = () => {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionId = section.id;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Check if this section is currently in view (center of viewport)
            if (scrollPosition >= sectionTop - window.innerHeight / 2 && 
                scrollPosition < sectionTop + sectionHeight - window.innerHeight / 2) {
                
                currentVisibleSectionId = sectionId;
                
                // If we've changed sections
                if (previouslyVisibleSectionId !== currentVisibleSectionId) {
                    console.log(`Switching from ${previouslyVisibleSectionId} to ${currentVisibleSectionId}`);
                    
                    // Reset animations for previously visible section if it exists and is different
                    if (previouslyVisibleSectionId && previouslyVisibleSectionId !== currentVisibleSectionId) {
                        resetSectionAnimations(previouslyVisibleSectionId);
                    }
                    
                    // Animate current section elements
                    animateSectionElements(currentVisibleSectionId);
                    
                    // Update the previously visible section
                    previouslyVisibleSectionId = currentVisibleSectionId;
                }
            }
        });
    };
    
    // Function to reset animations for a section
    const resetSectionAnimations = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const animatedElements = section.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        animatedElements.forEach(element => {
            element.classList.remove('appear');
            
            // Force reflow to ensure CSS transitions restart
            void element.offsetWidth;
        });
    };
    
    // Function to animate elements in a section
    const animateSectionElements = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const animatedElements = section.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        
        // Delay slightly to ensure animations run after reset
        setTimeout(() => {
            animatedElements.forEach(element => {
                element.classList.add('appear');
            });
        }, 50);
    };
    
    // Listen for scroll events
    window.addEventListener('scroll', checkSectionsInView);
    
    // Initial check
    checkSectionsInView();
});
