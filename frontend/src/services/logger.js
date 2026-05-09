/**
 * Logger utility for debugging and error tracking
 * Works in both dev and production builds
 */

class Logger {
  static info(message, data = null) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || "");
  }

  static error(message, error = null) {
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}`,
      error || "",
    );
    // You can add error tracking service here (e.g., Sentry)
  }

  static warn(message, data = null) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || "");
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === "development") {
      console.debug(
        `[DEBUG] ${new Date().toISOString()} - ${message}`,
        data || "",
      );
    }
  }
}

export default Logger;
