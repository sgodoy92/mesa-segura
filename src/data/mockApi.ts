import { Reserva, Mensaje, KpiData, ListaEsperaItem, EstadoReserva, Configuracion } from '../types';

const DELAY_MS = 300;

let mockConfiguracion: Configuracion = {
  nombreLocal: 'Restaurante El Asador',
  telefono: '+34 912 345 678',
  ticketMedio: 45,
  horarios: [
    { dia: 'Lunes', abierto: false, comidas: 'Cerrado', cenas: 'Cerrado' },
    { dia: 'Martes', abierto: true, comidas: '13:30 - 16:00', cenas: '20:30 - 23:30' },
    { dia: 'Miércoles', abierto: true, comidas: '13:30 - 16:00', cenas: '20:30 - 23:30' },
    { dia: 'Jueves', abierto: true, comidas: '13:30 - 16:00', cenas: '20:30 - 23:30' },
    { dia: 'Viernes', abierto: true, comidas: '13:30 - 16:00', cenas: '20:30 - 00:00' },
    { dia: 'Sábado', abierto: true, comidas: '13:30 - 16:30', cenas: '20:30 - 00:00' },
    { dia: 'Domingo', abierto: true, comidas: '13:30 - 16:30', cenas: 'Cerrado' }
  ],
  mesas: {
    pax2: 8,
    pax4: 10,
    pax6: 4
  },
  plantillas: {
    confirmacionT24: 'Hola {nombre}, te recordamos tu reserva mañana a las {hora} para {pax} personas en nuestro restaurante. Por favor, confirma tu asistencia pulsando el botón a continuación para garantizar tu mesa.',
    recordatorioT4: '⚠️ Hola {nombre}, tu reserva es hoy a las {hora} ({pax} pax). Nos quedan pocas mesas disponibles. Por favor responde 1 para CONFIRMAR o 2 para LIBERAR tu mesa si no vas a venir.',
    ofertaListaEspera: '🎉 ¡Buenas noticias {nombre}! Se ha liberado una mesa de {pax} personas a las {hora}. Si la deseas, confirma en los próximos 10 minutos.'
  }
};

// Internal mock dataset
let mockReservas: Reserva[] = [
  {
    id: 'res-101',
    clienteNombre: 'Carlos Mendoza',
    telefono: '+34 612 345 678',
    comensales: 4,
    hora: '21:30',
    fecha: 'Hoy',
    mesa: 'Mesa 12 (Interior)',
    estado: 'confirmada',
    ultimoMensaje: '¡Perfecto! Confirmo nuestra mesa de 4 personas para las 21:30.',
    horaUltimoMensaje: '20:14',
    fianzaAntiNoShow: true,
    montoFianza: 20,
    notas: 'Alergia a mariscos. Cumpleaños de su pareja.'
  },
  {
    id: 'res-102',
    clienteNombre: 'Laura Gómez',
    telefono: '+34 689 112 233',
    comensales: 2,
    hora: '22:00',
    fecha: 'Hoy',
    mesa: 'Mesa 05 (Terraza)',
    estado: 'riesgo',
    ultimoMensaje: '⚠️ Recordatorio: Tu reserva vence en 30 min. Responde 1 para confirmar o 2 para liberar.',
    horaUltimoMensaje: '20:45',
    fianzaAntiNoShow: false,
    montoFianza: 0,
    notas: 'Solicitó mesa en zona tranquila.'
  },
  {
    id: 'res-103',
    clienteNombre: 'Javier Martínez',
    telefono: '+34 655 443 322',
    comensales: 6,
    hora: '21:00',
    fecha: 'Hoy',
    mesa: 'Mesa 02 (VIP)',
    estado: 'recuperada',
    ultimoMensaje: '¡Disculpa el retraso! Tuvimos tráfico pero ya estamos aparcando. ¡Llegamos!',
    horaUltimoMensaje: '20:58',
    fianzaAntiNoShow: true,
    montoFianza: 30,
    notas: 'Mesa de negocios. Vino tinto reserva.'
  },
  {
    id: 'res-104',
    clienteNombre: 'Elena Sanchís',
    telefono: '+34 677 889 900',
    comensales: 3,
    hora: '22:15',
    fecha: 'Hoy',
    mesa: 'Mesa 08 (Interior)',
    estado: 'pendiente',
    ultimoMensaje: 'Hola Elena, enviamos enlace de pre-confirmación anti no-show para tu reserva.',
    horaUltimoMensaje: '19:30',
    fianzaAntiNoShow: false,
    montoFianza: 0,
    notas: 'Primera visita al restaurante.'
  },
  {
    id: 'res-105',
    clienteNombre: 'Pablo Alarcón',
    telefono: '+34 633 221 100',
    comensales: 5,
    hora: '20:30',
    fecha: 'Hoy',
    mesa: 'Mesa 04 (Terraza)',
    estado: 'liberada',
    ultimoMensaje: 'Lamentablemente se me complicó el trabajo. Cancelo para que dispongáis de la mesa.',
    horaUltimoMensaje: '19:10',
    fianzaAntiNoShow: false,
    montoFianza: 0,
    notas: 'Mesa liberada a las 19:10. Reasignada a lista de espera.'
  },
  {
    id: 'res-106',
    clienteNombre: 'Sofía Ruiz',
    telefono: '+34 600 776 554',
    comensales: 2,
    hora: '22:00',
    fecha: 'Hoy',
    mesa: 'Mesa 09 (Barra)',
    estado: 'cambiada',
    ultimoMensaje: 'Modificado con éxito: Nueva hora 22:00 para 2 comensales.',
    horaUltimoMensaje: '18:50',
    fianzaAntiNoShow: true,
    montoFianza: 10,
    notas: 'Cambio de hora de 21:00 a 22:00 realizado por WhatsApp.'
  }
];

