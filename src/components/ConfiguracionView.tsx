import React, { useState, useEffect } from 'react';
import { useReservas } from '../context/ReservaContext';
import { Configuracion, HorarioDia } from '../types';
import {
  Store,
  Phone,
  Euro,
  Clock,
  LayoutGrid,
  MessageSquare,
  Save,
  CheckCircle2,
  Sparkles,
  Info,
  Users
} from 'lucide-react';

export const ConfiguracionView: React.FC = () => {
  const { configuracion, guardarConfiguracion, loadingConfiguracion } = useReservas();

  const [formState, setFormState] = useState<Configuracion | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (configuracion) {
      setFormState(JSON.parse(JSON.stringify(configuracion)));
    }
  }, [configuracion]);

  if (!formState) {
    return (
      <div className="p-8 text-center text-xs text-[#7A7268]">
        Cargando configuración del local...
      </div>
    );
  }

  const handleGeneralChange = (field: keyof Configuracion, value: any) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleHorarioChange = (index: number, field: keyof HorarioDia, value: any) => {
    setFormState((prev) => {
      if (!prev) return null;
      const updatedHorarios = [...prev.horarios];
      updatedHorarios[index] = { ...updatedHorarios[index], [field]: value };
      return { ...prev, horarios: updatedHorarios };
    });
  };

  const handleMesasChange = (paxKey: 'pax2' | 'pax4' | 'pax6', value: number) => {
    setFormState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        mesas: {
          ...prev.mesas,
          [paxKey]: Math.max(0, value)
        }
      };
    });
  };

  const handlePlantillaChange = (plantillaKey: keyof Configuracion['plantillas'], value: string) => {
    setFormState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        plantillas: {
          ...prev.plantillas,
          [plantillaKey]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;
    await guardarConfiguracion(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Helper to render text with highlighted variables {nombre}, {hora}, {pax}
  const renderHighlightedVariables = (text: string) => {
    const regex = /(\{nombre\}|\{hora\}|\{pax\})/g;
    const parts = text.split(regex);

    return (
      <p className="text-xs text-[#2C2421] leading-relaxed font-sans bg-[#F6F2EA] p-3 rounded-xl border border-[#E0D8CA] whitespace-pre-line">
        {parts.map((part, i) => {
          if (part === '{nombre}' || part === '{hora}' || part === '{pax}') {
            return (
              <span
                key={i}
                className="inline-block bg-[#8C3B2E] text-white font-mono font-bold text-[11px] px-1.5 py-0.5 rounded mx-0.5 shadow-2xs"
              >
                {part}
              </span>
            );
          }
          return part;
        })}
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Save bar floating notice */}
      {savedSuccess && (
        <div className="p-4 bg-[#EDF7F0] border border-[#C6E9D0] text-[#2D7A46] rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>¡Configuración guardada con éxito en el estado del restaurante!</span>
        </div>
      )}

      {/* 1. Datos del Local */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DEC3] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8E2D8]">
          <div className="p-2 rounded-xl bg-[#8C3B2E]/10 text-[#8C3B2E]">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-[#2C2421]">
              Información General del Restaurante
            </h2>
            <p className="text-xs text-[#7A7268]">
              Datos principales del establecimiento visibles en el servicio WhatsApp.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A423A] mb-1 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-[#8C3B2E]" />
              Nombre del Local
            </label>
            <input
              type="text"
              required
              value={formState.nombreLocal}
              onChange={(e) => handleGeneralChange('nombreLocal', e.target.value)}
              className="w-full bg-white border border-[#D9D2C7] rounded-xl px-3 py-2 text-xs font-medium text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#8C3B2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A423A] mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#8C3B2E]" />
              Teléfono de Reservas
            </label>
            <input
              type="text"
              required
              value={formState.telefono}
              onChange={(e) => handleGeneralChange('telefono', e.target.value)}
              className="w-full bg-white border border-[#D9D2C7] rounded-xl px-3 py-2 text-xs font-medium text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#8C3B2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A423A] mb-1 flex items-center gap-1">
              <Euro className="w-3.5 h-3.5 text-[#C77B21]" />
              Ticket Medio (€ / comensal)
            </label>
            <input
              type="number"
              required
              min="0"
              value={formState.ticketMedio}
              onChange={(e) => handleGeneralChange('ticketMedio', Number(e.target.value))}
              className="w-full bg-white border border-[#D9D2C7] rounded-xl px-3 py-2 text-xs font-medium text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#8C3B2E]"
            />
          </div>
        </div>
      </div>

      {/* 2. Distribución de Mesas por Capacidad */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DEC3] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8E2D8]">
          <div className="p-2 rounded-xl bg-[#C77B21]/10 text-[#C77B21]">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-[#2C2421]">
              Mesas Disponibles por Capacidad
            </h2>
            <p className="text-xs text-[#7A7268]">
              Define cuántas mesas tienes de cada tamaño para la gestión automatizada de cupos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F6F2EA] p-4 rounded-xl border border-[#E0D8CA] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#2C2421] block">Mesas para 2 pax</span>
              <span className="text-[11px] text-[#7A7268]">Parejas / Rincón</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMesasChange('pax2', formState.mesas.pax2 - 1)}
                className="w-7 h-7 rounded-lg bg-white border border-[#D9D2C7] font-bold text-xs hover:bg-[#FAF8F5]"
              >
                -
              </button>
              <span className="font-serif font-bold text-lg text-[#8C3B2E] w-6 text-center">
                {formState.mesas.pax2}
              </span>
              <button
                type="button"
                onClick={() => handleMesasChange('pax2', formState.mesas.pax2 + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-[#D9D2C7] font-bold text-xs hover:bg-[#FAF8F5]"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-[#F6F2EA] p-4 rounded-xl border border-[#E0D8CA] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#2C2421] block">Mesas para 4 pax</span>
              <span className="text-[11px] text-[#7A7268]">Familias / Estándar</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMesasChange('pax4', formState.mesas.pax4 - 1)}
                className="w-7 h-7 rounded-lg bg-white border border-[#D9D2C7] font-bold text-xs hover:bg-[#FAF8F5]"
              >
                -
              </button>
              <span className="font-serif font-bold text-lg text-[#8C3B2E] w-6 text-center">
                {formState.mesas.pax4}
              </span>
              <button
                type="button"
                onClick={() => handleMesasChange('pax4', formState.mesas.pax4 + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-[#D9D2C7] font-bold text-xs hover:bg-[#FAF8F5]"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-[#F6F2EA] p-4 rounded-xl border border-[#E0D8CA] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#2C2421] block">Mesas para 6+ pax</span>
              <span className="text-[11px] text-[#7A7268]">Grupos / Grandes</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMesasChange('pax6', formState.mesas.pax6 - 1)}
                className="w-7 h-7 rounded-lg bg-white border border-[#D9D2C7] font-bold text-xs hover:bg-[#FAF8F5]"
              >
                -
              </button>
              <span className="font-serif font-bold text-lg text-[#8C3B2E] w-6 text-center">
                {formState.mesas.pax6}
              </span>
              <button
                type="button"
                onClick={() => handleMesasChange('pax6', formState.mesas.pax6 + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-[#D9D2C7] font-bold text-xs hover:bg-[#FAF8F5]"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Horarios de Apertura por Día */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DEC3] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8E2D8]">
          <div className="p-2 rounded-xl bg-[#2D7A46]/10 text-[#2D7A46]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-[#2C2421]">
              Horarios de Apertura por Día
            </h2>
            <p className="text-xs text-[#7A7268]">
              Especifica turnos de comida y cena para la aceptación automática de reservas.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E2D8] text-[#7A7268] uppercase text-[11px]">
                <th className="pb-2 font-semibold w-28">Día</th>
                <th className="pb-2 font-semibold w-24">Estado</th>
                <th className="pb-2 font-semibold">Turno Comidas</th>
                <th className="pb-2 font-semibold">Turno Cenas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]">
              {formState.horarios.map((item, idx) => (
                <tr key={item.dia} className="hover:bg-[#F6F2EA]/50 transition-colors">
                  <td className="py-2.5 font-bold text-[#2C2421]">{item.dia}</td>
                  <td className="py-2.5">
                    <button
                      type="button"
                      onClick={() => handleHorarioChange(idx, 'abierto', !item.abierto)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                        item.abierto
                          ? 'bg-[#EDF7F0] text-[#2D7A46] border border-[#C6E9D0]'
                          : 'bg-[#F8ECE9] text-[#8C3B2E] border border-[#F0C8C1]'
                      }`}
                    >
                      {item.abierto ? 'Abierto' : 'Cerrado'}
                    </button>
                  </td>
                  <td className="py-2.5 pr-3">
                    <input
                      type="text"
                      disabled={!item.abierto}
                      value={item.comidas}
                      onChange={(e) => handleHorarioChange(idx, 'comidas', e.target.value)}
                      className="w-full bg-white border border-[#D9D2C7] disabled:bg-gray-100 disabled:text-gray-400 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#8C3B2E]"
                    />
                  </td>
                  <td className="py-2.5">
                    <input
                      type="text"
                      disabled={!item.abierto}
                      value={item.cenas}
                      onChange={(e) => handleHorarioChange(idx, 'cenas', e.target.value)}
                      className="w-full bg-white border border-[#D9D2C7] disabled:bg-gray-100 disabled:text-gray-400 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#8C3B2E]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Textos de Plantillas de Mensaje WhatsApp */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DEC3] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E2D8] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#8C3B2E]/10 text-[#8C3B2E]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#2C2421]">
                Plantillas de Mensajes Automatizados WhatsApp
              </h2>
              <p className="text-xs text-[#7A7268]">
                Personaliza los mensajes usando las variables dinámicas <code className="bg-[#EFECE6] px-1 rounded text-[#8C3B2E] font-bold">{'{nombre}'}</code>, <code className="bg-[#EFECE6] px-1 rounded text-[#8C3B2E] font-bold">{'{hora}'}</code> y <code className="bg-[#EFECE6] px-1 rounded text-[#8C3B2E] font-bold">{'{pax}'}</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#FDF5EA] border border-[#F3E2C8] px-3 py-1 rounded-xl text-xs text-[#C77B21]">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Variables dinámicas autodetectadas y resaltadas</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Plantilla 1: Confirmación T-24h */}
          <div className="p-4 bg-white rounded-xl border border-[#E0D8CA] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#8C3B2E] uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8C3B2E]" />
                1. Plantilla Confirmación (T-24h antes)
              </label>
              <span className="text-[10px] bg-[#F8ECE9] text-[#8C3B2E] font-semibold px-2 py-0.5 rounded-full">
                Auto-envió 24h antes
              </span>
            </div>

            <textarea
              rows={3}
              value={formState.plantillas.confirmacionT24}
              onChange={(e) => handlePlantillaChange('confirmacionT24', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl p-3 text-xs text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#8C3B2E] font-sans"
            />

            <div>
              <span className="text-[11px] font-semibold text-[#7A7268] block mb-1">
                Vista previa con resaltado de variables:
              </span>
              {renderHighlightedVariables(formState.plantillas.confirmacionT24)}
            </div>
          </div>

          {/* Plantilla 2: Recordatorio T-4h */}
          <div className="p-4 bg-white rounded-xl border border-[#E0D8CA] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#C77B21] uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C77B21]" />
                2. Plantilla Recordatorio Ultima Hora (T-4h antes)
              </label>
              <span className="text-[10px] bg-[#FDF5EA] text-[#C77B21] font-semibold px-2 py-0.5 rounded-full">
                Urgencia / Anti No-Show
              </span>
            </div>

            <textarea
              rows={3}
              value={formState.plantillas.recordatorioT4}
              onChange={(e) => handlePlantillaChange('recordatorioT4', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl p-3 text-xs text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#C77B21] font-sans"
            />

            <div>
              <span className="text-[11px] font-semibold text-[#7A7268] block mb-1">
                Vista previa con resaltado de variables:
              </span>
              {renderHighlightedVariables(formState.plantillas.recordatorioT4)}
            </div>
          </div>

          {/* Plantilla 3: Oferta Lista de Espera */}
          <div className="p-4 bg-white rounded-xl border border-[#E0D8CA] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#2D7A46] uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2D7A46]" />
                3. Plantilla Oferta Mesa Liberada (Lista de Espera)
              </label>
              <span className="text-[10px] bg-[#EDF7F0] text-[#2D7A46] font-semibold px-2 py-0.5 rounded-full">
                Recuperación Inmediata
              </span>
            </div>

            <textarea
              rows={3}
              value={formState.plantillas.ofertaListaEspera}
              onChange={(e) => handlePlantillaChange('ofertaListaEspera', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl p-3 text-xs text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#2D7A46] font-sans"
            />

            <div>
              <span className="text-[11px] font-semibold text-[#7A7268] block mb-1">
                Vista previa con resaltado de variables:
              </span>
              {renderHighlightedVariables(formState.plantillas.ofertaListaEspera)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={loadingConfiguracion}
          className="bg-[#8C3B2E] hover:bg-[#6E2C22] text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{loadingConfiguracion ? 'Guardando...' : 'Guardar Configuración'}</span>
        </button>
      </div>
    </form>
  );
};
