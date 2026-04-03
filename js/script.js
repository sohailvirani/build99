document.addEventListener('DOMContentLoaded', () => {
    // Load Header and Footer
    const root = window.appRoot || '';
    Promise.all([
        fetch(root + 'includes/header.html').then(response => response.text()),
        fetch(root + 'includes/footer.html').then(response => response.text())
    ]).then(([headerHtml, footerHtml]) => {
        document.getElementById('header-placeholder').innerHTML = headerHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;

        // Fix navigation links based on root
        if (root) {
             const navLinks = document.querySelectorAll('.site-header a');
             navLinks.forEach(link => {
                 const href = link.getAttribute('href');
                 if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
                     link.setAttribute('href', root + href);
                 }
             });

             const headerImages = document.querySelectorAll('.site-header img');
             headerImages.forEach(img => {
                 const src = img.getAttribute('src');
                 if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                     img.setAttribute('src', root + src);
                 }
             });

             const footerLinks = document.querySelectorAll('.site-footer a');
             footerLinks.forEach(link => {
                 const href = link.getAttribute('href');
                 if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
                     link.setAttribute('href', root + href);
                 }
             });

             const footerImages = document.querySelectorAll('.site-footer img');
             footerImages.forEach(img => {
                 const src = img.getAttribute('src');
                 if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                     img.setAttribute('src', root + src);
                 }
             });
        }

        initHeader();
        
        // Set Active Navigation Link
        setActiveNavigation();
        initHeaderSearch();
    }).catch(error => console.error('Error loading includes:', error));

    // Initialize Modals
    initModals();

    // Initialize Hero Slider
    initHeroSlider();

    // Initialize Scroll Animations
    initScrollAnimations();

    // Initialize Service Carousel
    initServiceCarousel();

    initProjectCategoryFilter();
    initContactForm();
    initHeroRequirementForm();
});

function setActiveNavigation() {
    const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
    const allNavLinks = document.querySelectorAll('.header-nav a, .mobile-nav a');

    // First, remove active class from all links
    allNavLinks.forEach(link => link.classList.remove('active'));

    allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;

        let isActive = false;

        // Get the absolute path the link points to
        const tempLink = document.createElement('a');
        tempLink.href = link.href;
        let linkPath = tempLink.pathname.replace(/\/index\.html$/, '/');

        // Ensure both paths end with a slash for exact comparison
        if (!linkPath.endsWith('/')) linkPath += '/';
        let comparePath = currentPath;
        if (!comparePath.endsWith('/')) comparePath += '/';

        if (comparePath === linkPath) {
            isActive = true;
        }

        if (isActive) {
            link.classList.add('active');
            
            // If it's a dropdown item, also highlight the parent "Services" link
            const dropdown = link.closest('.dropdown-menu');
            if (dropdown) {
                const parentLink = dropdown.previousElementSibling;
                if (parentLink) parentLink.classList.add('active');
            }

            // Mobile equivalent
            const mobileDropdown = link.closest('.mobile-dropdown-menu');
            if (mobileDropdown) {
                const parentLink = mobileDropdown.previousElementSibling;
                if (parentLink) parentLink.classList.add('active');
                // Also open the mobile dropdown
                mobileDropdown.classList.add('active');
                const icon = parentLink.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            }
        }
    });
}

function initServiceCarousel() {
    const tracks = document.querySelectorAll('.carousel-track');
    if (tracks.length === 0) return;
    
    tracks.forEach(track => {
        // Duplicate slides for seamless loop
        const slides = Array.from(track.children);
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
        });
    });
}

function initProjectCategoryFilter() {
    const sections = document.querySelectorAll('.projects-completed-page');
    if (sections.length === 0) return;

    const determineCategory = (title) => {
        const t = (title || '').toLowerCase();
        if (t.includes('cafe') || t.includes('dhaba') || t.includes('restaurant')) return 'cafe-restaurant';
        if (t.includes('gym')) return 'gym';
        if (t.includes('venture')) return 'venture-developments';
        if (t.includes('interior')) return 'interiors';
        if (t.includes('pmc')) return 'pmc-works';
        if (
            t.includes('culvert') ||
            t.includes('bridge') ||
            t.includes('road') ||
            t.includes('highway') ||
            t.includes('railway') ||
            t.includes('pipeline') ||
            t.includes('oht') ||
            t.includes('esr') ||
            t.includes('ugr')
        ) return 'infra-works';
        return 'buildings';
    };

    sections.forEach(section => {
        const buttons = Array.from(section.querySelectorAll('.project-category-btn'));
        const cards = Array.from(section.querySelectorAll('.project-card.completed'));

        if (buttons.length === 0 || cards.length === 0) return;

        cards.forEach(card => {
            if (card.dataset && card.dataset.category) return;
            const titleEl = card.querySelector('.project-details h3');
            const title = titleEl ? titleEl.textContent : '';
            card.dataset.category = determineCategory(title);
        });

        const applyFilter = (category) => {
            cards.forEach(card => {
                const cardCategory = card.dataset.category || 'buildings';
                const shouldShow = category === 'all' ? true : cardCategory === category;
                card.style.display = shouldShow ? '' : 'none';
            });
        };

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-category') || 'all';
                applyFilter(category);
            });
        });

        const initial = buttons.find(b => b.classList.contains('active')) || buttons[0];
        const initialCategory = initial.getAttribute('data-category') || 'all';
        applyFilter(initialCategory);
    });
}

function initHeaderSearch() {
    const form = document.getElementById('header-search-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[name="q"]');
        const rawQuery = input ? input.value : '';
        const query = (rawQuery || '').trim();
        if (!query) return;

        const root = window.appRoot || '';
        const q = query.toLowerCase();
        const routes = [
            { keywords: ['survey'], href: 'services/surveying/' },
            { keywords: ['geotechnical', 'structural testing', 'material testing', 'ndt', 'testing'], href: 'services/geotechnical-&-structural-testing-services/' },
            { keywords: ['architect', 'architectural', 'planning', 'design'], href: 'services/architectural-designs/' },
            { keywords: ['building', 'construction', 'residential', 'commercial', 'industrial'], href: 'services/building-constructions/' },
            { keywords: ['interior', 'finishing'], href: 'services/interior-and-finishing/' },
            { keywords: ['cement', 'concrete', 'steel', 'tmt', 'sand', 'aggregate', 'materials'], href: 'services/construction-materials/' },
            { keywords: ['renovation', 'demolition', 'specialized'], href: 'services/renovation-specialized-site-works/' },
            { keywords: ['mep', 'electrical', 'plumbing', 'hvac', 'utility'], href: 'services/mep-&-utility-installation-works/' },
            { keywords: ['pmc', 'project management', 'mis', 'reporting'], href: 'services/pmc-&-global-technical-services/' },
            { keywords: ['infrastructure', 'road', 'bridge', 'pipeline', 'water', 'sewerage'], href: 'services/infrastructure-projects-&-specialized-engineering-works/' },
            { keywords: ['rental', 'amenities', 'play equipment'], href: 'services/public-amenities-construction-rental-services/' }
        ];

        const match = routes.find(r => r.keywords.some(k => q.includes(k)));
        const url = match ? (root + match.href) : (root + '#services');

        sessionStorage.setItem('build99_search_query', query);
        window.location.href = url;
    });
}

