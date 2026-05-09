# POS System 🛒

A modern, LAN-based Point of Sale (POS) system tailored for small grocery stores and retail businesses. This full-stack project integrates inventory and sales management with robust role-based user controls, offering a versatile, cross-platform experience across Web and Desktop, powered by Tauri.

---

## 🚀 Why This Project Stands Out

- **Real-World Impact:** Efficiently manages day-to-day retail operations, supporting fast checkout, streamlined inventory, and actionable analytics.
- **Full-Stack Mastery:** Demonstrates expertise across React, Node.js, Tauri, Rust, MongoDB, and modern backend/frontend development.
- **Enterprise Features:** Clean multi-module (frontend, backend, desktop) codebase, role-based access control, and scalable architecture.
- **Cross-Platform Delivery:** One codebase for web and desktop, leveraging Tauri for lightweight, secure desktop distribution.

---

## ✨ Key Features

- **Modular Architecture:** Organized as distinct `frontend`, `backend`, and `src-tauri` modules—clean separation of concerns.
- **LAN-Based Operations:** Built for fast local performance and minimal downtime—ideal for small- to medium-sized businesses.
- **Inventory & Sales Management:** Add, edit, and track products with intuitive sales workflows.
- **Role-Based Access Control:** Secure login with differentiated admin/cashier permissions.
- **Cross-Platform Desktop App:** Seamlessly runs as a native app on Windows, Linux, and macOS via Tauri.
- **Scalable & Maintainable:** MVC design for long-term adaptability and growth.

---

## 🛠 Tech Stack

- **Frontend:** React
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Desktop App:** Tauri (Rust-powered)
- **Architecture:** Modular MVC, JWT authentication, RESTful APIs

---

## 🏁 Running the Project Locally

From the repository root:

```powershell
# Start the Backend Server
cd backend
npm install
npm start

# Start the Frontend
cd ../frontend
npm install
npm start

# Run the Tauri Desktop Application (from repo root)
cd ..
npm install
npm run tauri:dev
```

For production builds:

```powershell
# Build Frontend (production)
cd frontend
npm run build

# Build Desktop bundle
cd ..
npm run tauri:build
```

Build outputs:
- `frontend/build/`
- `src-tauri/target/release/bundle/`

---

## Version History

### v1.0 Desktop Stabilization

- Migrated API usage to centralized frontend API client configuration.
- Fixed white-screen failure paths with improved runtime error handling.
- Added backend connection hardening and retry behavior for MongoDB startup.
- Tightened CORS and localhost-only runtime expectations for desktop mode.
- Updated Tauri app metadata and packaging readiness for desktop release.
- Added signed monthly license enforcement with grace-period handling.

---

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

1. Set `LICENSE_SECRET` (same secret for generator and validator).
2. Generate a signed license file from backend.
3. Place `license.json` on client machine at:
   - `%APPDATA%/pos-system/license.json`
4. Verify state via:
   - `GET /license/status`

---

## Architecture Overview

- `frontend/`: React application and production build output
- `backend/`: Express API, Mongo models, auth, and license enforcement
- `src-tauri/`: Desktop app wrapper and release build config
- `dist_for_vm/`: VM testing/distribution artifacts

---

## Important Documentation

- README_DEPLOYMENT.md
- DEPLOYMENT_READY.md
- DEPLOYMENT_CHECKLIST.md
- TESTING_GUIDE.md
- TROUBLESHOOTING.md
- LICENSE_SETUP.md
- WHITESCRFEEN_FIX.md

---

## Notes & Security

- This repository contains deployment and setup guides for VM and desktop usage.
- Keep `LICENSE_SECRET` private and rotate it if exposed.
- Renew and redistribute license files before grace expiration to avoid service interruption.

---

## Contact

**Contact:** [Abdullah Rifak](mailto:abdullahrifak522@gmail.com)

> ⭐️ _This project is actively maintained and open to collaboration!_

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

# POS System 🛒

A modern, LAN-based Point of Sale (POS) system tailored for small grocery stores and retail businesses. This full-stack project integrates inventory and sales management with robust role-based user controls, offering a versatile, cross-platform experience across Web and Desktop, powered by Tauri.

---

## 🚀 Why This Project Stands Out

- **Real-World Impact:** Efficiently manages day-to-day retail operations, supporting fast checkout, streamlined inventory, and actionable analytics.
- **Full-Stack Mastery:** Demonstrates expertise across React, Node.js, Tauri, Rust, MongoDB, and modern backend/frontend development.
- **Enterprise Features:** Clean multi-module (frontend, backend, desktop) codebase, role-based access control, and scalable architecture.
- **Cross-Platform Delivery:** One codebase for web and desktop, leveraging Tauri for lightweight, secure desktop distribution.

---

## ✨ Key Features

- **Modular Architecture:** Organized as distinct `frontend`, `backend`, and `tauri` modules—clean separation of concerns.
- **LAN-Based Operations:** Built for fast local performance and minimal downtime—ideal for small- to medium-sized businesses.
- **Inventory & Sales Management:** Add, edit, and track products with intuitive sales workflows.
- **Role-Based Access Control:** Secure login with differentiated admin/cashier permissions.
- **Cross-Platform Desktop App:** Seamlessly runs as a native app on Windows, Linux, and macOS.
- **Scalable & Maintainable:** MVC design for long-term adaptability and growth.

---

## 🛠 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Desktop App:** Tauri (Rust-powered)
- **Architecture:** Modular MVC, JWT authentication, RESTful APIs

---

## 🏁 Running the Project Locally

```bash
# Start the Backend Server
cd backend
npm install
npm start

# Start the Frontend
cd frontend
npm install
npm start

# Run the Tauri Desktop Application
cd pos-system
npm install
npm tauri run
```

---

## 🙌 Recruiter Highlights

- **Full ownership:** Designed and implemented the architecture, database models, and UI/UX.
- **Team workflows:** Built with readability and collaboration in mind—clean commit history, logical modules, and clear docs.
- **Modern stack:** Demonstrates proven delivery using latest JavaScript ecosystem tooling + Rust via Tauri.
- **Deployment ready:** Adaptable for real deployments on local networks or with cloud hosting.

---

## 📫 Let’s Connect!

Interested in a deeper technical walkthrough or code review?  
**Contact:** [Abdullah Rifak](mailto:abdullahrifak522@gmail.com)  
**LinkedIn:** [Abdullah Rifak](https://linkedin.com/in/abdullah-rifak)  
**Portfolio:** [Abdullah Rifak](https://portfolio-nu-seven-vh7vz0gjz3.vercel.app/)

---

> ⭐️ _This project is actively maintained and open to collaboration!_
