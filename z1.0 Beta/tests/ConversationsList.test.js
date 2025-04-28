import { describe, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConversationsList from '../src/pages/sidepanel/ConversationsList';

describe('ConversationsList', () => {
  test('renders without crashing', () => {
    // given
    const mockConversations = [
      {
        _id: '1',
        title: 'Test Conversation',
        start_action: new Date().toISOString(),
        action: 'delayed'
      }
    ];

    // when
    render(<ConversationsList />);

    // then
    const noConversationsMessage = screen.getByText('Nenhuma conversa pendente');
    expect(noConversationsMessage).toBeInTheDocument();
  });

  test('renders conversations list', () => {
    // given
    const mockConversations = [
      {
        _id: '1',
        title: 'Test Conversation',
        start_action: new Date().toISOString(),
        action: 'delayed'
      }
    ];

    // when
    render(<ConversationsList />);

    // then
    const conversationTitle = screen.getByText('Test Conversation');
    expect(conversationTitle).toBeInTheDocument();
  });
});