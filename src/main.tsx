import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: 'system-ui, sans-serif',
          background: '#F8FAFC',
          color: '#1E293B',
          padding: '32px'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>
            SOVEREIGN<span style={{ color: '#2563EB' }}>FORGE</span>.AI
          </div>
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 700, marginBottom: '8px', color: '#991B1B' }}>
              Initialization Error
            </div>
            <div style={{ fontSize: '13px', color: '#7F1D1D', marginBottom: '16px' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                padding: '10px 24px',
                background: '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Clear Cache & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
