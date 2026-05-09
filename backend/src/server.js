// Load environment variables from .env file if present
require("dotenv").config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./utils/logger");

logger.info("Backend server starting...", {
  mongoUri: config.mongoUri,
  port: config.port,
  isDesktopApp: config.isDesktopApp,
});

const maxRetries = 5;
let retryCount = 0;

const connectToDatabase = () => {
  logger.debug("Attempting MongoDB connection...", { attempt: retryCount + 1 });

  mongoose
    .connect(config.mongoUri, config.mongoOptions)
    .then(() => {
      logger.info("✓ MongoDB connected successfully");
      startServer();
    })
    .catch((err) => {
      retryCount++;
      if (retryCount < maxRetries) {
        logger.warn(
          `MongoDB connection failed. Retrying (${retryCount}/${maxRetries})...`,
          { error: err.message },
        );
        setTimeout(connectToDatabase, 2000); // Retry after 2 seconds
      } else {
        logger.error(
          `Failed to connect to MongoDB after ${maxRetries} attempts`,
          {
            error: err.message,
            mongoUri: config.mongoUri,
            stack: err.stack,
          },
        );
        process.exit(1);
      }
    });
};

const startServer = () => {
  // Bind to 0.0.0.0 to make it accessible from all interfaces
  // but primarily for localhost access in desktop app
  app.listen(config.port, "0.0.0.0", () => {
    logger.info(`✓ Backend server running on http://127.0.0.1:${config.port}`);
    logger.info(`📁 Log files stored at: ${logger.getLogDir()}`);
  });
};

connectToDatabase();
