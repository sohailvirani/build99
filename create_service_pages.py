import os

services = [
    {"name": "Testing", "dir": "testing"},
    {"name": "Architectural Designs", "dir": "architectural-designs"},
    {"name": "Building Constructions", "dir": "building-constructions"},
    {"name": "Interiors", "dir": "interiors"},
    {"name": "Construction Materials", "dir": "construction-materials"},
    {"name": "Building Works", "dir": "building-works"},
    {"name": "Construction Works", "dir": "construction-works"},
    {"name": "Engineering Services", "dir": "engineering-services"},
    {"name": "Infra & Industrial Services", "dir": "infra-industrial-services"},
    {"name": "Developments", "dir": "developments"}
]

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - Build99</title>
    <link rel="icon" type="image/webp" href="../../images/favicon.webp">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/responsive.css">
</head>
<body>

    <!-- Header Container -->
    <div id="header-placeholder"></div>

    <!-- Page Header / Banner -->
    <section class="page-header" style="background-image: url('../../images/banner%201.webp');">
        <div class="header-overlay">
            <div class="container">
                <div class="header-content">
                    <h1 class="reveal">{name}</h1>
                    <p class="subtitle reveal delay-200">Professional {name} Solutions</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Grid -->
    <section class="surveying-services-section">
        <div class="container">
            <div class="section-title text-center">
                <h2>Our {name}</h2>
            </div>
            <div class="surveying-services-grid">
                <!-- Placeholder Card 1 -->
                <div class="survey-card reveal-zoom delay-100">
                    <div class="survey-card-icon">
                        <i class="fas fa-tools" style="font-size: 3rem; color: var(--primary-color);"></i>
                    </div>
                    <div class="survey-card-content">
                        <h3>{name} Service 1</h3>
                        <p>Comprehensive {name} solutions tailored to your needs.</p>
                        <a href="#" class="survey-btn">Submit Your Requirement</a>
                    </div>
                </div>

                <!-- Placeholder Card 2 -->
                <div class="survey-card reveal-zoom delay-200">
                    <div class="survey-card-icon">
                        <i class="fas fa-hard-hat" style="font-size: 3rem; color: var(--primary-color);"></i>
                    </div>
                    <div class="survey-card-content">
                        <h3>{name} Service 2</h3>
                         <p>Expert {name} services for all types of projects.</p>
                        <a href="#" class="survey-btn">Submit Your Requirement</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer Container -->
    <div id="footer-placeholder"></div>

    <!-- Define app root for JS -->
    <script>
        window.appRoot = '../../';
    </script>
    <script src="../../js/script.js"></script>
</body>
</html>
"""

base_path = "services"

for service in services:
    dir_path = os.path.join(base_path, service["dir"])
    file_path = os.path.join(dir_path, "index.html")
    
    # Directories already created, but good to be safe
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        
    content = template.format(name=service["name"])
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Created {file_path}")
