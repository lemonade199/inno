import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b', margin: '2rem', borderRadius: '12px' }}>
          <h2>Oops! Halaman mengalami Crash (Error).</h2>
          <p>Tolong kirimkan teks warna merah di bawah ini ke AI Developer Anda:</p>
          <pre style={{ background: '#7f1d1d', color: '#fecaca', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '13px' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
