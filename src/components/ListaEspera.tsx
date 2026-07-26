import React, { useState } from 'react';
import { useReservas } from '../context/ReservaContext';
import { ListaEsperaItem } from '../types';
import { Users, Clock, Phone, Plus, Send, CheckCircle, AlertCircle, Sparkles, UserPlus, Trash2 } from 'lucide-react';

export const ListaEspera: React.FC = () => {
  const {
    listaEspera,
    reservas,
    loadingEspera,
    agregarListaEspera,
    cambiarEstadoListaEspera,
    enviarMensaje
  } = useReservas();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    clienteNombre: '',
    telefono: '',
    comensales: 2,
    horaDeseada: '21:30',
    notas: ''
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clienteNombre || !formData.telefono) return;

    agregarListaEspera({
      clienteNombre: formData.clienteNombre,
      telefono: formData.telefono,
      comensales: Number(formData.comensales),
      horaDeseada: formData.horaDeseada,
      notas: formData.notas
    });

    setFormData({
      clienteNombre: '',
      telefono: '',
      comensales: 2,
      horaDeseada: '21:30',
      notas: ''
    });
    setShowAddModal(false);
  };

  // Find if there is any freed table ('liberada') to highlight re-assignment opportunities
  const freedTables = reservas.filter((r) => r.estado === 'liberada');

  const handleNotifyWaitlist = (item: ListaEsperaItem) => {
    cambiarEstadoListaEspera(item.id, 'notificado');
    alert(`📲 Mensaje de WhatsApp enviado a ${item.clienteNombre} (${item.telefono}): "¡Tu mesa de ${item.comensales} personas está lista en Restaurante El Asador! Tienes 10 minutos para confirmar."`);
  };

  const handleAssignTable = (item: ListaEsperaItem) => {
    cambiarEstadoListaEspera(item.id, 'asignado');
  };

  return (
    <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DEC3] p-5 shadow-xs mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl text-[#2C2421]">
              Lista de Espera en Tiempo Real
            </h2>
            <span className="bg-[#C77B21]/15 text-[#C77B21] text-xs px-2.5 py-0.5 rounded-full font-bold">
              {listaEspera.filter((w) => w.estado === 'esperando' || w.estado === 'notificado').length} en espera
            </span>
          </div>
          <p className="text-xs text-[#7A7268] mt-1">
            Gestión fluida de clientes en puerta para ocupar mesas liberadas o canceladas inmediatamente.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 bg-[#8C3B2E] hover:bg-[#6E2C22] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Añadir a Lista de Espera
        </button>
      </div>

      {/* Alert banner if there are freed tables */}
      {freedTables.length > 0 && (
        <div className="mb-4 p-3 bg-[#FDF5EA] border border-[#F3E2C8] rounded-xl text-xs text-[#C77B21] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C77B21] shrink-0" />
            <span>
              <strong>¡Oportunidad!</strong> Tienes {freedTables.length} mesa(s) liberada(s) (ej: {freedTables[0].mesa || 'Mesa liberada'}). ¡Asígnala a los clientes en lista de espera!
            </span>
          </div>
        </div>
      )}

      {/* Table / List */}
      {loadingEspera ? (
        <div className="py-8 text-center text-xs text-[#7A7268]">
          Cargando lista de espera...
        </div>
      ) : listaEspera.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#8A8278]">
          No hay clientes en lista de espera actualmente.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E2D8] text-[#7A7268] uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-semibold">Cliente</th>
                <th className="pb-3 font-semibold">Teléfono</th>
                <th className="pb-3 font-semibold">Comensales</th>
                <th className="pb-3 font-semibold">Hora Deseada</th>
                <th className="pb-3 font-semibold">T. Espera</th>
                <th className="pb-3 font-semibold">Estado</th>
                <th className="pb-3 font-semibold text-right">Acciones WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]">
              {listaEspera.map((item) => (
                <tr key={item.id} className="hover:bg-[#F6F2EA]/60 transition-colors">
                  <td className="py-3 pr-2 font-medium text-[#2C2421]">
                    <div>{item.clienteNombre}</div>
                    {item.notas && <div className="text-[10px] text-[#8A8278]">{item.notas}</div>}
                  </td>
                  <td className="py-3 pr-2 text-[#5E564D]">{item.telefono}</td>
                  <td className="py-3 pr-2">
                    <span className="inline-flex items-center gap-1 bg-[#F0EAE1] text-[#2C2421] px-2 py-0.5 rounded font-medium">
                      <Users className="w-3 h-3 text-[#7A7268]" />
                      {item.comensales} pax
                    </span>
                  </td>
                  <td className="py-3 pr-2 font-mono font-medium text-[#8C3B2E]">{item.horaDeseada}</td>
                  <td className="py-3 pr-2 text-[#7A7268]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C77B21]" />
                      {item.tiempoEsperaMin} min
                    </span>
                  </td>
                  <td className="py-3 pr-2">
                    {item.estado === 'esperando' && (
                      <span className="bg-[#FDF5EA] text-[#C77B21] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#F3E2C8]">
                        Esperando
                      </span>
                    )}
                    {item.estado === 'notificado' && (
                      <span className="bg-[#EBF8FF] text-[#2B6CB0] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#BEE3F8]">
                        Notificado WhatsApp
                      </span>
                    )}
                    {item.estado === 'asignado' && (
                      <span className="bg-[#EDF7F0] text-[#2D7A46] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#C6E9D0]">
                        Mesa Asignada
                      </span>
                    )}
                    {item.estado === 'cancelado' && (
                      <span className="bg-[#EFECE6] text-[#6B635B] px-2 py-0.5 rounded-full text-[10px] font-medium">
                        Cancelado
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.estado !== 'asignado' && item.estado !== 'cancelado' && (
                        <>
                          <button
                            onClick={() => handleNotifyWaitlist(item)}
                            className="bg-[#2D7A46] hover:bg-[#236137] text-white text-[11px] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <Send className="w-3 h-3" />
                            Avisar por WhatsApp
                          </button>

                          <button
                            onClick={() => handleAssignTable(item)}
                            className="bg-[#8C3B2E] hover:bg-[#6E2C22] text-white text-[11px] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Asignar Mesa
                          </button>
                        </>
                      )}

                      {item.estado !== 'cancelado' && (
                        <button
                          onClick={() => cambiarEstadoListaEspera(item.id, 'cancelado')}
                          title="Cancelar solicitud"
                          className="p-1 hover:bg-[#F8ECE9] text-[#8C3B2E] rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Add Waitlist Item */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl max-w-md w-full p-6 border border-[#E5DEC3] shadow-xl relative animate-in fade-in zoom-in-95">
            <h3 className="font-serif font-bold text-lg text-[#2C2421] mb-1">
              Añadir Cliente a Lista de Espera
            </h3>
            <p className="text-xs text-[#7A7268] mb-4">
              Registra un cliente en puerta para enviarle aviso automático por WhatsApp en cuanto se libere una mesa.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A423A] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Maria Torres"
                  value={formData.clienteNombre}
                  onChange={(e) => setFormData({ ...formData, clienteNombre: e.target.value })}
                  className="w-full bg-white border border-[#D9D2C7] rounded-xl px-3 py-2 text-xs text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#8C3B2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A423A] mb-1">Teléfono (WhatsApp)</label>
                  <input
                    type="text"
                    required
                    placeholder="+34 600 112 233"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full bg-white border border-[#D9D2C7] rounded-xl px-3 py-2 text-xs text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#8C3B2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A423A] mb-1">Comensales (Pax)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.comensales}
                    onChange={(e) => setFormData({ ...formData, comensales: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D9D2C7] rounded-xl px-3 py-2 text-xs text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#8C3B2E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A423A] mb-1">Hora Deseada</label>
                <input
                  type="text"
                  required
                  placeholder="21:30"
                  value={formData.horaDeseada}
                  onChange={(e) => setFormData({ ...formData, horaDeseada: e.target.value })}
                  className="w-full bg-white border border-[#D9D2C7] rounded-xl px-3 py-2 text-xs text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#8C3B2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A423A] mb-1">Notas / Preferencias</label>
                <input
                  type="text"
                  placeholder="ej. Prefiere terraza o zona tranquila"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  className="w-full bg-white border border-[#D9D2C7] rounded-xl px-3 py-2 text-xs text-[#2C2421] focus:outline-none focus:ring-2 focus:ring-[#8C3B2E]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B635B] hover:bg-[#EFECE6] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#8C3B2E] hover:bg-[#6E2C22] text-white transition-colors cursor-pointer shadow-xs"
                >
                  Añadir a Lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