let mockMensajes: Record<string, Mensaje[]> = {
  'res-101': [
    {
      id: 'm-1',
      reservaId: 'res-101',
      remitente: 'bot',
      texto: '👋 ¡Hola Carlos! Te saludamos de Restaurante El Asador. Tienes una reserva hoy a las 21:30 para 4 personas.',
      timestamp: '12:00',
      estadoLectura: 'leido'
    },
    {
      id: 'm-2',
      reservaId: 'res-101',
      remitente: 'bot',
      texto: '🛡️ Para garantizar tu mesa y evitar cancelaciones de última hora, pulsa el botón para confirmar asistencia.',
      timestamp: '12:01',
      estadoLectura: 'leido',
      opcionesAccion: ['✅ Confirmar Asistencia', '✏️ Cambiar Hora/Pax', '❌ Cancelar']
    },
    {
      id: 'm-3',
      reservaId: 'res-101',
      remitente: 'cliente',
      texto: '✅ Confirmar Asistencia',
      timestamp: '20:12',
      estadoLectura: 'leido'
    },
    {
      id: 'm-4',
      reservaId: 'res-101',
      remitente: 'bot',
      texto: '🎉 ¡Reserva confirmada con éxito! Tu Mesa 12 te estará esperando a las 21:30. ¡Buen provecho!',
      timestamp: '20:13',
      estadoLectura: 'leido'
    },
    {
      id: 'm-5',
      reservaId: 'res-101',
      remitente: 'cliente',
      texto: '¡Perfecto! Confirmo nuestra mesa de 4 personas para las 21:30. Muchas gracias.',
      timestamp: '20:14',
      estadoLectura: 'leido'
    }
  ],

  'res-102': [
    {
      id: 'm-10',
      reservaId: 'res-102',
      remitente: 'bot',
      texto: 'Hola Laura 👋 Recordatorio de tu reserva hoy a las 22:00 (2 comensales).',
      timestamp: '18:00',
      estadoLectura: 'leido'
    },
    {
      id: 'm-11',
      reservaId: 'res-102',
      remitente: 'bot',
      texto: '⏰ Faltan 45 minutos y tu mesa aún no está confirmada. Si no puedes asistir, por favor infórmanos para reasignarla.',
      timestamp: '20:15',
      estadoLectura: 'leido',
      opcionesAccion: ['1. Confirmar Asistencia', '2. Liberar Mesa']
    },
    {
      id: 'm-12',
      reservaId: 'res-102',
      remitente: 'bot',
      texto: '⚠️ Recordatorio: Tu reserva vence en 30 min. Responde 1 para confirmar o 2 para liberar.',
      timestamp: '20:45',
      estadoLectura: 'entregado'
    }
  ],

  'res-103': [
    {
      id: 'm-20',
      reservaId: 'res-103',
      remitente: 'bot',
      texto: 'Hola Javier, recordatorio de tu reserva VIP a las 21:00 para 6 personas.',
      timestamp: '19:00',
      estadoLectura: 'leido'
    },
    {
      id: 'm-21',
      reservaId: 'res-103',
      remitente: 'bot',
      texto: '🚨 Tu reserva sobrepasó el margen de 15 minutos sin confirmación. Tu mesa pasará a lista de espera pronto.',
      timestamp: '20:40',
      estadoLectura: 'leido'
    },
    {
      id: 'm-22',
      reservaId: 'res-103',
      remitente: 'cliente',
      texto: '¡Disculpa el retraso! Tuvimos tráfico pero ya estamos aparcando. ¡Llegamos en 5 min, mantened la mesa!',
      timestamp: '20:58',
      estadoLectura: 'leido'
    },
    {
      id: 'm-23',
      reservaId: 'res-103',
      remitente: 'restaurante',
      texto: 'Entendido Javier, mantenemos la Mesa 02 reservada. ¡Buen viaje!',
      timestamp: '20:59',
      estadoLectura: 'leido'
    }
  ],

  'res-104': [
    {
      id: 'm-30',
      reservaId: 'res-104',
      remitente: 'bot',
      texto: 'Hola Elena 🍷 Gracias por reservar con nosotros para las 22:15 (3 personas).',
      timestamp: '19:30',
      estadoLectura: 'leido'
    },
    {
      id: 'm-31',
      reservaId: 'res-104',
      remitente: 'bot',
      texto: 'Por favor confirma tu asistencia haciendo clic abajo para asegurar la mesa.',
      timestamp: '19:30',
      estadoLectura: 'leido',
      opcionesAccion: [' Confirmar Ahora']
    }
  ],

  'res-105': [
    {
      id: 'm-40',
      reservaId: 'res-105',
      remitente: 'bot',
      texto: 'Hola Pablo, recordatorio de tu mesa a las 20:30 para 5 personas.',
      timestamp: '18:30',
      estadoLectura: 'leido'
    },
    {
      id: 'm-41',
      reservaId: 'res-105',
      remitente: 'cliente',
      texto: 'Lamentablemente se me complicó el trabajo. Cancelo para que dispongáis de la mesa.',
      timestamp: '19:10',
      estadoLectura: 'leido'
    },
    {
      id: 'm-42',
      reservaId: 'res-105',
      remitente: 'bot',
      texto: 'Gracias por avisar con tiempo, Pablo. Hemos liberado tu mesa y te esperamos en otra ocasión.',
      timestamp: '19:11',
      estadoLectura: 'leido'
    }
  ],

  'res-106': [
    {
      id: 'm-50',
      reservaId: 'res-106',
      remitente: 'cliente',
      texto: 'Hola, ¿podemos pasar la reserva de las 21:00 a las 22:00? Somos 2 personas.',
      timestamp: '18:45',
      estadoLectura: 'leido'
    },
    {
      id: 'm-51',
      reservaId: 'res-106',
      remitente: 'bot',
      texto: 'Modificado con éxito: Nueva hora 22:00 para 2 comensales en Mesa 09. Fianza mantenida.',
      timestamp: '18:50',
      estadoLectura: 'leido'
    }
  ]
};

