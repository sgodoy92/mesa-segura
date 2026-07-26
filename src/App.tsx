import React, { useState } from 'react';
import { ReservaProvider, useReservas } from './context/ReservaContext';
import { KpiCard } from './components/KpiCard';
import { ReservaRow } from './components/ReservaRow';
import { PhonePanel } from './components/PhonePanel';
import { ListaEspera } from './components/ListaEspera';
import { ConfiguracionView } from './components/ConfiguracionView';
import { EstadoReserva } from './types';
import {
  ShieldAlert,
  CalendarCheck2,
  Users,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  MessageCircle,
  Shield,
  UtensilsCrossed,
  RotateCw,
  SlidersHorizontal,
  LayoutDashboard,
  Settings
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const {
    reservas,
    selectedReservaId,
    setSelectedReservaId,
    kpis,
    loadingReservas,
    loadingKpis,
    filterEstado,
    setFilterEstado,
    cambiarEstadoReserva,
    refreshAll,
    configuracion
  } = useReservas();

  const [activeTab, setActiveTab] = useState<'reservas' | 'configuracion'>('reservas');

  // Filter reservations based on active filterEstado tab
  const reservasFiltradas = reservas.filter((res) => {
    if (filterEstado === 'todas') return true;
    return res.estado === filterEstado;
  });

  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#2C2421] font-sans p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E0D8CA]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#8C3B2E] text-[#F6F2EA] flex items-center justify-center shadow-md shrink-0">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C2421]">
                {configuracion?.nombreLocal || 'Mesa Segura'}
              </h1>
              <span className="bg-[#8C3B2E]/10 text-[#8C3B2E] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#8C3B2E]/20 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Anti No-Show
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#7A7268] mt-0.5 font-normal">
              Panel Inteligente de Confirmación y Liberación de Mesas vía WhatsApp
            </p>
          </div>
        </div>

        {/* Right header actions & status */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-[#FAF8F5] border border-[#E5DEC3] rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-[#2C2421]">WhatsApp Bot:</span>
            <span className="text-[#2D7A46] font-medium">Activo</span>
          </div>

          <button
            onClick={() => refreshAll()}
            title="Recargar datos de la API"
            className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#E5DEC3] text-[#6B635B] transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="bg-[#8C3B2E] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5">
            <CalendarCheck2 className="w-4 h-4" />
            <span>Servicio de Noche</span>
          </div>
        </div>
      </header>

      {/* Main Header Tabs: Panel de Reservas vs Configuración */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#E0D8CA] pb-2">
        <button
          onClick={() => setActiveTab('reservas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'reservas'
              ? 'bg-[#8C3B2E] text-white shadow-sm'
              : 'bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#6B635B] border border-[#E5DEC3]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Panel de Reservas & WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('configuracion')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'configuracion'
              ? 'bg-[#8C3B2E] text-white shadow-sm'
              : 'bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#6B635B] border border-[#E5DEC3]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configuración del Local</span>
        </button>
      </div>

      {activeTab === 'configuracion' ? (
        <ConfiguracionView />
      ) : (
        <>
          {/* 4 KPIs Top Row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard
              titulo="Total Reservas Hoy"
              valor={loadingKpis ? '...' : kpis?.totalReservas || 0}
              subtitulo="Servicio de cena (19:30 - 23:30)"
              icon={<CalendarCheck2 className="w-5 h-5" />}
              variant="crema"
              badgeText="Hoy"
            />

            <KpiCard
              titulo="Confirmadas Anti No-Show"
              valor={loadingKpis ? '...' : kpis?.totalConfirmadas || 0}
              subtitulo="Con fianza o respuesta SÍ por WhatsApp"
              icon={<CheckCircle className="w-5 h-5 text-[#2D7A46]" />}
              variant="verde"
              badgeText={kpis?.tasaAntiNoShow || '0%'}
            />

            <KpiCard
              titulo="Mesas en Riesgo"
              valor={loadingKpis ? '...' : kpis?.enRiesgo || 0}
              subtitulo="Sin confirmación < 45m del servicio"
              icon={<AlertTriangle className="w-5 h-5 text-[#8C3B2E]" />}
              variant="granate"
              badgeText="Atención requerida"
            />

            <KpiCard
              titulo="Ingreso Protegido"
              valor={loadingKpis ? '...' : kpis?.montoProtegido || '0 €'}
              subtitulo="Fianzas cobradas + No-shows evitados"
              icon={<Shield className="w-5 h-5 text-[#C77B21]" />}
              variant="ambar"
              badgeText="Garantizado"
            />
          </section>

          {/* Main Grid: Left Reservations List, Right WhatsApp Phone Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: List of Reservations */}
            <div className="lg:col-span-7 bg-[#FAF8F5] rounded-2xl border border-[#E5DEC3] p-4 sm:p-5 shadow-xs flex flex-col h-[740px]">
              {/* Section Header & Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E8E2D8]">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#2C2421]">
                    Listado de Reservas
                  </h2>
                  <p className="text-xs text-[#7A7268]">
                    Selecciona una reserva para interactuar vía WhatsApp a la derecha.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full pb-1">
                  {(['todas', 'pendiente', 'confirmada', 'riesgo', 'recuperada', 'liberada', 'cambiada'] as const).map(
                    (st) => {
                      const isActive = filterEstado === st;
                      return (
                        <button
                          key={st}
                          onClick={() => setFilterEstado(st)}
                          className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-all shrink-0 cursor-pointer ${
                            isActive
                              ? 'bg-[#8C3B2E] text-white font-semibold shadow-xs'
                              : 'bg-[#F0EAE1] hover:bg-[#E8E2D8] text-[#5A524A]'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Reservations List Scrollable Container */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
                {loadingReservas ? (
                  <div className="flex items-center justify-center h-full text-xs text-[#7A7268] gap-2">
                    <RotateCw className="w-4 h-4 animate-spin text-[#8C3B2E]" />
                    Cargando reservas desde mockApi...
                  </div>
                ) : reservasFiltradas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center text-xs text-[#8A8278]">
                    <p>No hay reservas con el estado "{filterEstado}".</p>
                    <button
                      onClick={() => setFilterEstado('todas')}
                      className="mt-2 text-[#8C3B2E] font-semibold underline cursor-pointer"
                    >
                      Ver todas las reservas
                    </button>
                  </div>
                ) : (
                  reservasFiltradas.map((res) => (
                    <ReservaRow
                      key={res.id}
                      reserva={res}
                      isSelected={res.id === selectedReservaId}
                      onSelect={() => setSelectedReservaId(res.id)}
                      onCambiarEstado={cambiarEstadoReserva}
                    />
                  ))
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: WhatsApp Phone Panel Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <PhonePanel />
            </div>
          </div>

          {/* BOTTOM SECTION: Lista de Espera */}
          <section className="mt-8">
            <ListaEspera />
          </section>
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ReservaProvider>
      <DashboardContent />
    </ReservaProvider>
  );
}
