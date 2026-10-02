import { TransportLine, InterchangeHub, SimulatedVehicle } from './madridNetworkData';
import { IncidentCase, DecisionCardItem } from '../types';

export interface SiteMapBounds {
  centerLat: number;
  centerLng: number;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  corridors: {
    name: string;
    color: string;
    points: [number, number][]; // canvas percentage coordinates [x%, y%]
    width?: number;
  }[];
  waterway?: {
    points: [number, number][];
    width: number;
    color: string;
  };
  ringHighways?: {
    innerRadiusX: number;
    innerRadiusY: number;
    outerRadiusX: number;
    outerRadiusY: number;
    centerX: number;
    centerY: number;
  };
}

export interface SitePunctualityMetric {
  code: string;
  name: string;
  mode: 'metro' | 'cercanias' | 'emt' | 'interurban' | 'light_rail' | 'tram';
  modeName: string;
  color: string;
  scheduledTrips: number;
  executedTrips: number;
  onTimeRate: number;
  targetSla: number;
  avgDelaySeconds: number;
  status: 'compliant' | 'breach_risk' | 'warning';
  caseId?: string;
  rootCauseEs: string;
  rootCauseEn: string;
}

export interface SiteOperatorCompliance {
  id: string;
  name: string;
  contractCode: string;
  mode: 'urban' | 'rail' | 'interurban' | 'tram';
  modeLabelEs: string;
  modeLabelEn: string;
  fleetAssigned: number;
  monthlyTrips: number;
  complianceRate: number;
  regularityScore: number;
  penaltiesAccruedEuros: number;
  penaltiesInDisputeEuros: number;
  bonusesEarnedEuros: number;
  baseMonthlyFeeEuros: number;
  status: 'compliant' | 'in_dispute' | 'penalized';
  auditNotesEs: string;
  auditNotesEn: string;
  kpis: {
    punctuality: number;
    tripDelivery: number;
    climateComfort: number;
    pmrRamps: number;
    cleanlinessScore: number;
    complaintsRate: number;
  };
}

export interface SiteShiftData {
  shiftLead: {
    name: string;
    roleId: string;
    titleEs: string;
    titleEn: string;
    console: string;
  };
  team: {
    roleId: string;
    name: string;
    title: string;
    status: string;
    console: string;
  }[];
  events: {
    time: string;
    author: string;
    textEs: string;
    textEn: string;
  }[];
  slaClocks: {
    caseId: string;
    titleEs: string;
    titleEn: string;
    severity: 'critical' | 'moderate' | 'minor';
    targetMinutes: number;
    elapsedMinutes: number;
    remainingMinutes: number;
    status: 'nominal' | 'warning' | 'breached';
    nextMilestoneEs: string;
    nextMilestoneEn: string;
  }[];
}

// ---------------------------------------------------------------------------
// MADRID DATASET
// ---------------------------------------------------------------------------
const MADRID_MAP_BOUNDS: SiteMapBounds = {
  centerLat: 40.4168,
  centerLng: -3.7038,
  minLat: 40.35,
  maxLat: 40.50,
  minLng: -3.78,
  maxLng: -3.62,
  corridors: [
    {
      name: 'Eje Castellana / Cercanías',
      color: '#8A1538',
      points: [[50, 68], [50, 52], [50, 38], [52, 26]],
      width: 4,
    },
    {
      name: 'Metro Línea 1',
      color: '#0097D9',
      points: [[54, 22], [51, 42], [47, 52], [50, 64], [66, 88]],
      width: 3,
    },
    {
      name: 'Metro Línea 10',
      color: '#002F6C',
      points: [[55, 12], [50, 32], [46, 54], [43, 72]],
      width: 3,
    },
  ],
  waterway: {
    points: [[35, 6], [42, 33], [44, 57], [52, 93]],
    width: 3,
    color: '#3B82F6',
  },
  ringHighways: {
    centerX: 50,
    centerY: 50,
    innerRadiusX: 20,
    innerRadiusY: 24,
    outerRadiusX: 34,
    outerRadiusY: 38,
  },
};

const MADRID_DECISION_CARDS: DecisionCardItem[] = [
  {
    id: 'INC-2026-0929-ATO',
    title: 'Avería de Catenaria en Corredor Atocha',
    incidentType: 'Overhead Power',
    severity: 'critical',
    whatHappened: 'Caída de tensión en vía 3 y 4 de Atocha Cercanías detectada por telemetría SCADA Adif.',
    impact: '4.320 viajeros afectados · Retrasos acumulados en líneas C-3, C-4 y C-5.',
    recommendedAction: 'Activar retención de 4 min en bus interurbano 352 e instruir 4 buses SE de refuerzo.',
    reason: 'Evita la rotura del enlace de 142 viajeros y contiene aglomeración en andén.',
    timeLeftMinutes: 3,
    slaTargetMinutes: 5,
    primaryActionLabel: 'Abrir Caso y Decidir',
    affectedLines: ['C-3', 'C-4', 'Bus 352'],
  },
  {
    id: 'INC-2026-0929-SOL',
    title: 'Indisponibilidad Escalera Mecánica Sol',
    incidentType: 'Station Equipment',
    severity: 'low',
    whatHappened: 'Parada automática por activación de sensor de seguridad en acceso Montera.',
    impact: 'Congestión moderada en pasillo de conexión L1/L2.',
    recommendedAction: 'Despachar equipo técnico de mantenimiento Schindler (SLA 30 min).',
    reason: 'Restablece flujo antes del pico de salida de las 14:00.',
    timeLeftMinutes: 18,
    slaTargetMinutes: 30,
    primaryActionLabel: 'Asignar Orden de Trabajo',
    affectedLines: ['L1', 'L2'],
  },
  {
    id: 'INC-2026-0929-MON',
    title: 'Avería Ascensor PMR Moncloa Isla 1',
    incidentType: 'Accessibility',
    severity: 'moderate',
    whatHappened: 'Bloqueo mecánico en ascensor de acceso a dársenas 10-15.',
    impact: 'Afección a 6 pasajeros con movilidad reducida.',
    recommendedAction: 'Desviar itinerario accesible por ascensor Isla 2 y alertar a supervisión.',
    reason: 'Garantiza derecho a la movilidad accesible sin interrupción de viaje.',
    timeLeftMinutes: 12,
    slaTargetMinutes: 20,
    primaryActionLabel: 'Activar Desvío PMR',
    affectedLines: ['L6', 'Interurbanos A-6'],
  },
];

const MADRID_PUNCTUALITY: SitePunctualityMetric[] = [
  {
    code: 'L1',
    name: 'Pinar de Chamartín - Valdecarros',
    mode: 'metro',
    modeName: 'Metro de Madrid',
    color: '#0097D9',
    scheduledTrips: 412,
    executedTrips: 412,
    onTimeRate: 99.5,
    targetSla: 98.0,
    avgDelaySeconds: 14,
    status: 'compliant',
    rootCauseEs: 'Régimen nominal · Intervalo medio 3 min',
    rootCauseEn: 'Nominal regime · Average headway 3 min',
  },
  {
    code: 'L6',
    name: 'Circular (Laguna - Cuatro Caminos)',
    mode: 'metro',
    modeName: 'Metro de Madrid',
    color: '#8D9297',
    scheduledTrips: 580,
    executedTrips: 578,
    onTimeRate: 98.9,
    targetSla: 98.0,
    avgDelaySeconds: 22,
    status: 'compliant',
    rootCauseEs: 'Régimen nominal · 64 trenes en carrusel',
    rootCauseEn: 'Nominal regime · 64 trains operating',
  },
  {
    code: 'C-3',
    name: 'Chamartín - Atocha - Aranjuez',
    mode: 'cercanias',
    modeName: 'Renfe Cercanías',
    color: '#7A1E65',
    scheduledTrips: 124,
    executedTrips: 116,
    onTimeRate: 93.8,
    targetSla: 96.0,
    avgDelaySeconds: 420,
    status: 'breach_risk',
    caseId: 'INC-2026-0929-ATO',
    rootCauseEs: 'Avería de catenaria en vía 3 Atocha (Caso INC-2026-0929-ATO)',
    rootCauseEn: 'Overhead catenary fault track 3 Atocha (Case INC-2026-0929-ATO)',
  },
  {
    code: 'C-4',
    name: 'Parla - Atocha - Alcobendas / Colmenar',
    mode: 'cercanias',
    modeName: 'Renfe Cercanías',
    color: '#0055A5',
    scheduledTrips: 168,
    executedTrips: 159,
    onTimeRate: 94.6,
    targetSla: 96.0,
    avgDelaySeconds: 310,
    status: 'breach_risk',
    caseId: 'INC-2026-0929-ATO',
    rootCauseEs: 'Afección colateral por corte de tensión en túnel de Sol',
    rootCauseEn: 'Collateral impact from power cutoff in Sol tunnel',
  },
  {
    code: 'EMT 27',
    name: 'Embajadores - Plaza de Castilla',
    mode: 'emt',
    modeName: 'EMT Madrid',
    color: '#0047BA',
    scheduledTrips: 340,
    executedTrips: 338,
    onTimeRate: 97.4,
    targetSla: 95.0,
    avgDelaySeconds: 45,
    status: 'compliant',
    rootCauseEs: 'Carril bus segregado Castellana · Regularidad óptima',
    rootCauseEn: 'Segregated bus lane Castellana · Optimal regularity',
  },
  {
    code: 'Bus 352',
    name: 'Madrid (Atocha) - Fuentidueña - Tarancón',
    mode: 'interurban',
    modeName: 'Empresa Ruiz (Interurbanos)',
    color: '#00853F',
    scheduledTrips: 48,
    executedTrips: 47,
    onTimeRate: 94.2,
    targetSla: 95.0,
    avgDelaySeconds: 240,
    status: 'breach_risk',
    rootCauseEs: 'Retención de enlace autorizada por sala en dársena 14',
    rootCauseEn: 'Authorized connection hold by control room at bay 14',
  },
];

const MADRID_OPERATORS: SiteOperatorCompliance[] = [
  {
    id: 'emt',
    name: 'Empresa Municipal de Transportes (EMT Madrid)',
    contractCode: 'CRTM-CONC-001/URB',
    mode: 'urban',
    modeLabelEs: 'Autobuses Urbanos',
    modeLabelEn: 'Urban Buses',
    fleetAssigned: 2050,
    monthlyTrips: 184000,
    complianceRate: 99.8,
    regularityScore: 97.4,
    penaltiesAccruedEuros: 0,
    penaltiesInDisputeEuros: 0,
    bonusesEarnedEuros: 650,
    baseMonthlyFeeEuros: 12400000,
    status: 'compliant',
    auditNotesEs: 'Cumplimiento excelente. 4 autobuses de reserva aportados al Servicio Especial Atocha.',
    auditNotesEn: 'Excellent compliance. 4 reserve buses deployed to SE Atocha relief.',
    kpis: {
      punctuality: 97.4,
      tripDelivery: 99.8,
      climateComfort: 99.5,
      pmrRamps: 99.9,
      cleanlinessScore: 9.6,
      complaintsRate: 0.38,
    },
  },
  {
    id: 'renfe',
    name: 'Renfe Cercanías Madrid (AGE / Contrato Programa)',
    contractCode: 'CRTM-CONC-CERC/MAD',
    mode: 'rail',
    modeLabelEs: 'Ferrocarril de Cercanías',
    modeLabelEn: 'Suburban Commuter Rail',
    fleetAssigned: 280,
    monthlyTrips: 38200,
    complianceRate: 98.4,
    regularityScore: 94.2,
    penaltiesAccruedEuros: 0,
    penaltiesInDisputeEuros: 450,
    bonusesEarnedEuros: 0,
    baseMonthlyFeeEuros: 8500000,
    status: 'in_dispute',
    auditNotesEs: 'Expediente Atocha C-3/C-4: Alegación de fuerza mayor por caída de catenaria Adif en tramitación.',
    auditNotesEn: 'Atocha C-3/C-4 docket: Force majeure claim under review due to Adif overhead catenary failure.',
    kpis: {
      punctuality: 94.2,
      tripDelivery: 98.4,
      climateComfort: 98.1,
      pmrRamps: 97.4,
      cleanlinessScore: 8.8,
      complaintsRate: 1.42,
    },
  },
  {
    id: 'ruiz',
    name: 'Empresa Ruiz (Concesión Corredor A-3)',
    contractCode: 'CRTM-VCM-301/RUIZ',
    mode: 'interurban',
    modeLabelEs: 'Autobuses Interurbanos',
    modeLabelEn: 'Interurban Buses',
    fleetAssigned: 185,
    monthlyTrips: 22400,
    complianceRate: 99.1,
    regularityScore: 95.8,
    penaltiesAccruedEuros: 0,
    penaltiesInDisputeEuros: 0,
    bonusesEarnedEuros: 120,
    baseMonthlyFeeEuros: 1950000,
    status: 'compliant',
    auditNotesEs: 'Colaboración activa en protocolo de retención de enlace intermodal dársena 14.',
    auditNotesEn: 'Active collaboration in bay 14 intermodal connection hold protocol.',
    kpis: {
      punctuality: 95.8,
      tripDelivery: 99.1,
      climateComfort: 98.7,
      pmrRamps: 99.2,
      cleanlinessScore: 9.1,
      complaintsRate: 0.65,
    },
  },
];