let mockListaEspera: ListaEsperaItem[] = [
  {
    id: 'w-1',
    clienteNombre: 'Ana Belén Rodríguez',
    telefono: '+34 644 112 334',
    comensales: 4,
    horaDeseada: '21:30',
    tiempoEsperaMin: 15,
    notas: 'Prefiere terraza si se libera.',
    estado: 'esperando'
  },
  {
    id: 'w-2',
    clienteNombre: 'Marcos Fernández',
    telefono: '+34 611 998 877',
    comensales: 2,
    horaDeseada: '22:00',
    tiempoEsperaMin: 25,
    notas: 'Dispuesto a sentarse en barra.',
    estado: 'notificado'
  },
  {
    id: 'w-3',
    clienteNombre: 'Lucía Serrano',
    telefono: '+34 699 554 433',
    comensales: 6,
    horaDeseada: '21:15',
    tiempoEsperaMin: 5,
    notas: 'Celebración familiar.',
    estado: 'esperando'
  }
];

// Async function 1: getReservas()
export async function getReservas(): Promise<Reserva[]> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  return [...mockReservas];
}

// Async function 2: getMensajes(reservaId)
export async function getMensajes(reservaId: string): Promise<Mensaje[]> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  return mockMensajes[reservaId] ? [...mockMensajes[reservaId]] : [];
}