function getFormSubmitEndpoint() {
    return window.formSubmitEndpoint || 'https://formsubmit.co/ajax/info.build99@gmail.com';
}

function buildSubmissionId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

async function submitToEmail(formData) {
    const formType = formData.get('form_type') || 'Website Enquiry';
    const submissionId = buildSubmissionId();
    const email = formData.get('email');

    formData.set('submission_id', submissionId);
    formData.set('_subject', `Build99 Enquiry - ${formType} - ${submissionId}`);
    formData.set('_template', 'table');
    formData.set('_captcha', 'false');
    formData.set('page_url', window.location.href);
    if (email) formData.set('_replyto', email);

    const response = await fetch(getFormSubmitEndpoint(), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Submit failed');
    }
    return response.json().catch(() => ({}));
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form') || document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        formData.append('form_type', 'Contact');

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            await submitToEmail(formData);
            contactForm.innerHTML = `
                <div class="form-success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Thank You!</h2>
                    <p>Message was sent successfully.</p>
                </div>
            `;
        } catch (err) {
            if (submitBtn) submitBtn.disabled = false;
            alert('Unable to send message. Please try again.');
        }
    });
}

function initHeroRequirementForm() {
    const form = document.getElementById('hero-requirement-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            formData.append('form_type', 'Home Hero Requirement');
            await submitToEmail(formData);

            form.innerHTML = `
                <div class="form-success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Thank You!</h2>
                    <p>Message was sent successfully.</p>
                </div>
            `;
        } catch (err) {
            if (submitBtn) submitBtn.disabled = false;
            alert('Unable to send message. Please try again.');
        }
    });
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    const nextSlide = () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    };

    setInterval(nextSlide, slideInterval);
}

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
    revealElements.forEach(el => observer.observe(el));
}

function initHeader() {
    const header = document.querySelector('.site-header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const closeMenu = document.querySelector('.close-menu');
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

    // Adjust body padding to header height
    const setBodyPadding = () => {
        if (header) {
            document.body.style.paddingTop = `${header.offsetHeight}px`;
        }
    };
    setBodyPadding();
    window.addEventListener('resize', setBodyPadding);

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Open
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuContainer.classList.add('active');
            mobileMenuOverlay.classList.add('active');
        });
    }

    // Mobile Menu Close
    const closeMobileMenu = () => {
        mobileMenuContainer.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
    };

    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Mobile Dropdown Toggle
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = toggle.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('active');
                // Toggle icon
                const icon = toggle.querySelector('i');
                if (icon) {
                    if (dropdown.classList.contains('active')) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    } else {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                }
            }
        });
    });
}

// Data: All Services List
const ALL_SERVICES = [
    "Topo Survey", "Contour Survey", "Building Survey", "Drone Survey", "As Built Survey",
    "GIS Mapping", "Bathymetric Survey", "Pipeline Survey", "Road Survey", "Soil Test",
    "Soil Boring", "Construction Material Testing", "Concrete Testing", "Water Testing",
    "Bridge Load Testing", "NDT Testing", "Carbonation Testing", "GIT", "Planning",
    "Structural Designs", "MEP Drawings", "HVAC Designs", "Building Information Modeling",
    "Elevation Drawings", "Estimations, Costing and Valuation", "Interior Designs",
    "3D Walkthrough Animation", "Residential Buildings", "Commercial Buildings",
    "Precast Buildings", "Eco-friendly Homes", "Pre-Fabricated Buildings / PEB Structures",
    "Light Gauge Framing System (LGFS)", "Wooden Houses", "Bamboo Houses", "Modular Buildings",
    "Residential Interior", "Commercial Interior", "Outdoor Interior", "Modular / Island Kitchen",
    "Home Automation", "False Ceiling", "Maximalist Interior Design", "Wallpaper Designs",
    "Landscaping", "Cement", "Steel", "Bricks and Blocks", "Fine & Coarse Aggregates",
    "Electrical Material", "Paints", "Precast Blocks", "Doors and Windows", "Plywood",
    "Shuttering & Bar Bending", "Concrete Work", "Brick Masonry & Plastering", "Electrical Work",
    "Plumbing Work", "Flooring", "Carpentry Services", "Painting", "Waterproofing Works",
    "Vastu Service", "Earthworks", "Demolition Service", "Renovation Works", "Fabrication Works",
    "Scaffolding Works", "Pest Control", "ACP Sheets and Glass Work Services", "Railing Work",
    "PMC Services", "Building Inspection", "Quality Check", "Project Reports",
    "Safety and Environment Engineering Services", "Human Resource Management",
    "Vendor Management Procurement", "Tender Process", "Government Permissions",
    "Roads (B.T & C.C)", "Pavements", "Railway Works", "Water Supply Management",
    "Waste Water Management", "Overhead Tank", "Warehouses", "Poultry Farms", "Swimming Pools",
    "Open Plotting Ventures", "Farm Land Developments", "Farm Houses", "Resorts",
    "Gated Communities", "Row Houses", "Townships", "Residential Developments", "Land Developments",
    "Café, Restaurant & Retail Building Construction", "Studio Apartment & Co-Living Building Construction", "Modular & Smart Home Construction",
    "Turnkey Interior Execution", "Modular Kitchen & Island Kitchen Installation", "False Ceiling & Designer Ceiling Execution",
    "Carpentry & Custom Furniture Works", "Terrace Gardening & Balcony & Sit-Out Area Execution", "Facade & Cladding Execution",
    "Gym Renovation, Remodeling & Interior Services", "Excavator / JCB on Rent",
    "Road & Highway Infrastructure Projects", "Warehouse & Logistics Infrastructure", "Water Supply & Distribution Projects",
    "Pipeline Infrastructure Projects", "Micro-Tunneling & Trenchless Works", "Pipe Jacking & HDD Works", "Rigid Pavement (PQ Concrete) Works"
];

