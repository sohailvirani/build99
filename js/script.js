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
    }).catch(error => console.error('Error loading includes:', error));

    // Initialize Modals
    initModals();

    // Initialize Hero Slider
    initHeroSlider();

    // Initialize Scroll Animations
    initScrollAnimations();

    // Initialize Service Carousel
    initServiceCarousel();
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
    "Carpentry & Custom Furniture Works", "Terrace Gardening & Balcony & Sit-Out Area Execution", "Facade & Cladding Execution"
];

// Data: Surveying Services Form Configuration
const SURVEY_SERVICE_CONFIG = {
    "Topographical Land Survey": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Type of land?", name: "land_type", type: "select", options: ["Open plot", "Agricultural", "Mixed"], required: true },
        { label: "Do you need elevation & contour details?", name: "needs_details", type: "radio", options: ["Yes", "No"], required: true }
    ],
    "Land Boundary Demarcation (Tippon Survey)": [
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
        { label: "Requirement?", name: "requirement_type", type: "select", options: ["Column marking", "Layout marking", "Excavation marking"], required: true }
    ],
    "As-Built Survey": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Is construction completed?", name: "is_completed", type: "radio", options: ["Yes", "No"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Approval", "Documentation", "Verification"], required: true }
    ],
    "Drone Survey & Aerial Mapping": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Mapping", "Inspection", "Marketing"], required: true },
        { label: "Output required?", name: "output", type: "select", options: ["Photos", "Video", "Both", "Orthomosaic"], required: true }
    ],
    "GIS Mapping & Spatial Data Analysis": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Do you need geo-referencing?", name: "needs_geo", type: "radio", options: ["Yes", "No"], required: true },
        { label: "Do you have existing data/maps?", name: "has_data", type: "radio", options: ["Yes", "No"], required: true }
    ],
    "Utility Mapping & Underground Services Survey (GPR)": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Known utilities?", name: "utilities", type: "select", options: ["Pipelines", "Cables", "Not sure"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Detection", "Safety", "Planning"], required: true }
    ],
    "DPR Survey & Feasibility Studies": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is the approximate project length/area?", name: "project_size", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Road", "Railway", "Pipeline", "Other"], required: true },
        { label: "Requirement?", name: "requirement_scope", type: "select", options: ["Full DPR", "Feasibility only"], required: true }
    ],
    "Road Alignment & Layout Planning Survey": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Approval authority?", name: "authority", type: "select", options: ["HMDA", "DTCP", "Other"], required: true },
        { label: "Layout type?", name: "layout_type", type: "select", options: ["Residential", "Farm", "Commercial"], required: true }
    ],
    "Hydrographic & Water Body Survey": [
        { label: "Where is the water body located?", name: "water_location", type: "text", required: true },
        { label: "What is the approximate survey area?", name: "survey_area", type: "text", required: true },
        { label: "Water body type?", name: "water_type", type: "select", options: ["Pond", "River", "Lake", "Sea"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Depth study", "Planning"], required: true }
    ],
    "3D Laser Scanning & LiDAR Survey": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Area type?", name: "area_type", type: "select", options: ["Open land", "Urban", "Forest"], required: true },
        { label: "Requirement?", name: "requirement_detail", type: "select", options: ["3D mapping", "High precision"], required: true }
    ],
    "Pre-Construction Site Survey Package": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial", "Infrastructure"], required: true }
    ],
    "Soil Investigation": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "What is the approximate site size?", name: "site_size", type: "text", required: true },
        { label: "Type of investigation required?", name: "investigation_type", type: "select", options: ["Borehole", "Auger", "Trial pit"], required: true },
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
        { label: "Type of test?", name: "test_type", type: "select", options: ["Compression", "Pull-out", "Lateral"], required: true },
        { label: "Required load capacity?", name: "load_capacity", type: "text", required: true }
    ],
    "Pile Integrity Testing (PIT)": [
        { label: "Site location?", name: "site_location", type: "text", required: true },
        { label: "Number of piles to be tested?", name: "pile_count", type: "text", required: true },
        { label: "Pile type and diameter?", name: "pile_type_diameter", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Defect detection", "Quality check"], required: true }
    ],
    "Dynamic Pile Load Testing": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of pile?", name: "pile_type", type: "select", options: ["Bored", "Driven"], required: true },
        { label: "Required load capacity?", name: "load_capacity", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Design validation", "Load carrying capacity"], required: true }
    ],
    "Groundwater Investigation": [
        { label: "Location of site?", name: "site_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Depth of study required?", name: "study_depth", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Water availability", "Borewell planning"], required: true }
    ],
    "Pipeline Route Investigation": [
        { label: "Route location and length?", name: "route_location_length", type: "text", required: true },
        { label: "Soil conditions?", name: "soil_conditions", type: "text", required: true },
        { label: "Depth of trench?", name: "trench_depth", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Pipeline design", "Stability analysis"], required: true }
    ],
    "Pavement Subgrade Investigation": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Road type?", name: "road_type", type: "select", options: ["Highway", "Internal road"], required: true },
        { label: "Soil condition?", name: "soil_condition", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Pavement design", "Subgrade strength"], required: true }
    ],
    "Soil Liquefaction Analysis": [
        { label: "Site location?", name: "site_location", type: "text", required: true },
        { label: "Seismic zone?", name: "seismic_zone", type: "text", required: true },
        { label: "Soil type and depth?", name: "soil_type_depth", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Earthquake risk assessment", "Foundation safety"], required: true }
    ],
    "Construction Materials Testing": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of material?", name: "material_type", type: "select", options: ["Cement", "Steel", "Concrete"], required: true },
        { label: "Type of test required?", name: "test_type", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Quality check", "Compliance", "Certification"], required: true }
    ],
    "Soil Resistivity Testing (Earthing)": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Solar", "Substation", "Telecom", "Other"], required: true },
        { label: "Area size or number of test points?", name: "test_points", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Earthing design", "Safety compliance"], required: true }
    ],
    "Non-Destructive Testing (NDT)": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Structure type?", name: "structure_type", type: "select", options: ["Building", "Bridge", "Industrial"], required: true },
        { label: "Type of test?", name: "test_type", type: "select", options: ["Rebound Hammer", "UPV", "Half Cell"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Strength check", "Condition assessment"], required: true }
    ],
    "Structural Audit & Retrofitting": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of structure?", name: "structure_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Issue observed?", name: "issue", type: "select", options: ["Cracks", "Damage", "Ageing"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Audit", "Analysis", "Retrofitting solution"], required: true }
    ],
    "Anchor Bolt / Rebar Pull-Out Testing": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of element?", name: "element_type", type: "select", options: ["Anchor bolt", "Rebar"], required: true },
        { label: "Number of test points?", name: "test_points", type: "text", required: true },
        { label: "Required test?", name: "test_type", type: "select", options: ["Pull-out", "Proof load"], required: true }
    ],
    "Core Cutting": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Material type?", name: "material_type", type: "select", options: ["RCC", "Asphalt"], required: true },
        { label: "Number of cores required?", name: "core_count", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Testing", "Analysis", "Quality check"], required: true }
    ],
    "Bridge Load Testing": [
        { label: "Where is the structure located?", name: "structure_location", type: "text", required: true },
        { label: "Structure type?", name: "structure_type", type: "select", options: ["Bridge", "Flyover", "Culvert"], required: true },
        { label: "Span or size details?", name: "span_details", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Load capacity", "Safety verification"], required: true }
    ],
    "Concrete Mix Design": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of mix?", name: "mix_type", type: "select", options: ["Concrete", "Asphalt"], required: true },
        { label: "Grade or specification required?", name: "specification", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Project use", "Approval", "Optimization"], required: true }
    ],
    "Geological Investigation": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Site type?", name: "site_type", type: "select", options: ["Hill", "Plain", "Coastal"], required: true },
        { label: "Required study?", name: "study_type", type: "select", options: ["Mapping", "Slope", "Seismic"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Project planning", "Risk assessment"], required: true }
    ],
    "Rock Investigation": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of rock/site condition?", name: "rock_type", type: "text", required: true },
        { label: "Required test?", name: "test_type", type: "select", options: ["Core drilling", "RQD", "UCS"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Foundation", "Stability analysis"], required: true }
    ],
    "Offshore Geotechnical Investigation": [
        { label: "Project location (offshore area details)?", name: "offshore_location", type: "text", required: true },
        { label: "Water depth or project extent?", name: "depth_extent", type: "text", required: true },
        { label: "Required service?", name: "service_type", type: "select", options: ["Borehole", "Sampling", "CPT"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Foundation", "Marine construction"], required: true }
    ],
    "Architectural Planning & Building Design": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is the plot size?", name: "plot_size", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New design", "Modification", "Approval drawings"], required: true }
    ],
    "Blue Prints (Building Approval & Submission Drawings)": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Plot size and ownership details?", name: "plot_size_ownership", type: "text", required: true },
        { label: "Authority for approval?", name: "approval_authority", type: "select", options: ["GHMC", "DTCP", "Local body"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["New approval", "Revision", "Regularization"], required: true }
    ],
    "Site Layout Design": [
        { label: "Site location?", name: "site_location", type: "text", required: true },
        { label: "Total land area?", name: "land_area", type: "text", required: true },
        { label: "Type of development?", name: "development_type", type: "select", options: ["Residential layout", "Commercial", "Industrial"], required: true },
        { label: "Requirements?", name: "requirements", type: "select", options: ["Roads", "Open spaces", "Amenities"], required: true }
    ],
    "RCC Detailing & Bar Bending Schedule (BBS)": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of structure?", name: "structure_type", type: "text", required: true },
        { label: "Structural drawings available?", name: "drawings_available", type: "radio", options: ["Yes", "No"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Execution", "Quantity estimation"], required: true }
    ],
    "Building Elevation & Façade Design": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of building?", name: "building_type", type: "text", required: true },
        { label: "Preferred style?", name: "style", type: "select", options: ["Modern", "Traditional", "Contemporary"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Aesthetic design", "Branding"], required: true }
    ],
    "3D Visualization & Walkthrough Animations": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "text", required: true },
        { label: "Drawings available?", name: "drawings_available", type: "select", options: ["2D", "CAD", "Sketch"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Presentation", "Marketing", "Client approval"], required: true }
    ],
    "MEP Design & Coordination": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of building?", name: "building_type", type: "text", required: true },
        { label: "Scope required?", name: "scope", type: "select", options: ["Electrical", "Plumbing", "Fire", "HVAC"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Design", "Coordination", "Execution support"], required: true }
    ],
    "SLD (Water, Sewerage, Fire, Electrical)": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of building?", name: "building_type", type: "text", required: true },
        { label: "Services required?", name: "services", type: "select", options: ["Water", "Drainage", "Fire", "Electrical"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Approvals", "Execution", "Documentation"], required: true }
    ],
    "Interior Design & Space Planning": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Type of space?", name: "space_type", type: "select", options: ["Home", "Office", "Retail"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirements?", name: "requirements", type: "select", options: ["Theme", "Furniture", "Functionality"], required: true }
    ],
    "Project Estimation & BOQ": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Cost estimation", "BBS", "BOQ"], required: true },
        { label: "Project stage?", name: "stage", type: "select", options: ["Planning", "Ongoing"], required: true }
    ],
    "As-Built Drawings": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of building?", name: "building_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Is construction completed?", name: "is_completed", type: "radio", options: ["Yes", "No"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Documentation", "Approval", "Records"], required: true }
    ],
    "HVAC Design": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Building type?", name: "building_type", type: "select", options: ["Office", "Industrial", "Commercial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Duct design", "Ventilation", "Full HVAC"], required: true },
        { label: "Area size or floor details?", name: "size_details", type: "text", required: true }
    ],
    "Landscape Planning & Design": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Softscape", "Hardscape", "Irrigation"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Villa", "Layout", "Commercial space"], required: true }
    ],
    "Structural Designs (RCC & Steel)": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Building", "Infrastructure", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New design", "Review", "Optimization"], required: true },
        { label: "Number of floors or scale of project?", name: "scale", type: "text", required: true }
    ],
    "Working / GFC Drawings": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Stage?", name: "stage", type: "select", options: ["Planning", "Execution"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Detailed working drawings", "GFC set"], required: true }
    ],
    "Shop Drawings & Detailed Construction Drawings": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Building", "Industrial", "Infra"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Fabrication", "Installation", "Reinforcement drawings"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Execution", "Contractor use"], required: true }
    ],
    "Individual House Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is the plot size?", name: "plot_size", type: "text", required: true },
        { label: "Required construction type?", name: "construction_type", type: "select", options: ["Ground Floor", "G+1", "G+2"], required: true },
        { label: "What is your current stage?", name: "stage", type: "select", options: ["Planning", "Ready to start"], required: true }
    ],
    "Turnkey Villa & Luxury Home Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is the plot size?", name: "plot_size", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "select", options: ["Villa", "Duplex", "Triplex"], required: true },
        { label: "What is your requirement?", name: "requirement", type: "select", options: ["Design + Build", "Construction only"], required: true }
    ],
    "Turnkey Residential Project Execution": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "What is the project type?", name: "project_type", type: "select", options: ["Standalone", "Apartment", "Gated Community"], required: true },
        { label: "Total built-up area or size?", name: "area_size", type: "text", required: true },
        { label: "Do you need full turnkey service?", name: "full_turnkey", type: "radio", options: ["Yes", "No"], required: true }
    ],
    "Farmhouse & Weekend Home Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Land size?", name: "land_size", type: "text", required: true },
        { label: "Type of construction?", name: "construction_type", type: "select", options: ["Prefab", "Smart home", "Container", "Traditional"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Personal use", "Rental", "Investment"], required: true }
    ],
    "Turnkey Construction for Commercial Projects": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Office", "Mall", "Café", "Restaurant"], required: true },
        { label: "Total area or number of floors?", name: "area_floors", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Turnkey", "Construction only"], required: true }
    ],
    "Institutional Building Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["School", "College", "Warehouse", "Shed"], required: true },
        { label: "Land or built-up area?", name: "area", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["New build", "Expansion"], required: true }
    ],
    "Resort, Hotel & Hospitality Construction": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Resort", "Hotel", "Convention Center"], required: true },
        { label: "Land area or number of rooms?", name: "area_rooms", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Design + Build", "Construction only"], required: true }
    ],
    "Mud House Construction (Green Sustainable Construction)": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Land size?", name: "land_size", type: "text", required: true },
        { label: "Type of construction?", name: "construction_type", type: "select", options: ["Mud block", "Bamboo", "Eco-friendly"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Residence", "Resort", "Experimental project"], required: true }
    ],
    "Café, Restaurant & Retail Building Construction": [
        { label: "Location of project?", name: "project_location", type: "text", required: true },
        { label: "Type of space?", name: "space_type", type: "select", options: ["Café", "Restaurant", "Retail store"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirements?", name: "requirements", type: "select", options: ["Kitchen", "Seating", "Interiors"], required: true }
    ],
    "Studio Apartment & Co-Living Building Construction": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Plot size?", name: "plot_size", type: "text", required: true },
        { label: "Number of units?", name: "unit_count", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Rental", "Co-living", "Investment"], required: true }
    ],
    "Modular & Smart Home Construction": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Plot size?", name: "plot_size", type: "text", required: true },
        { label: "Type of home?", name: "home_type", type: "select", options: ["Modular", "Smart", "Prefabricated"], required: true },
        { label: "Requirements?", name: "requirements", type: "select", options: ["Automation", "Smart features"], required: true }
    ],
    "Residential Interior": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of home?", name: "home_type", type: "select", options: ["2BHK", "3BHK", "Duplex"], required: true },
        { label: "What is the area or number of rooms?", name: "area_rooms", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Design + Execution", "Execution only", "Turnkey"], required: true }
    ],
    "Commercial Interior": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of space?", name: "space_type", type: "select", options: ["Office", "Restaurant", "Café", "Retail"], required: true },
        { label: "Total area or seating capacity?", name: "area_seating", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Turnkey", "Execution", "Renovation"], required: true }
    ],
    "False Ceiling & Designer Ceiling": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Area size for ceiling work?", name: "area_size", type: "text", required: true },
        { label: "Type of ceiling?", name: "ceiling_type", type: "select", options: ["POP", "PVC", "Grid"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New installation", "Replacement"], required: true }
    ],
    "Flooring Execution": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Type of flooring?", name: "flooring_type", type: "select", options: ["Tiles", "Granite", "Epoxy"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New flooring", "Renovation"], required: true }
    ],
    "Painting": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of painting?", name: "painting_type", type: "select", options: ["Interior", "Exterior", "Concrete"], required: true },
        { label: "Area size or number of rooms?", name: "area_rooms", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Fresh painting", "Repainting"], required: true }
    ],
    "Electrical Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["House wiring", "Lighting", "Both"], required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["New", "Renovation"], required: true },
        { label: "Any specific requirement?", name: "specific_requirement", type: "text", required: false }
    ],
    "Plumbing Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Water", "Sewerage", "Sanitary"], required: true },
        { label: "Project stage?", name: "stage", type: "select", options: ["New", "Repair", "Renovation"], required: true },
        { label: "Area or number of units?", name: "area_units", type: "text", required: true }
    ],
    "Glass & Aluminium Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Façade", "Partition", "ACP Panels"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New installation", "Replacement"], required: true }
    ],
    "Indoor Landscaping": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of setup?", name: "setup_type", type: "select", options: ["Green balcony", "Indoor plants", "Terrace garden"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Decoration", "Lifestyle", "Commercial"], required: true }
    ],
    "Outdoor Landscaping": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Lawn", "Plantation", "Pathway"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Villa", "Layout", "Commercial space"], required: true }
    ],
    "Home Theatre": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Room size?", name: "room_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Full setup", "Acoustic panels only"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Home use", "Premium experience"], required: true }
    ],
    "Home Automation": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of automation?", name: "automation_type", type: "select", options: ["Security", "Locks", "Fire safety", "Full automation"], required: true },
        { label: "Property type?", name: "property_type", type: "select", options: ["Home", "Villa", "Apartment"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New installation", "Upgrade"], required: true }
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
        { label: "Type of property?", name: "property_type", type: "select", options: ["House", "Apartment", "Villa"], required: true },
        { label: "Scope of work?", name: "scope", type: "select", options: ["Wiring", "DB panel", "Lighting", "Full installation"], required: true },
        { label: "Project stage?", name: "stage", type: "select", options: ["New", "Renovation"], required: true }
    ],
    "House Plumbing Installation Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of property?", name: "property_type", type: "select", options: ["House", "Apartment", "Villa"], required: true },
        { label: "Scope of work?", name: "scope", type: "select", options: ["Water lines", "Piping", "Sanitary fittings"], required: true },
        { label: "Project stage?", name: "stage", type: "select", options: ["New", "Renovation", "Repair"], required: true }
    ],
    "Fire Safety Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of building?", name: "building_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Extinguishers", "Sprinklers", "Hydrant", "Alarm system"], required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Safety", "Compliance", "New installation"], required: true }
    ],
    "Solar Power System Installation Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Property type?", name: "property_type", type: "select", options: ["House", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Panels", "Hybrid system", "Complete setup"], required: true },
        { label: "Required capacity? (kW)", name: "capacity", type: "text", required: true }
    ],
    "HVAC Installation & Ducting Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Building type?", name: "building_type", type: "select", options: ["Office", "Commercial", "Industrial"], required: true },
        { label: "Scope of work?", name: "scope", type: "select", options: ["Ducting", "Ventilation", "VRV/VRF systems"], required: true },
        { label: "Area size or number of floors?", name: "area_floors", type: "text", required: true }
    ],
    "Hydraulic Pushing Works": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Pipe pushing", "Trenchless", "Bore pushing"], required: true },
        { label: "Length or depth details?", name: "length_depth", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Utility installation", "Road crossing"], required: true }
    ],
    "Toilet Cubicle Supply & Installation": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type required?", name: "cubicle_type", type: "select", options: ["PVC", "SS hardware cubicles"], required: true },
        { label: "Number of units?", name: "units", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Supply only", "Supply & installation"], required: true }
    ],
    "Pest Control & Anti-Termite Treatment": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of treatment?", name: "treatment_type", type: "select", options: ["Pre-construction", "Post", "Wood borer"], required: true },
        { label: "Property type?", name: "property_type", type: "select", options: ["House", "Commercial", "Site"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true }
    ],
    "Project Management Consultancy (PMC) Services": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial", "Infra"], required: true },
        { label: "Project stage?", name: "stage", type: "select", options: ["Planning", "Ongoing", "Near completion"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Planning", "Budgeting", "Vendor management", "Full PMC"], required: true }
    ],
    "Independent Construction Quality Inspection": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of project?", name: "project_type", type: "select", options: ["Building", "Infra", "Industrial"], required: true },
        { label: "Scope?", name: "scope", type: "select", options: ["Material testing", "Site audit", "Compliance check"], required: true },
        { label: "Frequency?", name: "frequency", type: "select", options: ["One-time", "Periodic inspection"], required: true }
    ],
    "Maintenance, AMC & Facility Management": [
        { label: "Where is your site located?", name: "site_location", type: "text", required: true },
        { label: "Type of property?", name: "property_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Maintenance", "AMC", "Facility management"], required: true },
        { label: "Scope or area size?", name: "scope_area", type: "text", required: true }
    ],
    "Construction Progress Monitoring": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Building", "Infra", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Site monitoring", "MIS reports", "Progress tracking"], required: true },
        { label: "Frequency?", name: "frequency", type: "select", options: ["Weekly", "Monthly", "Custom"], required: true }
    ],
    "Project Cost Audit & Cost Control": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Cost audit", "Budget review", "Cost control"], required: true },
        { label: "Project stage?", name: "stage", type: "select", options: ["Planning", "Ongoing"], required: true }
    ],
    "Pre-Construction Inception": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Building", "Infra", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Feasibility", "Risk analysis", "Initial planning"], required: true },
        { label: "Land or project size?", name: "size", type: "text", required: true }
    ],
    "Government Approvals": [
        { label: "Where is your project located?", name: "project_location", type: "text", required: true },
        { label: "Type of approval?", name: "approval_type", type: "select", options: ["Building", "Layout", "Industrial"], required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New approval", "Regularization", "Support"], required: true }
    ],
    "International Architectural & Engineering Drawing Services": [
        { label: "Project location (Country/City)?", name: "project_location", type: "text", required: true },
        { label: "Type of drawings?", name: "drawing_type", type: "select", options: ["Architectural", "Structural", "MEP"], required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New drawings", "Revisions", "Outsourcing support"], required: true }
    ],
    "International Estimation & BOQ Services": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Residential", "Commercial", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Estimation", "BOQ", "Both"], required: true },
        { label: "Project stage?", name: "stage", type: "select", options: ["Planning", "Tender stage"], required: true }
    ],
    "BIM Modelling & Coordination (LOD 300–500)": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Building", "Infra", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["3D modelling", "Clash detection", "Shop drawings"], required: true },
        { label: "LOD level required?", name: "lod_level", type: "select", options: ["300", "400", "500"], required: true }
    ],
    "Construction Scheduling & Planning (Primavera / MSP)": [
        { label: "Project location?", name: "project_location", type: "text", required: true },
        { label: "Project type?", name: "project_type", type: "select", options: ["Building", "Infra", "Industrial"], required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Scheduling", "Resource planning", "Delay analysis"], required: true },
        { label: "Project stage?", name: "stage", type: "select", options: ["Planning", "Ongoing"], required: true }
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
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["BT Road", "CC Road", "Bridge", "Culvert"], required: true },
        { label: "Project length or area?", name: "project_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New construction", "Upgradation", "Repair"], required: true }
    ],
    "Railway Infrastructure Projects": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Track", "Platform", "RUB", "ROB"], required: true },
        { label: "Project length or scope?", name: "project_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New", "Upgrade", "Maintenance"], required: true }
    ],
    "Water Supply Projects": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["OHT", "Pump house", "Pipeline"], required: true },
        { label: "Capacity or project size?", name: "project_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New", "Expansion", "Rehabilitation"], required: true }
    ],
    "Sewerage & Stormwater Projects": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Sewer line", "STP", "Drainage"], required: true },
        { label: "Project length or capacity?", name: "project_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New", "Upgrade", "Repair"], required: true }
    ],
    "Pipeline Infrastructure Projects": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of pipeline?", name: "pipeline_type", type: "select", options: ["MS", "DI", "HDPE"], required: true },
        { label: "Length or diameter details?", name: "project_details", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Laying", "Testing", "Commissioning"], required: true }
    ],
    "Power Infrastructure Projects": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Substation", "Transmission", "UG cables"], required: true },
        { label: "Capacity or voltage level?", name: "project_capacity", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Installation", "Upgrade", "Maintenance"], required: true }
    ],
    "Marine Projects": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Shore protection", "Breakwater", "Jetty"], required: true },
        { label: "Project scope or area?", name: "project_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New", "Strengthening", "Repair"], required: true }
    ],
    "Warehouse & Logistics Infrastructure": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["PEB", "Industrial flooring"], required: true },
        { label: "Area size?", name: "area_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New construction", "Expansion"], required: true }
    ],
    "Piling Execution Works": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of piling?", name: "piling_type", type: "select", options: ["Bored cast-in-situ", "Driven piles"], required: true },
        { label: "Number or depth of piles?", name: "piling_details", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Execution", "Testing"], required: true }
    ],
    "Ground Improvement": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of method?", name: "improvement_method", type: "select", options: ["Vibro compaction", "Soil strengthening"], required: true },
        { label: "Area or depth?", name: "improvement_size", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Foundation", "Stabilization"], required: true }
    ],
    "Pre-Stressing & Post-Tensioning Works": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["PT slabs", "Cable stressing", "Grouting"], required: true },
        { label: "Project size or slab area?", name: "project_size", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New", "Strengthening"], required: true }
    ],
    "Bridge Bearings & Expansion Joints": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of work?", name: "work_type", type: "select", options: ["Bearing installation", "Joint replacement"], required: true },
        { label: "Bridge type or span?", name: "bridge_details", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["Installation", "Replacement", "Repair"], required: true }
    ],
    "Gabion Wall & RE Structures": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of structure?", name: "structure_type", type: "select", options: ["Gabion", "Retaining", "RE wall"], required: true },
        { label: "Length or height?", name: "structure_size", type: "text", required: true },
        { label: "Purpose?", name: "purpose", type: "select", options: ["Soil retention", "Protection"], required: true }
    ],
    "Anti-Corrosion & Protective Coatings": [
        { label: "Where is the project located?", name: "project_location", type: "text", required: true },
        { label: "Type of coating?", name: "coating_type", type: "select", options: ["Epoxy", "PU", "Protective"], required: true },
        { label: "Surface area?", name: "surface_area", type: "text", required: true },
        { label: "Requirement?", name: "requirement", type: "select", options: ["New coating", "Recoating", "Maintenance"], required: true }
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

        // 3. Contact Step (Combined Last Step)
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
        const inputs = stepEl.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (input.type === 'radio') {
                const name = input.name;
                const checked = stepEl.querySelector(`input[name="${name}"]:checked`);
                if (!checked) isValid = false;
            } else if (!input.value.trim()) {
                isValid = false;
            }
        });

        const errorMsg = stepEl.querySelector('.error-message');
        if (!isValid) {
            if (errorMsg) errorMsg.style.display = 'block';
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
        requirementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show Success Message instead of mailto/alert
            dynamicFieldsContainer.innerHTML = `
                <div class="form-success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Thank You!</h2>
                    <p>Your Form is submitted successfully.</p>
                    <p>We will get back to you shortly.</p>
                    <button type="button" class="btn-submit-modal" onclick="document.getElementById('survey-modal').style.display='none'; document.body.style.overflow='auto';">Close</button>
                </div>
            `;
            
            // Hide progress bar on success
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) progressBar.style.width = '100%';
            
            // Reset form
            requirementForm.reset();
        });
    }
}
