# POS System - Client Installation & Troubleshooting Guide

## ✓ What's Included in the Installer

The POS System installer (`.msi` or `.exe`) includes:

- **Tauri Application Shell** - The desktop application
- **WebView2 Runtime** - Required for the application UI to work
- **Node.js Backend** - Built-in server (bundled with the app)

## 📋 System Requirements

**Before installing, ensure you have:**

- Windows 10 or later (64-bit)
- At least 200 MB free disk space
- Administrator access for installation
- **Node.js 18.x or higher** - Required for the backend
- **MongoDB 5.0 or higher** - Required for the database

## 🚀 Installation Steps

### Step 1: Install Node.js (Required)

1. Download from: https://nodejs.org/
2. Choose the **LTS (Long Term Support)** version
3. Run the installer and click through the defaults
4. **IMPORTANT:** Check the option "Add to PATH" during installation
5. Restart your computer after installation
6. Verify by opening Command Prompt and typing:
   ```cmd
   node --version
   npm --version
   ```

### Step 2: Install MongoDB (Required)

1. Download from: https://www.mongodb.com/try/download/community
2. Run the MongoDB installer
3. **IMPORTANT:** Check "Install MongoDB as a Service"
4. Complete the installation
5. MongoDB should now start automatically with Windows
6. Verify by opening Command Prompt and typing:
   ```cmd
   mongosh --version
   ```

### Step 3: Install POS System Application

1. Run the `POS-System-0.1.0.msi` or `POS-System-0.1.0.exe` installer
2. The installer will automatically download and install WebView2 runtime
3. Follow the installation wizard and choose your installation directory
4. Click "Finish" to complete the installation

### Step 4: Verify MongoDB is Running

Before launching the POS System:

1. **Windows 10/11:** Open Services (services.msc)
   - Look for "MongoDB" in the service list
   - Status should show "Running"
   - If stopped, right-click and select "Start"

2. OR open Command Prompt and type:
   ```cmd
   mongosh
   ```

   - If this opens a connection, MongoDB is running ✓
   - Type `exit` to close

## ▶️ Running the Application

1. Click the POS System desktop shortcut or open from Start Menu
2. The app should show "Initializing application..." briefly
3. You should see the login page
4. Default credentials:
   - Username: admin
   - Password: admin123

## 🔴 Troubleshooting White Screen Error

### If You See a White Screen:

#### **Solution 1: Ensure MongoDB is Running**

```cmd
mongosh "mongodb://localhost:27017"
```

- Should connect without errors
- If it fails, start MongoDB Service (see Step 4 above)

#### **Solution 2: Check if Port 5000 is Available**

```cmd
netstat -ano | findstr :5000
```

- If something is using port 5000, close that application
- Common culprits: Apache, MySQL, other Node.js apps

#### **Solution 3: Restart the Application**

- Close all POS System windows
- Open Task Manager (Ctrl+Shift+Esc)
- Look for "node.exe" process - if found, right-click and "End Task"
- Wait 2 seconds and relaunch the application

#### **Solution 4: Check WebView2 Installation**

```cmd
reg query HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}
```

- If no results, run the installer again - it will reinstall WebView2

#### **Solution 5: View Application Logs**

On Windows, application logs are saved to:

```
%APPDATA%\pos-system\logs\
```

- Open a file manager and go to your AppData folder
- View recent log files for error details
- Take a screenshot of errors if you need support

## 🛠️ Manual Backend Start (Advanced)

If the app shows WebView2 error but backend might be running:

1. Open Command Prompt
2. Navigate to the installation directory
3. Run:
   ```cmd
   mongosh "mongodb://localhost:27017/pos-system-db"
   ```

   - Should connect without errors

## 📞 Support Information

If you encounter issues:

1. **Collect this information:**
   - Windows version (Settings → System → About)
   - Node.js version: `node --version`
   - MongoDB status: `mongosh --version`
   - Application logs from `%APPDATA%\pos-system\`

2. **Common fixes:**
   - Restart computer (solves 80% of issues)
   - Reinstall WebView2 runtime
   - Update Windows completely

## ✓ Verification Checklist

Before considering installation complete:

- [ ] Node.js installed and in PATH
- [ ] MongoDB installed and running as service
- [ ] POS System application installed
- [ ] Application launches without white screen
- [ ] Login page appears
- [ ] Can login with credentials
- [ ] Dashboard loads successfully

## 🔄 Updating the Application

When a new version is released:

1. Download the new installer
2. Run it - it will ask to uninstall the old version
3. Click "Yes" to keep your MongoDB data
4. Install the new version
5. Data will be preserved in MongoDB

---

**Need help?** Make sure all three components are installed:

- ✓ Node.js (in PATH)
- ✓ MongoDB (running as service)
- ✓ POS System Application (with WebView2)