// ---------------------------------------------------------------------------
// BARCELONA (ATM) DATASET
// ---------------------------------------------------------------------------
const BARCELONA_MAP_BOUNDS: SiteMapBounds = {
  centerLat: 41.3879,
  centerLng: 2.1699,
  minLat: 41.32,
  maxLat: 41.46,
  minLng: 2.05,
  maxLng: 2.25,
  corridors: [
    {
      name: 'Corredor Rodalies Litoral (R1/R4)',
      color: '#F39200',
      points: [[25, 75], [42, 60], [55, 48], [75, 30], [88, 18]],
      width: 4,
    },
    {
      name: 'Metro L1 (Hospital de Bellvitge - Fondo)',
      color: '#E30613',
      points: [[20, 80], [38, 62], [50, 50], [68, 38], [82, 22]],
      width: 3,
    },
    {
      name: 'Metro L3 (Zona Universitària - Trinitat Nova)',
      color: '#009640',
      points: [[26, 38], [40, 52], [52, 54], [58, 42], [62, 20]],
      width: 3,
    },
    {
      name: 'Metro L5 (Cornellà - Vall d\'Hebron)',
      color: '#0072CE',
      points: [[18, 70], [35, 58], [52, 42], [60, 28]],
      width: 3,
    },
  ],
  waterway: {
    // Mediterranean Sea coastline
    points: [[15, 95], [35, 82], [55, 70], [75, 58], [95, 45]],
    width: 5,
    color: '#0284C7',
  },
  ringHighways: {
    centerX: 50,
    centerY: 50,
    innerRadiusX: 24, // Ronda del Mig
    innerRadiusY: 18,
    outerRadiusX: 38, // Ronda de Dalt & Ronda Litoral
    outerRadiusY: 30,
  },
};

const BARCELONA_DECISION_CARDS: DecisionCardItem[] = [
  {
    id: 'INC-2026-0929-SNT',
    title: 'Avaria d\'Agulles i Senyalització a Sants Estació',
    incidentType: 'Rail Signalling',
    severity: 'critical',
    whatHappened: 'Falta de comprovació d\'agulla a la capçalera sud de Barcelona Sants (vies 7 i 8).',
    impact: '5.140 passatgers afectats · Retards de 25 min a Rodalies R1, R3 i R4.',
    recommendedAction: 'Instruir reforç de 6 autobusos llançadora TMB i protegir enllaç amb bus exprés e11.1 a Mataró.',
    reason: 'Evita la pèrdua de connexió metropolitana i conté la saturació al vestíbul de Sants.',
    timeLeftMinutes: 4,
    slaTargetMinutes: 5,
    primaryActionLabel: 'Obrir Incident i Decidir',
    affectedLines: ['R1', 'R4', 'Bus e11.1'],
  },
  {
    id: 'INC-2026-0929-CAT',
    title: 'Avaria d\'Ascensor PMR a Plaça de Catalunya L1/L3',
    incidentType: 'Accessibility',
    severity: 'moderate',
    whatHappened: 'Bloqueig mecànic a l\'ascensor d\'enllaç entre andana L1 direcció Fondo i vestíbul Renfe.',
    impact: '8 persones amb mobilitat reduïda pendents d\'itinerari adaptat.',
    recommendedAction: 'Desviar flux PMR per ascensor de Rambla i mobilitzar brigada d\'emergència TMB.',
    reason: 'Garanteix compliment de l\'SLA d\'accessibilitat universal ATM (màx 20 min).',
    timeLeftMinutes: 9,
    slaTargetMinutes: 20,
    primaryActionLabel: 'Activar Protocol PMR',
    affectedLines: ['L1', 'L3'],
  },
  {
    id: 'INC-2026-0929-SAG',
    title: 'Incidència de Càrrega i Dàrsenes a Sagrera Meridiana',
    incidentType: 'Interchange Operations',
    severity: 'low',
    whatHappened: 'Aglomeració a la dàrsena 4 per arribada simultània de 3 autobusos interurbans de Sagalés.',
    impact: 'Cua moderada a l\'andana d\'intercanvi.',
    recommendedAction: 'Obrir dàrsena auxiliar 6 i reassignar torns d\'embarcament.',
    reason: 'Descongestiona el moll de càrrega en menys de 8 minuts.',
    timeLeftMinutes: 15,
    slaTargetMinutes: 25,
    primaryActionLabel: 'Reassignar Dàrsena',
    affectedLines: ['R3', 'R4', 'Sagalés e7'],
  },
];

const BARCELONA_PUNCTUALITY: SitePunctualityMetric[] = [
  {
    code: 'L1',
    name: 'Hospital de Bellvitge - Fondo',
    mode: 'metro',
    modeName: 'TMB Metro de Barcelona',
    color: '#E30613',
    scheduledTrips: 430,
    executedTrips: 429,
    onTimeRate: 99.4,
    targetSla: 98.0,
    avgDelaySeconds: 16,
    status: 'compliant',
    rootCauseEs: 'Régimen nominal · Intervalo medio en hora punta 2 min 50 s',
    rootCauseEn: 'Nominal regime · Average peak headway 2m 50s',
  },
  {
    code: 'L5',
    name: 'Cornellà Centre - Vall d\'Hebron',
    mode: 'metro',
    modeName: 'TMB Metro de Barcelona',
    color: '#0072CE',
    scheduledTrips: 395,
    executedTrips: 395,
    onTimeRate: 99.1,
    targetSla: 98.0,
    avgDelaySeconds: 19,
    status: 'compliant',
    rootCauseEs: 'Régimen óptimo · Sin incidencias operativas en túnel',
    rootCauseEn: 'Optimal regime · No tunnel operational incidents',
  },
  {
    code: 'R1',
    name: 'Molins de Rei - Mataró - Maçanet',
    mode: 'cercanias',
    modeName: 'Rodalies de Catalunya',
    color: '#0085C7',
    scheduledTrips: 110,
    executedTrips: 98,
    onTimeRate: 92.4,
    targetSla: 95.0,
    avgDelaySeconds: 480,
    status: 'breach_risk',
    caseId: 'INC-2026-0929-SNT',
    rootCauseEs: 'Avería de aguja en vía 7 Sants Estació (Caso INC-2026-0929-SNT)',
    rootCauseEn: 'Track 7 switch fault at Sants Estació (Case INC-2026-0929-SNT)',
  },
  {
    code: 'R4',
    name: 'Sant Vicenç de Calders - Manresa',
    mode: 'cercanias',
    modeName: 'Rodalies de Catalunya',
    color: '#F39200',
    scheduledTrips: 142,
    executedTrips: 132,
    onTimeRate: 93.1,
    targetSla: 95.0,
    avgDelaySeconds: 390,
    status: 'breach_risk',
    caseId: 'INC-2026-0929-SNT',
    rootCauseEs: 'Afección cruzada por cizallamiento en Sants y túnel de Plaça de Catalunya',
    rootCauseEn: 'Cross-impact from routing bottleneck at Sants and Catalunya tunnel',
  },
  {
    code: 'Bus H12',
    name: 'Gornal - Besòs Verneda (Gran Via)',
    mode: 'emt',
    modeName: 'TMB Bus Metropolità',
    color: '#D8232A',
    scheduledTrips: 280,
    executedTrips: 278,
    onTimeRate: 97.8,
    targetSla: 95.0,
    avgDelaySeconds: 40,
    status: 'compliant',
    rootCauseEs: 'Prioridad semafórica en carril bus Gran Via operativa al 98%',
    rootCauseEn: 'Traffic signal priority on Gran Via busway 98% active',
  },
  {
    code: 'Bus e11.1',
    name: 'Barcelona - Mataró Centre (Exprés.cat)',
    mode: 'interurban',
    modeName: 'Moventis / Casas (ATM Concessió)',
    color: '#007A3D',
    scheduledTrips: 54,
    executedTrips: 53,
    onTimeRate: 95.2,
    targetSla: 95.0,
    avgDelaySeconds: 190,
    status: 'compliant',
    rootCauseEs: 'Retención de enlace autorizada en Sants para 85 pasajeros de R1',
    rootCauseEn: 'Connection hold approved at Sants for 85 transferring R1 passengers',
  },
];

const BARCELONA_OPERATORS: SiteOperatorCompliance[] = [
  {
    id: 'tmb',
    name: 'Transports Metropolitans de Barcelona (TMB Metro i Bus)',
    contractCode: 'ATM-CONC-001/TMB',
    mode: 'urban',
    modeLabelEs: 'Metro i Autobusos de Barcelona',
    modeLabelEn: 'Metro & Urban Buses Barcelona',
    fleetAssigned: 1880,
    monthlyTrips: 165000,
    complianceRate: 99.7,
    regularityScore: 97.9,
    penaltiesAccruedEuros: 0,
    penaltiesInDisputeEuros: 0,
    bonusesEarnedEuros: 720,
    baseMonthlyFeeEuros: 14200000,
    status: 'compliant',
    auditNotesEs: 'Cumplimiento óptimo. Despacho inmediato de 6 buses lanzadera de apoyo a Sants.',
    auditNotesEn: 'Optimal compliance. Immediate dispatch of 6 shuttle relief buses to Sants.',
    kpis: {
      punctuality: 97.9,
      tripDelivery: 99.7,
      climateComfort: 99.4,
      pmrRamps: 99.8,
      cleanlinessScore: 9.5,
      complaintsRate: 0.32,
    },
  },
  {
    id: 'rodalies',
    name: 'Rodalies de Catalunya (Renfe Viajeros / Generalitat)',
    contractCode: 'ATM-CONC-ROD/CAT',
    mode: 'rail',
    modeLabelEs: 'Rodalies de Catalunya',
    modeLabelEn: 'Commuter Rail Catalonia',
    fleetAssigned: 235,
    monthlyTrips: 31200,
    complianceRate: 97.6,
    regularityScore: 92.8,
    penaltiesAccruedEuros: 0,
    penaltiesInDisputeEuros: 620,
    bonusesEarnedEuros: 0,
    baseMonthlyFeeEuros: 7800000,
    status: 'in_dispute',
    auditNotesEs: 'Expediente Sants R1/R4: Solicitud de arbitraje por avería de enclavamiento Adif.',
    auditNotesEn: 'Sants R1/R4 dossier: Arbitration requested over Adif interlocking failure.',
    kpis: {
      punctuality: 92.8,
      tripDelivery: 97.6,
      climateComfort: 97.5,
      pmrRamps: 96.8,
      cleanlinessScore: 8.4,
      complaintsRate: 1.88,
    },
  },
  {
    id: 'moventis',
    name: 'Moventis / Empresa Casas (Corredor Maresme e11)',
    contractCode: 'ATM-CONC-MOV/MAR',
    mode: 'interurban',
    modeLabelEs: 'Autobusos Interurbans Exprés.cat',
    modeLabelEn: 'Interurban Express Buses',
    fleetAssigned: 145,
    monthlyTrips: 18200,
    complianceRate: 98.9,
    regularityScore: 96.2,
    penaltiesAccruedEuros: 0,
    penaltiesInDisputeEuros: 0,
    bonusesEarnedEuros: 180,
    baseMonthlyFeeEuros: 1720000,
    status: 'compliant',
    auditNotesEs: 'Retención de enlace autorizada y ejecutada con éxito en dársena 6 de Sants.',
    auditNotesEn: 'Connection hold approved and executed successfully at bay 6 Sants.',
    kpis: {
      punctuality: 96.2,
      tripDelivery: 98.9,
      climateComfort: 98.9,
      pmrRamps: 99.4,
      cleanlinessScore: 9.3,
      complaintsRate: 0.54,
    },
  },
];

