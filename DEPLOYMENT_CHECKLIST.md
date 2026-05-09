# Desktop App Configuration Checklist

## Before Running on Client PC ✓

### MongoDB 6.0+ Setup

- [ ] MongoDB 6.0+ installed and running
- [ ] MongoDB listening on `localhost:27017`
- [ ] Database service started
  - Windows: Check Services > MongoDB
  - macOS: `brew services list | grep mongodb`
  - Linux: `systemctl status mongod`

### Backend Configuration

- [ ] Node.js installed (`node --version`)
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Optional: Create `.env` file in backend/ for custom MongoDB URI
  ```
  MONGO_URI=mongodb://localhost:27017/pos-system-db
  PORT=5000
  ```
- [ ] Config file auto-created on first run
  - Windows: `%APPDATA%\pos-system\config.json`
  - macOS: `~/Library/Application Support/pos-system/config.json`
  - Linux: `~/.config/pos-system/config.json`

### Frontend Setup

- [ ] React dependencies installed (`npm install` in frontend/)
- [ ] Optional: Create `.env` file in frontend/ for custom API URL
  ```
  REACT_APP_API_URL=http://127.0.0.1:5000
  ```

### Tauri Build

- [ ] Rust toolchain installed
- [ ] Tauri dependencies installed (`npm install` in src-tauri/)
- [ ] Built with `cargo tauri build --release` or `cargo tauri dev`

## Runtime Checks ✓

### Database Connection

- [ ] MongoDB running and accessible
- [ ] Backend can connect to MongoDB
- [ ] Check console for: "✓ MongoDB connected successfully"

### Backend Server

- [ ] Backend process starts automatically
- [ ] Server running on `http://127.0.0.1:5000`
- [ ] Health check passes before app loads
- [ ] Check console for: "✓ Backend server running on http://127.0.0.1:5000"

### Frontend

- [ ] React app loads in Tauri WebView
- [ ] API calls work (check Network tab in DevTools)
- [ ] CORS not blocking requests
- [ ] Endpoints reachable at `http://127.0.0.1:5000`

## Troubleshooting ✓

### MongoDB Connection Fails

```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017"

# Check custom config (if created):
# Windows: %APPDATA%\pos-system\config.json
# macOS: ~/Library/Application\ Support/pos-system/config.json

# Edit if needed and restart app
```

### Backend Not Starting

```bash
# Check Node.js installation
node --version

# Verify backend modules
cd backend
npm install

# Check for port conflicts
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000
```

### CORS Errors

- [ ] Check that API calls use `http://127.0.0.1:5000`
- [ ] Backend CORS configured for localhost only
- [ ] No external API calls from React app

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Configuration Files ✓

### Backend Config Path

**Windows:** `%APPDATA%\pos-system\config.json`

```json
{
  "mongoUri": "mongodb://localhost:27017/pos-system-db",
  "port": 5000,
  "JWT_SECRET": "...",
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

**Environment Override (.env in backend/):**

```
MONGO_URI=mongodb://localhost:27017/pos-system-db
PORT=5000
```

### Frontend API Configuration

**API Endpoints:** `frontend/src/config/apiConfig.js`

- Centralized endpoint definitions
- Base URL: `http://127.0.0.1:5000`
- Override: `REACT_APP_API_URL` environment variable

### Tauri Configuration

**Build Settings:** `src-tauri/tauri.conf.json`

- Frontend dist: `../frontend/build`
- Dev URL: `http://localhost:3000`
- Product name: "POS System"
- App window: 1280x800, minimum 1024x768

## Deployment Notes ✓

### For Customer Installations

1. Install MongoDB 6.0+ first
2. Install the Tauri app (.exe, .dmg, .deb)
3. App auto-creates config on first run
4. Customize MongoDB URI in config if needed
5. Restart app after config changes

### Security Settings

- Config file permissions: `0o600` (owner only)
- CORS restricted to localhost
- No internet access required
- JWT tokens generated per installation

### Performance

- MongoDB retry logic: 5 attempts, 2s intervals
- Connection timeout: 5 seconds (MongoDB 6.0+)
- Write concern: majority
- Retry writes enabled

## Post-Installation ✓

### Verify Everything Works

1. [ ] App window opens
2. [ ] Login page loads
3. [ ] Can create suppliers
4. [ ] Can add items
5. [ ] Database operations work
6. [ ] No console errors
7. [ ] App stays responsive

### Monitor Logs

- Backend console in terminal window
- Frontend DevTools (F12 in app)
- Check for connection errors or timeouts

### Update MongoDB URI (if needed)

Edit config file in:

- Windows: `%APPDATA%\pos-system\config.json`
- macOS: `~/Library/Application Support/pos-system/config.json`
- Linux: `~/.config/pos-system/config.json`

Then restart the application.
