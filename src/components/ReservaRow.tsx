import React from 'react';
import { Reserva, EstadoReserva } from '../types';
import { EstadoBadge } from './EstadoBadge';
import { Users, Clock, MessageSquare, ShieldCheck, Phone, ChevronRight } from 'lucide-react';

interface ReservaRowProps {
  reserva: Reserva;
  isSelected: boolean;
  onSelect: () => void;
  onCambiarEstado: (reservaId: string, estado: EstadoReserva) => void;
}

export const ReservaRow: React.FC<ReservaRowProps> = ({
  reserva,
  isSelected,
  onSelect,
  onCambiarEstado
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-[#FAF8F5] border-[#8C3B2E] shadow-sm ring-1 ring-[#8C3B2E]/20'
          : 'bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] border-[#E8E2D8] hover:border-[#D0C7B8]'
      }`}
    >
      {/* Left accent bar for active item */}
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#8C3B2E] rounded-r" />
      )}

      <div className="flex items-start justify-between gap-3">
        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-semibold text-base text-[#2C2421] truncate font-sans group-hover:text-[#8C3B2E] transition-colors">
              {reserva.clienteNombre}
            </h4>

            {reserva.fianzaAntiNoShow && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#8C3B2E]/10 text-[#8C3B2E] px-2 py-0.5 rounded-full border border-[#8C3B2E]/20">
                <ShieldCheck className="w-3 h-3" />
                Fianza {reserva.montoFianza ? `${reserva.montoFianza}€` : 'Activa'}
              </span>
            )}
          </div>

          {/* Time, Table, Pax */}
          <div className="flex items-center gap-3 text-xs text-[#6B635B] my-1 flex-wrap">
            <span className="flex items-center gap-1 font-medium text-[#2C2421] bg-[#F0EAE1] px-2 py-0.5 rounded">
              <Clock className="w-3.5 h-3.5 text-[#8C3B2E]" />
              {reserva.hora}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#7A7268]" />
              {reserva.comensales} pax
            </span>
            {reserva.mesa && (
              <span className="text-[#8C3B2E] font-medium border-l border-[#D9D2C7] pl-2">
                {reserva.mesa}
              </span>
            )}
          </div>

          {/* Last message preview */}
          {reserva.ultimoMensaje && (
            <p className="text-xs text-[#7A7268] line-clamp-1 mt-2 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-[#A0988C] shrink-0" />
              <span className="truncate">{reserva.ultimoMensaje}</span>
              <span className="text-[10px] text-[#A0988C] ml-auto shrink-0">
                {reserva.horaUltimoMensaje}
              </span>
            </p>
          )}
        </div>

        {/* Right side: Status badge & arrow */}
        <div className="flex flex-col items-end justify-between gap-2 shrink-0">
          <EstadoBadge estado={reserva.estado} />

          {/* Quick status change action dropdown / buttons */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 mt-1 opacity-95 group-hover:opacity-100"
          >
            <select
              value={reserva.estado}
              onChange={(e) => onCambiarEstado(reserva.id, e.target.value as EstadoReserva)}
              className="text-[11px] bg-white border border-[#D9D2C7] text-[#4A423A] rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#8C3B2E] cursor-pointer"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="riesgo">En Riesgo</option>
              <option value="recuperada">Recuperada</option>
              <option value="cambiada">Cambiada</option>
              <option value="liberada">Liberada</option>
            </select>
            <ChevronRight className="w-4 h-4 text-[#A0988C] group-hover:text-[#8C3B2E] transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};
