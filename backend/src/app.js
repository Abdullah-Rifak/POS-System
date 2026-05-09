const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const salesmanRouter = require("./routes/salesman/salesman.router");
const supplierRouter = require("./routes/supplier/supplier.router");
const itemRouter = require("./routes/item/item.router");
const stockRouter = require("./routes/stock/stock.router");
const returnRouter = require("./routes/return/return.router");
const borrowRouter = require("./routes/borrow/borrow.router");
const authRouter = require("./routes/auth/auth.router");
const protectedRouter = require("./routes/authMiddleware/protectedRoutes.router");
const additionalRouter = require("./routes/additional/additional.router");
const hopperRouter = require("./routes/stringHoppers/stringHoppers.router");
const {
  licenseEnforcement,
  licenseStatusHandler,
} = require("./middleware/license.middleware");
const app = express();

// CORS configuration for desktop app (development and production)
const corsOptions = {
  origin: [
    "http://localhost:3000", // Development React dev server
    "http://127.0.0.1:3000", // Development React dev server (127.0.0.1)
    "http://localhost:5173", // Vite dev server
    "http://127.0.0.1:5173", // Vite dev server
    "tauri://localhost", // Tauri production build
    "http://tauri.localhost", // Alternative Tauri origin
    "app://localhost", // Tauri app protocol
    "file://", // File protocol for Tauri
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/license/status", licenseStatusHandler);
app.get("/health", (req, res) => res.json({ ok: true }));

app.use(licenseEnforcement);

app.use("/salesman", salesmanRouter);
app.use("/supplier", supplierRouter);
app.use("/item", itemRouter);
app.use("/stock", stockRouter);
app.use("/return", returnRouter);
app.use("/borrow", borrowRouter);
app.use("/auth", authRouter);
app.use("/protected", protectedRouter);
app.use("/additional", additionalRouter);
app.use("/hoppers", hopperRouter);

module.exports = app;
