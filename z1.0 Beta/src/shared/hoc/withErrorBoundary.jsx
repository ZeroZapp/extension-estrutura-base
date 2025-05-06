import React, { Component } from 'react';

/**
 * Componente de limite de erro para capturar erros em componentes filhos
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * HOC que envolve um componente em um ErrorBoundary
 * @param {React.Component} Component - Componente a ser envolvido
 * @param {React.ReactNode} ErrorComponent - Componente a ser exibido em caso de erro
 * @returns {React.Component} Componente envolvido no ErrorBoundary
 */
const withErrorBoundary = (Component, ErrorComponent) => {
  return function WithErrorBoundary(props) {
    return React.createElement(
      ErrorBoundary,
      { fallback: ErrorComponent },
      React.createElement(Component, props)
    );
  };
};

export default withErrorBoundary;
