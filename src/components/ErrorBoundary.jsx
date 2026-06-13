import { Component } from 'react'

/**
 * App-level error boundary.
 *
 * Catches render-time exceptions anywhere below it and shows a recoverable
 * fallback instead of unmounting React into a blank white screen — the kind of
 * resilience a production app needs. Class component because error boundaries
 * have no hook equivalent.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // In a real app this would go to Sentry / a logging service.
    console.error('Unhandled UI error:', error, info)
  }

  handleReset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return (
        <div className="errorboundary" role="alert">
          <div className="errorboundary__icon">😵</div>
          <h1 className="errorboundary__title">Something went wrong.</h1>
          <p className="errorboundary__text">
            An unexpected error occurred while rendering this page.
          </p>
          <div className="errorboundary__actions">
            <button className="btn btn--primary" onClick={() => window.location.assign('/')}>
              Go to home
            </button>
            <button className="btn" onClick={this.handleReset}>
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
