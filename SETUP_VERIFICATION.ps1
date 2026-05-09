# POS System - Windows PowerShell Setup & Verification Script
# Run as Administrator for best results

Write-Host "========================================" -ForegroundColor Green
Write-Host "   POS System - Setup & Verification" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
$isAdmin = ([System.Security.Principal.WindowsIdentity]::GetCurrent()).groups -match "S-1-5-32-544"
if (-not $isAdmin) {
    Write-Host "[WARNING] This script should be run as Administrator for full functionality" -ForegroundColor Yellow
    Write-Host "Please right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
}

# Function to check if command exists
function Test-CommandExists {
    param($command)
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
if (Test-CommandExists node) {
    $nodeVersion = & node --version
    Write-Host "[✓] Node.js is installed: $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "[✗] Node.js is NOT installed" -ForegroundColor Red
    Write-Host "    Download from: https://nodejs.org/ (LTS version)" -ForegroundColor Yellow
    Write-Host "    Make sure to check 'Add to PATH' during installation" -ForegroundColor Yellow
}

Write-Host ""

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Cyan
if (Test-CommandExists mongosh) {
    $mongoVersion = & mongosh --version
    Write-Host "[✓] MongoDB is installed: $mongoVersion" -ForegroundColor Green
}
else {
    Write-Host "[✗] MongoDB is NOT installed" -ForegroundColor Red
    Write-Host "    Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
}

Write-Host ""

# Check MongoDB Service (if running as admin)
if ($isAdmin) {
    Write-Host "Checking MongoDB Service..." -ForegroundColor Cyan
    $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($mongoService) {
        if ($mongoService.Status -eq "Running") {
            Write-Host "[✓] MongoDB Service is RUNNING" -ForegroundColor Green
        }
        else {
            Write-Host "[✗] MongoDB Service is STOPPED" -ForegroundColor Red
            Write-Host "    Starting MongoDB Service..." -ForegroundColor Yellow
            try {
                Start-Service -Name "MongoDB"
                Write-Host "[✓] MongoDB Service started successfully" -ForegroundColor Green
            }
            catch {
                Write-Host "[✗] Failed to start MongoDB Service" -ForegroundColor Red
                Write-Host "    You may need to start it manually from Services" -ForegroundColor Yellow
            }
        }
    }
    else {
        Write-Host "[!] MongoDB Service not found" -ForegroundColor Yellow
        Write-Host "    Ensure MongoDB is installed and 'Install as Service' was selected" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Check if port 5000 is available
Write-Host "Checking if port 5000 is available..." -ForegroundColor Cyan
$portInUse = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "[✗] Port 5000 is already in use" -ForegroundColor Red
    Write-Host "    Process: $($portInUse.OwningProcess)" -ForegroundColor Yellow
    Write-Host "    Please close the application using this port" -ForegroundColor Yellow
}
else {
    Write-Host "[✓] Port 5000 is available" -ForegroundColor Green
}

Write-Host ""

# Check WebView2 Runtime
Write-Host "Checking WebView2 Runtime..." -ForegroundColor Cyan
$webview2Path = "HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
$webview2 = Get-ItemProperty -Path "Registry::$webview2Path" -ErrorAction SilentlyContinue
if ($webview2) {
    Write-Host "[✓] WebView2 Runtime is installed" -ForegroundColor Green
}
else {
    Write-Host "[!] WebView2 Runtime may not be installed" -ForegroundColor Yellow
    Write-Host "    It will be installed automatically when you run the POS System installer" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Setup Verification Complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Summary recommendations
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Ensure all [✓] items are present"
Write-Host "2. If any [✗] items exist, install the missing software"
Write-Host "3. Run the POS System installer"
Write-Host "4. If you see a white screen, run this script again to diagnose"
Write-Host ""

Read-Host "Press Enter to close this window"
