import React from 'react';
import { EstadoReserva } from '../types';
import { Clock, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Edit3 } from 'lucide-react';

interface EstadoBadgeProps {
  estado: EstadoReserva;
  className?: string;
  showIcon?: boolean;
}

export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado, className = '', showIcon = true }) => {
  switch (estado) {
    case 'pendiente':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FDF5EA] text-[#C77B21] border border-[#F3E2C8] ${className}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-[#C77B21]" />}
          <span>Pendiente</span>
        </span>
      );
    case 'confirmada':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EDF7F0] text-[#2D7A46] border border-[#C6E9D0] ${className}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A46]" />}
          <span>Confirmada</span>
        </span>
      );
    case 'riesgo':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F8ECE9] text-[#8C3B2E] border border-[#F0C8C1] animate-pulse ${className}`}
        >
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-[#8C3B2E]" />}
          <span>En Riesgo</span>
        </span>
      );
    case 'liberada':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#EFECE6] text-[#6B635B] border border-[#DDD6CC] ${className}`}
        >
          {showIcon && <XCircle className="w-3.5 h-3.5 text-[#6B635B]" />}
          <span>Liberada</span>
        </span>
      );
    case 'recuperada':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8] ${className}`}
        >
          {showIcon && <RefreshCw className="w-3.5 h-3.5 text-[#2B6CB0]" />}
          <span>Recuperada</span>
        </span>
      );
    case 'cambiada':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E6FFFA] text-[#2C7A7B] border border-[#B2F5EA] ${className}`}
        >
          {showIcon && <Edit3 className="w-3.5 h-3.5 text-[#2C7A7B]" />}
          <span>Cambiada</span>
        </span>
      );
    default:
      return null;
  }
};