// Data: Surveying Services Form Configuration
const SURVEY_SERVICE_CONFIG = {
    "Topographical Land Survey": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Type of land?", name: "land_type", type: "select", options: ["Open plot", "Agricultural", "Mixed"], required: true },
        { label: "Do you need elevation & contour details?", name: "needs_details", type: "radio", options: ["Yes", "No"], required: true }
    ],
    "Land Boundary Demarcation (Tipon Survey)": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Do you have land documents available?", name: "docs_available", type: "radio", options: ["Yes", "No"], required: true },
        { label: "Any boundary dispute or encroachment?", name: "dispute", type: "radio", options: ["Yes", "No"], required: true }
    ],
    "Contour Survey & Cut–Fill Analysis": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Terrain type?", name: "terrain_type", type: "select", options: ["Flat", "Hilly", "Uneven"], required: true },
        { label: "Do you need cut & fill calculation?", name: "needs_calc", type: "radio", options: ["Yes", "No"], required: true }
    ],
    "Building Survey": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Current stage?", name: "stage", type: "select", options: ["Planning", "Ongoing", "Completed"], required: true },
        { label: "Requirement?", name: "requirement_type", type: "select", options: ["Column marking", "Building Layout Marking", "Excavation marking"], required: true }
    ],
    "As-Built Survey": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Is construction completed?", name: "is_completed", type: "radio", options: ["Yes", "No"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Building As-Built Survey", "Industrial As-Built Survey"], required: true }
    ],
    "Drone Survey & Aerial Mapping": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Mapping", "Inspection", "Marketing"], required: true },
        { label: "Output required?", name: "output", type: "select", options: ["Aerial Photography Survey", "Drone Ortho video survey"], required: true }
    ],
    "GIS Mapping & Spatial Data Analysis": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Geo Referencing", "Digitization of Site Features", "Cadastral mapping"], required: true },
        { label: "Do you have existing data/maps?", name: "has_data", type: "radio", options: ["Yes", "No"], required: true }
    ],
    "Utility Mapping & Underground Services Survey (GPR)": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Known utilities?", name: "utilities", type: "select", options: ["Ground Penetrating radar survey", "Pipelines Mapping", "Cable Mapping"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Detection", "Safety", "Planning"], required: true }
    ],
    "DPR Survey & Feasibility Studies": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is the approximate project length/area?", name: "project_size", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Railway DPR", "Pipeline DPR", "Road DPR"], required: true },
        { label: "Requirement?", name: "requirement_scope", type: "select", options: ["Full DPR", "Feasibility only"], required: true }
    ],
    "Layout Planning Survey": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Layout type?", name: "layout_type", type: "select", options: ["HMDA layout Planning", "DTCP layout Planning", "Farm land layout Planning"], required: true }
    ],
    "Hydrographic Survey": [
        { label: "Where is the water body located?", name: "water_location", type: "text", required: true },
        { label: "What is the approximate survey area?", name: "survey_area", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Ponds Bathymetric survey", "River and Lake Bathymetric survey", "Sea-Bathymetric Survey"], required: true }
    ],
    "LiDAR Survey": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement_detail", type: "select", options: ["Open Land lidar"], required: true }
    ],
    "Soil Investigation": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Type of investigation required?", name: "investigation_type", type: "select", options: ["Borehole Drilling", "Auger boring test", "Trail pit testing"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Construction", "Foundation design", "Soil study"], required: true }
    ],
    "Plate Load Testing": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the test area/plot size?", name: "plot_size", type: "text", required: true },
        { label: "Required test type or load capacity?", name: "load_capacity", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Bearing capacity", "Foundation design"], required: true }
    ],
    "Pile Load Testing (Static)": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Number of piles to be tested?", name: "pile_count", type: "text", required: true },
        { label: "Type of test?", name: "test_type", type: "select", options: ["Compression Load test", "Pull out Load test", "Lateral Load test"], required: true },
        { label: "Required load capacity?", name: "load_capacity", type: "text", required: true }
    ],
    "Construction Materials Testing": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of material?", name: "material_type", type: "select", options: ["Cement Testing", "Steel Testing", "Concrete Cub Testing"], required: true },
        { label: "Type of test required?", name: "test_type", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Quality check", "Compliance", "Certification"], required: true }
    ],
    "Soil Resistivity Testing (Earthing)": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Solar Projects", "Sub Stations Projects", "Telecom Structures"], required: true },
        { label: "Area size or number of test points?", name: "test_points", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Earthing design", "Safety compliance"], required: true }
    ],
    "Non-Destructive Testing (NDT)": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Structure type?", name: "structure_type", type: "select", options: ["Building", "Bridge", "Industrial"], required: true },
        { label: "Type of test?", name: "test_type", type: "select", options: ["Rebound Hammer Test", "UPV Test", "Half Cell potential Test"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Strength check", "Condition assessment"], required: true }
    ],
    "Structural Audit & Retrofitting": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of structure?", name: "structure_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Structural Condition Assessment", "Crack mapping analysis", "Retrofitting design proposal"], required: true }
    ],
    "Anchor Bolt / Rebar Pull-Out Testing": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of element?", name: "element_type", type: "select", options: ["Anchor bolt", "Rebar"], required: true },
        { label: "Required test?", name: "test_type", type: "select", options: ["On-site pull out load test", "Proof load testing"], required: true }
    ],
    "Core Cutting": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Material type?", name: "material_type", type: "select", options: ["RCC core cutting", "Asphalt Core Cutting"], required: true },
        { label: "Number of cores required?", name: "core_count", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Testing", "Analysis", "Quality check"], required: true }
    ],
    "Bridge Load Testing": [
        { label: "Where is the structure located?", name: "structure_location", type: "text", required: true },
        { label: "Structure type?", name: "structure_type", type: "select", options: ["Bridge Testing", "Flyovers Testing", "Culvert Testing"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Load capacity", "Safety verification"], required: true }
    ],
    "Concrete Mix Design": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of mix?", name: "mix_type", type: "select", options: ["Concrete mix design", "Asphalt mix design"], required: true },
        { label: "Grade or specification required?", name: "specification", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Project use", "Approval", "Optimization"], required: true }
    ],
    "Geological Investigation": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Required study?", name: "study_type", type: "select", options: ["Geological mapping", "Slope stability assessment", "Seismic hazard evaluation"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Project planning", "Risk assessment"], required: true }
    ],
    "Rock Investigation": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Required test?", name: "test_type", type: "select", options: ["Core Drilling in rock", "Rock quality Designation", "Unconfined Compressive strength test"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Foundation", "Stability analysis"], required: true }
    ],
    "Offshore Geotechnical Investigation": [
        { label: "Project location (offshore area details)?", name: "offshore_location", type: "text", required: true },
        { label: "Required service?", name: "service_type", type: "select", options: ["Offshore borehole Drilling", "Seabed Sampling", "CPT (Cone penetration test)"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Foundation", "Marine construction"], required: true }
    ],
    "Architectural Planning": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is the plot size?", name: "plot_size", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "select", options: ["Residential Building Designs", "Commercial Building Designs", "Industrial Designs"], required: true }
    ],
    "Project Estimation & BOQ": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Estimation Costings", "Bar Bending Schedule (BBS)", "Boq preparation"], required: true }
    ],
    "MEP Design": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of building?", name: "building_type", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Electrical layout planning", "Plumbing layout design", "MEP Coordination drawings"], required: true }
    ],
    "As-Built Drawings": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of building?", name: "building_type", type: "select", options: ["Building As-built survey", "Industrial As-built survey", "Commercial As-built Survey"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Documentation", "Approval", "Records"], required: true }
    ],
    "HVAC Design": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Building type?", name: "building_type", type: "select", options: ["Office", "Industrial", "Commercial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Duct layout Design", "Ventilation system Designs"], required: true }
    ],
    "SLD (Water, Sewerage, Fire, Electrical)": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of building?", name: "building_type", type: "text", required: true },
        { label: "Services required?", name: "services", type: "select", options: ["Electrical SLD", "Water supply schematic & Drainage SLD", "Fire System Schematic"], required: true }
    ],
    "Landscape Planning & Design": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Softscape Planning", "Hardscape Design", "Irrigation Layout"], required: true }
    ],
    "Structural Designs": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Building Structural Designs", "Infra Project Designs", "Industrial Structural Designs"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New design", "Review", "Optimization"], required: true }
    ],
    "Interior Design": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of space?", name: "space_type", type: "select", options: ["Home", "Office", "Retail"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["3D Interior Designs", "Façade Designs", "Walkthrough Animations"], required: true }
    ],
    "Working / GFC Drawings": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential Building Designs", "Commercial Building Designs", "Industrial Designs"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Detailed working drawings", "GFC set"], required: true }
    ],
    "Shop Drawings & Detailed Construction Drawings": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Building", "Industrial", "Infra"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Fabrication Drawing", "Installation Detail Drawing", "Reinforcement Shop Drawings"], required: true }
    ],
    "Individual House Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is the plot size?", name: "plot_size", type: "text", required: true },
        { label: "Required construction type?", name: "construction_type", type: "select", options: ["Ground Floor Buildings", "G+1 Building Construction", "G+2 Building Construction"], required: true }
    ],
    "Luxury Home Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is the plot size?", name: "plot_size", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "select", options: ["Villa Construction", "Duplex Building Construction", "Triplex Villa Construction"], required: true }
    ],
    "Turnkey Residential Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is the project type?", name: "project_type", type: "select", options: ["Standalone Buildings", "Gated Communities", "Apartment Construction"], required: true },
        { label: "Total built-up area or size?", name: "area_size", type: "text", required: true }
    ],
    "Farmhouse Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Land size?", name: "land_size", type: "text", required: true },
        { label: "Type of construction?", name: "construction_type", type: "select", options: ["Prefabricated homes", "smart automation homes", "container homes"], required: true }
    ],
    "Turnkey Commercial Building Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Office Buildings", "Shopping Malls", "Café & Restaurant Construction"], required: true },
        { label: "Total area or number of floors?", name: "area_floors", type: "text", required: true }
    ],
    "Institutional & Industrial Building Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Schools & colleges Buildings", "Ware houses", "industrial sheds"], required: true },
        { label: "Land or built-up area?", name: "area", type: "text", required: true }
    ],
    "Resort, Hotel & Hospitality Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Luxury Resorts", "Convention Centres", "Business hotels"], required: true },
        { label: "Land area or number of rooms?", name: "area_rooms", type: "text", required: true }
    ],
    "Green Sustainable Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of construction?", name: "construction_type", type: "select", options: ["Stabilized Mud block houses", "Bamboo Houses"], required: true }
    ],
    "Residential Interior": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is your requirement?", name: "requirement", type: "select", options: ["2BHK/3BHK House Interiors", "Duplex Interior Execution", "Turnkey Residential Interiors"], required: true },
        { label: "What is the area or number of rooms?", name: "area_rooms", type: "text", required: true }
    ],
    "Commercial Interior": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of space?", name: "space_type", type: "select", options: ["Corporate Office interiors", "Restaurant & café interiors", "Turnkey Commercial Interior"], required: true },
        { label: "Total area or seating capacity?", name: "area_seating", type: "text", required: true }
    ],
    "False Ceiling & Designer Ceiling": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Area size for ceiling work?", name: "area_size", type: "text", required: true },
        { label: "Type of ceiling?", name: "ceiling_type", type: "select", options: ["POP Ceiling", "PVC Ceiling", "Grid Ceiling"], required: true }
    ],
    "Flooring Execution": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Type of flooring?", name: "flooring_type", type: "select", options: ["Verified Tiling flooring", "Granite flooring", "Epoxy flooring"], required: true }
    ],
    "Painting": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of painting?", name: "painting_type", type: "select", options: ["Interior Painting", "Exterior Painting", "Concrete Painting"], required: true },
        { label: "Area size or number of rooms?", name: "area_rooms", type: "text", required: true }
    ],
    "Electrical Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["House Wiring", "Decorative Lighting"], required: true }
    ],
    "Plumbing Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Water Supply Pipeline Fittings", "Sewerage Pipe line Fittings", "Sanitary fittings"], required: true }
    ],
    "Glass & Aluminium Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Commercial Façade Works", "Partition Works", "ACP Panel works"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true }
    ],
    "Indoor Landscaping": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of setup?", name: "setup_type", type: "select", options: ["Planting Island", "Terrace Gardening", "Green Balcony"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true }
    ],
    "Outdoor Landscaping": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Lawn development", "Plantation work", "pathway pavers"], required: true }
    ],
    "Home Theatre": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Home theatre room setup", "Acoustic panel installation"], required: true },
        { label: "Room size?", name: "room_size", type: "text", required: true }
    ],
    "Home Automation": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of automation?", name: "automation_type", type: "select", options: ["Gas, Fire & smoke detection Automation", "Wardrobe locks, smart door locks automation", "Smart Security System"], required: true }
    ],
    "Cement": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type of cement required?", name: "cement_type", type: "select", options: ["OPC 53", "PPC 43"], required: true },
        { label: "Quantity required?", name: "quantity", type: "text", required: true },
        { label: "When do you need delivery?", name: "delivery_time", type: "text", required: true }
    ],
    "Steel": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type of steel?", name: "steel_type", type: "select", options: ["TMT bars", "Mild steel"], required: true },
        { label: "Required size & quantity?", name: "size_quantity", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Construction", "Fabrication"], required: true }
    ],
    "Concrete": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type of concrete?", name: "concrete_type", type: "select", options: ["RMC", "High strength", "Self-compacting"], required: true },
        { label: "Quantity required? (Cubic meters)", name: "quantity", type: "text", required: true },
        { label: "Required grade (if known)?", name: "grade", type: "text", required: false }
    ],
    "Bricks": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type of bricks?", name: "brick_type", type: "select", options: ["Red", "Fly ash", "AAC blocks"], required: true },
        { label: "Quantity required?", name: "quantity", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Wall construction", "Partition"], required: true }
    ],
    "Sand & Aggregates": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type required?", name: "sand_type", type: "select", options: ["River sand", "M-Sand", "Aggregates"], required: true },
        { label: "Quantity required?", name: "quantity", type: "text", required: true },
        { label: "Size/specification?", name: "specification", type: "select", options: ["20mm", "40mm", "Fine"], required: true }
    ],
    "Structural Steel & Roofing Sheets": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type required?", name: "material_type", type: "select", options: ["Structural steel", "Roofing sheets"], required: true },
        { label: "Quantity or area?", name: "quantity_area", type: "text", required: true },
        { label: "Specification or thickness?", name: "specification", type: "text", required: true }
    ],
    "Electrical Materials": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type of materials?", name: "material_type", type: "select", options: ["Wires", "Switches", "Panels"], required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential", "Commercial"], required: true },
        { label: "Quantity or requirement details?", name: "details", type: "text", required: true }
    ],
    "Plumbing & Sanitary Materials": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type of materials?", name: "material_type", type: "select", options: ["Pipes", "Sanitary", "Valves"], required: true },
        { label: "Material type?", name: "material_spec", type: "select", options: ["PVC", "CPVC", "UPVC"], required: true },
        { label: "Quantity or project size?", name: "quantity_size", type: "text", required: true }
    ],
    "UPVC Windows": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type of windows?", name: "window_type", type: "select", options: ["Sliding", "Casement"], required: true },
        { label: "Number of units or area?", name: "quantity", type: "text", required: true },
        { label: "Need installation also?", name: "needs_installation", type: "radio", options: ["Yes", "No"], required: true }
    ],
    "Solar Panels & Inverters": [
        { label: "Installation location?", name: "install_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Panels", "Inverter", "Complete system"], required: true },
        { label: "Capacity required? (kW)", name: "capacity", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Residential", "Commercial"], required: true }
    ],
    "Paints & Coatings": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type?", name: "paint_type", type: "select", options: ["Interior", "Exterior", "Waterproofing", "Industrial"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement_type", type: "select", options: ["Supply only", "With application"], required: true }
    ],
    "Landscaping Plants, Trees & Grass": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type required?", name: "landscape_type", type: "select", options: ["Plants", "Grass", "Trees"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Garden", "Layout", "Commercial space"], required: true }
    ],
    "Lighting Materials": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type?", name: "lighting_type", type: "select", options: ["LED", "Outdoor", "Decorative"], required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Home", "Commercial", "Landscape"], required: true },
        { label: "Quantity or requirement details?", name: "details", type: "text", required: true }
    ],
    "Terracotta Blocks": [
        { label: "Delivery location?", name: "delivery_location", type: "text", required: true },
        { label: "Type?", name: "block_type", type: "select", options: ["Blocks", "Roofing tiles", "Decorative"], required: true },
        { label: "Quantity required?", name: "quantity", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Construction", "Roofing", "Design"], required: true }
    ],
    "Temporary Structures": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of structure?", name: "structure_type", type: "select", options: ["Site office", "Warehouse", "Barricading"], required: true },
        { label: "Required area or size?", name: "area_size", type: "text", required: true },
        { label: "Duration of requirement?", name: "duration", type: "select", options: ["Short-term", "Long-term"], required: true }
    ],
    "Renovation Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Renovation", "Extension", "Alteration"], required: true },
        { label: "Type of building?", name: "building_type", type: "select", options: ["House", "Commercial", "Industrial"], required: true },
        { label: "Area or scope of work?", name: "area_scope", type: "text", required: true }
    ],
    "Earth Works": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Excavation", "Rock cutting", "Soil supply"], required: true },
        { label: "Quantity or area details?", name: "quantity_area", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Foundation", "Leveling", "Basement"], required: true }
    ],
    "Waterproofing": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Area type?", name: "area_type", type: "select", options: ["Terrace", "Basement", "Wall cracks"], required: true },
        { label: "Issue?", name: "issue", type: "select", options: ["Leakage", "Dampness", "Preventive work"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true }
    ],
    "Demolition Works": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of structure?", name: "structure_type", type: "select", options: ["Building", "Part structure"], required: true },
        { label: "Method required?", name: "method", type: "select", options: ["Manual", "Mechanical", "Controlled"], required: true },
        { label: "Scope?", name: "scope", type: "select", options: ["Demolition only", "With debris removal"], required: true }
    ],
    "Railing Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of railing?", name: "railing_type", type: "select", options: ["Iron", "SS", "Aluminum"], required: true },
        { label: "Area or length?", name: "area_length", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New installation", "Replacement"], required: true }
    ],
    "Fabrication Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "select", options: ["Shed", "Warehouse", "Hall"], required: true },
        { label: "Area or structure size?", name: "area_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Fabrication only", "Supply & installation"], required: true }
    ],
    "Retaining Wall & Compound Wall Works": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of wall?", name: "wall_type", type: "select", options: ["RCC", "Brick", "Precast"], required: true },
        { label: "Length or area?", name: "length_area", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Boundary", "Soil retention"], required: true }
    ],
    "Industrial Floorings": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Type of flooring?", name: "flooring_type", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Industrial", "Warehouse", "Parking"], required: true }
    ],
    "Scaffolding Works": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Building height?", name: "building_height", type: "text", required: true },
        { label: "Type of scaffolding required?", name: "scaffold_type", type: "text", required: true },
        { label: "Duration?", name: "duration", type: "text", required: true }
    ],
    "House Electrical Installation Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of electrical work?", name: "work_type", type: "select", options: ["Internal wiring & conduit laying", "Distribution Board installation & panel fixing", "Lighting fixtures, switches, & power point installation"], required: true }
    ],
    "House Plumbing Installation Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of plumbing work?", name: "work_type", type: "select", options: ["Water supply lines", "CPVC/PVC Piping", "sanitary fixture installation"], required: true }
    ],
    "Fire Safety Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Fire Extinguisher installation", "Fire sprinkler, hydrant, alarm systems"], required: true }
    ],
    "Solar Power System Installation Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Solar panel mounting structure", "Hybrid solar systems"], required: true },
        { label: "Capacity required? (kW)", name: "capacity", type: "text", required: true }
    ],
    "HVAC Installation & Ducting Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of HVAC work?", name: "work_type", type: "select", options: ["GI Duct fabrication", "Exhaust & ventilation systems", "VRV/VRF Systems"], required: true }
    ],
    "Hydraulic Pushing Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of pushing work?", name: "work_type", type: "select", options: ["Underground pipe pushing", "Trenches technology works", "Bore pushing"], required: true }
    ],
    "Toilet Cubicle Supply & Installation": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of cubicles?", name: "cubicle_type", type: "select", options: ["SS hardware installation", "PVC toilets cubicles"], required: true },
        { label: "Number of units?", name: "units", type: "text", required: true }
    ],
    "Pest Control & Anti-Termite Treatment": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of treatment?", name: "treatment_type", type: "select", options: ["Pre-construction anti-Termite", "Post construction treatment", "Wood borer treatment"], required: true }
    ],
    "Project Management Consultancy (PMC) Services": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Planning & Scheduling", "Budgeting", "Vendor Management"], required: true }
    ],
    "Independent Construction Quality Inspection": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Scope?", name: "scope", type: "select", options: ["Material Testing", "Site Audits", "Compliance Verification"], required: true }
    ],
    "Maintenance & AMC and Facility management Works": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Preventive Maintenance", "Asset Management", "Facility Operations"], required: true }
    ],
    "Construction Progress Monitoring": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Site Monitoring", "MIS Reports", "Progress Tracking"], required: true }
    ],
    "Project Cost Audit & Cost Control": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Budget Review", "Cost Tracking", "Financial Monitoring"], required: true }
    ],
    "Pre-Construction Inception": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Feasibility Study", "Risk Analysis"], required: true }
    ],
    "Government Approvals": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of approval?", name: "approval_type", type: "select", options: ["Building Permissions", "Layout Permissions", "Industrial Permissions"], required: true }
    ],
    "International Architectural & Engineering Drawing Services": [
        { label: "Project location (Country/City)?", name: "project_location", type: "text", required: true },
        { label: "Type of drawings?", name: "drawing_type", type: "select", options: ["Architectural Drawings", "Structural Drawings", "MEP Drawings"], required: true }
    ],
    "International Estimation & BOQ Services": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Project Estimations", "BOQ Preparation"], required: true }
    ],
    "BIM Modelling & Coordination (LOD 300–500)": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["3D Modelling", "Clash Detection", "Shop Drawings"], required: true }
    ],
    "Construction Scheduling & Planning (Primavera / MSP)": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Baseline Scheduling", "Resource Planning", "Delay Analysis"], required: true }
    ],
    "Roads & Pavements": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["New road", "Pavement", "Repair"], required: true },
        { label: "Length or area details?", name: "length_area", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Layout", "Highway", "Internal road"], required: true }
    ],
    "Water & Waste Water Management": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Water supply", "Sewerage network", "STP"], required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Layout", "Community", "Industrial"], required: true },
        { label: "Scope or capacity details?", name: "scope_capacity", type: "text", required: true }
    ],
    "Land Development & Plotting Works": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Land size?", name: "land_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Plotting", "Leveling", "Roads", "Full development"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Residential layout", "Farm plots", "Commercial"], required: true }
    ],
    "Construction Progress Reporting & Photo Documentation": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial", "Infrastructure"], required: true },
        { label: "Frequency required?", name: "frequency", type: "select", options: ["Daily", "Weekly", "Fortnightly", "Monthly"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Client reporting", "Documentation", "Records"], required: true }
    ],
    "Design Coordination Services (Arch/Structural/MEP)": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial", "Infrastructure"], required: true },
        { label: "Disciplines involved?", name: "disciplines", type: "select", options: ["Architecture", "Structural", "MEP", "All"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Clash resolution", "Coordination", "Execution support"], required: true }
    ],
    "Value Engineering & Cost Optimization": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial", "Infrastructure"], required: true },
        { label: "Current stage?", name: "stage", type: "select", options: ["Design", "Execution"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Cost reduction", "Efficiency improvement"], required: true }
    ],
    "Digital Project Controls & MIS Setup": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial", "Infrastructure"], required: true },
        { label: "Current systems in place?", name: "current_systems", type: "text", required: true },
        { label: "Scope?", name: "scope", type: "select", options: ["MIS setup", "Reporting", "Dashboards"], required: true }
    ],
    "Industrial Infrastructure": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Roads", "Drains", "Utilities"], required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Industrial park", "SEZ", "Factory"], required: true },
        { label: "Scope or area details?", name: "scope_area", type: "text", required: true }
    ],
    "Specialized Engineering Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Rock cutting", "Blasting", "Anchoring"], required: true },
        { label: "Scope or quantity details?", name: "scope_quantity", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Foundation", "Tunneling", "Slope stabilization"], required: true }
    ],
    "Public Amenities Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of amenity?", name: "amenity_type", type: "select", options: ["Bus shelter", "Public toilet", "Park"], required: true },
        { label: "Scope or size details?", name: "scope_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New construction", "Renovation"], required: true }
    ],
    "Rental Services": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of equipment required?", name: "equipment_type", type: "text", required: true },
        { label: "Duration of rental?", name: "duration", type: "text", required: true },
        { label: "Quantity required?", name: "quantity", type: "text", required: true }
    ],
    "Road & Highway Infrastructure Projects": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of road project?", name: "road_type", type: "select", options: ["BT Roads", "CC Roads", "Bridge & Culverts"], required: true },
        { label: "Project length or area?", name: "project_size", type: "text", required: true }
    ],
    "Railway Infrastructure Projects": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of railway work?", name: "work_type", type: "select", options: ["Track Works", "Platforms Works", "RUB & ROB Works"], required: true },
        { label: "Project scope or size?", name: "project_size", type: "text", required: true }
    ],
    "Water Supply Projects": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of water project?", name: "project_type", type: "select", options: ["Over head tanks", "Pump Houses", "Pipeline Works"], required: true },
        { label: "Capacity or size?", name: "capacity_size", type: "text", required: true }
    ],
    "Sewerage & Stormwater Projects": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Sewer Lines", "STP"], required: true },
        { label: "Project scope or capacity?", name: "project_size", type: "text", required: true }
    ],
    "Pipeline Infrastructure Projects": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of pipeline work?", name: "work_type", type: "select", options: ["MS / DI / HDPE Laying", "Testing & Commissioning"], required: true },
        { label: "Length and diameter?", name: "length_diameter", type: "text", required: true }
    ],
    "Power Infrastructure Projects": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of power project?", name: "project_type", type: "select", options: ["Substations", "Transmission Lines", "UG Cables"], required: true },
        { label: "Capacity or voltage level?", name: "capacity_voltage", type: "text", required: true }
    ],
    "Marine Projects": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of marine work?", name: "work_type", type: "select", options: ["Shore Protection", "Breakwaters", "Jetty Works"], required: true },
        { label: "Project scope or area?", name: "project_size", type: "text", required: true }
    ],
    "Warehouse & Logistics Infrastructure": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of infrastructure?", name: "infra_type", type: "select", options: ["PEB Structures", "Industrial Flooring"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true }
    ],
    "Piling Execution Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of piling?", name: "piling_type", type: "select", options: ["Bored Cast-in-Situ Piles", "Driven Piles"], required: true },
        { label: "Number or depth of piles?", name: "piling_details", type: "text", required: true }
    ],
    "Ground Improvement": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of method?", name: "improvement_method", type: "select", options: ["Vibro Compaction", "Soil Strengthening"], required: true },
        { label: "Area or depth?", name: "improvement_size", type: "text", required: true }
    ],
    "Pre-Stressing & Post-Tensioning Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["PT Slabs", "Cable Stressing", "Grouting"], required: true },
        { label: "Project size or area?", name: "project_size", type: "text", required: true }
    ],
    "Bridge Bearings & Expansion Joints": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Bearing Installation", "Joint Replacement"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Installation", "Replacement", "Maintenance"], required: true }
    ],
    "Gabion Wall & RE Structures": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of structure?", name: "structure_type", type: "select", options: ["Retaining Structures", "Reinforced Earth Walls"], required: true },
        { label: "Length or height?", name: "structure_size", type: "text", required: true }
    ],
    "Anti-Corrosion & Protective Coatings": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of coating?", name: "coating_type", type: "select", options: ["Epoxy Coatings", "PU Coatings", "Structural Protection"], required: true },
        { label: "Surface area?", name: "surface_area", type: "text", required: true }
    ],
    "Open Plotting Venture Development": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Total land area?", name: "land_area", type: "text", required: true },
        { label: "Scope of work?", name: "scope", type: "select", options: ["Roads", "Electrical", "OHT", "Parks", "Plotting"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Full development", "Partial work"], required: true }
    ],
    "Farm Land Development": [
        { label: "Where is your land located?", name: "land_location", type: "text", required: true },
        { label: "Total land area?", name: "land_area", type: "text", required: true },
        { label: "Scope of work?", name: "scope", type: "select", options: ["Plantation", "Borewell", "Irrigation", "Fencing", "Roads"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Personal use", "Investment", "Commercial farming"], required: true }
    ],
    "Land Developments": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Land area?", name: "land_area", type: "text", required: true },
        { label: "Type of development?", name: "development_type", type: "select", options: ["Residential", "Commercial", "Layout"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Planning", "Execution", "Full development"], required: true }
    ],
    "Playground & Sports Court Construction": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of facility?", name: "facility_type", type: "select", options: ["Cricket", "Football", "Indoor court"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New construction", "Upgrade"], required: true }
    ],
    "Swimming Pool Construction": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of pool?", name: "pool_type", type: "select", options: ["Residential", "Commercial"], required: true },
        { label: "Size or capacity?", name: "pool_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New construction", "Renovation"], required: true }
    ],
    "Paving Block & Walkway Construction": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Interlocking", "Industrial paving", "Footpath"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New", "Replacement", "Repair"], required: true }
    ],
    "Water Fountain & Landscape Feature Construction": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of feature?", name: "feature_type", type: "select", options: ["Fountain", "Decorative", "Landscape"], required: true },
        { label: "Area or project size?", name: "project_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New installation", "Upgrade"], required: true }
    ],
    "Outdoor Stage & Amphitheatre Construction": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Stage", "Seating", "Acoustic setup"], required: true },
        { label: "Area or seating capacity?", name: "seating_capacity", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New construction", "Upgrade"], required: true }
    ],
    "Children’s Play Equipment Installation": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of setup?", name: "setup_type", type: "select", options: ["Play structures", "Safety flooring"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New installation", "Replacement"], required: true }
    ],
    "Turnkey Interior Execution": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of space?", name: "space_type", type: "select", options: ["Residential", "Commercial"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Scope?", name: "scope", type: "select", options: ["Design + Execution", "Execution only"], required: true }
    ],
    "Modular Kitchen & Island Kitchen Installation": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Kitchen type?", name: "kitchen_type", type: "select", options: ["Modular", "Island kitchen"], required: true },
        { label: "Kitchen size?", name: "kitchen_size", type: "text", required: true },
        { label: "Requirements?", name: "requirements", type: "select", options: ["Storage", "Appliances", "Finishes"], required: true }
    ],
    "False Ceiling & Designer Ceiling Execution": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Ceiling type?", name: "ceiling_type", type: "select", options: ["Gypsum", "POP", "Designer"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Lighting", "Aesthetic", "Acoustic"], required: true }
    ],
    "Carpentry & Custom Furniture Works": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of furniture?", name: "furniture_type", type: "select", options: ["Wardrobes", "Cabinets", "Custom"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirements?", name: "requirements", type: "select", options: ["Design", "Material", "Finish"], required: true }
    ],
    "Terrace Gardening & Balcony & Sit-Out Area Execution": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Type of space?", name: "space_type", type: "select", options: ["Terrace", "Balcony", "Sit-out"], required: true },
        { label: "Requirements?", name: "requirements", type: "select", options: ["Plants", "Seating", "Decking"], required: true }
    ],
    "Facade & Cladding Execution": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of building?", name: "building_type", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Cladding type?", name: "cladding_type", type: "select", options: ["ACP", "Glass", "Stone", "HPL"], required: true }
    ],
    "Gym Renovation, Remodeling & Interior Services": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of gym?", name: "gym_type", type: "select", options: ["Commercial", "Home gym"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Scope?", name: "scope", type: "select", options: ["Renovation", "Interiors", "Equipment layout"], required: true }
    ],
    "Excavator / JCB on Rent": [
        { label: "Site location?", name: "site_location", type: "text", required: true },
        { label: "Duration required?", name: "duration", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Excavation", "Leveling", "Trenching"], required: true },
        { label: "Machine size or capacity?", name: "machine_size", type: "text", required: true }
    ],
    "Water Supply & Distribution Projects": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Area coverage?", name: "area_coverage", type: "text", required: true },
        { label: "Type of system?", name: "system_type", type: "select", options: ["Urban", "Rural"], required: true },
        { label: "Scope?", name: "scope", type: "select", options: ["Design", "Installation", "Maintenance"], required: true }
    ],
    "Micro-Tunneling & Trenchless Works": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Length and diameter?", name: "length_diameter", type: "text", required: true },
        { label: "Soil conditions?", name: "soil_conditions", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Utility installation", "Minimal surface disruption"], required: true }
    ],
    "Pipe Jacking & HDD Works": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Length and diameter?", name: "length_diameter", type: "text", required: true },
        { label: "Type?", name: "type", type: "select", options: ["Pipe jacking", "HDD"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Underground crossings", "Utilities"], required: true }
    ],
    "Rigid Pavement (PQ Concrete) Works": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Area or length?", name: "area_length", type: "text", required: true },
        { label: "Thickness requirement?", name: "thickness", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Road", "Industrial flooring"], required: true }
    ]
};

