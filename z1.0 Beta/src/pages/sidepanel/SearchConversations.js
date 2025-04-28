// src/pages/sidepanel/SearchConversations.js
import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import { MagnifyingGlass } from 'lucide-react';

const SearchConversations = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="mb-4">
      <Input
        placeholder="Buscar conversas..."
        startContent={<MagnifyingGlass className="w-4 h-4 text-gray-400" />}
        value={searchTerm}
        onChange={handleSearch}
        className="w-full"
      />
    </div>
  );
};

export default SearchConversations;