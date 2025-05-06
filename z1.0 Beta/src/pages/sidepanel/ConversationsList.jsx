import React, { useState, useEffect, useCallback } from 'react';

// Componentes UI do NextUI
import {
  Card, CardBody, Avatar, Badge, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from '@nextui-org/react';

// Ícones do Lucide
import {
  EllipsisVertical, MessageCircleHeart, MessageCircleX,
  Archive, ArchiveRestore, BotMessageSquare, Trash2,
} from 'lucide-react';

// Biblioteca para datas com suporte a fuso-horário e idioma
import moment from 'moment-timezone';
import 'moment/locale/pt';

// Banco de dados local no navegador
import pouchDB from 'pouchdb';
import pouchDBFind from 'pouchdb-find';
pouchDB.plugin(pouchDBFind);
const db = new pouchDB('conversations');

// Importa o componente de busca
import SearchConversations from './SearchConversations';

// Criação de índice para facilitar buscas por campos específicos
db.createIndex({
  index: { fields: ['action', 'start_action'] },
}).catch(error => {
  console.error('Erro ao criar índice:', error);
});

// Componente de avatar com fallback e tratamento de erro de imagem
function ConversationAvatar({ picture, title }) {
  const fallbackSrc = `/icon-34.png`;
  const [currentSrc, setCurrentSrc] = useState(picture || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(picture || fallbackSrc);
  }, [picture]);

  const handleError = useCallback(() => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  }, [currentSrc]);

  return React.createElement(
    Avatar,
    { 
      isBordered: true, 
      color: 'success', 
      src: currentSrc, 
      onError: handleError,
      name: title?.[0] || '?'
    }
  );
};

// Componente principal
function ConversationsList() {
  const [conversations, setConversations] = useState([]);
  const [allConversations, setAllConversations] = useState([]);

  // Função para buscar conversas no banco de dados
  const getConversations = async () => {
    console.log('getConversations initiated');

    try {
      const result = await db.find({
        selector: {
          $or: [{ action: 'delayed' }, { action: 'overdue' }],
        },
      });

      let docs = result.docs;

      docs = docs.filter(doc => typeof doc.start_action === 'string');
      docs.sort((a, b) => a.start_action.localeCompare(b.start_action));

      const formattedDocs = docs.map(doc => ({
        ...doc,
        start: moment(doc.start_action)
          .locale('pt-br')
          .tz('America/Campo_Grande')
          .format('D/MM [de] YYYY [às] HH:mm'),
      }));

      setConversations(formattedDocs);
      setAllConversations(formattedDocs);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  };

  // Função para lidar com a busca
  const handleSearch = (term) => {
    if (!term) {
      setConversations(allConversations);
      return;
    }

    const filtered = allConversations.filter(conversation => {
      const searchFields = [
        conversation.title?.toLowerCase(),
        conversation.message?.toLowerCase(),
        conversation.status?.toLowerCase()
      ];
      return searchFields.some(field => field?.includes(term));
    });
    setConversations(filtered);
  };

  useEffect(() => {
    getConversations();
  }, []);

  // Funções de manipulação de ações
  const handleAction = (action, conversationId) => {
    console.log(`${action} na conversa ${conversationId}`);
    // Implementar lógica de ação aqui
  };

  // Renderização condicional baseada no estado
  if (conversations.length === 0) {
    return React.createElement(
      'div',
      { className: 'p-4 text-center text-gray-500' },
      'Carregando conversas...'
    );
  }

  // Renderização principal
  return React.createElement(
    'div',
    { className: 'space-y-4' },
    // Barra de busca
    React.createElement(SearchConversations, { onSearch: handleSearch }),
    
    // Lista de conversas
    conversations.length === 0 
      ? React.createElement('p', { className: 'text-center text-gray-500 py-4' }, 'Nenhuma conversa encontrada')
      : conversations.map(conversation => {
          const statusColor = conversation.status === 'delayed' ? 'warning' : 'error';
          
          return React.createElement(
            Card,
            { key: conversation._id },
            React.createElement(
              CardBody,
              { className: 'p-4' },
              React.createElement(
                'div',
                { className: 'flex items-center justify-between' },
                // Lado esquerdo: Avatar e informações
                React.createElement(
                  'div',
                  { className: 'flex items-center space-x-4' },
                  React.createElement(ConversationAvatar, {
                    picture: conversation.picture,
                    title: conversation.title
                  }),
                  React.createElement(
                    'div',
                    null,
                    React.createElement('h3', { className: 'font-medium' }, conversation.title),
                    React.createElement('p', { className: 'text-sm text-gray-500' }, conversation.message),
                    React.createElement(
                      'div',
                      { className: 'flex items-center space-x-2 mt-1' },
                      React.createElement('span', { className: 'text-xs text-gray-400' }, conversation.start),
                      React.createElement(Badge, { color: statusColor },
                        conversation.status === 'delayed' ? 'Agendado' : 'Atrasado'
                      )
                    )
                  )
                ),
                // Lado direito: Menu de ações
                React.createElement(
                  Dropdown,
                  null,
                  React.createElement(
                    DropdownTrigger,
                    null,
                    React.createElement(
                      Button,
                      { isIconOnly: true, variant: 'light' },
                      React.createElement(EllipsisVertical, { className: 'w-4 h-4' })
                    )
                  ),
                  React.createElement(
                    DropdownMenu,
                    null,
                    [
                      { icon: MessageCircleHeart, label: 'Marcar como lida', action: 'reply' },
                      { icon: MessageCircleX, label: 'Marcar como não lida', action: 'archive' },
                      { icon: Archive, label: 'Arquivar', action: 'archive' },
                      { icon: ArchiveRestore, label: 'Restaurar', action: 'unarchive' },
                      { icon: BotMessageSquare, label: 'Enviar mensagem', action: 'ai' },
                      { icon: Trash2, label: 'Excluir', action: 'delete' }
                    ].map(({ icon: Icon, label, action }) => (
                      React.createElement(
                        DropdownItem,
                        {
                          key: action,
                          startContent: React.createElement(Icon, { className: 'w-4 h-4 mr-2' }),
                          onClick: () => handleAction(action, conversation._id)
                        },
                        label
                      )
                    ))
                  )
                )
              )
            )
          );
        })
  );
}

export default ConversationsList;