function initModals() {
    const modal = document.getElementById('survey-modal');
    const requirementForm = document.getElementById('requirement-form');
    const dynamicFieldsContainer = document.getElementById('dynamic-fields');
    let currentStep = 0;
    let steps = [];

    if (!modal) return;

    // Use event delegation for modal triggers
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.modal-trigger');
        if (!trigger) return;

        e.preventDefault();
        const service = trigger.getAttribute('data-service');
        const config = SURVEY_SERVICE_CONFIG[service] || [];
        
        // Reset and Build Steps
        currentStep = 0;
        buildFormSteps(service, config);
        showStep(0);
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    function buildFormSteps(service, config) {
        dynamicFieldsContainer.innerHTML = '';
        steps = [];

        // 1. Dynamic Config Steps
        config.forEach(field => {
            steps.push(createStep(field.label, field.name, field.type, field.label, field.required, field.options));
        });

        // 2. Requirement Step
        steps.push(createStep('Any specific requirement?', 'requirement', 'textarea', 'Describe your requirement in detail', false));

        // 3. Contact Step (Combined Step)
        steps.push({ 
            label: 'Contact Information', 
            type: 'contact_combined',
            fields: [
                { label: 'Full Name*', name: 'name', type: 'text', placeholder: 'Enter your name', required: true },
                { label: 'Mobile Number*', name: 'phone', type: 'tel', placeholder: 'Enter your mobile number', required: true },
                { label: 'Email Address*', name: 'email', type: 'email', placeholder: 'Enter your email address', required: true }
            ]
        });

        // Append all steps to container
        steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = `modal-step ${index === 0 ? 'active' : ''}`;
            stepDiv.id = `step-${index}`;
            
            // Add Title
            const title = document.createElement('h2');
            title.innerText = step.label;
            stepDiv.appendChild(title);

            // Add Error Message placeholder
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.innerText = 'Please fill all required fields.';
            stepDiv.appendChild(errorMsg);

            if (step.type === 'contact_combined') {
                // Special rendering for combined contact step
                step.fields.forEach(field => {
                    const group = document.createElement('div');
                    group.className = 'form-group';
                    
                    const label = document.createElement('label');
                    label.innerText = field.label;
                    group.appendChild(label);
                    
                    const input = document.createElement('input');
                    input.type = field.type;
                    input.name = field.name;
                    input.placeholder = field.placeholder;
                    if (field.required) input.required = true;
                    group.appendChild(input);
                    
                    stepDiv.appendChild(group);
                });
            } else {
                // Standard rendering for single-field steps
                const group = document.createElement('div');
                group.className = 'form-group';
                
                if (step.type === 'textarea') {
                    const input = document.createElement('textarea');
                    input.name = step.name;
                    input.placeholder = step.placeholder;
                    input.rows = 4;
                    if (step.required) input.required = true;
                    group.appendChild(input);
                } else if (step.type === 'select') {
                    const select = document.createElement('select');
                    select.name = step.name;
                    if (step.required) select.required = true;
                    
                    const defaultOpt = document.createElement('option');
                    defaultOpt.value = '';
                    defaultOpt.disabled = true;
                    defaultOpt.selected = true;
                    defaultOpt.innerText = `Select an option`;
                    select.appendChild(defaultOpt);
                    
                    step.options.forEach(opt => {
                        const o = document.createElement('option');
                        o.value = opt;
                        o.innerText = opt;
                        select.appendChild(o);
                    });
                    group.appendChild(select);
                } else if (step.type === 'radio') {
                    const radioGroup = document.createElement('div');
                    radioGroup.className = 'radio-group';
                    step.options.forEach(opt => {
                        const label = document.createElement('label');
                        label.className = 'radio-item';
                        const radio = document.createElement('input');
                        radio.type = 'radio';
                        radio.name = step.name;
                        radio.value = opt;
                        if (step.required) radio.required = true;
                        label.appendChild(radio);
                        label.appendChild(document.createTextNode(opt));
                        radioGroup.appendChild(label);
                    });
                    group.appendChild(radioGroup);
                } else {
                    const input = document.createElement('input');
                    input.type = step.type;
                    input.name = step.name;
                    input.placeholder = step.placeholder;
                    if (step.required) input.required = true;
                    group.appendChild(input);
                }
                
                stepDiv.appendChild(group);
            }

            // Add Buttons
            const btnGroup = document.createElement('div');
            btnGroup.className = 'step-buttons';

            if (index > 0) {
                const prevBtn = document.createElement('button');
                prevBtn.type = 'button';
                prevBtn.className = 'btn-prev';
                prevBtn.innerText = 'Back';
                prevBtn.onclick = () => prevStep();
                btnGroup.appendChild(prevBtn);
            }

            if (index === steps.length - 1) {
                const submitBtn = document.createElement('button');
                submitBtn.type = 'submit';
                submitBtn.className = 'btn-submit-modal';
                submitBtn.innerText = 'Submit Requirement';
                btnGroup.appendChild(submitBtn);
            } else {
                const nextBtn = document.createElement('button');
                nextBtn.type = 'button';
                nextBtn.className = 'btn-next';
                nextBtn.innerText = 'Continue';
                nextBtn.onclick = () => nextStep();
                btnGroup.appendChild(nextBtn);
            }

            stepDiv.appendChild(btnGroup);
            dynamicFieldsContainer.appendChild(stepDiv);
        });

        // Set hidden service heading
        const serviceHeading = document.getElementById('modal-service-heading');
        if (serviceHeading) serviceHeading.value = `${service} query`;
    }

    function createStep(label, name, type, placeholder, required, options = []) {
        return { label, name, type, placeholder, required, options };
    }

    function showStep(index) {
        const allSteps = document.querySelectorAll('.modal-step');
        allSteps.forEach(s => s.classList.remove('active'));
        
        const currentStepEl = document.getElementById(`step-${index}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
            
            // Focus first input
            const input = currentStepEl.querySelector('input, select, textarea');
            if (input) input.focus();
        }

        // Update Progress Bar
        const progress = ((index + 1) / steps.length) * 100;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) progressBar.style.width = `${progress}%`;
        
        currentStep = index;
    }

    function nextStep() {
        if (validateStep(currentStep)) {
            showStep(currentStep + 1);
        }
    }

    function prevStep() {
        showStep(currentStep - 1);
    }

    function validateStep(index) {
        const stepEl = document.getElementById(`step-${index}`);
        const currentStepConfig = steps[index];
        const errorMsg = stepEl.querySelector('.error-message');
        let isValid = true;
        let customError = '';

        if (currentStepConfig.type === 'contact_combined') {
            const inputs = stepEl.querySelectorAll('input[required]');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                }
                // Basic validations
                if (input.name === 'phone' && input.value.trim() && !/^[0-9]{10}$/.test(input.value.trim())) {
                    isValid = false;
                    customError = 'Please enter a valid 10-digit mobile number.';
                }
                if (input.name === 'email' && input.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
                    isValid = false;
                    customError = 'Please enter a valid email address.';
                }
            });
        } else {
            const inputs = stepEl.querySelectorAll('input[required], select[required], textarea[required]');
            inputs.forEach(input => {
                if (input.type === 'radio') {
                    const name = input.name;
                    const checked = stepEl.querySelector(`input[name="${name}"]:checked`);
                    if (!checked) isValid = false;
                } else if (!input.value.trim()) {
                    isValid = false;
                }
            });
        }

        if (!isValid) {
            if (errorMsg) {
                errorMsg.innerText = customError || 'Please fill all required fields.';
                errorMsg.style.display = 'block';
            }
        } else {
            if (errorMsg) errorMsg.style.display = 'none';
        }

        return isValid;
    }

    // Close Modal Logic
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-modal') || e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    if (requirementForm) {
        requirementForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateStep(currentStep)) return;

            const submitBtn = requirementForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            try {
                const formData = new FormData(requirementForm);
                formData.append('form_type', 'Requirement Modal');
                await submitToEmail(formData);

                dynamicFieldsContainer.innerHTML = `
                    <div class="form-success-message">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>Thank You!</h2>
                        <p>Message was sent successfully.</p>
                        <button type="button" class="btn-submit-modal" onclick="document.getElementById('survey-modal').style.display='none'; document.body.style.overflow='auto';">Close</button>
                    </div>
                `;

                const progressBar = document.querySelector('.progress-bar');
                if (progressBar) progressBar.style.width = '100%';

                requirementForm.reset();
            } catch (err) {
                if (submitBtn) submitBtn.disabled = false;
                const stepEl = document.getElementById(`step-${currentStep}`);
                const errorMsg = stepEl ? stepEl.querySelector('.error-message') : null;
                if (errorMsg) {
                    errorMsg.innerText = 'Unable to send message. Please try again.';
                    errorMsg.style.display = 'block';
                } else {
                    alert('Unable to send message. Please try again.');
                }
            }
        });
    }
}
