import React, { useState, useEffect } from 'react';
import { Input, Button, Textarea } from '@nextui-org/react'; // Adicionar Textarea
import { AppConfigStorage } from '@src/shared/storages/AppConfigStorage';

// Página de Configuração Simplificada - Apenas OpenAI API Key
export default function ConfigurationPage() {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [summaryPrompt, setSummaryPrompt] = useState(''); // Estado para prompt de resumo
  const [replyPrompt, setReplyPrompt] = useState('');     // Estado para prompt de resposta
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  console.log('mount ConfigurationPage (Simplified)');

  // Carregar a chave da API salva ao montar o componente
  useEffect(() => {
    AppConfigStorage.get().then(config => {
      setOpenaiApiKey(config?.openaiApiKey || '');
      setSummaryPrompt(config?.summaryPrompt || ''); // Carregar prompt de resumo ou string vazia
      setReplyPrompt(config?.replyPrompt || '');     // Carregar prompt de resposta ou string vazia
    });
  }, []);

  // Função para salvar todas as configurações
  const handleSaveConfig = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      // Obter a configuração atual antes de atualizar
      const currentConfig = await AppConfigStorage.get();
      // Atualizar apenas a chave da API, mantendo o resto
      await AppConfigStorage.set({
        ...currentConfig, // Mantém as configurações existentes
        openaiApiKey: openaiApiKey, // Atualiza a chave da API
        summaryPrompt: summaryPrompt, // Salva o prompt de resumo
        replyPrompt: replyPrompt     // Salva o prompt de resposta
      });
      setSaveSuccess(true);
      console.log('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
      // Esconder a mensagem de sucesso/erro após alguns segundos
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  return (
    // Estrutura simplificada para a página de opções
    <div className="p-6 bg-[#111b21] text-white min-h-screen font-roboto">
      <h1 className="text-2xl font-semibold mb-6">Configurações ZeroZapp</h1>

      {/* Seção de Configuração OpenAI */}
      <div className="p-4 shadow-xl bg-gray-500/10 rounded-xl max-w-md mx-auto">
        <h2 className="mb-4 text-lg font-semibold">Configuração OpenAI</h2>
        <div className="flex flex-col gap-6"> {/* Aumentar gap para espaçar mais */}
          <Input
            type="password"
            label="Chave da API OpenAI"
            placeholder="Cole sua chave aqui (ex: sk-...)"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            labelPlacement="outside"
            className="text-white"
            classNames={{
              label: "text-white",
              input: "text-white placeholder:text-gray-400", // Add placeholder color
              inputWrapper: "bg-gray-700/50 border-gray-600",
            }}
          />

          {/* Campo para Prompt de Resumo */}
          <Textarea
            label="Prompt de Resumo"
            placeholder="Digite o prompt do sistema para gerar resumos..."
            value={summaryPrompt}
            onChange={(e) => setSummaryPrompt(e.target.value)}
            labelPlacement="outside"
            minRows={6} // Aumentar altura mínima
            className="text-white"
            classNames={{
              label: "text-white",
              input: "text-white leading-relaxed placeholder:text-gray-400", // Add placeholder color
              inputWrapper: "bg-gray-700/50 border-gray-600",
            }}
          />

          {/* Campo para Prompt de Resposta */}
          <Textarea
            label="Prompt de Sugestão de Resposta"
            placeholder="Digite o prompt do sistema para sugerir respostas..."
            value={replyPrompt}
            onChange={(e) => setReplyPrompt(e.target.value)}
            labelPlacement="outside"
            minRows={6} // Aumentar altura mínima
            className="text-white"
            classNames={{
              label: "text-white",
              input: "text-white leading-relaxed placeholder:text-gray-400", // Add placeholder color
              inputWrapper: "bg-gray-700/50 border-gray-600",
            }}
          />

          {/* Botão Salvar e Mensagens de Status */}
          <div className="flex items-center justify-end gap-2 mt-2">
             {saveSuccess === true && <span className="text-sm text-green-500">Salvo com sucesso!</span>}
             {saveSuccess === false && <span className="text-sm text-red-500">Erro ao salvar.</span>}
            <Button
              color="primary"
              onClick={handleSaveConfig} // Atualizado para nova função
              isLoading={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar Configurações'} {/* Texto do botão atualizado */}
            </Button>
          </div>
        </div>
      </div>

      {/* Adicionar aqui outras seções de configuração no futuro, se necessário */}

    </div>
  );
}
