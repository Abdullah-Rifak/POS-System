@echo off
REM POS System - Windows Setup Script
REM This script checks for required dependencies and sets up the system

setlocal enabledelayedexpansion
color 0A
title POS System - Setup

echo.
echo ========================================
echo   POS System - Windows Setup
echo ========================================
echo.

REM Check for Node.js
echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    echo Make sure to:
    echo 1. Download the LTS version
    echo 2. Check "Add to PATH" during installation
    echo 3. Restart your computer after installation
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed: 
    node --version
)

echo.

REM Check for MongoDB
echo Checking for MongoDB...
mongosh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [WARNING] MongoDB (mongosh) is not found in PATH
    echo.
    echo Please ensure MongoDB is installed and added to PATH:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo After installation, verify with: mongosh --version
    echo.
    timeout /t 3
) else (
    echo [OK] MongoDB is installed:
    mongosh --version
)

echo.
echo ========================================
echo   Dependency Check Complete
echo ========================================
echo.
echo Next steps:
echo 1. Ensure MongoDB service is running
echo 2. Run the POS System desktop application
echo.
echo If you see a white screen error:
echo - Open Task Manager and check if "node.exe" is running
echo - Check that port 5000 is not already in use
echo.
pause
