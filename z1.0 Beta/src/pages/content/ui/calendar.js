import { motion } from 'framer-motion';
import moment from 'moment-timezone';
import {
  ArrowLeft,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  CoffeeIcon, // Adicionar importação do ícone de café
  SunIcon,
  SofaIcon,
  CalendarDaysIcon,
  CalendarSearchIcon,
  CalendarCheck,
} from 'lucide-react';

import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { pt } from 'date-fns/locale'; //
import { useState } from 'react';

const colStartClasses = ['', 'col-start-2', 'col-start-3', 'col-start-4', 'col-start-5', 'col-start-6', 'col-start-7'];

//create type for onSelectDateTime callback base to use in the Calendar component
type DateTime = {
  datetime: string;
};

// create type for props to use in the Calendar component
type CalendarProps = {
  onAbort: () => void;
  onSelectDateTime: (dateTime: DateTime) => void;
};

function NextHalfHour() { // Renamed function
  const agora = moment();

  let nextHalfHourTime; // Renamed variable and added logic
  if (agora.minute() < 30) {
    // Próxima meia hora é :30 da hora atual
    nextHalfHourTime = moment(agora).minute(30).second(0);
  } else {
    // Próxima meia hora é :00 da próxima hora
    nextHalfHourTime = moment(agora).add(1, 'hours').minute(0).second(0);
  }

  let text;

  if (nextHalfHourTime.isSame(agora, 'day')) { // Use renamed variable
    text = `Daqui a pouco`; // Updated text
  } else {
    text = `Amanhã`;
  }

  // Log removido
  return { datetime: nextHalfHourTime.format(), hour: nextHalfHourTime.format('HH:mm'), text };
}

function NextDay(hour?) {
  hour = hour || 8;

  // Definir o momento para o mesmo horário no dia seguinte
  const next = moment().add(1, 'days').hour(hour).minute(0).second(0);

  // Formatar texto para exibir "Amanhã às HH:mm"
  const text = `Amanhã`;

  return {
    datetime: next.format(),
    hour: next.format('HH:mm'),
    text: text,
  };
}

function NextSaturday() {
  // Obter o momento atual
  const now = moment();

  // Calcular quantos dias adicionar até o próximo sábado
  // Moment.js: 0 é Domingo, 6 é Sábado
  let addDays = 6 - now.day();
  if (addDays <= 0) {
    addDays += 7; // Se hoje já é sábado ou domingo, adicionar uma semana
  }

  // Definir o lembrete para o próximo sábado às 18:00
  const nextSaturday = moment(now).add(addDays, 'days').hour(18).minute(0).second(0);

  return {
    datetime: nextSaturday.format(),
    hour: nextSaturday.format('HH:mm'),
    text: `Próximo
    Final de Semana`,
  };
}

function NextMonday() {
  // Obter o momento atual
  const now = moment();

  // Calcular quantos dias adicionar até a próxima segunda-feira
  // Moment.js: 1 é Segunda-feira
  let addDays = 1 - now.day();
  if (addDays <= 0) {
    addDays += 7; // Se hoje é Segunda-feira ou depois, adicionar uma semana
  }
  // Adicionando a quantidade necessária de dias para chegar na próxima segunda-feira
  const nextMonday = moment(now).add(addDays, 'days').hour(8).minute(0).second(0);

  return {
    datetime: nextMonday.format(),
    hour: nextMonday.format('HH:mm'),
    text: `Próxima segunda-feira às ${nextMonday.format('HH:mm')}`,
  };
}