// ---------------------------------------------------------------------------
// SEVILLA (CONSORCIO METROPOLITANO) DATASET
// ---------------------------------------------------------------------------
const SEVILLA_MAP_BOUNDS: SiteMapBounds = {
  centerLat: 37.3891,
  centerLng: -5.9845,
  minLat: 37.32,
  maxLat: 37.45,
  minLng: -6.08,
  maxLng: -5.90,
  corridors: [
    {
      name: 'Eje Ferroviario Cercanías (C-1 / C-4)',
      color: '#8A1538',
      points: [[55, 15], [52, 38], [50, 55], [48, 75]],
      width: 4,
    },
    {
      name: 'Metro de Sevilla Línea 1',
      color: '#00853F',
      points: [[18, 55], [35, 52], [50, 55], [72, 60], [86, 75]],
      width: 3,
    },
    {
      name: 'TUSSAM Línea 1 / 2 Corredor Macarena',
      color: '#E31B23',
      points: [[48, 20], [45, 40], [42, 60], [40, 80]],
      width: 3,
    },
  ],
  waterway: {
    // Guadalquivir River
    points: [[40, 10], [42, 30], [38, 50], [32, 70], [30, 95]],
    width: 4,
    color: '#0284C7',
  },
  ringHighways: {
    centerX: 48,
    centerY: 52,
    innerRadiusX: 18, // Ronda Histórica
    innerRadiusY: 20,
    outerRadiusX: 34, // SE-30
    outerRadiusY: 36,
  },
};

const SEVILLA_DECISION_CARDS: DecisionCardItem[] = [
  {
    id: 'INC-2026-0929-STJ',
    title: 'Incidencia en Puesto de Mando Santa Justa / San Bernardo',
    incidentType: 'Signalling / Dispatch',
    severity: 'critical',
    whatHappened: 'Avería en enclavamiento electrónico en el túnel urbano Santa Justa - San Bernardo.',
    impact: '2.840 viajeros afectados · Retrasos de 20 min en Cercanías C-1 y afección a transbordos Metro L1.',
    recommendedAction: 'Despachar refuerzo de 4 autobuses TUSSAM C1/C2 y coordinar paso en San Bernardo.',
    reason: 'Absorbe la demanda de viajeros procedentes del área metropolitana sur.',
    timeLeftMinutes: 3,
    slaTargetMinutes: 5,
    primaryActionLabel: 'Abrir Incidencia y Actuar',
    affectedLines: ['C-1', 'Metro L1', 'TUSSAM C1'],
  },
  {
    id: 'INC-2026-0929-PDA',
    title: 'Saturación en Dársenas de Plaza de Armas (Corredor Aljarafe)',
    incidentType: 'Interchange Operations',
    severity: 'moderate',
    whatHappened: 'Bloqueo temporal en dársena 3 por maniobra de autobús metropolitano M-160 averiado.',
    impact: 'Demora en 6 salidas metropolitanas hacia Tomares, Castilleja y Bormujos.',
    recommendedAction: 'Desviar salidas a dársenas exteriores 11 y 12 y alertar por megafonía.',
    reason: 'Evita colapso circulatorio en el acceso por Torneo.',
    timeLeftMinutes: 8,
    slaTargetMinutes: 15,
    primaryActionLabel: 'Autorizar Desvío Dársena',
    affectedLines: ['M-160', 'M-111', 'TUSSAM 03'],
  },
  {
    id: 'INC-2026-0929-PJZ',
    title: 'Mantenimiento Preventivo Ascensor Puerta de Jerez',
    incidentType: 'Accessibility',
    severity: 'low',
    whatHappened: 'Revisión programada de cableado y sensor de planta en ascensor central.',
    impact: 'Desvío de viajeros PMR por ascensor Paseo de Cristina.',
    recommendedAction: 'Activar señalización bilingüe y aviso en la App del Consorcio.',
    reason: 'Garantiza tránsito sin barreras arquitectónicas en el centro histórico.',
    timeLeftMinutes: 20,
    slaTargetMinutes: 45,
    primaryActionLabel: 'Confirmar Señalización',
    affectedLines: ['Metro L1', 'MetroCentro T1'],
  },
];

const SEVILLA_PUNCTUALITY: SitePunctualityMetric[] = [
  {
    code: 'Metro L1',
    name: 'Ciudad Expo - Olivar de Quintos',
    mode: 'metro',
    modeName: 'Metro de Sevilla (Globalvia)',
    color: '#00853F',
    scheduledTrips: 220,
    executedTrips: 220,
    onTimeRate: 99.2,
    targetSla: 98.0,
    avgDelaySeconds: 18,
    status: 'compliant',
    rootCauseEs: 'Operación nominal · Intervalo medio 4 minutos en tramo central',
    rootCauseEn: 'Nominal operation · Average headway 4 min in core section',
  },
  {
    code: 'Cercanías C-1',
    name: 'Lora del Río - Santa Justa - Utrera / Lebrija',
    mode: 'cercanias',
    modeName: 'Renfe Cercanías Sevilla',
    color: '#8A1538',
    scheduledTrips: 76,
    executedTrips: 68,
    onTimeRate: 91.8,
    targetSla: 95.0,
    avgDelaySeconds: 510,
    status: 'breach_risk',
    caseId: 'INC-2026-0929-STJ',
    rootCauseEs: 'Avería de enclavamiento en túnel Santa Justa - San Bernardo',
    rootCauseEn: 'Interlocking outage in Santa Justa - San Bernardo tunnel',
  },
  {
    code: 'TUSSAM C1',
    name: 'Circular Exterior (Santa Justa - Prado - Triana)',
    mode: 'emt',
    modeName: 'TUSSAM Autobuses Urbanos',
    color: '#E31B23',
    scheduledTrips: 180,
    executedTrips: 178,
    onTimeRate: 96.8,
    targetSla: 95.0,
    avgDelaySeconds: 52,
    status: 'compliant',
    rootCauseEs: 'Carril bus segregado en Ronda Histórica y Puente del Patrocinio',
    rootCauseEn: 'Segregated bus lanes on Historic Ring and Patrocinio Bridge',
  },
  {
    code: 'Bus M-160',
    name: 'Sevilla (Plaza de Armas) - Tomares - Bormujos',
    mode: 'interurban',
    modeName: 'Consorcio Metropolitano (Empresa Casal)',
    color: '#1A7F37',
    scheduledTrips: 64,
    executedTrips: 60,
    onTimeRate: 93.4,
    targetSla: 95.0,
    avgDelaySeconds: 320,
    status: 'breach_risk',
    caseId: 'INC-2026-0929-PDA',
    rootCauseEs: 'Incidencia en dársena 3 Plaza de Armas · Tráfico denso en A-49',
    rootCauseEn: 'Bay 3 incident at Plaza de Armas · Heavy traffic on A-49',
  },
  {
    code: 'MetroCentro T1',
    name: 'Plaza Nueva - San Bernardo - Eduardo Dato',
    mode: 'light_rail',
    modeName: 'Tranvía de Sevilla (TUSSAM)',
    color: '#F39200',
    scheduledTrips: 110,
    executedTrips: 110,
    onTimeRate: 99.5,
    targetSla: 98.0,
    avgDelaySeconds: 12,
    status: 'compliant',
    rootCauseEs: 'Plataforma tranviaria reservada 100% libre de congestión',
    rootCauseEn: '100% dedicated light rail right-of-way free of traffic',
  },
];

const SEVILLA_OPERATORS: SiteOperatorCompliance[] = [
  {
    id: 'tussam',
    name: 'Transportes Urbanos de Sevilla, S.A.M. (TUSSAM)',
    contractCode: 'CTAS-CONC-001/TUSSAM',
    mode: 'urban',
    modeLabelEs: 'Autobuses Urbanos y Tranvía',
    modeLabelEn: 'Urban Buses & Tramway',
    fleetAssigned: 420,
    monthlyTrips: 68000,
    complianceRate: 99.6,
    regularityScore: 97.2,
    penaltiesAccruedEuros: 0,
    penaltiesInDisputeEuros: 0,
    bonusesEarnedEuros: 310,
    baseMonthlyFeeEuros: 5400000,
    status: 'compliant',
    auditNotesEs: 'Excelente regularidad. Servicio de refuerzo rápido en San Bernardo activado.',
    auditNotesEn: 'Excellent regularity. Rapid relief service deployed at San Bernardo.',
    kpis: {
      punctuality: 97.2,
      tripDelivery: 99.6,
      climateComfort: 99.8,
      pmrRamps: 99.9,
      cleanlinessScore: 9.4,
      complaintsRate: 0.41,
    },
  },
  {
    id: 'metro-sevilla',
    name: 'Sociedad Concesionaria Metro de Sevilla (Globalvia)',
    contractCode: 'CTAS-CONC-METRO/01',
    mode: 'rail',
    modeLabelEs: 'Metro Suburbano',
    modeLabelEn: 'Suburban Metro',
    fleetAssigned: 21,
    monthlyTrips: 14200,
    complianceRate: 99.4,
    regularityScore: 98.8,
    penaltiesAccruedEuros: 0,
    penaltiesInDisputeEuros: 0,
    bonusesEarnedEuros: 450,
    baseMonthlyFeeEuros: 3800000,
    status: 'compliant',
    auditNotesEs: 'Disponibilidad de vía 100%. Soporte de transbordo en San Bernardo ejemplar.',
    auditNotesEn: '100% track availability. Transfer support at San Bernardo exemplary.',
    kpis: {
      punctuality: 98.8,
      tripDelivery: 99.4,
      climateComfort: 99.6,
      pmrRamps: 99.9,
      cleanlinessScore: 9.7,
      complaintsRate: 0.22,
    },
  },
  {
    id: 'empresa-casal',
    name: 'Empresa Casal (Consorcio Corredor Aljarafe)',
    contractCode: 'CTAS-VCM-101/CASAL',
    mode: 'interurban',
    modeLabelEs: 'Autobuses Metropolitanos Aljarafe',
    modeLabelEn: 'Metropolitan Buses Aljarafe',
    fleetAssigned: 92,
    monthlyTrips: 11800,
    complianceRate: 98.2,
    regularityScore: 94.6,
    penaltiesAccruedEuros: 0,
    penaltiesInDisputeEuros: 310,
    bonusesEarnedEuros: 0,
    baseMonthlyFeeEuros: 980000,
    status: 'in_dispute',
    auditNotesEs: 'Expediente Plaza de Armas: Alegación por avería fortuita de embrague en dársena.',
    auditNotesEn: 'Plaza de Armas docket: Claim regarding unforeseen clutch failure at bay.',
    kpis: {
      punctuality: 94.6,
      tripDelivery: 98.2,
      climateComfort: 98.2,
      pmrRamps: 98.8,
      cleanlinessScore: 9.0,
      complaintsRate: 0.89,
    },
  },
];

// ---------------------------------------------------------------------------
// INTERCHANGE HUBS PER SITE
// ---------------------------------------------------------------------------
const BARCELONA_HUBS: InterchangeHub[] = [
  {
    id: 'hub-sants',
    name: 'Barcelona Sants Estació Central',
    code: 'SNT',
    lat: 41.3792,
    lng: 2.1402,
    modes: ['Rodalies R1, R3, R4', 'Metro L3, L5', 'Bus Urbà TMB', 'Bus Interurbà', 'AVE'],
    linesCount: 34,
    dailyPassengers: 320000,
    docksCount: 28,
    activeCrowdLevel: 'surge',
    status: 'alert',
  },
  {
    id: 'hub-catalunya',
    name: 'Intercanviador Plaça de Catalunya',
    code: 'CAT',
    lat: 41.3870,
    lng: 2.1700,
    modes: ['Rodalies R1, R4', 'FGC L6, L7, S1, S2', 'Metro L1, L3', 'TMB Bus'],
    linesCount: 28,
    dailyPassengers: 280000,
    docksCount: 16,
    activeCrowdLevel: 'high',
    status: 'alert',
  },
  {
    id: 'hub-sagrera',
    name: 'Sagrera - Meridiana',
    code: 'SAG',
    lat: 41.4230,
    lng: 2.1870,
    modes: ['Rodalies R3, R4', 'Metro L1, L5', 'Exprés.cat Sagalés'],
    linesCount: 22,
    dailyPassengers: 190000,
    docksCount: 20,
    activeCrowdLevel: 'moderate',
    status: 'nominal',
  },
  {
    id: 'hub-espanya',
    name: 'Intercanviador Plaça d\'Espanya',
    code: 'ESP',
    lat: 41.3745,
    lng: 2.1490,
    modes: ['FGC L8, R5, R6', 'Metro L1, L3', 'Aerobús', 'TMB Bus'],
    linesCount: 24,
    dailyPassengers: 185000,
    docksCount: 18,
    activeCrowdLevel: 'low',
    status: 'nominal',
  },
];

