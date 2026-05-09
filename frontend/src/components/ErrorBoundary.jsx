import React from 'react';
import Logger from '../services/logger';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorCount = this.state.errorCount + 1;
    this.setState({
      error,
      errorInfo,
      errorCount,
    });
    
    Logger.error(`[React Error] ${error.toString()}`, {
      componentStack: errorInfo.componentStack,
      count: errorCount,
    });

    // Auto-reload after 3 errors to prevent infinite error loops
    if (errorCount >= 3) {
      setTimeout(() => {
        window.location.reload();
      }, 100000);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h1>Oops! Something went wrong</h1>
            <p>The application encountered an unexpected error.</p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Dev Only)</summary>
                <pre>
                  {this.state.error && this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button onClick={this.handleReset} className="btn-retry">
                Try Again
              </button>
              <button onClick={() => (window.location.href = '/')} className="btn-home">
                Go to Home
              </button>
            </div>

            <p className="error-info">
              Error Count: {this.state.errorCount}
              {this.state.errorCount >= 3 && ' - Auto-reloading...'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
