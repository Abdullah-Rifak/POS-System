# POS System - Quick Troubleshooting Reference

## 🔴 White Screen Error - FIXED! ✓

### What Was Wrong

The Rust code (`main.rs`) was spawning the Node.js backend process but immediately killing it, leaving the frontend with no backend to connect to.

### What's Fixed

- Backend process is now properly managed
- WebView2 bundling is now in place
- Frontend shows helpful error messages if backend fails
- Health checks are more robust (10 retries instead of 5)

### Try These Steps

1. **Restart the application**
   - Close all windows
   - Open Task Manager (Ctrl+Shift+Esc)
   - End any "node.exe" processes
   - Wait 2 seconds and relaunch

2. **Verify MongoDB is running**
   - Windows Key → Services
   - Find "MongoDB" in the list
   - Should show "Running"
   - If not, right-click → "Start"

3. **Check Windows Defender isn't blocking Node.js**
   - Windows Defender may block node.exe on first run
   - If prompted, click "Allow access"
   - Or add exception: `your-install-path\backend\node.exe`

4. **Port 5000 conflict**

   ```cmd
   netstat -ano | findstr :5000
   ```

   If a PID is shown, close that application first

5. **Reinstall WebView2**
   - Run the installer again
   - It will check and reinstall WebView2

---

## 🟡 Backend Connection Warning

### Symptom

"Backend is not responding - Backend returned status 500"

### Causes & Fixes

#### MongoDB Not Running

```bash
# Check MongoDB status
mongosh "mongodb://localhost:27017"

# If fails, start MongoDB service
Services → MongoDB → Start
```

#### Backend Dependencies Not Installed

```bash
cd "C:\Program Files\POS System\backend"
npm install
```

#### Check Logs

```
C:\Users\YourUsername\AppData\Roaming\pos-system\logs\
```

---

## 🔵 Installer Issues

### "WebView2 Runtime installer failed"

- Ensure you have admin rights
- Check internet connection (installer downloads WebView2)
- Try running installer again

### "Installer couldn't complete"

- Uninstall old version first
- Restart computer
- Run installer again with admin rights

---

## 🟢 Performance Issues

### App Opens Very Slowly (>30 seconds)

- First launch takes longer (backend initializes MongoDB)
- Check MongoDB service is starting properly
- Check disk space (should be >1GB free)

### App Is Laggy After Opening

- MongoDB needs time to start (2-5 seconds)
- Hardware limitations may apply
- Close other applications using CPU

---

## 🟠 Login Problems

### Can't Login with Default Credentials

**First time setup:**

```
Username: admin
Password: admin123
```

**If this doesn't work:**

1. Press F12 to open Developer Tools
2. Go to "Network" tab
3. Try logging in
4. Look for failed requests to `/auth/login`
5. Check the response (error details)

**Database was wiped:**

```bash
# Backup creates automatic snapshots, but if completely deleted:
# Contact support - data recovery may be possible
```

---

## 📊 Verification Checklist

Run this in Command Prompt to verify everything:

```cmd
REM Check Node.js
node --version

REM Check MongoDB running
mongosh "mongodb://localhost:27017"

REM Check port 5000
netstat -ano | findstr :5000
# Should show nothing (port available) or node.exe using it

REM Check WebView2
reg query HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}
```

All should show successful results.

---

## 🛠️ Advanced Troubleshooting

### Check Application Event Log

- Windows Key → Event Viewer
- Windows Logs → Application
- Look for errors from "POS System" or Node.js

### Enable Detailed Logging

Create file: `%APPDATA%\pos-system\config.json`
Add logging level:

```json
{
  "mongoUri": "mongodb://localhost:27017/pos-system-db",
  "port": 5000,
  "logLevel": "debug"
}
```

### Manual Backend Start (Testing)

```bash
# Terminal 1: Start MongoDB
mongosh

# Terminal 2: Start backend manually
cd "C:\Program Files\POS System\backend"
node src/server.js
# Should show: "✓ Backend server running on http://127.0.0.1:5000"

# Terminal 3: Test API
curl http://127.0.0.1:5000/health
# Should respond with: {"ok":true}
```

---

## 📞 Before Contacting Support

Collect this information:

1. **Windows Version**: Settings → System → About → Windows specifications
2. **Node.js Version**: `node --version`
3. **MongoDB Status**: Verify MongoDB service is running
4. **Recent Logs**: `%APPDATA%\pos-system\logs\` (attach newest .log file)
5. **Steps You Took**: Document what you tried and results
6. **Screenshot**: If possible, screenshot of error message

---

## ✓ Successful Setup Indicators

You're good to go when you see:

1. ✓ Application launches (no immediate crash)
2. ✓ Login page appears (not white screen)
3. ✓ Can login with credentials
4. ✓ Dashboard loads with data
5. ✓ Can navigate between pages
6. ✓ Can create/edit records
7. ✓ No red errors in F12 Developer Tools

---

## 🚀 Quick Start After Installation

1. **Ensure MongoDB is running** (Windows service should auto-start)
2. **Launch POS System** from Start Menu
3. **Wait for initialization** (3-5 seconds on first launch)
4. **Login** with: admin / admin123
5. **You're in!** Start using the system

Need more help? Follow the full INSTALLATION_GUIDE.md or BUILD_AND_DEPLOYMENT.md files.
