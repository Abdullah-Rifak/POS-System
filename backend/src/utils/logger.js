const fs = require("fs");
const path = require("path");
const os = require("os");

const appName = "pos-system";

// Determine log directory
const baseDir =
  process.platform === "win32"
    ? process.env.APPDATA
    : process.platform === "darwin"
      ? path.join(os.homedir(), "Library", "Application Support")
      : path.join(os.homedir(), ".config");

const appConfigDir = path.join(baseDir, appName);
const logsDir = path.join(appConfigDir, "logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true, mode: 0o755 });
}

// Log file paths
const getLogPath = (filename) => path.join(logsDir, filename);
const errorLogPath = getLogPath("error.log");
const appLogPath = getLogPath("app.log");
const accessLogPath = getLogPath("access.log");

/**
 * Append message to log file with timestamp
 */
const appendLog = (filePath, level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr =
    Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : "";
  const logMessage = `[${timestamp}] [${level}]${metaStr} ${message}\n`;

  try {
    fs.appendFileSync(filePath, logMessage, { encoding: "utf-8", flag: "a" });
  } catch (err) {
    console.error("Failed to write to log file:", err.message);
  }
};

/**
 * Logger object with methods for different log levels
 */
const logger = {
  info: (message, meta = {}) => {
    console.log(`ℹ️  ${message}`, meta);
    appendLog(appLogPath, "INFO", message, meta);
  },

  warn: (message, meta = {}) => {
    console.warn(`⚠️  ${message}`, meta);
    appendLog(appLogPath, "WARN", message, meta);
  },

  error: (message, meta = {}) => {
    console.error(`❌ ${message}`, meta);
    appendLog(errorLogPath, "ERROR", message, meta);
  },

  debug: (message, meta = {}) => {
    if (process.env.DEBUG) {
      console.debug(`🔍 ${message}`, meta);
      appendLog(appLogPath, "DEBUG", message, meta);
    }
  },

  access: (method, url, statusCode, responseTime) => {
    const message = `${method} ${url} -> ${statusCode} (${responseTime}ms)`;
    appendLog(accessLogPath, "ACCESS", message);
  },

  /**
   * Get location of log files for debugging
   */
  getLogDir: () => logsDir,
};

module.exports = logger;
