import { Component } from 'react'

/**
 * ErrorBoundary — catches render errors anywhere in the tree.
 *
 * Without this, a single broken component (e.g., Supabase call throwing
 * during render) crashes the entire app → white screen.
 *
 * With this, users see a friendly error message + reload button.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error caught by boundary:', error, errorInfo)

    // AUTO-RELOAD on chunk load failures.
    // This happens when a new deploy changes asset filenames but the user's
    // browser still has the old index.html cached. The old HTML references
    // chunk files that no longer exist on the server → "Failed to fetch
    // dynamically imported module". Auto-reloading fetches the new HTML.
    if (
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('error loading dynamically imported module')
    ) {
      console.log('Chunk load failure detected — auto-reloading...')
      // Force a hard reload (bypass cache)
      window.location.reload(true)
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #f0faf0 0%, #fefdf7 100%)',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          direction: 'rtl',
        }}>
          <div style={{
            maxWidth: 480,
            textAlign: 'center',
            background: 'white',
            padding: '2.5rem',
            borderRadius: 24,
            boxShadow: '0 16px 48px rgba(29,107,58,0.12)',
            border: '1px solid #dcf0dc',
          }}>
            <div style={{
              width: 64,
              height: 64,
              margin: '0 auto 1rem',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1a6b3a, #c9a227)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}>
              🌿
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0d1a0d', margin: '0 0 0.5rem' }}>
              حدث خطأ غير متوقع
            </h1>
            <p style={{ color: '#5a8a5a', fontSize: 14, marginBottom: '1.5rem', lineHeight: 1.6 }}>
              نعتذر عن الإزعاج. يرجى تحديث الصفحة أو المحاولة لاحقاً.
            </p>
            {this.state.error?.message && (
              <details style={{
                textAlign: 'start',
                background: '#f8fdf8',
                padding: '0.75rem 1rem',
                borderRadius: 8,
                marginBottom: '1.5rem',
                fontSize: 12,
                color: '#5a8a5a',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>تفاصيل الخطأ</summary>
                <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg, #1a6b3a, #2d9b5a)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(29,107,58,0.35)',
              }}
            >
              تحديث الصفحة
            </button>
            <div style={{ marginTop: '1rem', fontSize: 10, color: '#8a9a8a' }}>
              Suwaika Dezad v3.5.1
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
