// src/pages/options/Options.js
import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input, Switch, Select, SelectItem, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';

function Options() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [language, setLanguage] = useState('pt-BR');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Carregar configurações salvas
    chrome.storage.local.get(['theme', 'notifications', 'language'], (result) => {
      setIsDarkMode(result.theme === 'dark');
      setNotificationsEnabled(result.notifications === true);
      setLanguage(result.language || 'pt-BR');
    });
  }, []);

  const handleThemeChange = async (checked) => {
    const theme = checked ? 'dark' : 'light';
    await chrome.storage.local.set({ theme });
    setIsDarkMode(checked);
    chrome.runtime.sendMessage({ type: 'THEME_CHANGED', theme });
  };

  const handleNotificationsChange = async (checked) => {
    await chrome.storage.local.set({ notifications: checked });
    setNotificationsEnabled(checked);
  };

  const handleLanguageChange = async (value) => {
    await chrome.storage.local.set({ language: value });
    setLanguage(value);
  };

  const handleSave = async () => {
    await chrome.storage.local.set({
      theme: isDarkMode ? 'dark' : 'light',
      notifications: notificationsEnabled,
      language
    });
    onClose();
  };

  return (
    <div className="options-container">
      <Card className="options-card">
        <CardBody>
          <h1>Configurações do ZeroZapp</h1>

          <div className="options-section">
            <h2>Interface</h2>
            <div className="options-item">
              <label>Modo Escuro</label>
              <Switch
                isSelected={isDarkMode}
                onValueChange={handleThemeChange}
              />
            </div>
          </div>

          <div className="options-section">
            <h2>Notificações</h2>
            <div className="options-item">
              <label>Habilitar Notificações</label>
              <Switch
                isSelected={notificationsEnabled}
                onValueChange={handleNotificationsChange}
              />
            </div>
          </div>

          <div className="options-section">
            <h2>Idioma</h2>
            <div className="options-item">
              <label>Selecione o idioma</label>
              <Select
                value={language}
                onValueChange={handleLanguageChange}
              >
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (United States)</SelectItem>
                <SelectItem value="es-ES">Español (España)</SelectItem>
              </Select>
            </div>
          </div>

          <div className="options-buttons">
            <Button
              color="primary"
              onClick={onOpen}
            >
              Salvar Configurações
            </Button>
          </div>

          <Modal
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalContent>
              <ModalHeader>Salvar Configurações</ModalHeader>
              <ModalBody>
                Deseja realmente salvar as configurações atuais?
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onClick={handleSave}
                >
                  Salvar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </CardBody>
      </Card>
    </div>
  );
}

export default Options;