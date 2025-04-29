import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import MenuManager from '@pages/content/client/ui/menuManager';
import ChatListActions from '@pages/content/client/ui/chatListActions';
import SummaryManager from '@pages/content/client/ui/summaryManager';

export default function App() {
  return (
    <NextUIProvider>
      <MenuManager />
      <ChatListActions />
      <SummaryManager />
    </NextUIProvider>
  );
}