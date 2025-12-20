/**
 * SoftTech Service Website - Main JavaScript
 * Handles navigation, animations, form validation, and interactive features
 */

(function() {
    'use strict';

    // ============================================
    // Mobile Navigation Toggle
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ============================================
    // Smooth Scrolling
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            } else {
                navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animations
    const animatedElements = document.querySelectorAll(
        '.service-card, .product-card, .client-card, .contact-card, .why-card, .portfolio-card, .process-step, .tech-category, .feature-item'
    );

    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.15s ease ${index * 0.02}s, transform 0.15s ease ${index * 0.02}s`;
        observer.observe(element);
    });

    // ============================================
    // Contact Form Validation
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Validation rules
        const validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            phone: {
                required: false,
                pattern: /^[\d\s\-\+\(\)]+$/
            },
            message: {
                required: true,
                minLength: 10
            }
        };

        // Get form elements
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');
        const formSuccess = document.getElementById('formSuccess');

        // Validation functions
        function showError(input, message) {
            const errorElement = document.getElementById(input.id + '-error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
        }

        function clearError(input) {
            const errorElement = document.getElementById(input.id + '-error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
            input.classList.remove('error');
            input.setAttribute('aria-invalid', 'false');
        }

        function validateField(input, rules) {
            const value = input.value.trim();
            clearError(input);

            // Required validation
            if (rules.required && !value) {
                showError(input, 'This field is required');
                return false;
            }

            // Skip other validations if field is empty and not required
            if (!value && !rules.required) {
                return true;
            }

            // Min length validation
            if (rules.minLength && value.length < rules.minLength) {
                showError(input, `Minimum ${rules.minLength} characters required`);
                return false;
            }

            // Pattern validation
            if (rules.pattern && !rules.pattern.test(value)) {
                if (input.id === 'email') {
                    showError(input, 'Please enter a valid email address');
                } else if (input.id === 'phone') {
                    showError(input, 'Please enter a valid phone number');
                } else if (input.id === 'name') {
                    showError(input, 'Name should only contain letters and spaces');
                } else {
                    showError(input, 'Invalid format');
                }
                return false;
            }

            return true;
        }

        // Real-time validation
        if (nameInput) {
            nameInput.addEventListener('blur', () => {
                validateField(nameInput, validationRules.name);
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                validateField(emailInput, validationRules.email);
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                if (phoneInput.value.trim()) {
                    validateField(phoneInput, validationRules.phone);
                }
            });
        }

        if (messageInput) {
            messageInput.addEventListener('blur', () => {
                validateField(messageInput, validationRules.message);
            });
        }

        // Form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            
            if (nameInput) {
                if (!validateField(nameInput, validationRules.name)) {
                    isValid = false;
                }
            }

            if (emailInput) {
                if (!validateField(emailInput, validationRules.email)) {
                    isValid = false;
                }
            }

            if (phoneInput && phoneInput.value.trim()) {
                if (!validateField(phoneInput, validationRules.phone)) {
                    isValid = false;
                }
            }

            if (messageInput) {
                if (!validateField(messageInput, validationRules.message)) {
                    isValid = false;
                }
            }

            if (isValid) {
                // Form is valid - in a real application, you would send data to a server
                // For now, we'll just show a success message
                if (formSuccess) {
                    formSuccess.textContent = 'Thank you! Your message has been sent. We will get back to you soon.';
                    formSuccess.classList.add('show');
                    
                    // Clear form
                    contactForm.reset();
                    
                    // Clear all errors
                    document.querySelectorAll('.error-message').forEach(error => {
                        error.classList.remove('show');
                    });
                    document.querySelectorAll('.error').forEach(input => {
                        input.classList.remove('error');
                        input.setAttribute('aria-invalid', 'false');
                    });

                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formSuccess.classList.remove('show');
                    }, 5000);

                    // Scroll to success message
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } else {
                // Focus on first error field
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // ============================================
    // Scroll to Top Button (Optional Enhancement)
    // ============================================
    let scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 999;
        transition: all 0.2s ease;
    `;
    
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    }, { passive: true });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(-4px)';
        scrollToTopBtn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    });

    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'translateY(0)';
        scrollToTopBtn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    });

    // ============================================
    // Performance: Lazy load images (if any are added)
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Console message for developers
    // ============================================
    console.log('%cSoftTech Service', 'color: #2563eb; font-size: 20px; font-weight: bold;');
    console.log('%cWebsite built with modern web standards', 'color: #6b7280; font-size: 12px;');
    console.log('%cContact: contect@softtechservice.site', 'color: #6b7280; font-size: 12px;');

})();
