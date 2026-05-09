# POS System - Desktop Tauri App Setup Guide

## System Requirements

- **MongoDB 6.0+** installed and running on local machine
- **Node.js** 14+
- **Rust** (for Tauri development)
- Windows 7+ / macOS / Linux

## Installation & Configuration

### 1. MongoDB Setup (Client PC)

**Windows:**

```bash
# MongoDB listener should be on localhost:27017
# Verify it's running:
mongo --version
# Connect to verify:
mongosh "mongodb://localhost:27017"
```

**macOS:**

```bash
brew services start mongodb-community
# Verify:
mongosh "mongodb://localhost:27017"
```

**Linux:**

```bash
sudo systemctl start mongod
# Verify:
mongosh "mongodb://localhost:27017"
```

### 2. Backend Configuration

The backend will auto-create config file on first run:

- **Windows:** `%APPDATA%\pos-system\config.json`
- **macOS:** `~/Library/Application Support/pos-system/config.json`
- **Linux:** `~/.config/pos-system/config.json`

#### Customize MongoDB Connection (Optional)

Create `.env` file in `backend/` directory:

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB settings if needed
```

Example for MongoDB with authentication:

```
MONGO_URI=mongodb://user:password@localhost:27017/pos-system-db?authSource=admin
PORT=5000
```

### 3. Building the Desktop App

```bash
# Install dependencies
npm install

# Frontend setup
cd frontend
npm install

# Backend setup
cd ../backend
npm install

# Build Tauri app
cd ../src-tauri
cargo build --release

# Or run in dev mode:
cargo tauri dev
```

## Desktop App Specifics

### CORS Configuration

The app is configured for **local-only** connections:

- ✅ `http://127.0.0.1:3000` (React dev server)
- ✅ `http://localhost:3000` (React dev server)
- ❌ External connections are blocked

### MongoDB Connection

- **Local mode only** - connects to `mongodb://localhost:27017`
- **Retry logic** - automatically retries 5 times if DB unavailable
- **Timeout** - 5 second server selection timeout for MongoDB 6.0+
- **Options enabled:**
  - `retryWrites: true` - for transaction support
  - `w: majority` - write concern for reliability

### Backend Server

- Listens on **`127.0.0.1:5000`** (local machine only)
- Health check before app loads
- Auto-cleanup on app exit
- 3-second startup delay for MongoDB connection

## Troubleshooting

### "Failed to connect to MongoDB"

1. Ensure MongoDB is running:
   ```bash
   mongosh "mongodb://localhost:27017"
   ```
2. Check config file:
   - Windows: `%APPDATA%\pos-system\config.json`
   - Edit to correct MongoDB URI

### "Port 5000 already in use"

```bash
# Find process using port 5000
# Windows:
netstat -ano | findstr :5000

# macOS/Linux:
lsof -i :5000

# Kill the process (get PID from above):
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>
```

### Backend not starting

1. Check Node.js is installed: `node --version`
2. Verify backend dependencies: `cd backend && npm install`
3. Check logs in terminal

## Deployment

For production deployment:

1. Build release: `cargo tauri build --release`
2. Executable located in `src-tauri/target/release/`
3. All dependencies bundled with app
4. MongoDB 6.0+ must be pre-installed on target PC

## Architecture

- **Frontend:** React 19.1.1 → Tauri WebView
- **Backend:** Express.js (Node.js) → Local process
- **Database:** MongoDB 6.0+ (local connection)
- **Process Management:** Tauri handles background Node.js process
- **API:** RESTful over `http://127.0.0.1:5000`

## Security Notes

- ✅ Config file permissions: `0o600` (owner-only)
- ✅ CORS restricted to localhost
- ✅ JWT tokens generated per installation
- ✅ No internet connection required
- ⚠️ Local network access possible if firewall allows

## Environment Variables

**Backend (.env.example):**

```
MONGO_URI=mongodb://localhost:27017/pos-system-db
PORT=5000
```

**Frontend (.env.example):**

```
REACT_APP_API_URL=http://127.0.0.1:5000
```
