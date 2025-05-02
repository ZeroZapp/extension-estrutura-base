// This file now only contains the menu options data.
// The rendering and interaction logic are handled in menuManager.tsx using plain JavaScript.

// Define the menu options data
export const menuOptions = [
    { key: 'archive-groups', label: 'Arquivar Apenas Grupos', description: 'Arquiva Apenas Grupos' },
    { key: 'archive-chats', label: 'Arquiva apenas Conversas', description: 'Arquiva apenas Conversas' },
    { key: 'archive-all', label: 'Arquiva todas as Conversas e Grupos', description: 'Arquiva todas as Conversas e Grupos' },
];

// The handleSelectOption function is now defined and used directly in menuManager.tsx
