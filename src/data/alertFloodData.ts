/**
 * Master Seed Data for 312 Signals Alert Flood & Correlation Engine
 * Conforming to PRD Scene 2 & 3, FLD-01 to FLD-08.
 */

export interface RawSignal {
  id: string;
  timestamp: string;
  sourceId: string;
  sourceName: string;
  sourceType: 'telemetry' | 'scada' | 'cctv' | 'passenger_report' | 'social_media' | 'panel_sensor';
  location: string;
  lineCode?: string;
  severityHint: 'critical' | 'high' | 'medium' | 'low';
  rawText: string;
  isDuplicate: boolean;
  isFlapping: boolean;
  isPlannedWork: boolean;
  clusterId?: string;
}

export interface UniqueAlert {
  id: string;
  sourceType: string;
  sourceName: string;
  timestamp: string;
  location: string;
  headline: string;
  signalCount: number;
  weight: number; // 0 to 100 for explain-why
  clusterId: string;
}

export interface AlertCluster {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium';
  primaryLocation: string;
  affectedCorridor: string;
  uniqueAlertCount: number;
  rawSignalCount: number;
  confidenceScore: number; // 0 to 100
  reasoningEs: string;
  reasoningEn: string;
  signalsWeights: { signalName: string; weight: number; source: string; time: string }[];
  promotedToCaseId?: string;
}

// 3 Clusters resulting from correlation
export const SEEDED_CLUSTERS: AlertCluster[] = [
  {
    id: 'cluster-catenary-atocha',
    name: 'Fallo de Tensión de Tracción en Catenaria (Atocha Vías 3-4)',
    severity: 'critical',
    primaryLocation: 'Estación Central Atocha Cercanías (Subterráneo)',
    affectedCorridor: 'Corredores C-3, C-4, C-5 y enlace Sur',
    uniqueAlertCount: 35,
    rawSignalCount: 280,
    confidenceScore: 96,
    reasoningEs:
      'Caída sincrónica de tensión a 420V reportada por SCADA Renfe (N03), confirmada por 3 subestaciones eléctricas contiguas, telemetría de 4 convoyes serie 465 detenidos y 230 alarmas de tracción simultáneas.',
    reasoningEn:
      'Synchronous voltage loss to 420V reported by Renfe SCADA (N03), confirmed by 3 electrical substations, telemetry from 4 halted series-465 trains, and 230 concurrent traction alarms.',
    signalsWeights: [
      { signalName: 'Subestación Atocha-Sur: Disparo de disyuntor 3.000V DC', weight: 42, source: 'N03 Adif/Renfe SCADA', time: '08:38:12' },
      { signalName: 'Telemetría Convoy 465-021: Tensión de pantógrafo 0V', weight: 28, source: 'N06 Telemetría On-Board', time: '08:38:14' },
      { signalName: 'Bloqueo automático de cantón Atocha-Villaverde Bajo', weight: 18, source: 'N03 Señalización', time: '08:38:20' },
      { signalName: 'Cámara CCTV CAM-ATO-04: Arco eléctrico detectado', weight: 12, source: 'N10 Visión por Computador', time: '08:38:22' },
    ],
    promotedToCaseId: 'INC-2026-0929-ATO',
  },
  {
    id: 'cluster-crowd-atocha',
    name: 'Aglomeración y Retención de Pasaje en Andenes Subterráneos',
    severity: 'high',
    primaryLocation: 'Atocha Cercanías · Andenes 3, 4 y 5',
    affectedCorridor: 'Intercambiador Atocha',
    uniqueAlertCount: 4,
    rawSignalCount: 24,
    confidenceScore: 88,
    reasoningEs:
      'Aumento repentino de densidad de viajeros (+45% sobre aforo de confort) detectado por sensores torniquetes ABT (N12) y análisis de densidad óptica CCTV.',
    reasoningEn:
      'Sudden passenger accumulation surge (+45% above comfort threshold) detected by ABT turnstiles (N12) and CCTV optical density analysis.',
    signalsWeights: [
      { signalName: 'Sensores de aforo andén 3: Ocupación 88%', weight: 45, source: 'N09 Gestor Intercambiador', time: '08:39:05' },
      { signalName: 'Validaciones de torniquetes ABT sin desalojo', weight: 30, source: 'N12 Ticketing ABT', time: '08:39:15' },
      { signalName: 'Escucha social: Picos de menciones #AtochaRetrasos', weight: 25, source: 'N17 Redes Sociales', time: '08:39:40' },
    ],
  },
  {
    id: 'cluster-connection-bus',
    name: 'Riesgo de Rotura de Enlace Ferro-Bus (Línea Interurbana 352)',
    severity: 'medium',
    primaryLocation: 'Intercambiador Atocha · Dársenas Superficie',
    affectedCorridor: 'Corredor A-3 (Perales - Tarancón)',
    uniqueAlertCount: 2,
    rawSignalCount: 8,
    confidenceScore: 92,
    reasoningEs:
      '21 viajeros en transbordo garantizado entre tren C-3 retrasado y autobús 352 con salida a las 08:42; margen proyectado en -3 min (Roto).',
    reasoningEn:
      '21 transferring passengers with guaranteed connection between delayed train C-3 and bus 352 departing at 08:42; projected margin -3 min (Broken).',
    signalsWeights: [
      { signalName: 'C-3 retraso proyectado: llegada estimada 08:40', weight: 55, source: 'N03 GTFS-RT', time: '08:39:20' },
      { signalName: 'Bus 352 en cabecera de dársena con motor arrancado', weight: 45, source: 'N06 Telemetría GPS', time: '08:40:02' },
    ],
  },
];

