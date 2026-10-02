/**
 * Master Reference Data for Madrid Multimodal Transport Network
 * Consorcio Regional de Transportes de Madrid (CRTM)
 */

export interface TransportLine {
  id: string;
  name: string;
  mode: 'metro' | 'cercanias' | 'emt' | 'interurban' | 'light_rail';
  code: string;
  color: string;
  textColor: string;
  routeEs: string;
  routeEn: string;
  stationsCount: number;
  frequencyPeakMin: number;
  operator: string;
  activeVehicles: number;
  status: 'nominal' | 'delayed' | 'disrupted';
}

export interface InterchangeHub {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  modes: string[];
  linesCount: number;
  dailyPassengers: number;
  docksCount: number;
  activeCrowdLevel: 'low' | 'moderate' | 'high' | 'surge';
  status: 'nominal' | 'alert';
}

export interface SimulatedVehicle {
  id: string;
  lineCode: string;
  mode: 'metro' | 'cercanias' | 'emt' | 'interurban' | 'light_rail';
  operatorId: string;
  vehicleNumber: string;
  lat: number;
  lng: number;
  heading: number;
  speedKmh: number;
  occupancyPercent: number;
  nextStop: string;
  status: 'in_service' | 'dwelling' | 'delayed' | 'held';
  delaySeconds: number;
  lastUpdateEpoch: number;
  propulsion: 'electric' | 'cng' | 'hybrid' | 'hydrogen';
}

export const MADRID_LINES: TransportLine[] = [
  // Cercanías Renfe Corridors
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
    status: 'disrupted', // Active incident in scenario
  },
  {
    id: 'c-4',
    name: 'Cercanías C-4',
    mode: 'cercanias',
    code: 'C-4',
    color: '#0055A5',
    textColor: '#FFFFFF',
    routeEs: 'Parla – Atocha – Chamartín – Alcobendas / Colmenar',
    routeEn: 'Parla – Atocha – Chamartín – Alcobendas / Colmenar',
    stationsCount: 21,
    frequencyPeakMin: 5,
    operator: 'Renfe Cercanías (N03)',
    activeVehicles: 42,
    status: 'delayed',
  },
  {
    id: 'c-5',
    name: 'Cercanías C-5',
    mode: 'cercanias',
    code: 'C-5',
    color: '#E31B23',
    textColor: '#FFFFFF',
    routeEs: 'Móstoles El Soto – Atocha – Fuenlabrada – Humanes',
    routeEn: 'Móstoles El Soto – Atocha – Fuenlabrada – Humanes',
    stationsCount: 23,
    frequencyPeakMin: 4,
    operator: 'Renfe Cercanías (N03)',
    activeVehicles: 58,
    status: 'nominal',
  },
  // Metro de Madrid Key Lines
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
    id: 'l-2',
    name: 'Metro Línea 2',
    mode: 'metro',
    code: 'L2',
    color: '#ED1C24',
    textColor: '#FFFFFF',
    routeEs: 'Las Rosas – Sol – Ópera – Cuatro Caminos',
    routeEn: 'Las Rosas – Sol – Ópera – Cuatro Caminos',
    stationsCount: 20,
    frequencyPeakMin: 4,
    operator: 'Metro de Madrid (N02)',
    activeVehicles: 30,
    status: 'nominal',
  },
  {
    id: 'l-6',
    name: 'Metro Línea 6 (Circular)',
    mode: 'metro',
    code: 'L6',
    color: '#8A8D8F',
    textColor: '#FFFFFF',
    routeEs: 'Circular (Moncloa – Cuatro Caminos – Av. América – Méndez Álvaro)',
    routeEn: 'Circular (Moncloa – Cuatro Caminos – Av. América – Méndez Álvaro)',
    stationsCount: 28,
    frequencyPeakMin: 2.8,
    operator: 'Metro de Madrid (N02)',
    activeVehicles: 64,
    status: 'nominal',
  },
  {
    id: 'l-10',
    name: 'Metro Línea 10',
    mode: 'metro',
    code: 'L10',
    color: '#002F6C',
    textColor: '#FFFFFF',
    routeEs: 'Hospital Infanta Sofía – Plaza Castilla – Tribunal – Puerta del Sur',
    routeEn: 'Hospital Infanta Sofía – Plaza Castilla – Tribunal – Puerta del Sur',
    stationsCount: 31,
    frequencyPeakMin: 3.5,
    operator: 'Metro de Madrid (N02)',
    activeVehicles: 52,
    status: 'nominal',
  },
  // EMT Bus Key Corridors
  {
    id: 'emt-27',
    name: 'EMT Línea 27',
    mode: 'emt',
    code: '27',
    color: '#0047BA',
    textColor: '#FFFFFF',
    routeEs: 'Embajadores – Atocha – Castellana – Plaza de Castilla',
    routeEn: 'Embajadores – Atocha – Castellana – Plaza de Castilla',
    stationsCount: 38,
    frequencyPeakMin: 3,
    operator: 'EMT Madrid (N01)',
    activeVehicles: 36,
    status: 'nominal',
  },
  {
    id: 'emt-34',
    name: 'EMT Línea 34',
    mode: 'emt',
    code: '34',
    color: '#0047BA',
    textColor: '#FFFFFF',
    routeEs: 'Cibeles – Atocha – General Ricardos – Las Águilas',
    routeEn: 'Cibeles – Atocha – General Ricardos – Las Águilas',
    stationsCount: 42,
    frequencyPeakMin: 4,
    operator: 'EMT Madrid (N01)',
    activeVehicles: 32,
    status: 'nominal',
  },
  // Interurban Concession Corridors
  {
    id: 'bus-352',
    name: 'Interurbano 352 (A-3 Corridor)',
    mode: 'interurban',
    code: '352',
    color: '#00853F',
    textColor: '#FFFFFF',
    routeEs: 'Madrid (Atocha / Conde Casal) – Perales – Fuentidueña – Tarancón',
    routeEn: 'Madrid (Atocha / Conde Casal) – Perales – Fuentidueña – Tarancón',
    stationsCount: 28,
    frequencyPeakMin: 12,
    operator: 'Empresa Ruiz / Interurbanos (N05)',
    activeVehicles: 18,
    status: 'delayed', // Subject of hold request in scene 4
  },
  // Metro Ligero / Tranvía
  {
    id: 'ml-1',
    name: 'Metro Ligero ML1',
    mode: 'light_rail',
    code: 'ML1',
    color: '#00A3E0',
    textColor: '#FFFFFF',
    routeEs: 'Pinar de Chamartín – Las Tablas',
    routeEn: 'Pinar de Chamartín – Las Tablas',
    stationsCount: 9,
    frequencyPeakMin: 6,
    operator: 'Metro Ligero Madrid (N04)',
    activeVehicles: 8,
    status: 'nominal',
  },
];

