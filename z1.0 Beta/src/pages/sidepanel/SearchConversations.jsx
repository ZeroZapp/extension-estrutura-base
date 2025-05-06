// src/pages/sidepanel/SearchConversations.js
import React from 'react';
import { Input } from '@nextui-org/react';
import { Search } from 'lucide-react';

/**
 * Componente de busca para filtrar conversas
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onSearch - Função chamada quando o termo de busca muda
 * @returns {React.ReactElement} Elemento React
 */
function SearchConversations({ onSearch }) {
  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return React.createElement(
    'div',
    { className: 'mb-4' },
    React.createElement(
      Input,
      {
        placeholder: 'Buscar conversas...',
        startContent: React.createElement(Search, { className: 'w-4 h-4 text-gray-400' }),
        onChange: handleSearch,
        className: 'w-full'
      }
    )
  );
}

export default SearchConversations;