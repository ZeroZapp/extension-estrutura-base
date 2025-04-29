import React from 'react';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { X } from 'lucide-react';

interface SummaryDisplayProps {
  summary: string;
  chatId: string; // Para referência futura, se necessário
  onClose: () => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, chatId, onClose }) => {
  return (
    // Posicionamento inicial fixo no canto superior direito. Pode ser ajustado.
    <div style={{
      position: 'fixed',
      top: '80px', // Ajustar conforme necessário
      right: '20px', // Ajustar conforme necessário
      width: '300px', // Largura do card
      zIndex: 1000, // Garantir que fique sobre outros elementos
      maxHeight: 'calc(100vh - 100px)', // Limitar altura
      overflowY: 'auto', // Adicionar scroll se necessário
     }}
     className="summary-display-container" // Classe para possível estilização adicional
    >
      <Card shadow="lg">
        <CardHeader className="flex justify-between items-center">
          <h4 className="text-lg font-semibold">Resumo da Conversa</h4>
          <Button isIconOnly size="sm" variant="light" onPress={onClose} aria-label="Fechar resumo">
            <X size={18} />
          </Button>
        </CardHeader>
        <CardBody>
          <p className="text-sm whitespace-pre-wrap">{summary}</p> {/* whitespace-pre-wrap para manter quebras de linha */}
        </CardBody>
      </Card>
    </div>
  );
};

export default SummaryDisplay;