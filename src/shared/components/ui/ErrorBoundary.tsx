import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hayError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hayError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hayError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error en la sección:', error, info.componentStack);
  }

  render() {
    if (this.state.hayError) {
      return (
        <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800">
            Algo salió mal
          </h2>
          <p className="mt-2 text-red-700">
            Esta sección tuvo un problema. Podés intentar recargar la página.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
