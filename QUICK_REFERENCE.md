# POS System - Client Quick Reference Card

## 📱 Installation Quick Start

### What You Need to Install First

1. **Node.js 18+** : https://nodejs.org/ (LTS version)
2. **MongoDB Community**: https://www.mongodb.com/try/download/community

### Installation Steps

1. Install Node.js, check "Add to PATH"
2. Install MongoDB, check "Install as Service"
3. Restart your computer
4. Run the POS System installer (.msi)
5. Open application from Start Menu

### Login

```
Username: admin
Password: admin123
```

---

## 🔴 If You See White Screen

**Option 1: Quick Fix (Try This First)**

- Close the app completely
- Open Task Manager (Ctrl+Shift+Esc)
- Look for "node.exe" and close it
- Wait 2 seconds
- Restart the application

**Option 2: Check MongoDB**

- Press Windows Key, type "Services"
- Find "MongoDB" in the list
- Should say "Running" (not "Stopped")
- If stopped, right-click → "Start"
- Then restart the application

**Option 3: Still Not Working**

- Restart your computer
- Make sure Node.js is installed: `node --version`
- Make sure MongoDB is installed: `mongosh --version`
- Run the application again

---

## ⚙️ Pre-Launch Checklist

Before opening the app, verify:

```
☐ Node.js installed? (Open Command Prompt, type: node --version)
☐ MongoDB running? (Services shows MongoDB = Running)
☐ Windows Defender allowed Node.js? (May prompt on first run)
☐ Port 5000 free? (No other app using it)
```

---

## 🙋 Common Questions

**Q: Do I need internet?**
A: No, it runs completely locally on your computer

**Q: Where is my data stored?**
A: In MongoDB database on your local computer (Windows username AppData folder)

**Q: Can multiple people use it?**
A: On the same computer only (local desktop app)

**Q: How do I back up my data?**
A: MongoDB data automatically backs up. Contact IT for disaster recovery.

**Q: Can I reinstall without losing data?**
A: Yes! Data is in MongoDB, separate from the app

---

## 📞 Troubleshooting

| Problem                          | Solution                                          |
| -------------------------------- | ------------------------------------------------- |
| White screen                     | Restart app, check MongoDB is running             |
| Can't login                      | Restart computer, verify credentials              |
| Very slow to open                | First launch is slower (initializing), be patient |
| Can't access from other computer | It's a local desktop app, not network-accessible  |
| Installer fails                  | Run installer again on Admin account              |

---

## 🔧 System Requirements

| Requirement | Minimum   | Recommended |
| ----------- | --------- | ----------- |
| Windows     | 10 64-bit | 11 64-bit   |
| Disk Space  | 200 MB    | 500 MB      |
| RAM         | 2 GB      | 4 GB        |
| Node.js     | 18.x      | 20.x LTS    |
| MongoDB     | 5.0       | 6.0+        |

---

## 📋 If You Need Support

Provide this information:

1. Windows version: Settings → System → About
2. Node.js version: `node --version`
3. MongoDB status: Running? (Check Services)
4. What were you doing when error appeared?
5. Full error message (if any)
6. Screenshot of error

---

## 🚨 Emergency: Port 5000 Already in Use

If error shows "Port 5000 in use":

```cmd
# Find what's using it
netstat -ano | findstr :5000

# Kill the process (replace XXXX with PID number shown above)
taskkill /PID XXXX /F

# Then restart the application
```

---

## ✓ Verification After Installation

After installing, verify all working:

1. ✓ Click Start Menu → type "POS"
2. ✓ Click "POS System" to open
3. ✓ See login page (not white screen)
4. ✓ Login with admin / admin123
5. ✓ See dashboard with data
6. ✓ Can navigate between pages

---

## 💾 Backup & Recovery

**Automatic**: MongoDB backs up daily
**Manual**: Ask IT to create backup

**Data Location**: `%APPDATA%\pos-system\`

---

## 🔄 Getting Updates

When a new version is available:

1. Close the current application
2. Run the new installer
3. It will uninstall old version
4. Click "Yes" when asked to keep data
5. Data is preserved - nothing lost!

---

## 📲 Contact IT Support

**For installation issues:**

- Run: `SETUP_VERIFICATION.ps1` (right-click → Run with PowerShell)
- Send screenshot + error message

**For application bugs:**

- Take screenshot
- Describe what you were doing
- Check `%APPDATA%\pos-system\logs\` for error files

---

**Remember**:

- Keep Node.js and MongoDB installed
- Keep Windows updated
- Don't move the installation folder
- MongoDB must be running for app to work

**Questions?** Check INSTALLATION_GUIDE.md in setup folder or contact IT support.

---

**POS System v0.1.0** | Windows Tauri Desktop Application | MongoDB Backend
