# White Screen Fix - Building and Deployment Guide

## Problem Identified

The frontend was experiencing white screens after bundling because:

1. **Hardcoded localhost URLs** - Scattered throughout components using `http://localhost:5000`
2. **No connection error handling** - Silent failures with no user feedback
3. **Missing Error Boundary** - Unhandled React errors crashed the app without showing error UI
4. **No centralized API configuration** - Made it difficult to manage API endpoints

## Solutions Implemented

### 1. Centralized Axios Instance (`src/services/axiosInstance.js`)

- Replaces hardcoded URLs with a centralized configuration
- Automatically includes auth tokens in headers
- Handles 401 errors by redirecting to login
- Logs all API requests/responses for debugging

### 2. Logger Utility (`src/services/logger.js`)

- Centralized logging for development and production
- Tracks errors and API calls
- Ready for integration with error tracking services (Sentry, etc.)

### 3. Error Boundary (`src/components/ErrorBoundary.jsx`)

- Catches React rendering errors before they cause white screens
- Shows user-friendly error messages
- Auto-recovers after 3 errors to prevent infinite loops
- Shows detailed error info in development mode only

### 4. Environment Configuration

- `.env.production` file specifies API URL for production builds
- Works with Tauri's local backend server

## Building for Production

### Prerequisites

Ensure MongoDB and Backend are running:

```bash
# Terminal 1: MongoDB
mongosh "mongodb://localhost:27017"

# Terminal 2: Backend
cd backend
npm install
npm start
# Should show: "✓ Backend server running on http://127.0.0.1:5000"
```

### Build Steps

#### Option 1: Web Build (browser)

```bash
cd frontend
npm install
npm run build

# The build will be in frontend/build directory
# Test locally:
npx serve -s build
```

#### Option 2: Desktop App Build (Tauri)

```bash
# Ensure backend is running first!

# From root directory:
npm install
npm run tauri build

# Generated installer will be in:
# src-tauri/target/release/bundle/
```

## Testing the Fix

### 1. After Building:

- **Backend should be running** on http://127.0.0.1:5000
- Open the bundled app (or run `npm start` in production mode)
- You should see the login page (not white screen)
- Login and verify all pages load

### 2. If You See White Screen:

1. **Open Developer Console** (F12)
2. **Check for errors** in Console tab
3. **Common issues:**
   - Backend not running → Start it first
   - Port 5000 already in use → Stop other services
   - MongoDB not running → Start MongoDB service

### 3. Debugging:

- Console logs now show `[INFO]`, `[ERROR]`, `[WARN]` prefixes
- Error Boundary catches and displays errors
- All API calls are logged with request/response

## Files Changed

### Frontend Components Updated:

- `src/App.js` - Added Error Boundary
- `src/pages/login/login.jsx` - Uses axiosInstance
- `src/pages/Admin/AddItem.jsx` - Uses axiosInstance
- `src/pages/Admin/AddSupplier.jsx` - Uses axiosInstance
- `src/pages/Admin/AddSalesman.jsx` - Uses axiosInstance
- `src/pages/Admin/Dashboard.jsx` - Uses axiosInstance
- `src/pages/salesman/addStock.jsx` - Uses axiosInstance

### New Files Created:

- `src/services/axiosInstance.js` - Centralized axios setup
- `src/services/logger.js` - Logger utility
- `src/components/ErrorBoundary.jsx` - Error boundary component
- `src/components/ErrorBoundary.css` - Error UI styling
- `frontend/.env.production` - Production environment config

## Performance Impact

- ✅ Minimal overhead (request/response logging only in dev)
- ✅ Error boundary has negligible performance cost
- ✅ Centralized axios improves code maintainability
- ✅ No additional dependencies required

## Next Steps

1. Test the build thoroughly before deploying
2. Monitor logs for any connection issues
3. Consider adding error tracking (Sentry integration ready)
4. Update backend `.env` if needed for CORS settings

## Rollback (if needed)

All changes are additive - no breaking changes made to existing API endpoints.
Simply rebuild if issues occur.
