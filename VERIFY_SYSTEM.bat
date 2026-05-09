@echo off
REM Pre-Installation Verification Script for POS System
REM This script checks if all required dependencies are installed

echo ========================================
echo POS System - Pre-Installation Verification
echo ========================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js is installed: 
    node --version
) else (
    echo [ERROR] Node.js is NOT installed
    echo Download from: https://nodejs.org/
    echo.
)

REM Check npm
echo.
echo Checking npm...
npm --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] npm is installed: 
    npm --version
) else (
    echo [ERROR] npm is NOT installed
    echo.
)

REM Check MongoDB
echo.
echo Checking MongoDB...
mongosh --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB is installed: 
    mongosh --version
) else (
    echo [ERROR] MongoDB is NOT installed
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
)

REM Check MongoDB service
echo.
echo Checking MongoDB service...
sc query MongoDB >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB service is available
    for /f "tokens=3" %%a in ('sc query MongoDB ^| find "STATE"') do (
        echo Service state: %%a
    )
) else (
    echo [INFO] MongoDB service not found (you can start it manually)
)

REM Check port 5000 availability
echo.
echo Checking port 5000 availability...
netstat -ano | findstr :5000 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Port 5000 is already in use
    echo Active connections on port 5000:
    netstat -ano | findstr :5000
) else (
    echo [OK] Port 5000 is available
)

REM Check port 27017 (MongoDB default)
echo.
echo Checking port 27017 (MongoDB)...
netstat -ano | findstr :27017 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB port 27017 is accessible
) else (
    echo [INFO] MongoDB port 27017 not active (start MongoDB service)
)

echo.
echo ========================================
echo Verification Complete
echo ========================================
echo.
echo Next steps:
echo 1. If Node.js or MongoDB are missing, install them
echo 2. Start MongoDB service before running the application
echo 3. Install the POS System using the provided installer
echo.
pause