export default function Calendar({ onAbort, onSelectDateTime }: CalendarProps) {
  // Log removido
  const nextHalfHour = NextHalfHour(); // Renamed variable and function call
  const nextDay = NextDay();
  const nextSaturday = NextSaturday();
  const nextMonday = NextMonday();

  const [picker, setPicker] = useState('shortcut');

  const today = startOfToday();

  const [selectedDateTime, setSelectedDateTime] = useState({
    date: today,
    time: format(new Date(), 'HH:mm'),
  });

  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));

  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function handleDateChange(newDate) {
    setSelectedDateTime({
      ...selectedDateTime,
      date: newDate,
    });
  }

  function handleTimeChange(newTime) {
    setSelectedDateTime({
      ...selectedDateTime,
      time: newTime,
    });
  }

  return (
    <>
      {picker !== 'calendar' ? (
        <motion.div className="grid grid-cols-1 gap-4 my-4 w-96">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                console.log('datetime', nextHalfHour.datetime);
                onSelectDateTime({ datetime: nextHalfHour.datetime });
              }}
              className="w-full gap-2 flex-col transition-all duration-100 rounded-xl hover:border-white/20 hover:bg-[#27272A]/20 flex items-center justify-center py-2 hover:shadow-lg border-transparent border active:bg-teal-400 group active:scale-95">
              <CoffeeIcon className="text-teal-600 h-14 w-14 group-active:text-white" strokeWidth={1} /> {/* Trocar MoonIcon por CoffeeIcon */}
              <div className="flex flex-col text-center">
                <p className="text-sm font-bold group-active:text-whitegroup-active:text-white">{nextHalfHour.text}</p>
                <span className="text-xs text-gray-400 group-active:text-teal-200">{nextHalfHour.hour}</span>
              </div>
            </button>

            <button
              onClick={() => {
                console.log('datetime', nextDay.datetime);
                onSelectDateTime({ datetime: nextDay.datetime });
              }}
              className="w-full gap-2 flex-col transition-all duration-100 rounded-xl hover:border-white/20 hover:bg-[#27272A]/20 flex items-center justify-center py-2 hover:shadow-lg border-transparent border active:bg-teal-400 group active:scale-95">
              <SunIcon className="text-teal-600 h-14 w-14 group-active:text-white" strokeWidth={1} />
              <div className="flex flex-col text-center">
                <p className="text-sm font-bold group-active:text-white">{nextDay.text}</p>
                <span className="text-xs text-gray-400">{nextDay.hour}</span>
              </div>
            </button>

            <button
              onClick={() => {
                console.log('datetime', nextSaturday.datetime);
                onSelectDateTime({ datetime: nextSaturday.datetime });
              }}
              className="w-full gap-2 flex-col transition-all duration-100 rounded-xl hover:border-white/20 hover:bg-[#27272A]/20 flex items-center justify-center py-2 hover:shadow-lg border-transparent border active:bg-teal-400 group active:scale-95">
              <SofaIcon className="text-teal-600 h-14 w-14 group-active:text-white" strokeWidth={1} />
              <div className="flex flex-col text-center">
                <p className="text-sm font-bold group-active:text-white">
                  Proximo
                  <br /> Final de Semana
                </p>
                <span className="text-xs text-gray-400">sab. {nextSaturday.hour}</span>
              </div>
            </button>

            <button
              onClick={() => {
                console.log('datetime', nextMonday.datetime);
                onSelectDateTime({ datetime: nextMonday.datetime });
              }}
              className="w-full gap-2 flex-col transition-all duration-100 rounded-xl hover:border-white/20 hover:bg-[#27272A]/20 flex items-center justify-center py-2 hover:shadow-lg border-transparent border active:bg-teal-400 group active:scale-95">
              <CalendarDaysIcon className="text-teal-600 h-14 w-14 group-active:text-white" strokeWidth={1} />
              <div className="flex flex-col text-center">
                <p className="text-sm font-bold group-active:text-white">
                  Próxima
                  <br /> Segunda-Feira
                </p>
                <span className="text-xs text-gray-400">seg. {nextMonday.hour}</span>
              </div>
            </button>

            <button
              className="w-full gap-2 flex-col transition-all duration-100 rounded-xl hover:border-white/20 hover:bg-[#27272A]/20 flex items-center justify-center py-2 hover:shadow-lg border-transparent border active:bg-teal-400 group active:scale-95 cursor-pointer text-center"
              onClick={() => setPicker('calendar')}>
              <CalendarSearchIcon className="text-teal-600 h-14 w-14 group-active:text-white" strokeWidth={1} />
              <div className="flex flex-col text-center">
                <p className="text-sm font-bold">
                  Escolher data e<br />
                  hora
                </p>
              </div>
            </button>

            {window?.lastSelection?.datetime && ( // Corrected &&
              <button
                onClick={() => {
                  onSelectDateTime({ datetime: window?.lastSelection?.datetime });
                }}
                className="w-full gap-2 flex-col transition-all duration-100 rounded-xl hover:border-white/20 hover:bg-[#27272A]/20 flex items-center justify-center py-2 hover:shadow-lg border-transparent border active:bg-teal-400 group active:scale-95">
                <CalendarCheck className="text-teal-600 h-14 w-14 group-active:text-white" strokeWidth={1} />
                <div className="flex flex-col text-center">
                  <p className="text-sm font-bold group-active:text-white">Ultima Seleção</p>
                  <span className="text-xs text-gray-400">
                    Dia {moment(window?.lastSelection?.datetime).format('D/MM [de] YYYY [às] HH:mm')}
                  </span>
                </div>
              </button>
            )}
          </div>

          <div className="flex w-full gap-4 mt-2">
            <Button
              size="md"
              className="w-full text-base bg-teal-500"
              radius="md"
              onClick={() => {
                onAbort();
              }}>
              Cancelar
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-4 my-4 text-zinc-900 dark:text-white w-96"
          initial={{ opacity: 0, scale: 0.5, transform: 'translateX(100px)' }} // Adiciona transform: "translateX(100px)"
          animate={{ opacity: 1, scale: 1, transform: 'translateX(0)' }} // Altera para transform: "translateX(0)"
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}>
          <div className="flex items-center justify-between">
            <Button isIconOnly size="sm" className="text-teal-400 bg-teal-950" onClick={() => setPicker('shortcut')}>
              <ArrowLeft className="w-10" />
            </Button>

            <h2 className="font-semibold text-zinc-900 dark:text-white first-letter:uppercase">
              {format(firstDayCurrentMonth, "MMMM 'de' yyyy", { locale: pt })}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 mt-2 text-xs font-medium leading-6 text-center text-gray-400">
            <div>D</div>
            <div>S</div>
            <div>T</div>
            <div>Q</div>
            <div>Q</div>
            <div>S</div>
            <div>S</div>
          </div>
          <div className="grid grid-cols-7 mt-2 text-sm">
            {days.map((day, dayIdx) => (
              <div key={day.toString()} className={clsx(dayIdx === 0 && colStartClasses[getDay(day)], 'py-1.5')}>
                <button
                  type="button"
                  onClick={() => handleDateChange(day)}
                  className={clsx(
                    isEqual(day, selectedDateTime.date) && 'text-teal-400', // Corrected &&
                    !isEqual(day, selectedDateTime.date) && isToday(day) && 'text-teal-600', // Corrected &&
                    !isEqual(day, selectedDateTime.date) && // Corrected &&
                      !isToday(day) && // Corrected &&
                      isSameMonth(day, firstDayCurrentMonth) && // Corrected &&
                      'text-white',
                    !isEqual(day, selectedDateTime.date) && // Corrected &&
                      !isToday(day) && // Corrected &&
                      !isSameMonth(day, firstDayCurrentMonth) && // Corrected &&
                      'text-gray-600',
                    isEqual(day, selectedDateTime.date) && isToday(day) && 'bg-teal-600/50', // Corrected &&
                    isEqual(day, selectedDateTime.date) && !isToday(day) && 'bg-teal-950', // Corrected &&
                    !isEqual(day, selectedDateTime.date) && 'hover:bg-teal-950 hover:text-white', // Corrected &&
                    (isEqual(day, selectedDateTime.date) || isToday(day)) && 'font-semibold', // Corrected &&
                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-zinc-900 dark:text-slate-100',
                  )}>
                  <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-start gap-4">
            <input
              type="time"
              name="time"
              id="time"
              className="ml-4 w-max flex-1 b-0 p-2 rounded-lg border-0"
              // classNames={{
              //   input: 'w-max flex-1 b-0px-4',
              // }}
              value={selectedDateTime.time}
              onChange={e => handleTimeChange(e.target.value)}
            />
            <label className="flex-1 flex items-center gap-4 text-sm w-max text-nowrap" htmlFor="time">
              Informar Hora
            </label>
          </div>

          <div className="flex w-full gap-4 mt-2">
            <Button
              isDisabled={!selectedDateTime.date || !selectedDateTime.time} // Corrected && and logic to OR
              size="md"
              className="w-full text-base bg-teal-500"
              radius="md"
              onClick={() => {
                const date = format(selectedDateTime.date, 'yyyy-MM-dd');
                const time = selectedDateTime.time;
                onSelectDateTime({ datetime: `${date} ${time}` });
              }}>
              Confirmar
              <strong>
                {format(selectedDateTime.date, "dd 'de' MMMM 'de' yyyy", {
                  locale: pt,
                })}
                {' às '}
                {selectedDateTime.time}
              </strong>
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
}
