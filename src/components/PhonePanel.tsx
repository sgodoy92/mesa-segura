import React, { useState, useRef, useEffect } from 'react';
import { useReservas } from '../context/ReservaContext';
import { ChatMessage } from './ChatMessage';
import { EstadoBadge } from './EstadoBadge';
import {
  Phone,
  Video,
  Send,
  MoreVertical,
  ShieldCheck,
  Zap,
  AlertTriangle,
  CreditCard,
  UserCheck,
  RefreshCw,
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';

export const PhonePanel: React.FC = () => {
  const {
    reservas,
    selectedReservaId,
    selectedReserva,
    setSelectedReservaId,
    mensajes,
    loadingMensajes,
    enviarMensaje,
    cambiarEstadoReserva
  } = useReservas();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedReservaId) return;
    enviarMensaje(selectedReservaId, inputText);
    setInputText('');
  };

  const handleTemplateClick = (text: string) => {
    if (!selectedReservaId) return;
    enviarMensaje(selectedReservaId, text);
  };

  const handleSimulateClientResponse = (optionText: string) => {
    if (!selectedReservaId) return;
    
    // Send message as if client responded
    if (optionText.includes('Confirmar')) {
      enviarMensaje(selectedReservaId, `[Cliente vía WhatsApp]: ${optionText}`);
      cambiarEstadoReserva(selectedReservaId, 'confirmada');
    } else if (optionText.includes('Cancelar') || optionText.includes('Liberar')) {
      enviarMensaje(selectedReservaId, `[Cliente vía WhatsApp]: ${optionText}`);
      cambiarEstadoReserva(selectedReservaId, 'liberada');
    } else if (optionText.includes('Cambiar')) {
      enviarMensaje(selectedReservaId, `[Cliente vía WhatsApp]: ${optionText}`);
      cambiarEstadoReserva(selectedReservaId, 'cambiada');
    } else {
      enviarMensaje(selectedReservaId, `[Cliente vía WhatsApp]: ${optionText}`);
    }
  };

  // Top tabs for active clients (allows switching inside phone mockup)
  const activeTabs = reservas.slice(0, 5);

  return (
    <div className="flex flex-col items-center justify-start h-full w-full">
      {/* Phone Frame Outer Container */}
      <div className="w-full max-w-[400px] bg-[#1E1E1E] p-3 rounded-[40px] shadow-2xl border-4 border-[#333] relative flex flex-col h-[740px]">
        
        {/* Phone Notch / Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#111] border border-gray-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a]" />
        </div>

        {/* Client Selector Tabs Bar inside Phone */}
        <div className="pt-6 pb-2 px-1 bg-[#075E54] text-white rounded-t-[28px] z-20">
          <div className="flex items-center justify-between text-[11px] text-emerald-100 px-3 mb-2 pt-1 font-mono">
            <span>9:41</span>
            <span className="font-semibold text-white tracking-wider">WhatsApp Business</span>
            <span>100% 🔋</span>
          </div>

          {/* Client Tabs horizontal scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-2 py-1">
            {activeTabs.map((res) => {
              const isSelected = res.id === selectedReservaId;
              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedReservaId(res.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#075E54] font-bold shadow-xs'
                      : 'bg-[#128C7E]/80 hover:bg-[#128C7E] text-emerald-50'
                  }`}
                >
                  <span className="truncate max-w-[80px]">{res.clienteNombre.split(' ')[0]}</span>
                  {res.estado === 'riesgo' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Header for Selected Client */}
        {selectedReserva ? (
          <div className="bg-[#075E54] text-white px-3 py-2.5 flex items-center justify-between border-t border-[#128C7E]/40 z-20">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-800 border-2 border-emerald-300/40 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  {selectedReserva.clienteNombre.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#075E54]" />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm text-white truncate leading-tight">
                  {selectedReserva.clienteNombre}
                </h3>
                <p className="text-[10px] text-emerald-100/90 truncate flex items-center gap-1">
                  <span>{selectedReserva.telefono}</span>
                  <span>•</span>
                  <span>{selectedReserva.comensales} pax ({selectedReserva.hora})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-100 shrink-0">
              <button
                title="Llamada directa"
                className="p-1 hover:bg-[#128C7E] rounded-full transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
              </button>
              <EstadoBadge estado={selectedReserva.estado} showIcon={false} className="text-[10px] px-2 py-0.5" />
            </div>
          </div>
        ) : (
          <div className="bg-[#075E54] text-white p-3 text-center text-xs">
            Selecciona un cliente para ver la conversación
          </div>
        )}

        {/* WhatsApp Chat Wall / Background */}
        <div className="flex-1 bg-[#E5DDD5] overflow-y-auto p-3 relative flex flex-col space-y-2">
          {/* Subtle WhatsApp chat pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          {/* Date separator badge */}
          <div className="text-center my-1">
            <span className="bg-[#FCFAF8]/90 text-[#7A7268] text-[10px] font-semibold px-3 py-0.5 rounded-full shadow-2xs border border-[#E0D8D0]">
              HOY — MESA SEGURA AUTOMATED
            </span>
          </div>

          {/* Anti No-Show Info Pill */}
          {selectedReserva && (
            <div className="bg-[#FFF9E6] border border-[#F3E2C8] rounded-lg p-2.5 text-[11px] text-[#7A5B15] shadow-2xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C77B21] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Protección Anti No-Show: </span>
                {selectedReserva.fianzaAntiNoShow ? (
                  <span>Fianza de {selectedReserva.montoFianza}€ depositada. Mesa {selectedReserva.mesa || ''} asegurada.</span>
                ) : (
                  <span>Recordatorio enviado a las {selectedReserva.horaUltimoMensaje}. Esperando confirmación.</span>
                )}
              </div>
            </div>
          )}

          {/* Messages list */}
          {loadingMensajes ? (
            <div className="flex-1 flex items-center justify-center text-xs text-[#7A7268] gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#8C3B2E]" />
              Cargando chat de WhatsApp...
            </div>
          ) : mensajes.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-[#8A8278] text-center p-4">
              No hay mensajes aún en este chat. Usa las plantillas rápidas abajo.
            </div>
          ) : (
            mensajes.map((msj) => (
              <ChatMessage
                key={msj.id}
                mensaje={msj}
                onOptionClick={handleSimulateClientResponse}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Templates Bar */}
        <div className="bg-[#FAF8F5] border-t border-[#E0D8D0] p-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 z-10 shrink-0">
          <span className="text-[10px] font-bold text-[#8C3B2E] uppercase shrink-0 flex items-center gap-0.5">
            <Zap className="w-3 h-3" /> Plantillas:
          </span>

          <button
            onClick={() => handleTemplateClick('👋 Hola, por favor confirma tu asistencia pulsando "1" para asegurar tu mesa.')}
            className="text-[11px] bg-white hover:bg-[#F0EAE1] text-[#2C2421] border border-[#D9D2C7] px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <span>⚡ Confirmación</span>
          </button>

          <button
            onClick={() => handleTemplateClick('🚨 Hola! Tu mesa está agendada en 15 min. Confirma asistencia o pasará a lista de espera.')}
            className="text-[11px] bg-[#F8ECE9] hover:bg-[#F2D7D1] text-[#8C3B2E] border border-[#F0C8C1] px-2.5 py-1 rounded-full whitespace-nowrap font-medium shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Alerta 15m</span>
          </button>

          <button
            onClick={() => handleTemplateClick('💳 Enlace de depósito anti no-show (10€/pax): https://mesasegura.app/pay/res-101')}
            className="text-[11px] bg-[#FDF5EA] hover:bg-[#F9E9D2] text-[#C77B21] border border-[#F3E2C8] px-2.5 py-1 rounded-full whitespace-nowrap font-medium shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <CreditCard className="w-3 h-3" />
            <span>Link Fianza</span>
          </button>

          <button
            onClick={() => handleTemplateClick('✅ Excelente. Tu reserva ha sido confirmada manualmente por el restaurante.')}
            className="text-[11px] bg-[#EDF7F0] hover:bg-[#D7EFE0] text-[#2D7A46] border border-[#C6E9D0] px-2.5 py-1 rounded-full whitespace-nowrap font-medium shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmar</span>
          </button>
        </div>

        {/* WhatsApp Input Form */}
        <form
          onSubmit={handleSend}
          className="bg-[#F0F0F0] p-2 rounded-b-[28px] flex items-center gap-2 z-10"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe un mensaje de WhatsApp..."
            className="flex-1 bg-white text-xs px-3 py-2 rounded-full text-[#2C2421] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E54]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-full bg-[#075E54] hover:bg-[#128C7E] disabled:bg-gray-400 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Phone Bottom Home Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full z-30" />
      </div>
    </div>
  );
};
