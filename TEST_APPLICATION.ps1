# Testing Script for POS System
# Run this in PowerShell after installing the application

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "POS System - Testing Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Function to start MongoDB
function Start-MongoDBService {
    Write-Host "Attempting to start MongoDB service..." -ForegroundColor Yellow
    try {
        $service = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
        if ($service) {
            if ($service.Status -ne 'Running') {
                Start-Service -Name MongoDB
                Write-Host "[OK] MongoDB service started" -ForegroundColor Green
            }
            else {
                Write-Host "[OK] MongoDB service is already running" -ForegroundColor Green
            }
        }
        else {
            Write-Host "[INFO] MongoDB service not found. Starting mongod manually..." -ForegroundColor Yellow
            Start-Process mongod -WindowStyle Minimized
            Write-Host "[OK] MongoDB started (check if mongod window opens)" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "[ERROR] Failed to start MongoDB: $_" -ForegroundColor Red
    }
}

# Function to test MongoDB connection
function Test-MongoDBConnection {
    Write-Host ""
    Write-Host "Testing MongoDB connection..." -ForegroundColor Yellow
    
    try {
        $process = mongosh --eval "db.version()" --quiet 2>$null
        Write-Host "[OK] MongoDB is accessible" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[ERROR] Cannot connect to MongoDB" -ForegroundColor Red
        Write-Host "Make sure MongoDB is running on localhost:27017" -ForegroundColor Yellow
        return $false
    }
}

# Function to test backend health
function Test-BackendHealth {
    Write-Host ""
    Write-Host "Testing backend health (http://127.0.0.1:5000/health)..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/health" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "[OK] Backend is responding with status $($response.StatusCode)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[WARNING] Backend is not responding yet" -ForegroundColor Yellow
        Write-Host "This is normal if the application just started" -ForegroundColor Yellow
        return $false
    }
}

# Main execution
Write-Host ""
Write-Host "Step 1: Starting MongoDB" -ForegroundColor Cyan
Start-MongoDBService

Write-Host ""
Write-Host "Step 2: Waiting for MongoDB to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Step 3: Testing MongoDB Connection" -ForegroundColor Cyan
$mongoConnected = Test-MongoDBConnection

if (-not $mongoConnected) {
    Write-Host ""
    Write-Host "MongoDB connection failed. Critical error!" -ForegroundColor Red
    Write-Host "The application will not work without MongoDB." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 4: Waiting for backend to start..." -ForegroundColor Cyan
Write-Host "The application backend should start automatically..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Step 5: Testing Backend Connection" -ForegroundColor Cyan
for ($i = 1; $i -le 10; $i++) {
    if (Test-BackendHealth) {
        Write-Host ""
        Write-Host "======================================" -ForegroundColor Green
        Write-Host "✓ All systems operational!" -ForegroundColor Green
        Write-Host "✓ Application is ready to use" -ForegroundColor Green
        Write-Host "======================================" -ForegroundColor Green
        Read-Host "Press Enter to exit"
        exit 0
    }
    Write-Host "Attempt $i/10: Waiting..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Red
Write-Host "⚠ Backend health check failed" -ForegroundColor Red
Write-Host "======================================" -ForegroundColor Red
Write-Host ""
Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
Write-Host "1. Check if MongoDB is running: mongosh" -ForegroundColor White
Write-Host "2. Check logs: C:\Users\$env:UserName\AppData\Roaming\pos-system\logs\" -ForegroundColor White
Write-Host "3. Restart the application" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
