import React from 'react';
import { Mensaje } from '../types';
import { CheckCheck, Bot, User, Store } from 'lucide-react';

interface ChatMessageProps {
  mensaje: Mensaje;
  onOptionClick?: (optionText: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ mensaje, onOptionClick }) => {
  const isClient = mensaje.remitente === 'cliente';
  const isBot = mensaje.remitente === 'bot';

  return (
    <div className={`flex flex-col mb-3 ${isClient ? 'items-start' : 'items-end'}`}>
      {/* Sender indicator */}
      <div className="flex items-center gap-1 text-[10px] text-[#7A7268] mb-0.5 px-1 font-medium">
        {isClient && (
          <>
            <User className="w-3 h-3 text-[#6B635B]" />
            <span>Cliente</span>
          </>
        )}
        {isBot && (
          <>
            <Bot className="w-3 h-3 text-[#8C3B2E]" />
            <span className="text-[#8C3B2E]">MesaSegura Bot</span>
          </>
        )}
        {!isClient && !isBot && (
          <>
            <Store className="w-3 h-3 text-[#2D7A46]" />
            <span className="text-[#2D7A46]">Restaurante</span>
          </>
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-xs relative ${
          isClient
            ? 'bg-white text-[#2C2421] border border-[#E5E0D8] rounded-tl-xs'
            : isBot
            ? 'bg-[#EBF5EE] text-[#1B432C] border border-[#CDEAD6] rounded-tr-xs'
            : 'bg-[#8C3B2E] text-white rounded-tr-xs'
        }`}
      >
        <p className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
          {mensaje.texto}
        </p>

        {/* Action buttons embedded in message */}
        {mensaje.opcionesAccion && mensaje.opcionesAccion.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-[#CDEAD6] flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-[#2D7A46] uppercase tracking-wider">
              Respuesta rápida WhatsApp:
            </span>
            {mensaje.opcionesAccion.map((opt, index) => (
              <button
                key={index}
                onClick={() => onOptionClick?.(opt)}
                className="w-full text-left text-xs font-medium py-1.5 px-3 rounded-lg bg-white hover:bg-[#F2FAF4] text-[#1B432C] border border-[#C2E3CC] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span>{opt}</span>
                <span className="text-[10px] text-[#2D7A46] group-hover:translate-x-0.5 transition-transform">
                  Enviar ➔
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp & read receipts */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
            isClient
              ? 'text-[#9C9489]'
              : isBot
              ? 'text-[#5A876A]'
              : 'text-white/80'
          }`}
        >
          <span>{mensaje.timestamp}</span>
          {!isClient && (
            <CheckCheck
              className={`w-3.5 h-3.5 ${
                mensaje.estadoLectura === 'leido'
                  ? isBot
                    ? 'text-[#2D7A46]'
                    : 'text-emerald-200'
                  : 'opacity-70'
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
};
