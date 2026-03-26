document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const body = document.body;
    let isMenuOpen = false;

    // Create mobile menu content by cloning nav links
    const navLinks = document.querySelector('.nav-links').cloneNode(true);
    mobileOverlay.appendChild(navLinks);

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileOverlay.classList.add('active');
            menuBtn.innerHTML = '<i class="ri-close-line"></i>';
            body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            mobileOverlay.classList.remove('active');
            menuBtn.innerHTML = '<i class="ri-menu-3-line"></i>';
            body.style.overflow = 'auto'; // Re-enable scrolling
        }
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close mobile menu when a link is clicked
    const mobileLinks = mobileOverlay.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // --- 3. Scroll Reveal Animations (Intersection Observer) ---
    const hiddenElements = document.querySelectorAll('.hidden');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: Stop observing once revealed to only animate once
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits bottom
    });

    hiddenElements.forEach((el) => observer.observe(el));

    // Staggered reveal for skills and projects children
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('show');
                    }, index * 150); // 150ms stagger
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const skillsContainer = document.querySelector('.skills-container');
    const projectGrid = document.querySelector('.project-grid');
    const certGrid = document.querySelector('.certifications-grid');
    
    // We already use base .hidden on children in HTML, but this lets us stagger them if desired
    // Currently, standard observer handles them nicely. The stagger observer is kept here if more complex staggering is needed.

    // --- 4. Active Navigation Link Update on Scroll ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // --- Project Data & Rendering ---
    const localProjects = [
        {
            name: 'Hospital-Online-Patient-Data-Organizer-System-',
            date: 'November 2025',
            language: 'JavaScript',
            description: 'HOPDS — a full-stack Healthcare Management Dashboard bridging clinicians, patients, and administrators. Features secure multi-role login portals, real-time patient data management, and a performance-optimized backend. Built with the MERN stack and deployed live on Vercel.',
            html_url: 'https://github.com/Ojasvimishra/Hospital-Online-Patient-Data-Organizer-System-',
            homepage: 'https://hospital-online-patient-data-organi.vercel.app',
            icon: 'ri-javascript-line',
            imgUrl: 'assets/Screenshot 2026-03-23 195504.png',
            techTags: ['MongoDB', 'Express.js', 'React', 'Node.js'],
            features: [
                'Multi-role authentication (Admin, Doctor, Patient)',
                'Real-time patient data management',
                'Live deployment on Vercel'
            ]
        },
        {
            name: 'DEKHO-BHARAT',
            date: 'February 2026',
            language: 'JavaScript',
            description: 'DEKHO BHARAT is an intelligent travel-discovery ecosystem merging hierarchical data modeling, algorithm optimization, and modern full-stack engineering. Delivers smart destination discovery with curated cultural experiences across India.',
            html_url: 'https://github.com/Ojasvimishra/DEKHO-BHARAT',
            homepage: 'http://localhost:5173',
            icon: 'ri-javascript-line',
            imgUrl: 'assets/Screenshot 2026-03-23 201404.png',
            techTags: ['React', 'Node.js', 'MongoDB', 'Vite'],
            features: [
                'Smart hierarchical destination discovery',
                'Full MERN stack architecture',
                'Cultural experiences & travel algorithms'
            ]
        }
    ];

    const renderProjectCard = (projectData) => {
        const grid = document.getElementById('github-projects-grid');
        if (!grid) return;

        const card = document.createElement('div');
        card.className = 'project-card glass-card hidden';
        
        const imgHTML = projectData.imgUrl ? `<div class="project-img-wrapper"><img src="${projectData.imgUrl}" alt="${projectData.name}" class="project-image" /></div>` : '';
        const techTagsHTML = projectData.techTags.map(t => `<span>${t}</span>`).join('');
        const featuresHTML = projectData.features.map(f => `<li><i class="ri-check-line"></i> ${f}</li>`).join('');

        card.innerHTML = `
            ${imgHTML}
            <div class="project-content">
                <div class="project-header">
                    <i class="${projectData.icon} project-icon"></i>
                    <span class="project-date">${projectData.date}</span>
                </div>
                <h3>${projectData.name.replace(/-/g, ' ')}</h3>
                <p>${projectData.description}</p>
                <ul class="project-features">
                    ${featuresHTML}
                </ul>
                <div class="tech-stack" style="flex-grow: 1;">
                    ${techTagsHTML}
                </div>
                <div class="project-links" style="margin-top: 15px;">
                    <a href="${projectData.html_url}" target="_blank" class="link-btn"><i class="ri-github-line"></i> GitHub Repo</a>
                    ${projectData.homepage ? `<a href="${projectData.homepage}" target="_blank" class="link-btn" style="margin-left: 15px;"><i class="ri-external-link-line"></i> Live Demo</a>` : ''}
                </div>
            </div>
        `;
        
        grid.appendChild(card);
        if (typeof observer !== 'undefined') observer.observe(card);
    };

    // --- 5. Project Showcase Logic ---
    const initProjectShowcase = async () => {
        const grid = document.getElementById('github-projects-grid');
        if (!grid) return;

        // Clear loading, but render local projects immediately for speed/reliability
        grid.innerHTML = '';
        localProjects.forEach(p => renderProjectCard(p));

        try {
            // Attempt to fetch more from GitHub to complement
            const response = await fetch('https://api.github.com/users/Ojasvimishra/repos?sort=updated&per_page=10');
            if (response.ok) {
                const repos = await response.json();
                
                // Only add projects that aren't already in the local list
                const newRepos = repos.filter(repo => {
                    const isDuplicate = localProjects.some(lp => lp.name.toLowerCase() === repo.name.toLowerCase());
                    return !isDuplicate && !repo.fork && repo.name !== 'Ojasvimishra' && repo.name !== 'Portfolio';
                });

                newRepos.forEach(repo => {
                    const date = new Date(repo.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    let icon = 'ri-github-line';
                    if (repo.language === 'JavaScript' || repo.language === 'TypeScript') icon = 'ri-javascript-line';
                    else if (repo.language === 'C++') icon = 'ri-code-s-slash-line';
                    
                    let bgImage = 'assets/img2.png';
                    
                    if (repo.name.toLowerCase().includes('counterfeit')) {
                        bgImage = 'assets/How-Can-Analytics-Detect-Counterfeits-on-E-Commerce-Platforms-1024x576.png';
                    }

                    renderProjectCard({
                        name: repo.name,
                        date: date,
                        description: repo.description || 'A software project developed by Ojasvi Mishra.',
                        html_url: repo.html_url,
                        homepage: repo.homepage,
                        icon: icon,
                        imgUrl: bgImage, // Default image for fetched projects
                        techTags: repo.language ? [repo.language] : ['Software'],
                        features: ['Maintained on GitHub', 'Source code available']
                    });
                });
            }
        } catch (error) {
            console.log('GitHub API Limit or Network Error - falling back to local projects only.');
            // We do nothing here because local projects are already rendered!
        }
    };

    initProjectShowcase();

    // --- 6. Custom Mouse Cursor & Spotlight Hover ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorDot) {
             cursorDot.style.left = `${mouseX}px`;
             cursorDot.style.top = `${mouseY}px`;
        }
    });

    const animateCursor = () => {
        let distX = mouseX - outlineX;
        let distY = mouseY - outlineY;
        
        // Easing for smooth trailing action
        outlineX += distX * 0.15;
        outlineY += distY * 0.15;
        
        if (cursorOutline) {
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const handleOnMouseMove = e => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // set CSS variable for mouse position exactly overlapping the card
        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
    };

    // Attach spotlight bounds to existing cards
    const attachSpotlightListeners = () => {
        const cards = document.querySelectorAll('.glass-card');
        for (const card of cards) {
            card.onmousemove = e => handleOnMouseMove(e);
        }
    }
    
    attachSpotlightListeners();

    // Observe and attach to dynamically created github items
    const observerSpotlight = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('glass-card')) {
                        node.onmousemove = e => handleOnMouseMove(e);
                    }
                });
            }
        });
    });

    const htmlGrid = document.getElementById('github-projects-grid');
    if (htmlGrid) {
        observerSpotlight.observe(htmlGrid, { childList: true, subtree: true });
    }

    // --- 7. Hero Text Typing Effect ---
    const scrambleEl = document.querySelector('.scramble-text');
    if (scrambleEl) {
        const phrases = ['Software Developer', 'Full-Stack Engineer', 'Open Source Contributor', 'Tech Innovator'];
        let currentPhrase = 0;
        let isDeleting = false;
        let text = '';
        
        const typeEffect = () => {
            const fullText = phrases[currentPhrase];
            
            if (isDeleting) {
                text = fullText.substring(0, text.length - 1);
            } else {
                text = fullText.substring(0, text.length + 1);
            }
            
            scrambleEl.innerHTML = text || '&nbsp;';
            
            let typeSpeed = isDeleting ? 30 : 80;
            
            if (!isDeleting && text === fullText) {
                typeSpeed = 2500; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && text === '') {
                isDeleting = false;
                currentPhrase = (currentPhrase + 1) % phrases.length;
                typeSpeed = 500; // Pause before new word
            }
            
            setTimeout(typeEffect, typeSpeed);
        };
        setTimeout(typeEffect, 1500); // Initial delay
    }
});
