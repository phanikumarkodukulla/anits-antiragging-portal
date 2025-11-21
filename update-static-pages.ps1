# Quick script to add ANITS navbar/footer partials to static pages
$staticPages = @(
    "rules.ejs",
    "penalties.ejs",
    "rights.ejs",
    "committee.ejs",
    "contact.ejs"
)

$navbarCode = @'
    <%- include('../partials/navbar', { currentPage: '' }) %>
'@

$footerCode = @'
    <%- include('../partials/footer') %>

    <!-- SOS Button -->
    <button id="sosButton" class="sos-button" title="Emergency SOS Alert">
        <i class="fas fa-exclamation-triangle"></i>
    </button>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/main.js"></script>
    <script src="/js/sos.js"></script>
'@

foreach ($page in $staticPages) {
    $filePath = "C:\Users\user\OneDrive\Desktop\AARW\views\static\$page"
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Replace old navbar
        $content = $content -replace '(?s)<nav class="navbar[^>]*>.*?</nav>', $navbarCode
        
        # Replace old footer
        $content = $content -replace '(?s)<footer[^>]*>.*?</footer>\s*<script[^>]*bootstrap[^>]*></script>', $footerCode
        
        # Update title
        $content = $content -replace '<title>[^<]*</title>', '<title>ANITS | Anti-Ragging Portal</title>'
        
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        Write-Host "Updated: $page" -ForegroundColor Green
    }
}

Write-Host "`nAll static pages updated successfully!" -ForegroundColor Cyan
