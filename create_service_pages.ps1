$services = @(
    @{Name="Testing"; Dir="testing"},
    @{Name="Architectural Designs"; Dir="architectural-designs"},
    @{Name="Building Constructions"; Dir="building-constructions"},
    @{Name="Interiors"; Dir="interiors"},
    @{Name="Construction Materials"; Dir="construction-materials"},
    @{Name="Building Works"; Dir="building-works"},
    @{Name="Construction Works"; Dir="construction-works"},
    @{Name="Engineering Services"; Dir="engineering-services"},
    @{Name="Infra & Industrial Services"; Dir="infra-industrial-services"},
    @{Name="Developments"; Dir="developments"}
)

$template = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{0} - Build99</title>
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
                    <h1 class="reveal">{0}</h1>
                    <p class="subtitle reveal delay-200">Professional {0} Solutions</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Grid -->
    <section class="surveying-services-section">
        <div class="container">
            <div class="section-title text-center">
                <h2>Our {0}</h2>
            </div>
            <div class="surveying-services-grid">
                <!-- Placeholder Card 1 -->
                <div class="survey-card reveal-zoom delay-100">
                    <div class="survey-card-icon">
                        <i class="fas fa-tools" style="font-size: 3rem; color: var(--primary-color);"></i>
                    </div>
                    <div class="survey-card-content">
                        <h3>{0} Service 1</h3>
                        <p>Comprehensive {0} solutions tailored to your needs.</p>
                        <a href="#" class="survey-btn">Submit Your Requirement</a>
                    </div>
                </div>

                <!-- Placeholder Card 2 -->
                <div class="survey-card reveal-zoom delay-200">
                    <div class="survey-card-icon">
                        <i class="fas fa-hard-hat" style="font-size: 3rem; color: var(--primary-color);"></i>
                    </div>
                    <div class="survey-card-content">
                        <h3>{0} Service 2</h3>
                         <p>Expert {0} services for all types of projects.</p>
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
"@

foreach ($service in $services) {
    $dirPath = Join-Path "services" $service.Dir
    $filePath = Join-Path $dirPath "index.html"
    
    if (!(Test-Path $dirPath)) {
        New-Item -ItemType Directory -Force -Path $dirPath | Out-Null
    }
    
    $content = $template -f $service.Name
    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Created $filePath"
}
