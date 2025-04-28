// src/pages/sidepanel/ConversationsList.js
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

// Criação de índice para facilitar buscas por campos específicos
db.createIndex({
  index: { fields: ['action', 'start_action'] },
});

// Componente de avatar com fallback e tratamento de erro de imagem
const ConversationAvatar = (props) => {
  const fallbackSrc = `/icon-34.png`;
  const [currentSrc, setCurrentSrc] = useState(props.picture || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(props.picture || fallbackSrc);
  }, [props.picture]);

  const handleError = useCallback(() => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  }, [currentSrc]);

  return (
    <Avatar isBordered color="success" src={currentSrc} onError={handleError} />
  );
};

// Componente principal
const MyModule = () => {
  const [conversations, setConversations] = useState([]);

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

      setConversations(
        docs.map(doc => ({
          ...doc,
          start: moment(doc.start_action)
            .locale('pt-br')
            .tz('America/Campo_Grande')
            .format('D/MM [de] YYYY [às] HH:mm'),
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  return (
    <div className="space-y-4">
      <SearchConversations onSearch={(term) => {
        if (!term) {
          setConversations(docs);
          return;
        }

        const filtered = docs.filter(conversation => {
          const searchFields = [
            conversation.title?.toLowerCase(),
            conversation.message?.toLowerCase(),
            conversation.status?.toLowerCase()
          ];
          return searchFields.some(field => field?.includes(term));
        });
        setConversations(filtered);
      }} />

      {conversations.map((conversation) => (
        <Card key={conversation._id}>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ConversationAvatar picture={conversation.picture} title={conversation.title} />
                <div>
                  <h3 className="font-medium">{conversation.title}</h3>
                  <p className="text-sm text-gray-500">{conversation.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-400">{conversation.start}</span>
                    <Badge color={conversation.status === 'delayed' ? 'warning' : 'error'}>
                      {conversation.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light">
                    <EllipsisVertical className="w-4 h-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>
                    <MessageCircleHeart className="w-4 h-4 mr-2" />
                    Marcar como lida
                  </DropdownItem>
                  <DropdownItem>
                    <MessageCircleX className="w-4 h-4 mr-2" />
                    Marcar como não lida
                  </DropdownItem>
                  <DropdownItem>
                    <Archive className="w-4 h-4 mr-2" />
                    Arquivar
                  </DropdownItem>
                  <DropdownItem>
                    <ArchiveRestore className="w-4 h-4 mr-2" />
                    Restaurar
                  </DropdownItem>
                  <DropdownItem>
                    <BotMessageSquare className="w-4 h-4 mr-2" />
                    Enviar mensagem
                  </DropdownItem>
                  <DropdownItem>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default MyModule;