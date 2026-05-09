# POS System Desktop

Production-ready POS system with:
- React frontend
- Node.js + Express backend
- MongoDB data layer
- Tauri desktop packaging
- Signed monthly license enforcement

## Current Project Status

- Deployment status: Ready
- White-screen issues: Fixed
- Centralized API handling: Implemented
- Error boundary + logging: Implemented
- License validation: Active (monthly renewal + grace period)

For detailed deployment notes, see:
- README_DEPLOYMENT.md
- DEPLOYMENT_READY.md
- DEPLOYMENT_COMPLETE.txt

## Version History

### v1.0 Desktop Stabilization

- Migrated API usage to centralized frontend API client configuration.
- Fixed white-screen failure paths with improved runtime error handling.
- Added backend connection hardening and retry behavior for MongoDB startup.
- Tightened CORS and localhost-only runtime expectations for desktop mode.
- Updated Tauri app metadata and packaging readiness for desktop release.
- Added signed monthly license enforcement with grace-period handling.

## Architecture

- frontend/: React application and production build output
- backend/: Express API, Mongo models, auth, and license enforcement
- src-tauri/: Desktop app wrapper and release build config
- dist_for_vm/: VM testing/distribution artifacts

## License System (Now Enabled)

The backend enforces license validation for business APIs.

Behavior:
- Default license period: 30 days
- Grace period after expiry: 7 days
- After grace expires: API access is blocked until renewed

Source references:
- LICENSE_SETUP.md
- backend/scripts/generate-license.js
- backend/license.json

### License Renewal Flow

1. Set LICENSE_SECRET (same secret for generator and validator).
2. Generate a signed license file from backend.
3. Place license.json on client machine at:
   - %APPDATA%/pos-system/license.json
4. Verify state via:
   - GET /license/status

## Local Development

## Prerequisites

- Node.js (recommended current LTS)
- npm
- MongoDB
- Rust toolchain (for Tauri builds)

## Start Backend

From backend folder:

- npm install
- npm start

Expected default backend URL:
- http://127.0.0.1:5000

## Start Frontend

From frontend folder:

- npm install
- npm start

## Build Frontend (Production)

From frontend folder:

- npm run build

Build output:
- frontend/build/

## Desktop Build (Tauri)

From repository root:

- npm install
- npm run tauri:build

Expected bundle output:
- src-tauri/target/release/bundle/

## Environment Notes

Frontend production API base URL should point to your backend host.
This is configured via frontend/.env.production.

Current deployment docs reference backend at:
- http://127.0.0.1:5000

## Key Scripts

Root package.json:
- npm run start
- npm run build
- npm run tauri
- npm run tauri:dev
- npm run tauri:build

Backend package.json:
- npm run start
- npm run dev
- npm run watch
- npm run generate:license

## Important Documentation

- README_DEPLOYMENT.md
- DEPLOYMENT_READY.md
- DEPLOYMENT_CHECKLIST.md
- TESTING_GUIDE.md
- TROUBLESHOOTING.md
- LICENSE_SETUP.md
- WHITESCRFEEN_FIX.md

## Notes

- This repository currently contains deployment and setup guides for VM and desktop usage.
- Keep LICENSE_SECRET private and rotate it if exposed.
- Renew and redistribute license files before grace expiration to avoid service interruption.
