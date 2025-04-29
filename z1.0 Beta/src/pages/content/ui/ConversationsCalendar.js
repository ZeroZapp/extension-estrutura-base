import refreshOnUpdate from 'virtual:reload-on-update-in-view';
refreshOnUpdate('');

import React, { useEffect, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Chip } from '@nextui-org/react';

interface ConversationsCalendarProps {
  defaultView?: string;
}

// a custom render function
function renderEventContent(eventInfo) {
  return (
    <Chip size="sm" variant="faded" color="success">
      {eventInfo.timeText} {eventInfo.event.title.split(' ')[0]}
    </Chip>
  );
}

import PouchDB from 'pouchdb';

import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

const db = new PouchDB('conversations');

import moment from 'moment-timezone';

interface Document {
  _id: string;
  _rev?: string;
  action: string;
  start_action: string;
  _deleted?: boolean;
  // Adicione aqui outros campos esperados em seus documentos
}

const ConversationsCalendar: React.FC<ConversationsCalendarProps> = ({ defaultView }) => {
  const [conversations, setConversations] = useState([]);

  const getConversations = async () => {
    console.log('getConversations initiated');

    const conversations = await db.find({
      selector: {
        action: 'delayed',
      },
    });

    const docs = conversations.docs as Document[];

    setConversations(
      docs.map(doc => {
        return {
          ...doc,
          start: moment(doc.start_action).format('YYYY-MM-DD HH:mm:ss'),
        };
      }),
    );

    console.log('conversations', conversations);
  };

  useEffect(() => {
    getConversations();

    function handleMessages(message) {
      if (message.type === 'DB_CHANGE') {
        console.log('Alteração recebida:', message.data);
        // Atualize sua UI aqui com base na alteração recebida
        getConversations();
      }
    }

    // Adiciona o ouvinte de mensagens
    chrome.runtime.onMessage.addListener(handleMessages);

    // Função de limpeza que será chamada ao desmontar o componente
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessages);
    };
  }, []);

  return (
    <div>
      <FullCalendar
        locale={ptBrLocale}
        initialView={defaultView ? defaultView : 'dayGridMonth'}
        plugins={[dayGridPlugin, timeGridPlugin]}
        eventContent={renderEventContent}
        events={conversations}
      />
    </div>
  );
};

export default ConversationsCalendar;
