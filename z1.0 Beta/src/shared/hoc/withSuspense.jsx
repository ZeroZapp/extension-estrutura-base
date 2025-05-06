import React, { Suspense } from 'react';

/**
 * HOC que envolve um componente em um Suspense boundary
 * @param {React.Component} Component - Componente a ser envolvido
 * @param {React.ReactNode} SuspenseComponent - Componente de fallback para o Suspense
 * @returns {React.Component} Componente envolvido no Suspense
 */
const withSuspense = (Component, SuspenseComponent) => {
  return function WithSuspense(props) {
    return React.createElement(
      Suspense,
      { fallback: SuspenseComponent },
      React.createElement(Component, props)
    );
  };
};

export default withSuspense;