const SEVILLA_HUBS: InterchangeHub[] = [
  {
    id: 'hub-santa-justa',
    name: 'Estación Central Sevilla Santa Justa',
    code: 'STJ',
    lat: 37.3920,
    lng: -5.9750,
    modes: ['Cercanías C-1, C-4, C-5', 'TUSSAM Línea 28, C1, C2, EA', 'AVE'],
    linesCount: 18,
    dailyPassengers: 140000,
    docksCount: 22,
    activeCrowdLevel: 'surge',
    status: 'alert',
  },
  {
    id: 'hub-san-bernardo',
    name: 'Intercambiador San Bernardo Viapol',
    code: 'SBN',
    lat: 37.3805,
    lng: -5.9790,
    modes: ['Cercanías C-1, C-4', 'Metro Línea 1', 'Tranvía T1 MetroCentro', 'TUSSAM Bus'],
    linesCount: 16,
    dailyPassengers: 115000,
    docksCount: 14,
    activeCrowdLevel: 'high',
    status: 'alert',
  },
  {
    id: 'hub-plaza-armas',
    name: 'Estación de Autobuses Plaza de Armas',
    code: 'PDA',
    lat: 37.3910,
    lng: -6.0020,
    modes: ['Autobuses Metropolitanos Aljarafe', 'TUSSAM Bus', 'Largo Recorrido'],
    linesCount: 26,
    dailyPassengers: 95000,
    docksCount: 38,
    activeCrowdLevel: 'moderate',
    status: 'nominal',
  },
  {
    id: 'hub-prado',
    name: 'Intercambiador Prado de San Sebastián',
    code: 'PRA',
    lat: 37.3812,
    lng: -5.9875,
    modes: ['Metro Línea 1', 'Tranvía MetroCentro T1', 'Autobuses Consorcio Sur', 'TUSSAM'],
    linesCount: 20,
    dailyPassengers: 85000,
    docksCount: 18,
    activeCrowdLevel: 'low',
    status: 'nominal',
  },
];

// ---------------------------------------------------------------------------
// LINES PER SITE
// ---------------------------------------------------------------------------
const BARCELONA_LINES: TransportLine[] = [
  {
    id: 'bcn-r1',
    name: 'Rodalies R1',
    mode: 'cercanias',
    code: 'R1',
    color: '#0085C7',
    textColor: '#FFFFFF',
    routeEs: 'Molins de Rei – Sants – Plaça Catalunya – Mataró – Maçanet',
    routeEn: 'Molins de Rei – Sants – Plaça Catalunya – Mataró – Maçanet',
    stationsCount: 31,
    frequencyPeakMin: 6,
    operator: 'Rodalies de Catalunya',
    activeVehicles: 28,
    status: 'disrupted',
  },
  {
    id: 'bcn-r4',
    name: 'Rodalies R4',
    mode: 'cercanias',
    code: 'R4',
    color: '#F39200',
    textColor: '#FFFFFF',
    routeEs: 'Sant Vicenç de Calders – Sants – Manresa',
    routeEn: 'Sant Vicenç de Calders – Sants – Manresa',
    stationsCount: 39,
    frequencyPeakMin: 8,
    operator: 'Rodalies de Catalunya',
    activeVehicles: 32,
    status: 'delayed',
  },
  {
    id: 'bcn-l1',
    name: 'Metro Línea 1 (Roig)',
    mode: 'metro',
    code: 'L1',
    color: '#E30613',
    textColor: '#FFFFFF',
    routeEs: 'Hospital de Bellvitge – Espanya – Catalunya – Clot – Fondo',
    routeEn: 'Hospital de Bellvitge – Espanya – Catalunya – Clot – Fondo',
    stationsCount: 30,
    frequencyPeakMin: 2.8,
    operator: 'TMB Metro',
    activeVehicles: 44,
    status: 'nominal',
  },
  {
    id: 'bcn-l3',
    name: 'Metro Línea 3 (Verd)',
    mode: 'metro',
    code: 'L3',
    color: '#009640',
    textColor: '#FFFFFF',
    routeEs: 'Zona Universitària – Sants – Catalunya – Passeig de Gràcia – Trinitat Nova',
    routeEn: 'Zona Universitària – Sants – Catalunya – Passeig de Gràcia – Trinitat Nova',
    stationsCount: 26,
    frequencyPeakMin: 3.2,
    operator: 'TMB Metro',
    activeVehicles: 36,
    status: 'nominal',
  },
  {
    id: 'bcn-l5',
    name: 'Metro Línea 5 (Blau)',
    mode: 'metro',
    code: 'L5',
    color: '#0072CE',
    textColor: '#FFFFFF',
    routeEs: 'Cornellà Centre – Sants Estació – Sagrada Família – Vall d\'Hebron',
    routeEn: 'Cornellà Centre – Sants Estació – Sagrada Família – Vall d\'Hebron',
    stationsCount: 27,
    frequencyPeakMin: 3.0,
    operator: 'TMB Metro',
    activeVehicles: 38,
    status: 'nominal',
  },
  {
    id: 'bcn-h12',
    name: 'TMB Bus H12 (Gran Via)',
    mode: 'emt',
    code: 'H12',
    color: '#D8232A',
    textColor: '#FFFFFF',
    routeEs: 'Gornal – Ildefons Cerdà – Pl. Espanya – Pl. Universitat – Besòs Verneda',
    routeEn: 'Gornal – Ildefons Cerdà – Pl. Espanya – Pl. Universitat – Besòs Verneda',
    stationsCount: 32,
    frequencyPeakMin: 4,
    operator: 'TMB Bus Metropolità',
    activeVehicles: 26,
    status: 'nominal',
  },
  {
    id: 'bcn-e11',
    name: 'Exprés.cat e11.1 (Maresme)',
    mode: 'interurban',
    code: 'e11.1',
    color: '#007A3D',
    textColor: '#FFFFFF',
    routeEs: 'Barcelona (Sants / Gran Via) – Mataró Centre',
    routeEn: 'Barcelona (Sants / Gran Via) – Mataró Centre',
    stationsCount: 8,
    frequencyPeakMin: 10,
    operator: 'Moventis / Casas',
    activeVehicles: 16,
    status: 'delayed',
  },
];

const SEVILLA_LINES: TransportLine[] = [
  {
    id: 'sev-c1',
    name: 'Cercanías C-1',
    mode: 'cercanias',
    code: 'C-1',
    color: '#8A1538',
    textColor: '#FFFFFF',
    routeEs: 'Lora del Río – Santa Justa – San Bernardo – Utrera – Lebrija',
    routeEn: 'Lora del Río – Santa Justa – San Bernardo – Utrera – Lebrija',
    stationsCount: 20,
    frequencyPeakMin: 15,
    operator: 'Renfe Cercanías Sevilla',
    activeVehicles: 14,
    status: 'disrupted',
  },
  {
    id: 'sev-l1',
    name: 'Metro de Sevilla Línea 1',
    mode: 'metro',
    code: 'L1',
    color: '#00853F',
    textColor: '#FFFFFF',
    routeEs: 'Ciudad Expo – San Juan – Puerta Jerez – San Bernardo – Olivar de Quintos',
    routeEn: 'Ciudad Expo – San Juan – Puerta Jerez – San Bernardo – Olivar de Quintos',
    stationsCount: 22,
    frequencyPeakMin: 4,
    operator: 'Metro de Sevilla (Globalvia)',
    activeVehicles: 18,
    status: 'nominal',
  },
  {
    id: 'sev-c1-bus',
    name: 'TUSSAM Línea C1',
    mode: 'emt',
    code: 'C1',
    color: '#E31B23',
    textColor: '#FFFFFF',
    routeEs: 'Circular Exterior: Santa Justa – Prado – Los Remedios – Triana – Macarena',
    routeEn: 'Circular Exterior: Santa Justa – Prado – Los Remedios – Triana – Macarena',
    stationsCount: 36,
    frequencyPeakMin: 5,
    operator: 'TUSSAM (Urbano Sevilla)',
    activeVehicles: 24,
    status: 'nominal',
  },
  {
    id: 'sev-m160',
    name: 'Metropolitano M-160 (Aljarafe)',
    mode: 'interurban',
    code: 'M-160',
    color: '#1A7F37',
    textColor: '#FFFFFF',
    routeEs: 'Sevilla (Plaza de Armas) – Tomares – Castilleja de la Cuesta – Bormujos',
    routeEn: 'Sevilla (Plaza de Armas) – Tomares – Castilleja de la Cuesta – Bormujos',
    stationsCount: 19,
    frequencyPeakMin: 12,
    operator: 'Consorcio Metropolitano (Empresa Casal)',
    activeVehicles: 12,
    status: 'delayed',
  },
  {
    id: 'sev-t1',
    name: 'MetroCentro T1 (Tranvía)',
    mode: 'light_rail',
    code: 'T1',
    color: '#F39200',
    textColor: '#FFFFFF',
    routeEs: 'Plaza Nueva – Archivo de Indias – San Bernardo – Eduardo Dato',
    routeEn: 'Plaza Nueva – Archivo de Indias – San Bernardo – Eduardo Dato',
    stationsCount: 8,
    frequencyPeakMin: 6,
    operator: 'Tranvía de Sevilla (TUSSAM)',
    activeVehicles: 6,
    status: 'nominal',
  },
];

// ---------------------------------------------------------------------------
// SHIFT DATA PER SITE
// ---------------------------------------------------------------------------
const MADRID_SHIFT_DATA: SiteShiftData = {
  shiftLead: {
    name: 'Rubén Cano',
    roleId: 'R02',
    titleEs: 'Jefe de Turno de Operaciones CITRAM Madrid',
    titleEn: 'CITRAM Madrid Operations Shift Lead',
    console: 'Consola Central Sala CITRAM',
  },
  team: [
    { roleId: 'R01', name: 'Lucía Ferrer', title: 'Operadora Metro / Cercanías', status: 'active', console: 'Puesto 03' },
    { roleId: 'R02', name: 'Rubén Cano', title: 'Jefe de Turno de Sala (Shift Lead)', status: 'active', console: 'Consola Principal' },
    { roleId: 'R03', name: 'Andrés Molina', title: 'Coordinador Principal de Incidentes', status: 'active', console: 'Puesto 01' },
    { roleId: 'R04', name: 'Beatriz Lara', title: 'Oficial de Información al Viajero', status: 'active', console: 'Puesto Comms' },
    { roleId: 'R05', name: 'Elena Ruiz', title: 'Planificadora de Oferta GESTRA', status: 'active', console: 'Puesto Planificación' },
    { roleId: 'R13', name: 'Tomás Gil', title: 'Despachador EMT / Autobuses', status: 'active', console: 'Puesto EMT Remoto' },
  ],
  events: [
    { time: '13:43:30', author: 'Beatriz Lara (R04)', textEs: 'Aviso bilingüe de corte de catenaria publicado en App y paneles PIS de Atocha.', textEn: 'Bilingual catenary outage notice broadcast to App and Atocha PIS screens.' },
    { time: '13:42:15', author: 'Andrés Molina (R03)', textEs: 'Validación de telemetría Adif 0V. Despachados 4 autobuses SE desde Entrevías.', textEn: 'Adif 0V telemetry validated. 4 SE relief buses dispatched from Entrevías.' },
    { time: '13:41:04', author: 'CITRAM Engine (N23)', textEs: 'Disparo de disyuntor subestación Méndez Álvaro. Generado caso INC-2026-0929-ATO.', textEn: 'Méndez Álvaro substation breaker trip. Generated case INC-2026-0929-ATO.' },
    { time: '13:18:22', author: 'Lucía Ferrer (R01)', textEs: 'Chamartín vía 7: Avería de aguja sin consecuencias. Tráfico derivado a vía 8.', textEn: 'Chamartín track 7: Switch fault without incident. Traffic diverted to track 8.' },
    { time: '12:00:00', author: 'Rubén Cano (R02)', textEs: 'Relevo de mediodía completado con 100% de consolas operativas.', textEn: 'Midday shift rotation completed with 100% operational consoles.' },
  ],
  slaClocks: [
    {
      caseId: 'INC-2026-0929-ATO',
      titleEs: 'Avería Catenaria Atocha (Cercanías C-3/C-4)',
      titleEn: 'Atocha Catenary Fault (Cercanías C-3/C-4)',
      severity: 'critical',
      targetMinutes: 20,
      elapsedMinutes: 8,
      remainingMinutes: 12,
      status: 'warning',
      nextMilestoneEs: 'Paso 8 Runbook: Restablecimiento de tensión Adif',
      nextMilestoneEn: 'Runbook step 8: Adif power restoration sign-off',
    },
    {
      caseId: 'INC-2026-0929-CHA',
      titleEs: 'Fallo Señalización Chamartín Vía 7',
      titleEn: 'Chamartín Track 7 Signalling Outage',
      severity: 'moderate',
      targetMinutes: 45,
      elapsedMinutes: 17,
      remainingMinutes: 28,
      status: 'nominal',
      nextMilestoneEs: 'Despeje de agujas por mantenimiento Adif',
      nextMilestoneEn: 'Switch clearance by Adif maintenance',
    },
  ],
};

