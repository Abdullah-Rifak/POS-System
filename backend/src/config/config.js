const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

const appName = "pos-system";

const baseDir =
  process.platform === "win32"
    ? process.env.APPDATA
    : process.platform === "darwin"
      ? path.join(os.homedir(), "Library", "Application Support")
      : path.join(os.homedir(), ".config");

const appConfigDir = path.join(baseDir, appName);
const configPath = path.join(appConfigDir, "config.json");

if (!fs.existsSync(configPath)) {
  // Create directory with proper permissions
  fs.mkdirSync(appConfigDir, { recursive: true, mode: 0o755 });
  console.log(`📁 Created config directory: ${appConfigDir}`);

  // Default config for local MongoDB
  const defaultConfig = {
    mongoUri:
      process.env.MONGO_URI || "mongodb://localhost:27017/pos-system-db",
    port: process.env.PORT || 5000,
    JWT_SECRET: crypto.randomBytes(64).toString("hex"),
    LICENSE_SECRET: process.env.LICENSE_SECRET || "Abd123@gmail",
    JWT_EXPIRE: "1d",
    isDesktopApp: true,
    mongoOptions: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    },
  };

  // Write config file with restricted permissions
  fs.writeFileSync(
    configPath,
    JSON.stringify(defaultConfig, null, 2),
    { mode: 0o600 }, // Only owner can read/write
  );
  console.log(`📝 Created config file: ${configPath}`);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

if (!config.LICENSE_SECRET) {
  config.LICENSE_SECRET =
    process.env.LICENSE_SECRET || "POS_SYSTEM_CHANGE_THIS_LICENSE_SECRET";
}

// Allow environment variable overrides for MongoDB 6.0+ configuration
if (process.env.MONGO_URI) {
  config.mongoUri = process.env.MONGO_URI;
  console.log(`🔄 MongoDB URI overridden via MONGO_URI env variable`);
}
if (process.env.PORT) {
  config.port = parseInt(process.env.PORT, 10);
  console.log(
    `🔄 Server port overridden via PORT env variable: ${config.port}`,
  );
}

if (process.env.LICENSE_SECRET) {
  config.LICENSE_SECRET = process.env.LICENSE_SECRET;
  console.log("🔄 License secret overridden via LICENSE_SECRET env variable");
}

console.log(`✓ Configuration loaded from: ${configPath}`);
config.appConfigDir = appConfigDir;
module.exports = config;
