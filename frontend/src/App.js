import React, { useState, useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes";
import ErrorBoundary from "./components/ErrorBoundary";
import Logger from "./services/logger";

// Initialize app
Logger.info("POS System App Starting...");

function App() {
  const [backendReady, setBackendReady] = useState(false);
  const [backendError, setBackendError] = useState(null);

  useEffect(() => {
    let interval;

    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("http://127.0.0.1:5000/health", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          Logger.info("Backend is ready");
          setBackendReady(true);
          setBackendError(null);

          // Stop the interval once backend is ready
          if (interval) clearInterval(interval);
        } else {
          throw new Error(`Backend returned status ${response.status}`);
        }
      } catch (error) {
        Logger.error("Backend connection failed:", error);
        setBackendReady(false);
        setBackendError(
          `Backend not responding (${error.message}). Retrying...`,
        );
      }
    };

    // Initial check after 1s to allow backend startup
    const initialTimer = setTimeout(checkBackend, 1000);

    // Repeat every 3 seconds until backendReady
    interval = setInterval(() => {
      if (!backendReady) checkBackend();
    }, 3000);

    return () => {
      clearTimeout(initialTimer);
      if (interval) clearInterval(interval);
    };
  }, [backendReady]);

  if (!backendReady) {
    return (
      <div className="App">
        <div style={styles.loadingContainer}>
          <h1>POS System</h1>
          <p>{backendError || "Initializing backend..."}</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <AppRoutes />
      </div>
    </ErrorBoundary>
  );
}

const styles = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
};
export default App;