export const MADRID_INTERCHANGES: InterchangeHub[] = [
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
    activeCrowdLevel: 'surge', // Due to catenary fault on C-3
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
    name: 'Intercambiador de Transportes Moncloa',
    code: 'MON',
    lat: 40.4354,
    lng: -3.7196,
    modes: ['Metro L3, L6', 'EMT', 'Interurbanos Corredor A-6'],
    linesCount: 44,
    dailyPassengers: 280000,
    docksCount: 40,
    activeCrowdLevel: 'moderate',
    status: 'nominal',
  },
  {
    id: 'hub-principe-pio',
    name: 'Intercambiador Príncipe Pío',
    code: 'PPI',
    lat: 40.4212,
    lng: -3.7198,
    modes: ['Cercanías C-1, C-7, C-10', 'Metro L6, L10, Ramal', 'EMT', 'Interurbanos A-5'],
    linesCount: 30,
    dailyPassengers: 195000,
    docksCount: 28,
    activeCrowdLevel: 'low',
    status: 'nominal',
  },
  {
    id: 'hub-plaza-castilla',
    name: 'Intercambiador Plaza de Castilla',
    code: 'PCA',
    lat: 40.4668,
    lng: -3.6892,
    modes: ['Metro L1, L9, L10', 'EMT', 'Interurbanos Corredor A-1'],
    linesCount: 48,
    dailyPassengers: 260000,
    docksCount: 42,
    activeCrowdLevel: 'moderate',
    status: 'nominal',
  },
  {
    id: 'hub-av-america',
    name: 'Intercambiador Avenida de América',
    code: 'AAM',
    lat: 40.4382,
    lng: -3.6763,
    modes: ['Metro L4, L6, L7, L9', 'EMT', 'Interurbanos Corredor A-2'],
    linesCount: 36,
    dailyPassengers: 210000,
    docksCount: 36,
    activeCrowdLevel: 'low',
    status: 'nominal',
  },
];

/**
 * Deterministic Generator for 5,000+ Active Fleet Vehicles
 * Adhering to PRD SEED-01, SEED-04, ARC-03, and PERF-04.
 */
export function generateMadridFleet(count = 5120): SimulatedVehicle[] {
  const vehicles: SimulatedVehicle[] = [];
  const modes: ('metro' | 'cercanias' | 'emt' | 'interurban' | 'light_rail')[] = [
    'metro', 'cercanias', 'emt', 'interurban', 'light_rail'
  ];

  // Bounding box of Greater Madrid
  const minLat = 40.35;
  const maxLat = 40.50;
  const minLng = -3.78;
  const maxLng = -3.62;

  // Pseudo-random deterministic generator with fixed seed
  let seed = 19850516; // CRTM founding date May 16, 1985
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const lineKeys = ['C-3', 'C-4', 'C-5', 'L1', 'L2', 'L6', 'L10', '27', '34', '352', 'ML1'];

  for (let i = 0; i < count; i++) {
    const mode = modes[i % modes.length];
    const lineCode = lineKeys[i % lineKeys.length];
    const lat = minLat + pseudoRandom() * (maxLat - minLat);
    const lng = minLng + pseudoRandom() * (maxLng - minLng);
    const heading = Math.round(pseudoRandom() * 360);
    const speedKmh = Math.round(15 + pseudoRandom() * 45);
    const occupancyPercent = Math.round(40 + pseudoRandom() * 55);

    vehicles.push({
      id: `veh-${mode}-${1000 + i}`,
      lineCode,
      mode,
      operatorId: mode === 'cercanias' ? 'N03' : mode === 'metro' ? 'N02' : mode === 'emt' ? 'N01' : 'N05',
      vehicleNumber: `${mode.toUpperCase().slice(0, 3)}-${2000 + (i % 900)}`,
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
      heading,
      speedKmh,
      occupancyPercent,
      nextStop: i % 2 === 0 ? 'Atocha Central' : 'Nuevos Ministerios',
      status: i === 42 ? 'delayed' : 'in_service',
      delaySeconds: i === 42 ? 360 : 0,
      lastUpdateEpoch: Date.now() - Math.round(pseudoRandom() * 5000),
      propulsion: i % 3 === 0 ? 'electric' : i % 3 === 1 ? 'cng' : 'hybrid',
    });
  }

  return vehicles;
}
