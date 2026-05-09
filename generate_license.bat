@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%backend"

if not exist "%BACKEND_DIR%" (
  echo ERROR: backend folder not found next to this .bat file.
  echo Place this file in the POS-System root folder.
  pause
  exit /b 1
)

set /p LICENSE_SECRET=Enter LICENSE_SECRET: 
if "%LICENSE_SECRET%"=="" (
  echo ERROR: LICENSE_SECRET is required.
  pause
  exit /b 1
)

set /p CUSTOMER=Enter customer name: 
if "%CUSTOMER%"=="" (
  set "CUSTOMER=Unknown Customer"
)

set /p MACHINE=Enter machine ID (or leave blank for *): 
if "%MACHINE%"=="" (
  set "MACHINE=*"
)

set /p DAYS=Enter license days (default 30): 
if "%DAYS%"=="" (
  set "DAYS=30"
)

set "OUTFILE=%BACKEND_DIR%\license.json"
set "TARGET_DIR=%APPDATA%\pos-system"
set "TARGET_FILE=%TARGET_DIR%\license.json"

pushd "%BACKEND_DIR%" || exit /b 1
set "LICENSE_SECRET=%LICENSE_SECRET%"

node scripts\generate-license.js --customer "%CUSTOMER%" --machine "%MACHINE%" --days %DAYS% --out "%OUTFILE%"

if %errorlevel% neq 0 (
  echo ERROR: License generation failed.
  popd
  pause
  exit /b 1
)

popd

echo.
echo License generated at: %OUTFILE%

if not exist "%TARGET_DIR%" (
  mkdir "%TARGET_DIR%"
)

copy /Y "%OUTFILE%" "%TARGET_FILE%" >nul
if %errorlevel% neq 0 (
  echo ERROR: Failed to copy license to %TARGET_FILE%
  pause
  exit /b 1
)

echo License copied to: %TARGET_FILE%
echo.
pause