const BARCELONA_SHIFT_DATA: SiteShiftData = {
  shiftLead: {
    name: 'Jordi Cardona',
    roleId: 'R02',
    titleEs: 'Cap de Torn Centre de Control ATM Barcelona',
    titleEn: 'ATM Barcelona Control Center Shift Lead',
    console: 'Consola Central ATM Gran Via',
  },
  team: [
    { roleId: 'R01', name: 'Marta Soler', title: 'Operadora TMB / Rodalies', status: 'active', console: 'Puesto BCN-02' },
    { roleId: 'R02', name: 'Jordi Cardona', title: 'Cap de Torn (Shift Lead)', status: 'active', console: 'Consola Principal ATM' },
    { roleId: 'R03', name: 'Oriol Puig', title: 'Coordinador d\'Incidències Metropolitanes', status: 'active', console: 'Puesto BCN-01' },
    { roleId: 'R04', name: 'Núria Riera', title: 'Oficial d\'Informació al Passatger ATM', status: 'active', console: 'Puesto Comms ATM' },
    { roleId: 'R05', name: 'Xavier Bosch', title: 'Planificador d\'Oferta Integrada', status: 'active', console: 'Puesto Oferta' },
    { roleId: 'R13', name: 'Pol Vila', title: 'Despatxador Exprés.cat i Moventis', status: 'active', console: 'Puesto Interurbans' },
  ],
  events: [
    { time: '13:44:10', author: 'Núria Riera (R04)', textEs: 'Avisos actualizados en app TMB y megafonía de Sants Estació (avaria d\'agulles).', textEn: 'Alerts updated in TMB app and Sants Estació PA system (switch fault).' },
    { time: '13:41:50', author: 'Oriol Puig (R03)', textEs: 'Autorizada retención de 4 min en bus e11.1 a Mataró para transbordo de R1.', textEn: 'Authorized 4 min hold on e11.1 Mataró bus for transferring R1 passengers.' },
    { time: '13:39:15', author: 'CITRAM Engine (N23)', textEs: 'Desajuste de enclavamiento en vía 7 Sants. Generado caso INC-2026-0929-SNT.', textEn: 'Interlocking mismatch track 7 Sants. Generated case INC-2026-0929-SNT.' },
    { time: '13:05:00', author: 'Marta Soler (R01)', textEs: 'FGC Plaça Espanya: Restablecido paso normal tras limpieza de andén.', textEn: 'FGC Plaça Espanya: Normal headway restored following platform cleanup.' },
    { time: '12:00:00', author: 'Jordi Cardona (R02)', textEs: 'Relleu de migdia efectuat amb 100% de consoles sincronitzades.', textEn: 'Midday handover completed with 100% synchronized consoles.' },
  ],
  slaClocks: [
    {
      caseId: 'INC-2026-0929-SNT',
      titleEs: 'Avaria d\'Agulles Sants Estació (Rodalies R1/R4)',
      titleEn: 'Sants Switch Fault (Rodalies R1/R4)',
      severity: 'critical',
      targetMinutes: 20,
      elapsedMinutes: 6,
      remainingMinutes: 14,
      status: 'warning',
      nextMilestoneEs: 'Paso 5 Runbook: Verificación de tracción y despeje de vía 7',
      nextMilestoneEn: 'Runbook step 5: Traction check & track 7 clearance',
    },
    {
      caseId: 'INC-2026-0929-CAT',
      titleEs: 'Ascensor PMR Plaça de Catalunya L1/L3',
      titleEn: 'PMR Lift Plaça de Catalunya L1/L3',
      severity: 'moderate',
      targetMinutes: 30,
      elapsedMinutes: 11,
      remainingMinutes: 19,
      status: 'nominal',
      nextMilestoneEs: 'Llegada de brigada de mantenimiento Thyssen',
      nextMilestoneEn: 'Arrival of Thyssen maintenance team',
    },
  ],
};

const SEVILLA_SHIFT_DATA: SiteShiftData = {
  shiftLead: {
    name: 'Manuel Romero',
    roleId: 'R02',
    titleEs: 'Jefe de Sala Consorcio de Transportes de Sevilla',
    titleEn: 'Consorcio de Transportes de Sevilla Room Lead',
    console: 'Consola Central Plaza de Armas',
  },
  team: [
    { roleId: 'R01', name: 'Rocío Macías', title: 'Operadora Metro / TUSSAM', status: 'active', console: 'Puesto SEV-02' },
    { roleId: 'R02', name: 'Manuel Romero', title: 'Jefe de Turno de Sala (Shift Lead)', status: 'active', console: 'Consola Principal Consorcio' },
    { roleId: 'R03', name: 'Álvaro Cruz', title: 'Coordinador de Incidencias Metropolitanas', status: 'active', console: 'Puesto SEV-01' },
    { roleId: 'R04', name: 'Carmen Peña', title: 'Oficial de Información al Usuario', status: 'active', console: 'Puesto Comms CTAS' },
    { roleId: 'R05', name: 'David Moreno', title: 'Planificador de Servicios Metropolitanos', status: 'active', console: 'Puesto Planificación' },
    { roleId: 'R13', name: 'Francisco Ruiz', title: 'Despachador Empresa Casal / Damas', status: 'active', console: 'Puesto Aljarafe' },
  ],
  events: [
    { time: '13:43:00', author: 'Carmen Peña (R04)', textEs: 'Aviso publicado en redes y marquesinas de Santa Justa por avería de enclavamiento.', textEn: 'Alert broadcast to social channels and Santa Justa stops regarding interlocking fault.' },
    { time: '13:40:20', author: 'Álvaro Cruz (R03)', textEs: 'Activado refuerzo con 4 autobuses TUSSAM C1 para absorber transbordo en San Bernardo.', textEn: 'Activated 4 TUSSAM C1 relief buses to absorb transfer demand at San Bernardo.' },
    { time: '13:38:00', author: 'CITRAM Engine (N23)', textEs: 'Avería de señalización túnel Santa Justa - San Bernardo. Caso INC-2026-0929-STJ.', textEn: 'Signalling outage in Santa Justa - San Bernardo tunnel. Case INC-2026-0929-STJ.' },
    { time: '13:10:00', author: 'Rocío Macías (R01)', textEs: 'Dársena 3 Plaza de Armas: Grúa de asistencia retira autobús averiado M-160.', textEn: 'Plaza de Armas bay 3: Tow truck cleared immobilized M-160 bus.' },
    { time: '12:00:00', author: 'Manuel Romero (R02)', textEs: 'Relevo del turno de mañana completado con normalidad.', textEn: 'Morning shift handover completed with nominal console status.' },
  ],
  slaClocks: [
    {
      caseId: 'INC-2026-0929-STJ',
      titleEs: 'Avería Señalización Santa Justa (Cercanías C-1)',
      titleEn: 'Santa Justa Signalling Outage (Cercanías C-1)',
      severity: 'critical',
      targetMinutes: 25,
      elapsedMinutes: 7,
      remainingMinutes: 18,
      status: 'warning',
      nextMilestoneEs: 'Paso 4 Runbook: Desvío alternativo de viajeros a Metro L1',
      nextMilestoneEn: 'Runbook step 4: Passenger diversion to Metro L1',
    },
    {
      caseId: 'INC-2026-0929-PDA',
      titleEs: 'Incidencia Dársena Plaza de Armas',
      titleEn: 'Plaza de Armas Bay Incident',
      severity: 'moderate',
      targetMinutes: 30,
      elapsedMinutes: 14,
      remainingMinutes: 16,
      status: 'nominal',
      nextMilestoneEs: 'Comprobación de despeje de dársena 3',
      nextMilestoneEn: 'Bay 3 clearance verification',
    },
  ],
};

// ---------------------------------------------------------------------------
// MASTER EXPORT FUNCTIONS
// ---------------------------------------------------------------------------
export function getSiteMapBounds(siteId: string): SiteMapBounds {
  if (siteId === 'site-b') return BARCELONA_MAP_BOUNDS;
  if (siteId === 'site-c') return SEVILLA_MAP_BOUNDS;
  return MADRID_MAP_BOUNDS;
}

export function getSiteDecisionCards(siteId: string, language: 'es' | 'en' = 'es'): DecisionCardItem[] {
  if (siteId === 'site-b') return BARCELONA_DECISION_CARDS;
  if (siteId === 'site-c') return SEVILLA_DECISION_CARDS;
  return MADRID_DECISION_CARDS;
}

export function getSitePunctualityMetrics(siteId: string): SitePunctualityMetric[] {
  if (siteId === 'site-b') return BARCELONA_PUNCTUALITY;
  if (siteId === 'site-c') return SEVILLA_PUNCTUALITY;
  return MADRID_PUNCTUALITY;
}

export function getSiteOperators(siteId: string): SiteOperatorCompliance[] {
  if (siteId === 'site-b') return BARCELONA_OPERATORS;
  if (siteId === 'site-c') return SEVILLA_OPERATORS;
  return MADRID_OPERATORS;
}

export function getSiteInterchanges(siteId: string): InterchangeHub[] {
  if (siteId === 'site-b') return BARCELONA_HUBS;
  if (siteId === 'site-c') return SEVILLA_HUBS;
  // default to Madrid
  return [
    {
      id: 'hub-atocha',
      name: 'Intercambiador y Estación Atocha',
      code: 'ATO',
      lat: 40.4065,
      lng: -3.6895,
      modes: ['Cercanías', 'Metro L1', 'EMT', 'Interurbanos', 'Alta Velocidad'],
      linesCount: 38,
      dailyPassengers: 350000,
      docksCount: 32,
      activeCrowdLevel: 'surge',
      status: 'alert',
    },
    {
      id: 'hub-chamartin',
      name: 'Intercambiador Chamartín Clara Campoamor',
      code: 'CHA',
      lat: 40.4721,
      lng: -3.6826,
      modes: ['Cercanías', 'Metro L1, L10', 'EMT', 'Interurbanos', 'Alta Velocidad'],
      linesCount: 26,
      dailyPassengers: 220000,
      docksCount: 24,
      activeCrowdLevel: 'moderate',
      status: 'nominal',
    },
    {
      id: 'hub-moncloa',
      name: 'Intercambiador de Moncloa',
      code: 'MON',
      lat: 40.4354,
      lng: -3.7196,
      modes: ['Metro L3, L6', 'Interurbanos A-6', 'EMT'],
      linesCount: 44,
      dailyPassengers: 310000,
      docksCount: 42,
      activeCrowdLevel: 'moderate',
      status: 'nominal',
    },
    {
      id: 'hub-av-america',
      name: 'Intercambiador de Avenida de América',
      code: 'AVA',
      lat: 40.4406,
      lng: -3.6700,
      modes: ['Metro L4, L6, L7, L9', 'Interurbanos A-2', 'EMT'],
      linesCount: 36,
      dailyPassengers: 210000,
      docksCount: 36,
      activeCrowdLevel: 'low',
      status: 'nominal',
    },
  ];
}

