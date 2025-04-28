// src/pages/panel/Panel.js
import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input, Switch, Select, SelectItem, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';

function Panel() {
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    activeChats: 0,
    lastActivity: null,
    responseTime: 0,
    averageMessages: 0,
    peakHours: []
  });

  const [isExporting, setIsExporting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Carregar estatísticas
    chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
      if (response && response.stats) {
        setStats(response.stats);
      }
    });
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    await chrome.runtime.sendMessage({ type: 'EXPORT_STATS' });
    setIsExporting(false);
    onOpen();
  };

  return (
    <div className="panel-container">
      <Card className="panel-card">
        <CardBody>
          <h1>Estatísticas do ZeroZapp</h1>

          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Mensagens Totais</h3>
                <p>{stats.totalMessages}</p>
              </div>
              <div className="stat-card">
                <h3>Mensagens Não Lidas</h3>
                <p>{stats.unreadMessages}</p>
              </div>
              <div className="stat-card">
                <h3>Conversas Ativas</h3>
                <p>{stats.activeChats}</p>
              </div>
              <div className="stat-card">
                <h3>Tempo de Resposta</h3>
                <p>{stats.responseTime}s</p>
              </div>
              <div className="stat-card">
                <h3>Média de Mensagens</h3>
                <p>{stats.averageMessages}</p>
              </div>
            </div>

            <div className="stats-details">
              <h2>Hora de Pico</h2>
              <ul className="peak-hours">
                {stats.peakHours.map((hour, index) => (
                  <li key={index}>{hour}</li>
                ))}
              </ul>
            </div>

            <div className="stats-details">
              <h2>Última Atividade</h2>
              <p>{stats.lastActivity ? stats.lastActivity.toLocaleString() : 'Nenhuma'}</p>
            </div>
          </div>

          <div className="panel-actions">
            <Button
              color="primary"
              isLoading={isExporting}
              onClick={handleExport}
            >
              Exportar Estatísticas
            </Button>
          </div>

          <Modal
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalContent>
              <ModalHeader>Exportação Concluída</ModalHeader>
              <ModalBody>
                As estatísticas foram exportadas com sucesso!
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={onClose}
                >
                  Fechar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </CardBody>
      </Card>
    </div>
  );
}

export default Panel;