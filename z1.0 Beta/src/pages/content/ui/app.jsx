import React from 'react';
import { NextUIProvider } from '@nextui-org/react';

export default function App() {
  return (
    <NextUIProvider>
      {/* Este componente não renderiza nada diretamente */}
      {/* A injeção de componentes é feita pelo inicializer.jsx */}
    </NextUIProvider>
  );
}