export function getSiteLines(siteId: string): TransportLine[] {
  if (siteId === 'site-b') return BARCELONA_LINES;
  if (siteId === 'site-c') return SEVILLA_LINES;
  // default to Madrid
  return [
    {
      id: 'c-3',
      name: 'Cercanías C-3',
      mode: 'cercanias',
      code: 'C-3',
      color: '#8A1538',
      textColor: '#FFFFFF',
      routeEs: 'Aranjuez – Atocha – Chamartín – El Escorial',
      routeEn: 'Aranjuez – Atocha – Chamartín – El Escorial',
      stationsCount: 23,
      frequencyPeakMin: 6,
      operator: 'Renfe Cercanías (N03)',
      activeVehicles: 34,
      status: 'disrupted',
    },
    {
      id: 'c-4',
      name: 'Cercanías C-4',
      mode: 'cercanias',
      code: 'C-4',
      color: '#0055A5',
      textColor: '#FFFFFF',
      routeEs: 'Parla – Atocha – Chamartín – Alcobendas',
      routeEn: 'Parla – Atocha – Chamartín – Alcobendas',
      stationsCount: 21,
      frequencyPeakMin: 5,
      operator: 'Renfe Cercanías (N03)',
      activeVehicles: 42,
      status: 'delayed',
    },
    {
      id: 'l-1',
      name: 'Metro Línea 1',
      mode: 'metro',
      code: 'L1',
      color: '#0097D9',
      textColor: '#FFFFFF',
      routeEs: 'Pinar de Chamartín – Sol – Atocha – Valdecarros',
      routeEn: 'Pinar de Chamartín – Sol – Atocha – Valdecarros',
      stationsCount: 33,
      frequencyPeakMin: 3.5,
      operator: 'Metro de Madrid (N02)',
      activeVehicles: 48,
      status: 'nominal',
    },
    {
      id: 'l-6',
      name: 'Metro Línea 6 (Circular)',
      mode: 'metro',
      code: 'L6',
      color: '#8A8D8F',
      textColor: '#FFFFFF',
      routeEs: 'Circular (Moncloa – Cuatro Caminos – Av. América)',
      routeEn: 'Circular (Moncloa – Cuatro Caminos – Av. América)',
      stationsCount: 28,
      frequencyPeakMin: 2.8,
      operator: 'Metro de Madrid (N02)',
      activeVehicles: 64,
      status: 'nominal',
    },
    {
      id: 'emt-27',
      name: 'EMT Línea 27',
      mode: 'emt',
      code: '27',
      color: '#0047BA',
      textColor: '#FFFFFF',
      routeEs: 'Embajadores – Atocha – Castellana – Plaza Castilla',
      routeEn: 'Embajadores – Atocha – Castellana – Plaza Castilla',
      stationsCount: 38,
      frequencyPeakMin: 3,
      operator: 'EMT Madrid (N01)',
      activeVehicles: 36,
      status: 'nominal',
    },
    {
      id: 'bus-352',
      name: 'Interurbano 352 (A-3)',
      mode: 'interurban',
      code: '352',
      color: '#00853F',
      textColor: '#FFFFFF',
      routeEs: 'Madrid (Atocha) – Perales – Fuentidueña',
      routeEn: 'Madrid (Atocha) – Perales – Fuentidueña',
      stationsCount: 28,
      frequencyPeakMin: 12,
      operator: 'Empresa Ruiz (N05)',
      activeVehicles: 18,
      status: 'delayed',
    },
  ];
}

export function getSiteShiftData(siteId: string): SiteShiftData {
  if (siteId === 'site-b') return BARCELONA_SHIFT_DATA;
  if (siteId === 'site-c') return SEVILLA_SHIFT_DATA;
  return MADRID_SHIFT_DATA;
}

export function generateSiteFleet(siteId: string, count = 1200): SimulatedVehicle[] {
  const bounds = getSiteMapBounds(siteId);
  const siteLines = getSiteLines(siteId);
  const vehicles: SimulatedVehicle[] = [];

  let seed = siteId === 'site-b' ? 19970101 : siteId === 'site-c' ? 20010915 : 19850516;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const lineCodes = siteLines.map((l) => l.code);
  const modes: ('metro' | 'cercanias' | 'emt' | 'interurban' | 'light_rail')[] = [
    'metro', 'cercanias', 'emt', 'interurban', 'light_rail',
  ];

  for (let i = 0; i < count; i++) {
    const lineIndex = i % lineCodes.length;
    const lineCode = lineCodes[lineIndex];
    const mode = siteLines[lineIndex]?.mode || modes[i % modes.length];
    const lat = bounds.minLat + pseudoRandom() * (bounds.maxLat - bounds.minLat);
    const lng = bounds.minLng + pseudoRandom() * (bounds.maxLng - bounds.minLng);
    const heading = Math.round(pseudoRandom() * 360);
    const speedKmh = Math.round(15 + pseudoRandom() * 45);
    const occupancyPercent = Math.round(40 + pseudoRandom() * 55);

    vehicles.push({
      id: `veh-${siteId}-${mode}-${1000 + i}`,
      lineCode,
      mode,
      operatorId: mode === 'cercanias' ? 'N03' : mode === 'metro' ? 'N02' : 'N01',
      vehicleNumber: `${mode.toUpperCase().slice(0, 3)}-${2000 + (i % 900)}`,
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
      heading,
      speedKmh,
      occupancyPercent,
      nextStop: i % 2 === 0 ? (siteId === 'site-b' ? 'Sants Estació' : siteId === 'site-c' ? 'Santa Justa' : 'Atocha Central') : (siteId === 'site-b' ? 'Plaça Catalunya' : siteId === 'site-c' ? 'San Bernardo' : 'Nuevos Ministerios'),
      status: i === 42 ? 'delayed' : 'in_service',
      delaySeconds: i === 42 ? 360 : 0,
      lastUpdateEpoch: Date.now() - Math.round(pseudoRandom() * 5000),
      propulsion: i % 3 === 0 ? 'electric' : i % 3 === 1 ? 'cng' : 'hybrid',
    });
  }

  return vehicles;
}

