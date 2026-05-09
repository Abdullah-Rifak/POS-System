# Testing on Another Windows VM - Instructions

## Files Ready for Testing

### Production Installers (Ready to Deploy)

1. **NSIS Installer** (Recommended for testing)
   - File: `POS System_0.1.0_x64-setup.exe`
   - Location: `src-tauri\target\release\bundle\nsis\`
   - Size: ~120MB
   - Installation: Standard Windows installer
   - Uninstall: Control Panel → Programs and Features

2. **MSI Installer** (Alternative option)
   - File: `POS System_0.1.0_x64_en-US.msi`
   - Location: `src-tauri\target\release\bundle\msi\`
   - Size: ~120MB
   - Installation: Windows Installer format

### Testing Tools (Copy to VM)

1. **VERIFY_SYSTEM.bat** - System requirements checker
2. **TEST_APPLICATION.ps1** - Automated testing script
3. **TESTING_GUIDE.md** - Complete testing documentation

---

## Steps to Test on Another Windows VM

### 1. **Transfer Files to Target VM**

Copy these files to the target VM:

```
From your PC:
- src-tauri\target\release\bundle\nsis\POS System_0.1.0_x64-setup.exe
- VERIFY_SYSTEM.bat
- TEST_APPLICATION.ps1
- TESTING_GUIDE.md
```

Use:

- USB Flash Drive
- Network Share (Windows file sharing)
- Cloud Storage (Google Drive, OneDrive, etc.)
- RDP/Remote Desktop to transfer files

### 2. **On the Target VM - Verify Setup**

```powershell
# Run the verification script (double-click or run in PowerShell)
.\VERIFY_SYSTEM.bat
```

This will check:
✓ Node.js installation
✓ npm installation
✓ MongoDB installation
✓ Port availability (5000, 27017)
✓ Required dependencies

### 3. **Install Required Software (if missing)**

If verification fails, install:

**Node.js:**

- Download: https://nodejs.org/ (v16+ LTS recommended)
- Run installer, accept defaults

**MongoDB Community:**

- Download: https://www.mongodb.com/try/download/community
- Run installer, select "Install MongoDB as a Service"

### 4. **Install POS System Application**

```powershell
# Double-click the installer:
.\POS System_0.1.0_x64-setup.exe

# Or run from PowerShell:
& ".\POS System_0.1.0_x64-setup.exe"
```

Follow the installation wizard (accept all defaults).

### 5. **Start MongoDB Service**

```powershell
# Start MongoDB service
Start-Service MongoDB

# Or start it manually:
mongod
```

### 6. **Launch the Application**

- Start Menu → POS System
- Or find it in: `C:\Program Files\POS System\`

### 7. **Run Automated Tests**

```powershell
# Run the testing script
powershell -ExecutionPolicy Bypass -File .\TEST_APPLICATION.ps1
```

This will:

1. Start MongoDB service
2. Test MongoDB connectivity
3. Wait for backend to start
4. Verify backend health
5. Report all results

---

## Expected Test Results

### ✓ Successful Test

```
Step 1: Starting MongoDB
[OK] MongoDB service started

Step 2: Waiting for MongoDB to initialize...

Step 3: Testing MongoDB Connection
[OK] MongoDB is accessible

Step 4: Waiting for backend to start...

Step 5: Testing Backend Connection
Attempt 1/10: Waiting...
[OK] Backend is responding with status 200

======================================
✓ All systems operational!
✓ Application is ready to use
======================================
```

### ✗ Common Issues & Solutions

**Issue: "Node.js not found"**

- Solution: Install Node.js from nodejs.org

**Issue: "MongoDB not accessible"**

- Solution: Ensure MongoDB service is running
  ```powershell
  Start-Service MongoDB
  ```

**Issue: "Backend is not responding"**

- Solution: Check logs at:
  ```
  C:\Users\<Username>\AppData\Roaming\pos-system\logs\
  ```

**Issue: "Port 5000 already in use"**

- Solution: Check what's using the port and stop it
  ```powershell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

---

## Testing Checklist

After successful installation, verify:

- [ ] Application starts without errors
- [ ] No "Backend is not responding" error
- [ ] Login page loads
- [ ] Can log in with valid credentials
- [ ] Dashboard displays data
- [ ] Navigation works smoothly
- [ ] Can create/edit/delete records
- [ ] Reports generate correctly
- [ ] No console errors in the app
- [ ] Response times are acceptable (~2 seconds per action)

---

## Clean Testing Environment

For a fresh test on isolated VM:

1. **Fresh Windows Installation**
   - No prior versions of the app
   - Clean registry

2. **Install Only Required Software**
   - Windows OS (update to latest)
   - Node.js (LTS version)
   - MongoDB Community

3. **Run from USB or Network**
   - Don't copy to hard drive first
   - This simulates multiple machine testing

4. **Monitor Resource Usage**
   - Task Manager → Performance
   - Should use < 500MB RAM at idle
   - Backend process should be stable

---

## Success Metrics

The application is ready for client use when:

✓ Installs successfully without errors
✓ Launches without "Backend is not responding"
✓ Responds to all user actions within 2 seconds
✓ Can perform all CRUD operations
✓ No console errors or warnings
✓ Handles network interruptions gracefully
✓ Logs errors properly for debugging

---

## Report Testing Results

Please provide:

1. **VM Configuration**
   - Windows version (7, 10, 11?)
   - RAM amount
   - Processor type

2. **Test Results**
   - Pass/Fail for each checklist item
   - Any error messages encountered
   - Response times for operations

3. **Environment Details**
   - Node.js version
   - MongoDB version
   - Network type (wired/WiFi)

4. **Issues Found**
   - Steps to reproduce
   - Screenshots if applicable
   - Related log entries

---

For questions or issues, check **TESTING_GUIDE.md** for detailed troubleshooting.
