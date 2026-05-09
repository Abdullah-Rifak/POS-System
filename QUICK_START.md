# Quick Start - Desktop App Installation

## For End Users (Customer's PC)

### Step 1: Install Prerequisites

```bash
# MongoDB 6.0+ MUST be installed and running
# Download from: https://www.mongodb.com/try/download/community
# Install and ensure service is running

# Verify MongoDB is running:
mongosh "mongodb://localhost:27017"
# You should see: test>
```

### Step 2: Install POS System App

- Run the installer (.exe, .dmg, or .deb)
- Follow installation steps
- App will start automatically

### Step 3: First Launch

- App will create config automatically
- Check console window for:
  - "✓ MongoDB connected successfully"
  - "✓ Backend server running on http://127.0.0.1:5000"
- React frontend should load in app window

### Step 4: Login

- Use your configured admin credentials
- Start using the POS system

### Troubleshooting

**"MongoDB connection error"**

1. Ensure MongoDB service is running
2. Open Task Manager (Windows) or Activity Monitor (macOS)
3. Look for "mongod" process
4. If not found, start MongoDB service
5. Restart POS System app

**"Backend server failed to start"**

1. Check if port 5000 is already in use
2. Windows: `netstat -ano | findstr :5000`
3. macOS/Linux: `lsof -i :5000`
4. Kill other process on port 5000
5. Restart app

**App doesn't load**

1. Check MongoDB is running
2. Wait 5-10 seconds for backend startup
3. Check if error message appears
4. Restart the application

---

## For Developers / System Admins

### Custom MongoDB Configuration

If you need custom MongoDB URI (authentication, different host, etc.):

1. **Windows:**

   ```
   Create/Edit: C:\Users\<YourName>\AppData\Roaming\pos-system\.env
   MONGO_URI=mongodb://user:password@host:27017/pos-system-db?authSource=admin
   PORT=5000
   ```

2. **macOS:**

   ```
   Create/Edit: ~/Library/Application\ Support/pos-system/.env
   MONGO_URI=mongodb://user:password@host:27017/pos-system-db?authSource=admin
   PORT=5000
   ```

3. **Linux:**

   ```
   Create/Edit: ~/.config/pos-system/.env
   MONGO_URI=mongodb://user:password@host:27017/pos-system-db?authSource=admin
   PORT=5000
   ```

4. Restart application

### Auto-Generated Configuration

First run creates: `<ConfigDir>/pos-system/config.json`

```json
{
  "mongoUri": "mongodb://localhost:27017/pos-system-db",
  "port": 5000,
  "JWT_SECRET": "auto-generated-64-char-hex-string",
  "JWT_EXPIRE": "1d",
  "isDesktopApp": true,
  "mongoOptions": {
    "serverSelectionTimeoutMS": 5000,
    "socketTimeoutMS": 45000,
    "retryWrites": true,
    "w": "majority"
  }
}
```

### Development Mode

```bash
# Navigate to project root
cd POS-System

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Run dev server
cd ..
cargo tauri dev

# Or with custom MongoDB:
MONGO_URI=mongodb://custom-host:27017/db-name cargo tauri dev
```

### Build Release

```bash
# Build for production
cargo tauri build --release

# Output location:
# Windows: src-tauri/target/release/bundle/msi/
# macOS: src-tauri/target/release/bundle/dmg/
# Linux: src-tauri/target/release/bundle/deb/
```

### Key Endpoints

- **Backend Health:** `http://127.0.0.1:5000/health`
- **Login:** `POST http://127.0.0.1:5000/auth/login`
- **Items:** `http://127.0.0.1:5000/item`
- **Stock:** `http://127.0.0.1:5000/stock/combined`
- **Suppliers:** `http://127.0.0.1:5000/supplier`

### Logs & Debugging

1. **Backend Console:** Check terminal window running Node.js
2. **Frontend DevTools:** Press F12 inside app window
3. **Config File:** Check if auto-generated correctly
4. **MongoDB:** Test with `mongosh "mongodb://localhost:27017"`

### Performance Notes

- First startup: 3-5 seconds (backend initialization)
- MongoDB connection attempts: up to 5 retries
- Between retries: 2 second delay
- Health check: 5 attempts before proceeding

### Support Information

**Common Issues:**

- MongoDB not running → Start MongoDB service
- Port 5000 in use → Change PORT in env/config
- CORS errors → Ensure API calls use 127.0.0.1:5000
- Slow startup → Check MongoDB is responsive

**Configuration:**

- Backend config: `~/AppData/Roaming/pos-system/config.json` (Windows)
- Frontend API: `http://127.0.0.1:5000` (hardcoded, override with REACT_APP_API_URL)
- Environment vars: Supported in .env file

**Uninstall:**

1. Close the app
2. Remove from Programs (Windows) / Applications (macOS)
3. Optionally delete config:
   - Windows: `%APPDATA%\pos-system`
   - macOS: `~/Library/Application Support/pos-system`
   - Linux: `~/.config/pos-system`
4. MongoDB data remains intact

---

## Environment Variables Reference

### Backend (.env file in backend/ directory)

| Variable    | Default                                   | Purpose                   |
| ----------- | ----------------------------------------- | ------------------------- |
| `MONGO_URI` | `mongodb://localhost:27017/pos-system-db` | MongoDB connection string |
| `PORT`      | `5000`                                    | Backend server port       |

### Frontend (.env file in frontend/ directory)

| Variable            | Default                 | Purpose              |
| ------------------- | ----------------------- | -------------------- |
| `REACT_APP_API_URL` | `http://127.0.0.1:5000` | Backend API endpoint |

### System Environment

| Variable  | Used By             | Purpose          |
| --------- | ------------------- | ---------------- |
| `APPDATA` | Windows backend     | Config directory |
| `HOME`    | macOS/Linux backend | Config directory |

---

## File Locations

### Configuration

- **Windows:** `%APPDATA%\pos-system\config.json`
- **macOS:** `~/Library/Application Support/pos-system/config.json`
- **Linux:** `~/.config/pos-system/config.json`

### Application

- **Windows:** `C:\Program Files\POS System\`
- **macOS:** `/Applications/POS System.app`
- **Linux:** `/usr/bin/pos-system` or similar

### MongoDB Data (if local)

- **Windows:** `C:\Program Files\MongoDB\Server\6.0\data\`
- **macOS:** `/usr/local/var/mongodb/`
- **Linux:** `/var/lib/mongdb/`