export function getSiteHeroCase(siteId: string): IncidentCase {
  if (siteId === 'site-b') {
    return {
      id: 'INC-2026-0929-SNT',
      titleEs: 'Avaria d\'Agulles i Senyalització a Sants Estació',
      titleEn: 'Track Switch and Signalling Outage at Sants Station',
      summaryEs: 'Falta de comprovació d\'agulla a la capçalera sud de Barcelona Sants afectant les vies 7 i 8 de Rodalies.',
      summaryEn: 'Switch alignment failure on southern throat of Barcelona Sants impacting tracks 7 & 8 of Rodalies.',
      severity: 'critical',
      primaryCorridor: 'Corredor Litoral / Barcelona Sants - Sagrera',
      affectedLines: ['Rodalies R1', 'Rodalies R4', 'Bus Exprés e11.1'],
      affectedStations: ['Barcelona Sants', 'Plaça de Catalunya', 'Arc de Triomf', 'El Clot'],
      affectedPassengersCount: 5140,
      detectedAt: '13:39:15',
      slaTargetMinutes: 20,
      slaTimeRemainingMinutes: 14,
      dimensions: {
        lifecycle: 'active',
        urgency: 'immediate',
        reliability: 'confirmed',
        operationalStatus: 'major_disruption',
        resolution: 'mitigation_in_progress',
      },
      claimedBy: {
        userId: 'oriol.puig@atm.cat',
        fullName: 'Oriol Puig',
        roleId: 'R03',
        roleName: 'Coordinador d\'Incidències ATM',
        claimedAt: '13:40:00',
      },
      runbook: {
        id: 'RB-01-BCN',
        code: 'RB-01-SANTS-AGULLES',
        name: 'Protocol d\'Emergència per Tall de Vies a Sants i Coordinació Multimodal ATM',
        steps: [
          {
            id: 1,
            titleEs: '1. Validació de Telemetria i Abast',
            titleEn: '1. Telemetry Validation & Scope Confirmation',
            descriptionEs: 'Comprovació de dades SCADA Adif i càmeres d\'andana a Sants.',
            descriptionEn: 'Verify Adif SCADA telemetry and platform CCTV feeds at Sants.',
            actorRole: 'R01 / R03',
            nonHumanActor: 'N03 (Adif/Renfe), N16 (CCTV)',
            status: 'completed',
            completedAt: '13:40:30',
            completedBy: 'Oriol Puig (R03)',
            evidenceNotes: 'Pèrdua de senyal a agulla 14B capçalera sud de Sants confirmada.',
            actionPayload: { type: 'notify', details: 'Avaria d\'infraestructura confirmada.' },
          },
          {
            id: 2,
            titleEs: '2. Notificació Concurrente a Operadors',
            titleEn: '2. Concurrent Operator Notification Dispatched',
            descriptionEs: 'Alerta immediata a Rodalies, TMB Metro, TMB Bus i TRAM.',
            descriptionEn: 'Immediate broadcast to Rodalies, TMB Metro, TMB Bus, and TRAM.',
            actorRole: 'R03',
            nonHumanActor: 'N01 (TMB), N03 (Rodalies)',
            status: 'completed',
            completedAt: '13:41:10',
            completedBy: 'Oriol Puig (R03)',
            evidenceNotes: 'Acusament de recepció rebut de TMB i Rodalies en 32 segons.',
            actionPayload: { type: 'notify', details: 'Notificació a 4 operadors completada.' },
          },
          {
            id: 3,
            titleEs: '3. Retenció de Connexió Intermodal a Sants',
            titleEn: '3. Intermodal Connection Hold at Sants',
            descriptionEs: 'Retenir 4 minuts la sortida del bus exprés e11.1 a Mataró per a 85 viatgers.',
            descriptionEn: 'Hold departure of express bus e11.1 to Mataró by 4 min for 85 transferring passengers.',
            actorRole: 'R03',
            nonHumanActor: 'N01 (SAE Moventis)',
            status: 'in_progress',
            evidenceNotes: 'Comandament de retenció enviat a la consola de l\'autobús a la dàrsena 6.',
            actionPayload: { type: 'hold_connection', details: 'Retenció de 4 minuts executant-se.' },
          },
        ],
      },
      intermodalConnection: {
        trainService: 'Rodalies R1 (Tren 15420)',
        targetBusLine: 'Línia Exprés e11.1 (Barcelona Sants - Mataró)',
        interchangeStation: 'Intercanviador de Barcelona Sants (Dàrsena 6)',
        holdingMinutes: 4,
        passengersBenefiting: 85,
        subsequentKnockOnDelaySeconds: 42,
        costImpactEuros: 38,
        judgment: 'RECOMMENDED',
        status: 'pending_approval',
      },
      reinforcements: {
        requiredBuses: 6,
        dispatchedBuses: 6,
        originDepot: 'Cotxera TMB Zona Franca',
        targetRoute: 'Llançadora Especial Sants - Plaça Catalunya',
        status: 'in_transit',
      },
      passengerCommunications: {
        status: 'approved',
        channels: ['Panells PIS Sants', 'App TMB', 'X / Twitter @Rodalies', 'Megafonia'],
        headlineEs: 'Retards a R1 i R4 per incidència a Sants Estació',
        headlineEn: 'Delays on R1 & R4 due to infrastructure fault at Sants',
        bodyEs: 'A causa d\'una avaria tècnica a Sants, els trens de Rodalies R1 i R4 circulen amb demora mitjana de 25 min. Es recomana utilitzar Metro L1 i L5 com a alternativa.',
        bodyEn: 'Due to technical fault at Sants, Rodalies R1 & R4 run with average 25 min delays. Use Metro L1 & L5 as alternatives.',
      },
      timeline: [
        {
          id: 'EVT-BCN-01',
          timestamp: '13:39:15',
          type: 'actor_telemetry',
          actorId: 'N03',
          actorName: 'Adif SCADA Agulles',
          actorRole: 'Infraestructura Ferroviària',
          description: 'Disparament automàtic de bloqueig en agulla 14B a Barcelona Sants.',
        },
        {
          id: 'EVT-BCN-02',
          timestamp: '13:40:00',
          type: 'decision',
          actorId: 'N23',
          actorName: 'ATM Correlation Engine',
          actorRole: 'Motor d\'Intel·ligència de Trànsit',
          description: 'Generat automàticament cas crític INC-2026-0929-SNT amb 5.140 passatgers afectats.',
        },
      ],
    };
  }

  if (siteId === 'site-c') {
    return {
      id: 'INC-2026-0929-STJ',
      titleEs: 'Incidencia en Enclavamiento Santa Justa / San Bernardo',
      titleEn: 'Interlocking Failure Santa Justa / San Bernardo',
      summaryEs: 'Fallo de señalización en el túnel urbano que enlaza Santa Justa con San Bernardo afectando a Cercanías C-1.',
      summaryEn: 'Signalling failure in urban tunnel connecting Santa Justa with San Bernardo affecting Cercanías C-1.',
      severity: 'critical',
      primaryCorridor: 'Túnel Urbano Santa Justa - San Bernardo',
      affectedLines: ['Cercanías C-1', 'Metro L1', 'TUSSAM C1'],
      affectedStations: ['Sevilla Santa Justa', 'San Bernardo', 'Virgen del Rocío', 'Bellavista'],
      affectedPassengersCount: 2840,
      detectedAt: '13:38:00',
      slaTargetMinutes: 25,
      slaTimeRemainingMinutes: 18,
      dimensions: {
        lifecycle: 'active',
        urgency: 'immediate',
        reliability: 'confirmed',
        operationalStatus: 'major_disruption',
        resolution: 'mitigation_in_progress',
      },
      claimedBy: {
        userId: 'alvaro.cruz@ctas.es',
        fullName: 'Álvaro Cruz',
        roleId: 'R03',
        roleName: 'Coordinador de Sala Consorcio Sevilla',
        claimedAt: '13:39:00',
      },
      runbook: {
        id: 'RB-01-SEV',
        code: 'RB-01-SANTA-JUSTA-SIGNALLING',
        name: 'Protocolo de Contingencia Túnel Ferroviario Central Sevilla',
        steps: [
          {
            id: 1,
            titleEs: '1. Verificación de Telemetría Adif',
            titleEn: '1. Adif Telemetry Check',
            descriptionEs: 'Cruzar datos del enclavamiento electrónico en San Bernardo.',
            descriptionEn: 'Cross-check electronic interlocking data at San Bernardo.',
            actorRole: 'R01 / R03',
            nonHumanActor: 'N03 (Adif/Renfe)',
            status: 'completed',
            completedAt: '13:39:30',
            completedBy: 'Álvaro Cruz (R03)',
            evidenceNotes: 'Ocupación fantasma detectada en cantón 12B túnel Santa Justa.',
            actionPayload: { type: 'notify', details: 'Fallo de circuito de vía confirmado.' },
          },
          {
            id: 2,
            titleEs: '2. Despacho de Refuerzos TUSSAM C1/C2',
            titleEn: '2. TUSSAM C1/C2 Relief Dispatch',
            descriptionEs: 'Instruir salida de 4 autobuses de reserva para absorber demanda en San Bernardo.',
            descriptionEn: 'Instruct departure of 4 reserve buses to absorb demand at San Bernardo.',
            actorRole: 'R03',
            nonHumanActor: 'N01 (SAE TUSSAM)',
            status: 'in_progress',
            evidenceNotes: 'Autobuses despachados desde cocheras de San Jerónimo.',
            actionPayload: { type: 'dispatch_buses', details: 'Flota en ruta a Santa Justa.' },
          },
        ],
      },
      intermodalConnection: {
        trainService: 'Cercanías C-1 (Tren 27140)',
        targetBusLine: 'Línea Metropolita M-160 (Sevilla - Tomares)',
        interchangeStation: 'Intercambiador San Bernardo / Prado (Dársena 3)',
        holdingMinutes: 5,
        passengersBenefiting: 64,
        subsequentKnockOnDelaySeconds: 30,
        costImpactEuros: 24,
        judgment: 'RECOMMENDED',
        status: 'pending_approval',
      },
      reinforcements: {
        requiredBuses: 4,
        dispatchedBuses: 4,
        originDepot: 'Cocheras TUSSAM San Jerónimo',
        targetRoute: 'Servicio Refuerzo Santa Justa - San Bernardo',
        status: 'in_transit',
      },
      passengerCommunications: {
        status: 'approved',
        channels: ['Paneles PIS Santa Justa', 'App Consorcio Sevilla', 'Redes Sociales', 'Megafonía'],
        headlineEs: 'Demoras en Cercanías C-1 por incidencia en túnel de San Bernardo',
        headlineEn: 'Delays on Cercanías C-1 due to San Bernardo tunnel issue',
        bodyEs: 'Por incidencia en el sistema de señalización, los trenes de la línea C-1 registran retrasos de 20 min. Se recomienda transbordar a Metro Línea 1 en San Bernardo.',
        bodyEn: 'Due to signalling issue, line C-1 experiences 20 min delays. Transfer to Metro Line 1 at San Bernardo is recommended.',
      },
      timeline: [
        {
          id: 'EVT-SEV-01',
          timestamp: '13:38:00',
          type: 'actor_telemetry',
          actorId: 'N03',
          actorName: 'Adif Señalización',
          actorRole: 'Infraestructura Ferroviaria',
          description: 'Avería de circuito de vía en túnel urbano Santa Justa - San Bernardo.',
        },
      ],
    };
  }

  // Madrid default
  return {
    id: 'INC-2026-0929-ATO',
    titleEs: 'Avería de Catenaria en Corredor Ferroviario de Atocha',
    titleEn: 'Overhead Catenary Fault at Atocha Rail Corridor',
    summaryEs: 'Caída de tensión en catenaria vías 3 y 4 de Atocha Cercanías que interrumpe la circulación de las líneas C-3, C-4 y C-5 en sentido Sur.',
    summaryEn: 'Overhead line power outage on tracks 3 & 4 at Atocha Cercanías halting southbound train operations on lines C-3, C-4, and C-5.',
    severity: 'critical',
    primaryCorridor: 'Corredor Sur / Atocha - Méndez Álvaro',
    affectedLines: ['Cercanías C-3', 'Cercanías C-4', 'Cercanías C-5', 'Interurbano 352'],
    affectedStations: ['Atocha Cercanías', 'Méndez Álvaro', 'Villaverde Bajo', 'San Cristóbal Industrial'],
    affectedPassengersCount: 4320,
    detectedAt: '13:41:04',
    slaTargetMinutes: 20,
    slaTimeRemainingMinutes: 12,
    dimensions: {
      lifecycle: 'active',
      urgency: 'immediate',
      reliability: 'confirmed',
      operationalStatus: 'major_disruption',
      resolution: 'mitigation_in_progress',
    },
    claimedBy: {
      userId: 'andres.molina@crtm.es',
      fullName: 'Andrés Molina',
      roleId: 'R03',
      roleName: 'Coordinador de Sala de Control',
      claimedAt: '13:42:00',
    },
    runbook: {
      id: 'RB-01',
      code: 'RB-01-ATOCHA-CATENARIA',
      name: 'Protocolo de Emergencia por Corte de Catenaria y Coordinación Intermodal',
      steps: [
        {
          id: 1,
          titleEs: '1. Validación del Incidente y Confirmación de Alcance',
          titleEn: '1. Incident Validation & Scope Confirmation',
          descriptionEs: 'Cruzar telemetría SCADA Adif (N03) con reportes de tracción Renfe y cámaras CCTV de andén (N16).',
          descriptionEn: 'Cross-check Adif SCADA telemetry (N03) against Renfe traction logs and platform CCTV (N16).',
          actorRole: 'R01 / R03',
          nonHumanActor: 'N03 (Adif/Renfe), N16 (CCTV)',
          status: 'completed',
          completedAt: '13:42:15',
          completedBy: 'Andrés Molina (R03)',
          evidenceNotes: 'Telemetría confirmada: caída a 0V en catenaria vía 3 y vía 4 entre Atocha y Méndez Álvaro.',
          actionPayload: { type: 'notify', details: 'Confirmación operativa de avería en infraestructura ferroviaria.' },
        },
        {
          id: 2,
          titleEs: '2. Notificación a Operadores e Infraestructura',
          titleEn: '2. Operator & Infrastructure Notifications Dispatched',
          descriptionEs: 'Notificar en paralelo a Renfe Cercanías (R08), Metro de Madrid (R07), EMT Madrid (R06) y DGT Tráfico (R11).',
          descriptionEn: 'Dispatch concurrent notifications to Renfe Cercanías (R08), Metro de Madrid (R07), EMT Madrid (R06), and DGT Traffic (R11).',
          actorRole: 'R03 (Coordinador)',
          nonHumanActor: 'N01 (EMT), N02 (Metro), N03 (Renfe), N10 (DGT)',
          status: 'completed',
          completedAt: '13:43:02',
          completedBy: 'Andrés Molina (R03)',
          evidenceNotes: 'Canales SIP y bus de mensajería interoperable confirmaron acuse de recibo de los 4 operadores en < 45s.',
          actionPayload: { type: 'notify', details: 'Acuses de recibo recibidos de EMT, Renfe, Metro y DGT.' },
        },
        {
          id: 3,
          titleEs: '3. Despacho de Refuerzos de Autobuses (SE)',
          titleEn: '3. Bus Reinforcement Dispatch (Special Service)',
          descriptionEs: 'Activar Servicio Especial (SE) Atocha - Méndez Álvaro con 4 autobuses de reserva de EMT/Interurbanos.',
          descriptionEn: 'Activate Special Bus Service (SE) Atocha - Méndez Álvaro deploying 4 reserve buses from EMT / Interurbans.',
          actorRole: 'R06 (Regulador EMT)',
          nonHumanActor: 'N01 (SIRI / SAE EMT)',
          status: 'in_progress',
          evidenceNotes: '4 autobuses articulados asignados desde cochera de Entrevías. Tiempo estimado de primera llegada: 8 min.',
          actionPayload: { type: 'dispatch_buses', details: 'Flota reservada: SE-101, SE-102, SE-103, SE-104 en ruta hacia Atocha.' },
        },
      ],
    },
    intermodalConnection: {
      trainService: 'Cercanías C-3 (Tren 24810)',
      targetBusLine: 'Línea Interurbana 352 (Atocha - Fuentidueña)',
      interchangeStation: 'Intercambiador de Atocha (Dársena 14)',
      holdingMinutes: 4,
      passengersBenefiting: 142,
      subsequentKnockOnDelaySeconds: 38,
      costImpactEuros: 48,
      judgment: 'RECOMMENDED',
      status: 'pending_approval',
    },
    reinforcements: {
      requiredBuses: 4,
      dispatchedBuses: 4,
      originDepot: 'Cochera EMT Entrevías',
      targetRoute: 'Servicio Especial Atocha - Méndez Álvaro',
      status: 'in_transit',
    },
    passengerCommunications: {
      status: 'approved',
      channels: ['Pantallas PIS Atocha', 'Megafonía Intercambiador', 'App Mi Transporte', 'X / Twitter @CRTM_Alertas'],
      headlineEs: 'Retrasos en líneas C-3 y C-4 por avería técnica en Atocha',
      headlineEn: 'Delays on lines C-3 & C-4 due to technical outage at Atocha',
      bodyEs: 'Por avería en la infraestructura en Atocha, los trenes de las líneas C-3 y C-4 sufren demoras medias de 25 min. Se recomienda el uso de Metro Línea 1 o el Servicio Especial de autobuses gratuito.',
      bodyEn: 'Due to infrastructure failure at Atocha, lines C-3 and C-4 experience average delays of 25 min. Use Metro Line 1 or free Special Bus Service as alternatives.',
    },
    timeline: [
      {
        id: 'EVT-01',
        timestamp: '13:41:04',
        type: 'actor_telemetry',
        actorId: 'N03',
        actorName: 'Adif SCADA Catenaria',
        actorRole: 'Infraestructura Ferroviaria',
        description: 'Detección automática de disparo de disyuntor en subestación Méndez Álvaro. Tensión en vía 3 cae a 0 V.',
      },
    ],
  };
}

export function getSiteCctvFeeds(siteId: string) {
  if (siteId === 'site-b') {
    return [
      { id: 1, name: 'Sants Estació - Andana Rodalies Vies 7/8', location: 'Barcelona Sants', status: 'live', fps: 30, resolution: '1080p', type: 'crowd_surge' },
      { id: 2, name: 'Plaça de Catalunya - Vestíbul Enllaç L1/L3', location: 'Plaça Catalunya', status: 'live', fps: 25, resolution: '1080p', type: 'concourse' },
      { id: 3, name: 'Sagrera Meridiana - Dàrsenes d\'Autobusos', location: 'La Sagrera', status: 'live', fps: 25, resolution: '720p', type: 'bus_docks' },
      { id: 4, name: 'Plaça d\'Espanya - Enllaç FGC / L1 / L3', location: 'Plaça Espanya', status: 'live', fps: 30, resolution: '1080p', type: 'interchange' },
    ];
  }
  if (siteId === 'site-c') {
    return [
      { id: 1, name: 'Sevilla Santa Justa - Andenes Cercanías Vía 3/4', location: 'Santa Justa', status: 'live', fps: 30, resolution: '1080p', type: 'crowd_surge' },
      { id: 2, name: 'San Bernardo - Vestíbulo Transbordo Metro L1', location: 'San Bernardo', status: 'live', fps: 25, resolution: '1080p', type: 'concourse' },
      { id: 3, name: 'Plaza de Armas - Dársena 3 Autobuses Metropolitanos', location: 'Plaza de Armas', status: 'live', fps: 25, resolution: '720p', type: 'bus_docks' },
      { id: 4, name: 'Prado de San Sebastián - Parada MetroCentro T1', location: 'Prado San Sebastián', status: 'live', fps: 30, resolution: '1080p', type: 'interchange' },
    ];
  }
  return [
    { id: 1, name: 'Atocha Cercanías - Andén Vía 3/4 (C-3/C-4)', location: 'Atocha Central', status: 'live', fps: 30, resolution: '1080p', type: 'crowd_surge' },
    { id: 2, name: 'Atocha Intercambiador - Dársena 14 (Bus 352)', location: 'Atocha Dársenas', status: 'live', fps: 25, resolution: '1080p', type: 'bus_docks' },
    { id: 3, name: 'Moncloa Intercambiador - Nivel -1 Isla 2', location: 'Moncloa', status: 'live', fps: 25, resolution: '720p', type: 'concourse' },
    { id: 4, name: 'Sol - Conexión Metro L1/L2/L3 y Renfe', location: 'Sol Central', status: 'live', fps: 30, resolution: '1080p', type: 'interchange' },
  ];
}

