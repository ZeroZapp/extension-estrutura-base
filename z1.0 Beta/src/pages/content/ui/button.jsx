import React, { useState } from 'react';
import { NextUIProvider, Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';
import Calendar from '@pages/content/ui/calendar.jsx';
import { CalendarHeart, NotebookText, Zap } from 'lucide-react'; // Import Zap icon

// Remover interface ActionButtonProps e voltar à definição original
// interface ActionButtonProps {
//   onSelectDatetime: (datetime: string) => void;
//   onSummarize: () => void;
// }

// Remover a prop onSummarizeRequest, pois a lógica foi movida para injected/index.ts
export default function ActionButton({ onSelectDatetime }) {
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [loading] = useState(false);

  return (
    <React.StrictMode>
      <NextUIProvider>
        <div className="flex items-center gap-1"> {/* Adicionar flex container */}
           {/* Botão de Resumo/Sugestão removido daqui, pois foi movido para injected/index.ts */}
           {/* Tag </Button> órfã removida */}

          {/* Popover e Botão de Agendamento (Existente) */}
          <Popover
            shadow="lg"
            isOpen={isOpenPopover}
            onOpenChange={(open) => setIsOpenPopover(open)} // Controlar abertura/fechamento
            shouldCloseOnBlur={true}
            showArrow={false}
            backdrop="opaque"
            placement="right"
            classNames={{
              base: ['mt-4', 'before:bg-default-200'],
              content: [
                'py-3 px-4 border border-default-200',
                'bg-gradient-to-br from-white to-default-300',
                'dark:from-default-100 dark:to-default-50',
              ],
            }}>
            <PopoverTrigger>
              <Button
                isIconOnly
                isLoading={loading}
                variant="light"
                size="sm" // Tamanho menor
                aria-label="Adiar">
                <Zap size={20} className="text-teal-600 group-active:text-white" strokeWidth={2} /> {/* Replace CalendarHeart with Zap */}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                onSelectDateTime={async ({ datetime }) => {
                  setIsOpenPopover(false); // Fecha o popover
                  onSelectDatetime(datetime); // Chama a função original
                }}
                onAbort={async () => {
                  setIsOpenPopover(false); // Fecha o popover
                }}
              />
            </PopoverContent> {/* Fechamento do Popover que estava faltando ou deslocado */}
          </Popover> {/* Fechamento duplicado de </Popover> removido */}
        </div>
      </NextUIProvider>
    </React.StrictMode>
  );
}