// Sample of unique normalized alerts (representing the 41 unique alerts)
export const SAMPLE_UNIQUE_ALERTS: UniqueAlert[] = [
  {
    id: 'ALT-ATO-01',
    sourceType: 'SCADA Eléctrico',
    sourceName: 'N03 Adif Regulación',
    timestamp: '08:38:12',
    location: 'Atocha Vía 3-4',
    headline: 'Disparo de disyuntor de tracción en Subestación Atocha-Sur (0V)',
    signalCount: 42,
    weight: 42,
    clusterId: 'cluster-catenary-atocha',
  },
  {
    id: 'ALT-ATO-02',
    sourceType: 'Telemetría Tren',
    sourceName: 'N06 IoT On-Board',
    timestamp: '08:38:14',
    location: 'Atocha Cercanías',
    headline: 'Pérdida de tensión en pantógrafo del Convoy 465-021',
    signalCount: 36,
    weight: 28,
    clusterId: 'cluster-catenary-atocha',
  },
  {
    id: 'ALT-ATO-03',
    sourceType: 'Señalización Ferroviaria',
    sourceName: 'N03 Renfe Regulación',
    timestamp: '08:38:20',
    location: 'Cantón Atocha-Villaverde',
    headline: 'Ocupación fija de cantón por tren detenido sin tracción',
    signalCount: 28,
    weight: 18,
    clusterId: 'cluster-catenary-atocha',
  },
  {
    id: 'ALT-ATO-04',
    sourceType: 'Visión por Computador',
    sourceName: 'N10 Red de Cámaras',
    timestamp: '08:38:22',
    location: 'Túnel Sur Atocha',
    headline: 'Detección óptica de destello / arco eléctrico en catenaria',
    signalCount: 15,
    weight: 12,
    clusterId: 'cluster-catenary-atocha',
  },
  {
    id: 'ALT-CWD-01',
    sourceType: 'Sensores Aforo Dársenas',
    sourceName: 'N09 Intercambiador Atocha',
    timestamp: '08:39:05',
    location: 'Andén 3 Atocha',
    headline: 'Densidad de andén supera el 85% de aforo de confort',
    signalCount: 14,
    weight: 45,
    clusterId: 'cluster-crowd-atocha',
  },
  {
    id: 'ALT-CWD-02',
    sourceType: 'Ticketing ABT',
    sourceName: 'N12 Sistema de Validación',
    timestamp: '08:39:15',
    location: 'Torniquetes Vestíbulo Cercanías',
    headline: 'Flujo de entrada sostenido sin desahogo por trenes detenidos',
    signalCount: 8,
    weight: 30,
    clusterId: 'cluster-crowd-atocha',
  },
  {
    id: 'ALT-CON-01',
    sourceType: 'Protección de Enlaces',
    sourceName: 'N22 El Cerebro CITRAM',
    timestamp: '08:39:20',
    location: 'Dársena Interurbana 14',
    headline: 'Margen de transbordo negativo (-3 min) en línea 352 hacia Tarancón',
    signalCount: 6,
    weight: 55,
    clusterId: 'cluster-connection-bus',
  },
];

// Generator for the 312 simulated raw signals
export function generate312RawSignals(): RawSignal[] {
  const list: RawSignal[] = [];

  const sources = [
    { id: 'N03', name: 'Renfe Cercanías SCADA', type: 'scada' as const },
    { id: 'N06', name: 'Telemetría On-Board', type: 'telemetry' as const },
    { id: 'N10', name: 'CCTV Videovigilancia', type: 'cctv' as const },
    { id: 'N09', name: 'Intercambiadores Atocha', type: 'panel_sensor' as const },
    { id: 'N12', name: 'Validación ABT', type: 'panel_sensor' as const },
    { id: 'N13', name: 'CRM / Quejas Ciudadano', type: 'passenger_report' as const },
    { id: 'N17', name: 'Escucha Redes Sociales', type: 'social_media' as const },
  ];

  for (let i = 1; i <= 312; i++) {
    const isDup = i > 41 && i <= 255;
    const isFlap = i > 255 && i <= 293;
    const isPlan = i > 293;

    let cluster = 'cluster-catenary-atocha';
    let text = `Alarma caída de tensión catenaria vía 3/4 [Código SCADA V-0929-${i}]`;
    let sev: 'critical' | 'high' | 'medium' | 'low' = 'critical';

    if (i % 7 === 0) {
      cluster = 'cluster-crowd-atocha';
      text = `Aviso aforo andén Atocha Cercanías sensor S-${i}`;
      sev = 'high';
    } else if (i % 13 === 0) {
      cluster = 'cluster-connection-bus';
      text = `Retraso transfer Cercanías C-3 a bus interurbano 352 [Margen roto]`;
      sev = 'medium';
    }

    if (isDup) {
      text = `(Duplicado) ${text}`;
    } else if (isFlap) {
      text = `(Sensor oscilante/flapping) Lectura intermitente sensor de tracción #${i}`;
      sev = 'low';
    } else if (isPlan) {
      text = `(Trabajo programado) Notificación preventiva de corte nocturno #${i}`;
      sev = 'low';
    }

    const src = sources[i % sources.length];
    const secondOffset = Math.min(Math.floor((i / 312) * 90), 89);
    const timeStr = `08:38:${secondOffset.toString().padStart(2, '0')}`;

    list.push({
      id: `SIG-${1000 + i}`,
      timestamp: timeStr,
      sourceId: src.id,
      sourceName: src.name,
      sourceType: src.type,
      location: 'Atocha Central / Corredor Sur',
      lineCode: i % 2 === 0 ? 'C-3' : 'C-4',
      severityHint: sev,
      rawText: text,
      isDuplicate: isDup,
      isFlapping: isFlap,
      isPlannedWork: isPlan,
      clusterId: cluster,
    });
  }

  return list;
}