// Async function 3: getKpis()
export async function getKpis(): Promise<KpiData> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  
  const totalReservas = mockReservas.length;
  const totalConfirmadas = mockReservas.filter((r) => r.estado === 'confirmada' || r.estado === 'recuperada').length;
  const enRiesgo = mockReservas.filter((r) => r.estado === 'riesgo').length;
  const recuperadas = mockReservas.filter((r) => r.estado === 'recuperada').length;
  const liberadas = mockReservas.filter((r) => r.estado === 'liberada').length;
  
  const tasa = totalReservas > 0 ? ((totalConfirmadas / totalReservas) * 100).toFixed(1) + '%' : '0%';
  const sumaFianzas = mockReservas.reduce((acc, curr) => acc + (curr.montoFianza || 0), 0) + (recuperadas * 45);

  return {
    totalReservas,
    totalConfirmadas,
    enRiesgo,
    recuperadas,
    tasaAntiNoShow: tasa,
    montoProtegido: `${sumaFianzas + 340} €`
  };
}

// Additional helpers for simulated interactivity
export async function getListaEspera(): Promise<ListaEsperaItem[]> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  return [...mockListaEspera];
}

export async function updateReservaEstado(reservaId: string, nuevoEstado: EstadoReserva): Promise<Reserva> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  const idx = mockReservas.findIndex((r) => r.id === reservaId);
  if (idx !== -1) {
    mockReservas[idx] = { ...mockReservas[idx], estado: nuevoEstado };
    return mockReservas[idx];
  }
  throw new Error('Reserva no encontrada');
}

export async function enviarMensajeMock(reservaId: string, texto: string, remitente: 'restaurante' | 'bot' = 'restaurante'): Promise<Mensaje> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  const nuevoMensaje: Mensaje = {
    id: `m-${Date.now()}`,
    reservaId,
    remitente,
    texto,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    estadoLectura: 'enviado'
  };

  if (!mockMensajes[reservaId]) {
    mockMensajes[reservaId] = [];
  }
  mockMensajes[reservaId].push(nuevoMensaje);

  // Update ultimoMensaje in Reserva
  const idx = mockReservas.findIndex((r) => r.id === reservaId);
  if (idx !== -1) {
    mockReservas[idx] = {
      ...mockReservas[idx],
      ultimoMensaje: texto,
      horaUltimoMensaje: nuevoMensaje.timestamp
    };
  }

  return nuevoMensaje;
}

export async function addWaitlistEntry(entry: Omit<ListaEsperaItem, 'id' | 'estado' | 'tiempoEsperaMin'>): Promise<ListaEsperaItem> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  const newEntry: ListaEsperaItem = {
    ...entry,
    id: `w-${Date.now()}`,
    tiempoEsperaMin: 1,
    estado: 'esperando'
  };
  mockListaEspera.push(newEntry);
  return newEntry;
}

export async function updateWaitlistEstado(id: string, nuevoEstado: ListaEsperaItem['estado']): Promise<ListaEsperaItem> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  const idx = mockListaEspera.findIndex((w) => w.id === id);
  if (idx !== -1) {
    mockListaEspera[idx] = { ...mockListaEspera[idx], estado: nuevoEstado };
    return mockListaEspera[idx];
  }
  throw new Error('Elemento de lista de espera no encontrado');
}

export async function getConfiguracion(): Promise<Configuracion> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  return { ...mockConfiguracion };
}

export async function updateConfiguracion(nuevaConfig: Configuracion): Promise<Configuracion> {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  mockConfiguracion = { ...nuevaConfig };
  return { ...mockConfiguracion };
}
