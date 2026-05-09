# Testing Guide for POS System on Another Windows VM

## Prerequisites on Target VM

### Required Software:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB Community Edition** - [Download](https://www.mongodb.com/try/download/community)
3. **.NET Framework** (usually pre-installed on Windows)

### Verify Installation:

```powershell
node --version
npm --version
mongosh --version
```

---

## Installation Steps

### 1. Install the Application

Run one of the provided installers:

- **NSIS Installer** (Recommended): `POS System_0.1.0_x64-setup.exe`
- **MSI Installer**: `POS System_0.1.0_x64_en-US.msi`

### 2. Start MongoDB Service

Before launching the application:

**Option A: MongoDB as Windows Service** (If installed)

```powershell
# Start MongoDB service
net start MongoDB
# Or
Start-Service MongoDB
```

**Option B: Manual MongoDB Start**

```powershell
# Start MongoDB server (runs on localhost:27017)
mongod
```

### 3. Launch the Application

After installing, the application will be in:

- Start Menu → POS System
- Or: `C:\Program Files\POS System` (or similar)

---

## Testing Checklist

### Backend Connection

- [ ] Application starts without "Backend is not responding" error
- [ ] Login page loads successfully
- [ ] No connection errors in console

### Functionality Tests

- [ ] Login with valid credentials works
- [ ] Dashboard loads all data
- [ ] Navigation between pages works smoothly
- [ ] Can create new items/stock
- [ ] Can update existing records
- [ ] Can delete records
- [ ] Search/filter functions work
- [ ] Reports generate correctly
- [ ] Export to PDF works

### Performance

- [ ] Application loads in < 5 seconds
- [ ] Page transitions are smooth (< 2 seconds)
- [ ] No lag when scrolling through large datasets

### Error Handling

- [ ] Proper error messages when backend is down
- [ ] Can recover after backend restart
- [ ] Handles network disconnections gracefully

---

## Troubleshooting

### "Backend is not responding" Error

**Solution 1: Ensure MongoDB is running**

```powershell
# Check if MongoDB is accessible
mongosh "mongodb://localhost:27017"

# If this fails, start MongoDB:
mongod
```

**Solution 2: Check if port 5000 is available**

```powershell
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process if needed (replace PID with the process ID)
taskkill /PID <PID> /F
```

**Solution 3: Allow firewall access**

- Windows Defender Firewall → Allow an app
- Make sure Node.js is in the allowed list

**Solution 4: Check application logs**

- Logs location: `C:\Users\<Username>\AppData\Roaming\pos-system\logs\`
- Check for error messages

### Application Won't Start

**Solution:**

1. Uninstall the application
2. Ensure MongoDB is running
3. Wait 5 seconds
4. Reinstall the application

---

## Log Files Location

All application logs are stored at:

```
C:\Users\<YourUsername>\AppData\Roaming\pos-system\logs\
```

Check the latest log file for detailed error information.

---

## System Requirements

- **OS**: Windows 10 or Windows 11
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 500MB free space
- **Network**: Localhost network access (127.0.0.1:5000)

---

## Uninstallation

To remove the application:

1. Go to Control Panel → Programs → Programs and Features
2. Find "POS System"
3. Click Uninstall
4. Configuration files remain in `AppData\Roaming\pos-system\` (delete manually if needed)

---

## Reporting Issues

When reporting issues, please include:

1. Windows version (Win+R → winver)
2. Node.js version (`node --version`)
3. MongoDB status (`mongosh --version`)
4. Complete error message from application
5. Relevant log file contents from logs folder