export interface SiteLookaheadEvent {
  time: string;
  title: string;
  subtitle: string;
  severity: 'critical' | 'nominal' | 'warning';
}

export function getSiteLookaheadEvents(siteId: string, language: 'es' | 'en' = 'es'): SiteLookaheadEvent[] {
  if (siteId === 'site-b') {
    return [
      {
        time: '08:15',
        title: language === 'es' ? 'Saturació Rodalies R1' : 'Rodalies R1 Surge',
        subtitle: language === 'es' ? 'Sants Estació +40% afluència' : 'Sants +40% passenger influx',
        severity: 'critical',
      },
      {
        time: '08:30',
        title: language === 'es' ? 'Reforç Metro L3' : 'Metro L3 Reinforcement',
        subtitle: language === 'es' ? '+5 combois TMB en carrusel' : '+5 TMB trains inserted',
        severity: 'nominal',
      },
      {
        time: '08:42',
        title: language === 'es' ? 'Enllaç en Risc' : 'Connection at Risk',
        subtitle: language === 'es' ? 'Bus Exprés e11.1 a Mataró' : 'Express Bus e11.1 Mataró',
        severity: 'warning',
      },
      {
        time: '09:00',
        title: language === 'es' ? 'Normalització Servei' : 'Service Normalization',
        subtitle: language === 'es' ? 'Descens -22% volum passatgers' : 'Flow declines -22%',
        severity: 'nominal',
      },
    ];
  }

  if (siteId === 'site-c') {
    return [
      {
        time: '08:15',
        title: language === 'es' ? 'Pico Demanda Cercanías C-1' : 'Cercanías C-1 Peak Demand',
        subtitle: language === 'es' ? 'Santa Justa +30% afluencia' : 'Santa Justa +30% passenger flow',
        severity: 'critical',
      },
      {
        time: '08:30',
        title: language === 'es' ? 'Refuerzo TUSSAM C1' : 'TUSSAM C1 Bus Relief',
        subtitle: language === 'es' ? '+4 buses en Ronda Histórica' : '+4 buses on Historic Ring',
        severity: 'nominal',
      },
      {
        time: '08:42',
        title: language === 'es' ? 'Enlace en Riesgo' : 'Connection at Risk',
        subtitle: language === 'es' ? 'Bus Metropolitano M-160' : 'Metropolitan Bus M-160',
        severity: 'warning',
      },
      {
        time: '09:00',
        title: language === 'es' ? 'Fin Franja Crítica' : 'Peak Window Concludes',
        subtitle: language === 'es' ? 'Descenso -18% flujo viajeros' : 'Flow declines -18%',
        severity: 'nominal',
      },
    ];
  }

  // Madrid (site-a default)
  return [
    {
      time: '08:15',
      title: language === 'es' ? 'Pico Demanda C-3' : 'C-3 Peak Demand',
      subtitle: language === 'es' ? 'Atocha +35% afluencia' : 'Atocha +35% influx',
      severity: 'critical',
    },
    {
      time: '08:30',
      title: language === 'es' ? 'Refuerzo Línea 6' : 'Line 6 Reinforcement',
      subtitle: language === 'es' ? '+4 convoyes Metro' : '+4 Metro trainsets',
      severity: 'nominal',
    },
    {
      time: '08:42',
      title: language === 'es' ? 'Enlace en Riesgo' : 'Connection at Risk',
      subtitle: language === 'es' ? 'Bus Interurbano 352' : 'Interurban Bus 352',
      severity: 'warning',
    },
    {
      time: '09:00',
      title: language === 'es' ? 'Fin Franja Crítica' : 'Critical Window End',
      subtitle: language === 'es' ? 'Descenso -20% flujo' : 'Flow down -20%',
      severity: 'nominal',
    },
  ];
}

export interface SiteHeroCaseMarkerInfo {
  id: string;
  lat: number;
  lng: number;
  title: string;
  label: string;
  station: string;
}

export function getSiteHeroCaseMarkerInfo(siteId: string, language: 'es' | 'en' = 'es'): SiteHeroCaseMarkerInfo {
  if (siteId === 'site-b') {
    return {
      id: 'INC-2026-0929-SNT',
      lat: 41.3792,
      lng: 2.1402,
      title: language === 'es'
        ? "Avería de Agujas y Señalización en Barcelona Sants (Vías 7-8)"
        : 'Track Switch and Signalling Outage at Barcelona Sants (Tracks 7-8)',
      label: language === 'es' ? 'Avaria Senyalització (Sants)' : 'Signalling Fault (Sants)',
      station: 'Barcelona Sants',
    };
  }
  if (siteId === 'site-c') {
    return {
      id: 'INC-2026-0929-STJ',
      lat: 37.3925,
      lng: -5.9753,
      title: language === 'es'
        ? 'Avería de Enclavamiento en Túnel Santa Justa - San Bernardo'
        : 'Interlocking Failure in Santa Justa - San Bernardo Tunnel',
      label: language === 'es' ? 'Incidencia Enclavamiento (Santa Justa)' : 'Interlocking Fault (Santa Justa)',
      station: 'Santa Justa',
    };
  }
  return {
    id: 'INC-2026-0929-ATO',
    lat: 40.4065,
    lng: -3.6895,
    title: language === 'es'
      ? 'Avería de Catenaria en Corredor Atocha Cercanías (Vías 3-4)'
      : 'Overhead Catenary Fault at Atocha Rail Corridor (Tracks 3-4)',
    label: language === 'es' ? 'Incidencia Catenaria (Atocha)' : 'Catenary Incident (Atocha)',
    station: 'Atocha Central',
  };
}

export interface SiteMinorNoticeMarkerInfo {
  lat: number;
  lng: number;
  name: string;
  text: string;
}

export function getSiteMinorNoticeMarkerInfo(siteId: string, language: 'es' | 'en' = 'es'): SiteMinorNoticeMarkerInfo {
  if (siteId === 'site-b') {
    return {
      lat: 41.3870,
      lng: 2.1700,
      name: 'Plaça Catalunya',
      text: language === 'es' ? 'Ascensor PMR en Revisión' : 'PRM Lift Inspection',
    };
  }
  if (siteId === 'site-c') {
    return {
      lat: 37.3828,
      lng: -5.9926,
      name: 'Puerta de Jerez',
      text: language === 'es' ? 'Mantenimiento Preventivo Ascensor' : 'Preventive Elevator Maintenance',
    };
  }
  return {
    lat: 40.4168,
    lng: -3.7038,
    name: 'Sol',
    text: language === 'es' ? 'Escalera en Revisión' : 'Escalator Under Maintenance',
  };
}

export interface SiteDeltaEvent {
  id: string;
  severity: 'critical' | 'nominal' | 'info';
  title: string;
  timeAgo: string;
  description: string;
  caseId?: string;
  actionText?: string;
}

export function getSiteDeltaEvents(siteId: string, language: 'es' | 'en' = 'es'): SiteDeltaEvent[] {
  if (siteId === 'site-b') {
    return [
      {
        id: 'DE-BCN-01',
        severity: 'critical',
        title: language === 'es' ? '1 Incidencia Crítica Declarada' : '1 Critical Incident Declared',
        timeAgo: language === 'es' ? 'Hace 3 min' : '3 min ago',
        description: language === 'es'
          ? "Avería de agujas en la cabecera sur de Barcelona Sants (vías 7 y 8). Afección directa sobre Rodalies R1, R3 y R4."
          : 'Track switch failure on southern throat of Barcelona Sants (tracks 7 & 8). Impact on Rodalies R1, R3, and R4.',
        caseId: 'INC-2026-0929-SNT',
        actionText: language === 'es' ? 'Examinar caso INC-2026-0929-SNT' : 'Examine case INC-2026-0929-SNT',
      },
      {
        id: 'DE-BCN-02',
        severity: 'nominal',
        title: language === 'es' ? 'Protección de Enlace Activada' : 'Connection Protection Hold Activated',
        timeAgo: language === 'es' ? 'Hace 11 min' : '11 min ago',
        description: language === 'es'
          ? 'Retención de 4 minutos autorizada para el bus exprés e11.1 a Mataró en Sants, protegiendo a 85 viajeros.'
          : '4-minute hold authorized for express bus e11.1 to Mataró at Sants, securing transfer for 85 passengers.',
      },
      {
        id: 'DE-BCN-03',
        severity: 'info',
        title: language === 'es' ? 'Despacho de Lanzaderas TMB' : 'TMB Shuttle Relievers Dispatched',
        timeAgo: language === 'es' ? 'Hace 22 min' : '22 min ago',
        description: language === 'es'
          ? '6 autobuses articulados en tránsito desde cocheras de Zona Franca hacia Sants Estació.'
          : '6 articulated buses in transit from Zona Franca depot to Sants Station.',
      },
    ];
  }

  if (siteId === 'site-c') {
    return [
      {
        id: 'DE-SEV-01',
        severity: 'critical',
        title: language === 'es' ? '1 Incidencia Crítica Declarada' : '1 Critical Incident Declared',
        timeAgo: language === 'es' ? 'Hace 4 min' : '4 min ago',
        description: language === 'es'
          ? 'Fallo de señalización en túnel Santa Justa - San Bernardo con demora de 20 min en Cercanías C-1.'
          : 'Signalling failure in Santa Justa - San Bernardo tunnel with 20 min delay on Cercanías C-1.',
        caseId: 'INC-2026-0929-STJ',
        actionText: language === 'es' ? 'Examinar caso INC-2026-0929-STJ' : 'Examine case INC-2026-0929-STJ',
      },
      {
        id: 'DE-SEV-02',
        severity: 'nominal',
        title: language === 'es' ? 'Protección de Enlace Activada' : 'Connection Protection Hold Activated',
        timeAgo: language === 'es' ? 'Hace 14 min' : '14 min ago',
        description: language === 'es'
          ? 'Retención de 5 minutos en autobús metropolitano M-160 en dársena de San Bernardo, protegiendo 64 viajeros.'
          : '5-minute hold on metropolitan bus M-160 at San Bernardo bay, protecting 64 passengers.',
      },
      {
        id: 'DE-SEV-03',
        severity: 'info',
        title: language === 'es' ? 'Refuerzo TUSSAM Despachado' : 'TUSSAM Relief Fleet Dispatched',
        timeAgo: language === 'es' ? 'Hace 25 min' : '25 min ago',
        description: language === 'es'
          ? '4 autobuses de reserva salieron de cocheras de San Jerónimo para reforzar las líneas C1 y C2.'
          : '4 reserve buses departed San Jerónimo depot to reinforce circular lines C1 & C2.',
      },
    ];
  }

  // Madrid default
  return [
    {
      id: 'DE-MAD-01',
      severity: 'critical',
      title: language === 'es' ? '1 Incidencia Crítica Declarada' : '1 Critical Incident Declared',
      timeAgo: language === 'es' ? 'Hace 3 min' : '3 min ago',
      description: language === 'es'
        ? 'Caída de tensión en catenaria de vías 3 y 4 en Atocha Cercanías. Afección sobre corredores C-3, C-4 y C-5.'
        : 'Voltage loss on overhead line of tracks 3 & 4 at Atocha Cercanías. Disruption on C-3, C-4, and C-5 corridors.',
      caseId: 'INC-2026-0929-ATO',
      actionText: language === 'es' ? 'Examinar caso INC-2026-0929' : 'Examine case INC-2026-0929',
    },
    {
      id: 'DE-MAD-02',
      severity: 'nominal',
      title: language === 'es' ? 'Protección de Enlace Activada' : 'Connection Protection Hold Activated',
      timeAgo: language === 'es' ? 'Hace 12 min' : '12 min ago',
      description: language === 'es'
        ? 'Se recomendó retención de 5 minutos para el autobús interurbano 352 en Atocha, protegiendo el transbordo de 21 viajeros.'
        : '5-minute hold was recommended for interurban bus 352 at Atocha, protecting transfer for 21 passengers.',
    },
    {
      id: 'DE-MAD-03',
      severity: 'info',
      title: language === 'es' ? 'Despacho de Refuerzos SE Activado' : 'Special Service Reinforcements Dispatched',
      timeAgo: language === 'es' ? 'Hace 24 min' : '24 min ago',
      description: language === 'es'
        ? '4 autobuses de refuerzo de EMT Madrid despachados desde cocheras de Entrevías hacia Atocha.'
        : '4 EMT Madrid relief buses dispatched from Entrevías depot toward Atocha.',
    },
  ];
}

