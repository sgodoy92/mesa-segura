export type EstadoReserva = 'pendiente' | 'confirmada' | 'riesgo' | 'liberada' | 'recuperada' | 'cambiada';

export interface Reserva {
  id: string;
  clienteNombre: string;
  telefono: string;
  comensales: number;
  hora: string;
  fecha: string; // e.g. "Hoy, 21:30" or "2026-07-26"
  mesa?: string;
  estado: EstadoReserva;
  ultimoMensaje: string;
  horaUltimoMensaje: string;
  fianzaAntiNoShow?: boolean;
  montoFianza?: number;
  notas?: string;
}

export interface Mensaje {
  id: string;
  reservaId: string;
  remitente: 'bot' | 'cliente' | 'restaurante';
  texto: string;
  timestamp: string;
  estadoLectura?: 'enviado' | 'entregado' | 'leido';
  opcionesAccion?: string[]; // E.g., ['1. Confirmar Asistencia', '2. Modificar Hora', '3. Cancelar']
}

export interface KpiData {
  totalReservas: number;
  totalConfirmadas: number;
  enRiesgo: number;
  recuperadas: number;
  tasaAntiNoShow: string; // e.g. "94.2%"
  montoProtegido: string; // e.g. "1.280 €"
}

export interface HorarioDia {
  dia: string;
  abierto: boolean;
  comidas: string;
  cenas: string;
}

export interface MesasCapacidad {
  pax2: number;
  pax4: number;
  pax6: number;
}

export interface PlantillasMensaje {
  confirmacionT24: string;
  recordatorioT4: string;
  ofertaListaEspera: string;
}

export interface Configuracion {
  nombreLocal: string;
  telefono: string;
  ticketMedio: number;
  horarios: HorarioDia[];
  mesas: MesasCapacidad;
  plantillas: PlantillasMensaje;
}
