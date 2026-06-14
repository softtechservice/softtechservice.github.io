/**
 * SoftTech Service Website - Main JavaScript
 * Handles navigation, animations, form validation, and interactive features
 */

(function() {
    'use strict';

    // ============================================
    // Theme toggle (light / dark)
    // ============================================
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0B1120' : '#0F172A');
        }
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }
    }

    // Sync UI with the theme set by the inline head script
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) {}
        });
    }

    // Follow OS theme changes when the user hasn't chosen explicitly
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            let stored = null;
            try { stored = localStorage.getItem('theme'); } catch (err) {}
            if (!stored) applyTheme(e.matches ? 'dark' : 'light');
        });
    }

    // ============================================
    // Current year in footer
    // ============================================
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

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
                const navOffset = 96; // floating navbar (72px) + top spacing
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
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

    if (navbar) {
        const onScroll = () => {
            navbar.classList.toggle('scrolled', window.pageYOffset > 24);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ============================================
    // Intersection Observer for scroll reveal
    // ============================================
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        reveals.forEach(el => el.classList.add('in'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

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
    // Back to top button
    // ============================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.pageYOffset > 600);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // Scroll-spy: highlight active nav link
    // ============================================
    const sections = document.querySelectorAll('main section[id]');
    const navItems = document.querySelectorAll('.nav-menu a[href^="#"]');
    if (sections.length && navItems.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navItems.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { threshold: 0, rootMargin: '-40% 0px -55% 0px' });
        sections.forEach(s => spy.observe(s));
    }

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
    console.log('%cSoftTech Service', 'color: #0369A1; font-size: 20px; font-weight: bold;');
    console.log('%cWebsite built with modern web standards', 'color: #475569; font-size: 12px;');
    console.log('%cContact: contect@softtechservice.site', 'color: #475569; font-size: 12px;');

})();
