import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Reserva, Mensaje, KpiData, ListaEsperaItem, EstadoReserva, Configuracion } from '../types';
import {
  getReservas,
  getMensajes,
  getKpis,
  getListaEspera,
  getConfiguracion,
  updateConfiguracion,
  updateReservaEstado,
  enviarMensajeMock,
  addWaitlistEntry,
  updateWaitlistEstado
} from '../data/mockApi';

interface ReservaContextType {
  reservas: Reserva[];
  selectedReservaId: string;
  selectedReserva: Reserva | undefined;
  mensajes: Mensaje[];
  kpis: KpiData | null;
  listaEspera: ListaEsperaItem[];
  configuracion: Configuracion | null;
  loadingReservas: boolean;
  loadingMensajes: boolean;
  loadingKpis: boolean;
  loadingEspera: boolean;
  loadingConfiguracion: boolean;
  filterEstado: EstadoReserva | 'todas';
  setFilterEstado: (estado: EstadoReserva | 'todas') => void;
  setSelectedReservaId: (id: string) => void;
  cambiarEstadoReserva: (reservaId: string, estado: EstadoReserva) => Promise<void>;
  enviarMensaje: (reservaId: string, texto: string) => Promise<void>;
  agregarListaEspera: (item: Omit<ListaEsperaItem, 'id' | 'estado' | 'tiempoEsperaMin'>) => Promise<void>;
  cambiarEstadoListaEspera: (id: string, estado: ListaEsperaItem['estado']) => Promise<void>;
  guardarConfiguracion: (nuevaConfig: Configuracion) => Promise<void>;
  refreshAll: () => Promise<void>;
}

const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

export const ReservaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [selectedReservaId, setSelectedReservaId] = useState<string>('res-101');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [listaEspera, setListaEspera] = useState<ListaEsperaItem[]>([]);
  const [configuracion, setConfiguracion] = useState<Configuracion | null>(null);
  const [filterEstado, setFilterEstado] = useState<EstadoReserva | 'todas'>('todas');

  const [loadingReservas, setLoadingReservas] = useState<boolean>(true);
  const [loadingMensajes, setLoadingMensajes] = useState<boolean>(false);
  const [loadingKpis, setLoadingKpis] = useState<boolean>(true);
  const [loadingEspera, setLoadingEspera] = useState<boolean>(true);
  const [loadingConfiguracion, setLoadingConfiguracion] = useState<boolean>(true);

  // Fetch initial reservations, KPIs, and configuration
  const loadInitialData = useCallback(async () => {
    setLoadingReservas(true);
    setLoadingKpis(true);
    setLoadingEspera(true);
    setLoadingConfiguracion(true);

    try {
      const [resData, kpiData, waitData, configData] = await Promise.all([
        getReservas(),
        getKpis(),
        getListaEspera(),
        getConfiguracion()
      ]);
      setReservas(resData);
      setKpis(kpiData);
      setListaEspera(waitData);
      setConfiguracion(configData);

      if (resData.length > 0 && !selectedReservaId) {
        setSelectedReservaId(resData[0].id);
      }
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    } finally {
      setLoadingReservas(false);
      setLoadingKpis(false);
      setLoadingEspera(false);
      setLoadingConfiguracion(false);
    }
  }, [selectedReservaId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load messages when selectedReservaId changes
  useEffect(() => {
    if (!selectedReservaId) return;

    let isMounted = true;
    setLoadingMensajes(true);

    getMensajes(selectedReservaId)
      .then((msjs) => {
        if (isMounted) {
          setMensajes(msjs);
        }
      })
      .catch((err) => {
        console.error('Error cargando mensajes:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoadingMensajes(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedReservaId]);

  const selectedReserva = reservas.find((r) => r.id === selectedReservaId);

  // Actions
  const cambiarEstadoReserva = async (reservaId: string, nuevoEstado: EstadoReserva) => {
    try {
      const updated = await updateReservaEstado(reservaId, nuevoEstado);
      setReservas((prev) => prev.map((r) => (r.id === reservaId ? updated : r)));
      
      // Also update KPIs
      const updatedKpis = await getKpis();
      setKpis(updatedKpis);

      // Auto-post a system bot notification message in chat
      await enviarMensajeMock(
        reservaId,
        `📌 Estado de la reserva actualizado a: ${nuevoEstado.toUpperCase()}`,
        'bot'
      );
      const updatedMsgs = await getMensajes(reservaId);
      if (selectedReservaId === reservaId) {
        setMensajes(updatedMsgs);
      }
    } catch (error) {
      console.error('Error al cambiar estado de reserva:', error);
    }
  };

  const enviarMensaje = async (reservaId: string, texto: string) => {
    if (!texto.trim()) return;
    try {
      await enviarMensajeMock(reservaId, texto, 'restaurante');
      const updatedMsgs = await getMensajes(reservaId);
      setMensajes(updatedMsgs);

      // Refresh reservas list to reflect last message
      const resData = await getReservas();
      setReservas(resData);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const agregarListaEspera = async (item: Omit<ListaEsperaItem, 'id' | 'estado' | 'tiempoEsperaMin'>) => {
    setLoadingEspera(true);
    try {
      await addWaitlistEntry(item);
      const updatedList = await getListaEspera();
      setListaEspera(updatedList);
    } catch (error) {
      console.error('Error añadiendo a lista de espera:', error);
    } finally {
      setLoadingEspera(false);
    }
  };

  const cambiarEstadoListaEspera = async (id: string, nuevoEstado: ListaEsperaItem['estado']) => {
    try {
      await updateWaitlistEstado(id, nuevoEstado);
      const updatedList = await getListaEspera();
      setListaEspera(updatedList);
    } catch (error) {
      console.error('Error actualizando lista de espera:', error);
    }
  };

  const guardarConfiguracion = async (nuevaConfig: Configuracion) => {
    setLoadingConfiguracion(true);
    try {
      const saved = await updateConfiguracion(nuevaConfig);
      setConfiguracion(saved);
    } catch (error) {
      console.error('Error guardando configuración:', error);
    } finally {
      setLoadingConfiguracion(false);
    }
  };

  const refreshAll = async () => {
    await loadInitialData();
    if (selectedReservaId) {
      const msgs = await getMensajes(selectedReservaId);
      setMensajes(msgs);
    }
  };

  return (
    <ReservaContext.Provider
      value={{
        reservas,
        selectedReservaId,
        selectedReserva,
        mensajes,
        kpis,
        listaEspera,
        configuracion,
        loadingReservas,
        loadingMensajes,
        loadingKpis,
        loadingEspera,
        loadingConfiguracion,
        filterEstado,
        setFilterEstado,
        setSelectedReservaId,
        cambiarEstadoReserva,
        enviarMensaje,
        agregarListaEspera,
        cambiarEstadoListaEspera,
        guardarConfiguracion,
        refreshAll
      }}
    >
      {children}
    </ReservaContext.Provider>
  );
};

export const useReservas = () => {
  const context = useContext(ReservaContext);
  if (!context) {
    throw new Error('useReservas debe ser usado dentro de un ReservaProvider');
  }
  return context;
};
