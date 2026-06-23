import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-view" className="min-h-screen bg-slate-900 text-white p-6 flex flex-col justify-center items-center font-sans">
          <div className="max-w-md w-full bg-slate-800 rounded-xl p-6 shadow-2xl border border-red-500/30">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-xl font-bold">Application Error</h1>
            </div>
            
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              An unexpected error occurred in the application. Please see details below:
            </p>

            <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-red-400 overflow-auto max-h-[150px] mb-4 border border-slate-700">
              <strong>{this.state.error?.name}:</strong> {this.state.error?.message}
            </div>

            {this.state.errorInfo && (
              <details className="cursor-pointer text-xs text-slate-400 mb-6">
                <summary className="hover:text-slate-200 transition-colors mb-2">Show component stack</summary>
                <pre className="bg-slate-950 p-3 rounded overflow-auto max-h-[150px] text-[10px] text-slate-500 border border-slate-800">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-all duration-150 active:scale-[0.98]"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
