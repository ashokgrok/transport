export interface DisruptionScenario {
  id: string; // S1 to S8
  code: string;
  titleEs: string;
  titleEn: string;
  category: 'Normalcy' | 'Infrastructure' | 'Multimodal' | 'Weather' | 'Mega-Event' | 'Equipment' | 'Cyber' | 'Compound';
  severity: 'normal' | 'low' | 'medium' | 'high' | 'critical';
  descriptionEs: string;
  descriptionEn: string;
  affectedCorridors: string[];
  affectedLines: string[];
  impactedPax: number;
  activeSignalsCount: number;
  uniqueAlertsCount: number;
  clustersCount: number;
  incidentCasesCount: number;
  chaosPreset?: {
    feedFlappingActorId?: string;
    staleFeedsCount?: number;
    outOfServiceLiftsCount?: number;
  };
}

export const ALL_8_SCENARIOS: DisruptionScenario[] = [
  {
    id: 'S1',
    code: 'S1-NORMALCY',
    titleEs: 'S1: Madrid en Calma (Operación Nominal)',
    titleEn: 'S1: Madrid at Rest (Nominal Operation)',
    category: 'Normalcy',
    severity: 'normal',
    descriptionEs: 'Hora punta matinal controlada. 98.4% de normalidad en toda la red de Metro, Cercanías, EMT e Interurbanos.',
    descriptionEn: 'Morning rush hour under control. 98.4% normalcy across Metro, Cercanías, EMT, and Interurban bus networks.',
    affectedCorridors: ['Toda la red de la Comunidad de Madrid'],
    affectedLines: ['Metro L1-L12', 'Cercanías C1-C10', 'EMT 214 líneas'],
    impactedPax: 0,
    activeSignalsCount: 14,
    uniqueAlertsCount: 3,
    clustersCount: 0,
    incidentCasesCount: 0,
  },
  {
    id: 'S2',
    code: 'S2-SINGLE-MODE',
    titleEs: 'S2: Disrupción Monomodal (Avería Catenaria Atocha)',
    titleEn: 'S2: Single-Mode Disruption (Atocha Catenary Outage)',
    category: 'Infrastructure',
    severity: 'critical',
    descriptionEs: 'Disparo de disyuntor en subestación Méndez Álvaro. 312 señales sin procesar colapsan en 1 caso activo en vías 3 y 4 de Atocha.',
    descriptionEn: 'Substation circuit breaker trip at Méndez Álvaro. 312 raw signals collapse into 1 actionable incident on Atocha tracks 3 & 4.',
    affectedCorridors: ['Corredor Sur / Atocha - Méndez Álvaro'],
    affectedLines: ['Cercanías C-3', 'Cercanías C-4', 'Cercanías C-5'],
    impactedPax: 4320,
    activeSignalsCount: 312,
    uniqueAlertsCount: 41,
    clustersCount: 3,
    incidentCasesCount: 1,
    chaosPreset: {
      feedFlappingActorId: 'N03',
      staleFeedsCount: 0,
      outOfServiceLiftsCount: 1,
    },
  },
  {
    id: 'S3',
    code: 'S3-MULTIMODAL-CASCADE',
    titleEs: 'S3: Disrupción Multimodal en Cascada (Atocha + Metro L1)',
    titleEn: 'S3: Multi-Modal Cascading Disruption (Atocha + Metro L1)',
    category: 'Multimodal',
    severity: 'critical',
    descriptionEs: 'Avería de catenaria en Cercanías provoca desvío masivo hacia Metro L1, disparando subestación Pacífico y saturando dársenas de autobús.',
    descriptionEn: 'Cercanías catenary outage causes massive passenger diversion to Metro L1, tripping Pacífico substation and overwhelming bus bays.',
    affectedCorridors: ['Corredor Sur', 'Eje Metro Línea 1', 'Intercambiador Atocha'],
    affectedLines: ['Cercanías C-3, C-4', 'Metro L1', 'Bus EMT 10, 24, 54, 57'],
    impactedPax: 14800,
    activeSignalsCount: 680,
    uniqueAlertsCount: 88,
    clustersCount: 6,
    incidentCasesCount: 2,
  },
  {
    id: 'S4',
    code: 'S4-HEATWAVE',
    titleEs: 'S4: Ola de Calor Extremo (42°C Deformación de Vía)',
    titleEn: 'S4: Extreme Weather Event (42°C Rail Buckling)',
    category: 'Weather',
    severity: 'high',
    descriptionEs: 'Temperaturas de 42°C causan pandeo térmico de carril en Chamartín, sobrecalentamiento de motores de autobuses y restricciones de velocidad a 40 km/h.',
    descriptionEn: '42°C summer heatwave causes rail buckling at Chamartín, bus engine overheating, and network-wide 40 km/h speed limits.',
    affectedCorridors: ['Corredor Norte / Chamartín', 'Red Superficie EMT'],
    affectedLines: ['Cercanías C-1, C-2, C-7, C-8', 'EMT Flota Diésel/GNC'],
    impactedPax: 9200,
    activeSignalsCount: 420,
    uniqueAlertsCount: 56,
    clustersCount: 4,
    incidentCasesCount: 2,
  },
  {
    id: 'S5',
    code: 'S5-MEGA-EVENT',
    titleEs: 'S5: Mega-Evento Planificado (Final de Champions League)',
    titleEn: 'S5: Planned Mega-Event (Champions League Final)',
    category: 'Mega-Event',
    severity: 'high',
    descriptionEs: 'Afluencia de 85.000 espectadores al estadio. Sobrecarga en estaciones Estadio Metropolitano y Canillejas. Activación de lanzaderas exprés.',
    descriptionEn: '85,000 attendees at stadium. Heavy congestion at Estadio Metropolitano and Canillejas stations. Express shuttle bus fleet deployed.',
    affectedCorridors: ['Eje Este / San Blas - Canillejas', 'Línea 7 de Metro'],
    affectedLines: ['Metro L7', 'Metro L2', 'Bus Especial SE Estadio'],
    impactedPax: 85000,
    activeSignalsCount: 290,
    uniqueAlertsCount: 34,
    clustersCount: 2,
    incidentCasesCount: 1,
  },
  {
    id: 'S6',
    code: 'S6-EQUIPMENT-FAILURE',
    titleEs: 'S6: Fallo Masivo de Equipamiento e Itinerarios PMR',
    titleEn: 'S6: Infrastructure Equipment Failure (Interchange Lift Blackout)',
    category: 'Equipment',
    severity: 'medium',
    descriptionEs: 'Caída de cuadro eléctrico en Intercambiador de Moncloa inhabilita 6 ascensores principales y 8 escaleras mecánicas. Desvío prioritario de viajeros PMR.',
    descriptionEn: 'Electrical switchboard failure at Moncloa Interchange disables 6 main elevators and 8 escalators. PMR step-free emergency diversion activated.',
    affectedCorridors: ['Intercambiador de Moncloa (Islas 1, 2 y 3)'],
    affectedLines: ['Metro L3, L6', 'Interurbanos Corredor A-6 (Líneas 601-691)'],
    impactedPax: 3400,
    activeSignalsCount: 185,
    uniqueAlertsCount: 24,
    clustersCount: 2,
    incidentCasesCount: 1,
    chaosPreset: {
      outOfServiceLiftsCount: 6,
    },
  },
  {
    id: 'S7',
    code: 'S7-CYBER-FEED-OUTAGE',
    titleEs: 'S7: Caída de Conector y Arbitraje de Datos (Feed Outage N01)',
    titleEn: 'S7: Cyber / Connector Feed Outage (N01 Feed Goes Dark)',
    category: 'Cyber',
    severity: 'high',
    descriptionEs: 'Corte de enlace de fibra con el back-office del operador de autobuses interurbanos. El motor conmuta a GTFS-RT secundario e interpola estimaciones.',
    descriptionEn: 'Fiber link severed to interurban bus operator back-office. Engine seamlessly falls back to GTFS-RT secondary telemetry with degraded confidence scoring.',
    affectedCorridors: ['Corredor Sur / A-4 y A-42'],
    affectedLines: ['Concesiones Interurbanas VCM-401, VCM-402'],
    impactedPax: 6100,
    activeSignalsCount: 95,
    uniqueAlertsCount: 18,
    clustersCount: 1,
    incidentCasesCount: 1,
    chaosPreset: {
      feedFlappingActorId: 'N01',
      staleFeedsCount: 3,
    },
  },
  {
    id: 'S8',
    code: 'S8-COMPOUND-CRISIS',
    titleEs: 'S8: Crisis Compuesta (Temporal Invernal Filomena + Huelga Parcial)',
    titleEn: 'S8: Compound Crisis (Winter Storm Filomena + Rail Strike)',
    category: 'Compound',
    severity: 'critical',
    descriptionEs: 'Nevada extrema con 35 cm de nieve bloquea vías de superficie y coincide con huelga parcial ferroviaria. 60% de autobuses cancelados, esparcidores de sal en dársenas.',
    descriptionEn: '35 cm blizzard paralyzes ground routes concurrently with rail union strike. 60% bus cancellations, salt spreaders deployed at interchanges.',
    affectedCorridors: ['Toda la Comunidad de Madrid', 'M-30, M-40, Red de Cercanías'],
    affectedLines: ['Todas las líneas de Cercanías y Autobuses'],
    impactedPax: 320000,
    activeSignalsCount: 1420,
    uniqueAlertsCount: 215,
    clustersCount: 12,
    incidentCasesCount: 4,
    chaosPreset: {
      staleFeedsCount: 7,
      outOfServiceLiftsCount: 14,
    },
  },
];
