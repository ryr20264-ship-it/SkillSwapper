/* ==========================================================================
   SkillSwapper - Animation Engine v2.0
   Author: Senior Frontend Developer & UI/UX Designer
   Description: Scroll-reveal, cursor glow, magnetic buttons, parallax,
                staggered entrances, counter animation, and rich interactions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       0. Custom Cursor Glow (desktop only)
       ====================================================================== */
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        const glow = document.createElement('div');
        const ring = document.createElement('div');
        glow.classList.add('cursor-glow');
        ring.classList.add('cursor-ring');
        document.body.appendChild(glow);
        document.body.appendChild(ring);

        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            glow.style.left = mouseX + 'px';
            glow.style.top  = mouseY + 'px';
        });

        // Smooth ring follow
        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            requestAnimationFrame(animateRing);
        };
        animateRing();

        // Expand ring on hoverable elements
        const hoverTargets = document.querySelectorAll(
            'a, button, .btn-premium, .glass-card, .feature-card, .nav-link, .accordion-button'
        );
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
        });
    }

    /* ======================================================================
       1. Scroll Reveal — Intersection Observer
       ====================================================================== */
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ======================================================================
       2. Auto-assign reveal classes to every major section element
       ====================================================================== */
    const autoRevealMap = [
        // Section headings
        { selector: '.section-title, .section-subtitle, .section-label', cls: 'reveal-slide-up' },
        // Feature / glass cards
        { selector: '.feature-card, .glass-card', cls: 'reveal-slide-up' },
        // Left-side content blocks
        { selector: '.about-text-col, .story-text', cls: 'reveal-slide-right' },
        // Right-side visuals
        { selector: '.about-visual-col, .story-visual', cls: 'reveal-slide-left' },
        // Step items in how-it-works
        { selector: '.step-item', cls: 'reveal-slide-up' },
        // Team cards
        { selector: '.team-card, .founder-card', cls: 'reveal-scale' },
        // FAQ items
        { selector: '.accordion-item', cls: 'reveal-slide-up' },
        // Footer columns
        { selector: '.footer-col', cls: 'reveal-slide-up' },
        // Stats / counter items
        { selector: '.stat-item, .metric-card', cls: 'reveal-scale' },
        // Generic content blocks
        { selector: '.why-card, .hub-orbit-item, .cta-card', cls: 'reveal-slide-up' },
    ];

    autoRevealMap.forEach(({ selector, cls }) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal', cls);
                // Stagger siblings (max 6)
                const delay = Math.min(i % 6 + 1, 6);
                el.classList.add(`delay-${delay}`);
            }
        });
    });

    // Re-observe newly tagged elements
    document.querySelectorAll('.reveal:not([data-observed])').forEach(el => {
        el.setAttribute('data-observed', '1');
        revealObserver.observe(el);
    });

    /* ======================================================================
       3. 3D Tilt Effect on Cards (desktop only)
       ====================================================================== */
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll(
            '.glass-card, .story-glass-card, .cta-glass-card, .feature-card, .founder-card, .team-card'
        );

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect  = card.getBoundingClientRect();
                const cx    = rect.width  / 2;
                const cy    = rect.height / 2;
                const ox    = (e.clientX - rect.left - cx) / cx;
                const oy    = (e.clientY - rect.top  - cy) / cy;
                const maxR  = 6;
                const rx    = -oy * maxR;
                const ry    =  ox * maxR;

                card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
                card.style.boxShadow = `${-ox*16}px ${-oy*16}px 36px rgba(139,92,246,0.14), 0 10px 30px rgba(0,0,0,0.45)`;
                card.style.backgroundImage = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.06) 0%, transparent 65%), linear-gradient(135deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.01) 100%)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
                card.style.backgroundImage = '';
            });
        });
    }

    /* ======================================================================
       4. Magnetic Button Effect (desktop only)
       ====================================================================== */
    if (!isTouchDevice) {
        const magnetBtns = document.querySelectorAll('.btn-premium, .back-to-top');

        magnetBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const dx   = e.clientX - (rect.left + rect.width / 2);
                const dy   = e.clientY - (rect.top  + rect.height / 2);
                btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px) scale(1.04)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
                setTimeout(() => { btn.style.transition = ''; }, 500);
            });
        });
    }

    /* ======================================================================
       5. Scroll Progress Bar (top of viewport)
       ====================================================================== */
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            if (total > 0) {
                progressBar.style.width = `${(window.pageYOffset / total) * 100}%`;
            }
        }, { passive: true });
    }

    /* ======================================================================
       6. Parallax on Hero visuals & section blobs
       ====================================================================== */
    if (!isTouchDevice) {
        const parallaxEls = [
            { els: document.querySelectorAll('.hero-glow-orb, .ambient-orb'), speed: 0.18 },
            { els: document.querySelectorAll('.hero-visual-wrapper'), speed: 0.06 },
        ];

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            parallaxEls.forEach(({ els, speed }) => {
                els.forEach(el => {
                    el.style.transform = `translateY(${scrollY * speed}px)`;
                });
            });
        }, { passive: true });
    }

    /* ======================================================================
       7. Number Counter on Scroll
       ====================================================================== */
    const counterEls = document.querySelectorAll('.counter-value');

    const startCounter = (el) => {
        const target   = parseInt(el.getAttribute('data-target'), 10);
        const suffix   = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const fps      = 1000 / 60;
        const frames   = Math.round(duration / fps);
        let f = 0;

        const tick = () => {
            f++;
            const progress = f / frames;
            const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
            if (f < frames) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString() + suffix;
        };
        tick();
    };

    const counterObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObs.observe(el));

    /* ======================================================================
       8. Button Ripple Effect
       ====================================================================== */
    document.querySelectorAll('.btn-premium').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top  = (e.clientY - rect.top)  + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    /* ======================================================================
       9. Navbar Shrink & Scroll-Spy
       ====================================================================== */
    const navbar   = document.querySelector('.navbar-custom');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-custom .nav-link');

    const onScroll = () => {
        // Shrink
        if (navbar) {
            navbar.classList.toggle('navbar-shrink', window.scrollY > 50);
        }

        // Scroll-spy
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Close mobile menu on link click
    const collapseEl = document.querySelector('.navbar-collapse');
    const toggler    = document.querySelector('.navbar-toggler-custom');
    navLinks.forEach(a => {
        a.addEventListener('click', () => {
            if (collapseEl && collapseEl.classList.contains('show') && toggler) toggler.click();
        });
    });

    /* ======================================================================
       10. Back-to-Top Button
       ====================================================================== */
    const bttBtn = document.querySelector('.back-to-top');
    if (bttBtn) {
        window.addEventListener('scroll', () => {
            bttBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        bttBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ======================================================================
       11. Typing Effect (Hero)
       ====================================================================== */
    const typingEl = document.getElementById('typing-text');
    const phrases  = ['Learn.', 'Teach.', 'Grow Together.'];
    let pIdx = 0, cIdx = 0, deleting = false, speed = 120;

    const type = () => {
        const phrase = phrases[pIdx];
        if (deleting) {
            typingEl.textContent = phrase.substring(0, --cIdx);
            speed = 50;
        } else {
            typingEl.textContent = phrase.substring(0, ++cIdx);
            speed = 140;
        }

        if (!deleting && cIdx === phrase.length) { deleting = true; speed = 2200; }
        else if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; speed = 500; }

        setTimeout(type, speed);
    };

    if (typingEl) setTimeout(type, 1200);

    /* ======================================================================
       12. Toast Notification System
       ====================================================================== */
    const showToast = (message, title = 'SkillSwapper') => {
        const toast = document.createElement('div');
        toast.className = 'toast-custom p-3';
        toast.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-1">
                <strong class="me-auto text-info font-heading"><i class="bi bi-patch-check-fill me-2"></i>${title}</strong>
                <button type="button" class="btn-close btn-close-white" style="font-size:0.75rem;" aria-label="Close"></button>
            </div>
            <div class="toast-body p-0 text-grey" style="font-size:0.88rem;">${message}</div>
        `;

        const container = document.querySelector('.toast-container-custom');
        if (!container) return;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 80);

        toast.querySelector('.btn-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        });
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }
        }, 4500);
    };

    // Newsletter form
    const nlForm = document.getElementById('newsletter-form');
    if (nlForm) {
        nlForm.addEventListener('submit', e => {
            e.preventDefault();
            const inp = nlForm.querySelector('input[type="email"]');
            if (!inp.value.trim()) return;
            showToast('Welcome! You are now subscribed to the SkillSwapper newsletter.', 'Subscription Successful');
            inp.value = '';
        });
    }

    // Contact form
    const ctForm = document.getElementById('contact-form');
    if (ctForm) {
        ctForm.addEventListener('submit', e => {
            e.preventDefault();
            const inputs = ctForm.querySelectorAll('.input-premium');
            let valid = true;
            inputs.forEach(inp => {
                if (!inp.value.trim()) { valid = false; inp.style.borderColor = '#ff5f56'; }
                else inp.style.borderColor = '';
            });
            if (valid) {
                showToast('Your message has been sent! We will get back to you shortly.', 'Message Dispatched');
                inputs.forEach(inp => inp.value = '');
            } else {
                showToast('Please complete all fields.', 'Form Validation Error');
            }
        });
    }

    /* ======================================================================
       13. Loading Screen Dismiss
       ====================================================================== */
    const loader = document.getElementById('loading-screen');
    if (loader) {
        document.body.style.overflow = 'hidden';
        let prog = 0;
        const iv = setInterval(() => {
            prog += Math.floor(Math.random() * 15) + 5;
            if (prog >= 100) {
                prog = 100;
                clearInterval(iv);
                setTimeout(() => {
                    loader.style.opacity = '0';
                    loader.style.visibility = 'hidden';
                    document.body.style.overflow = 'auto';
                }, 500);
            }
        }, 120);
    }

    /* ======================================================================
       14. Section entrance animation on first paint (hero)
       ====================================================================== */
    const heroSection = document.getElementById('hero');
    if (heroSection) heroSection.classList.add('section-enter');

    /* ======================================================================
       15. Smooth anchor scroll with offset
       ====================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    /* ======================================================================
       16. Animated gradient border on section headings on scroll
       ====================================================================== */
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeScaleIn 0.75s cubic-bezier(0.16,1,0.3,1) forwards';
            }
        });
    }, { threshold: 0.3 });
    sectionTitles.forEach(t => titleObs.observe(t));

});
