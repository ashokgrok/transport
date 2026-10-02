import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { t } from '../../services/localization';
import {
  Accessibility,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  Users,
  Compass,
  MapPin,
  Clock,
  Phone,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface LiftDevice {
  id: string;
  nameEs: string;
  nameEn: string;
  station: string;
  locationEs: string;
  locationEn: string;
  status: 'operational' | 'out_of_service' | 'maintenance';
  stepFreeAlternativeEs: string;
  stepFreeAlternativeEn: string;
  paxImpactHourly: number;
}

const SAMPLE_LIFTS: LiftDevice[] = [
  {
    id: 'ASC-ATO-03',
    nameEs: 'Ascensor Andén 3/4 a Vestíbulo',
    nameEn: 'Elevator Platform 3/4 to Concourse',
    station: 'Atocha Cercanías',
    locationEs: 'Cabecera Sur (Vías 3-4)',
    locationEn: 'South Header (Tracks 3-4)',
    status: 'out_of_service',
    stepFreeAlternativeEs: 'Ascensor Norte 02 vía rampa de enlace andén 5 (itinerario accesible alternativo +90m)',
    stepFreeAlternativeEn: 'North Lift 02 via platform 5 link ramp (accessible alternative detour +90m)',
    paxImpactHourly: 42,
  },
  {
    id: 'ASC-ATO-01',
    nameEs: 'Ascensor Vestíbulo a Dársenas Bus',
    nameEn: 'Elevator Concourse to Bus Bays',
    station: 'Atocha Intercambiador',
    locationEs: 'Dársena 10-18',
    locationEn: 'Bay 10-18',
    status: 'operational',
    stepFreeAlternativeEs: 'Itinerario principal 100% operativo sin barreras.',
    stepFreeAlternativeEn: 'Primary step-free route 100% operational.',
    paxImpactHourly: 0,
  },
  {
    id: 'ASC-MA-02',
    nameEs: 'Ascensor Estación Méndez Álvaro',
    nameEn: 'Elevator Méndez Álvaro Station',
    station: 'Méndez Álvaro',
    locationEs: 'Acceso Metro L6 - Cercanías',
    locationEn: 'Metro L6 - Cercanías Access',
    status: 'operational',
    stepFreeAlternativeEs: 'Itinerario estándar operativo.',
    stepFreeAlternativeEn: 'Standard step-free route operational.',
    paxImpactHourly: 0,
  },
  {
    id: 'ASC-SOL-01',
    nameEs: 'Ascensor Plaza de Sol a Vestíbulo Renfe',
    nameEn: 'Elevator Sol Square to Renfe Concourse',
    station: 'Sol',
    locationEs: 'Plaza Puerta del Sol',
    locationEn: 'Puerta del Sol Square',
    status: 'maintenance',
    stepFreeAlternativeEs: 'Acceso por calle Montera (rampa y ascensor Este).',
    stepFreeAlternativeEn: 'Montera Street access (ramp and East elevator).',
    paxImpactHourly: 65,
  },
];

interface AssistanceMission {
  id: string;
  paxNameEs: string;
  paxNameEn: string;
  category: 'PMR (Silla de Ruedas)' | 'Movilidad Reducida' | 'Discapacidad Visual' | 'Personas Mayores con Cargas';
  station: string;
  fromLocationEs: string;
  fromLocationEn: string;
  toLocationEs: string;
  toLocationEn: string;
  assignedTeamEs: string;
  assignedTeamEn: string;
  status: 'assigned' | 'in_transit' | 'assisting' | 'completed';
  etaMinutes: number;
}

export const AccessibilityRoutingView: React.FC = () => {
  const { language, effectiveRole } = useAuth();
  const { activeSite } = useSite();

  const getSiteLifts = (siteId: string): LiftDevice[] => {
    if (siteId === 'site-b') {
      return [
        {
          id: 'ASC-SNT-01',
          nameEs: 'Ascensor Andana 7/8 a Vestíbul Rodalies',
          nameEn: 'Elevator Platform 7/8 to Rodalies Concourse',
          station: 'Barcelona Sants',
          locationEs: 'Andana Rodalies Vies 7-8',
          locationEn: 'Rodalies Platform Tracks 7-8',
          status: 'out_of_service',
          stepFreeAlternativeEs: 'Ascensor central cap a vestíbul d\'alta velocitat i rampa d\'enllaç (+80m).',
          stepFreeAlternativeEn: 'Central elevator to high-speed concourse and link ramp (+80m).',
          paxImpactHourly: 48,
        },
        {
          id: 'ASC-CAT-02',
          nameEs: 'Ascensor Plaça Catalunya L1/L3',
          nameEn: 'Elevator Plaça Catalunya L1/L3',
          station: 'Plaça de Catalunya',
          locationEs: 'Accés Rambla - Vestíbul TMB',
          locationEn: 'Rambla Access - TMB Concourse',
          status: 'operational',
          stepFreeAlternativeEs: 'Itinerari principal 100% accessible sense barreres.',
          stepFreeAlternativeEn: 'Primary route 100% step-free accessible.',
          paxImpactHourly: 0,
        },
        {
          id: 'ASC-SAG-01',
          nameEs: 'Ascensor Sagrera Meridiana',
          nameEn: 'Elevator Sagrera Meridiana',
          station: 'La Sagrera',
          locationEs: 'Enllaç Metro L1/L5 a Dàrsenes d\'Autobús',
          locationEn: 'Metro L1/L5 link to Bus Bays',
          status: 'operational',
          stepFreeAlternativeEs: 'Itinerari adaptat nominal.',
          stepFreeAlternativeEn: 'Nominal adapted route.',
          paxImpactHourly: 0,
        },
      ];
    }
    if (siteId === 'site-c') {
      return [
        {
          id: 'ASC-STJ-02',
          nameEs: 'Ascensor Andén 3 a Vestíbulo Santa Justa',
          nameEn: 'Elevator Platform 3 to Santa Justa Concourse',
          station: 'Sevilla Santa Justa',
          locationEs: 'Cabecera Vías 3-4 Cercanías',
          locationEn: 'Cercanías Tracks 3-4 Header',
          status: 'out_of_service',
          stepFreeAlternativeEs: 'Ascensor Norte 01 por rampa de correspondencia (+60m).',
          stepFreeAlternativeEn: 'North Lift 01 via transfer ramp (+60m).',
          paxImpactHourly: 32,
        },
        {
          id: 'ASC-SBN-01',
          nameEs: 'Ascensor Intercambiador San Bernardo',
          nameEn: 'Elevator San Bernardo Interchange',
          station: 'San Bernardo',
          locationEs: 'Enlace Metro L1 con Cercanías C-1',
          locationEn: 'Metro L1 link with Cercanías C-1',
          status: 'operational',
          stepFreeAlternativeEs: 'Paso 100% accesible adaptado a PMR.',
          stepFreeAlternativeEn: '100% accessible step-free route.',
          paxImpactHourly: 0,
        },
        {
          id: 'ASC-PJZ-01',
          nameEs: 'Ascensor Central Puerta de Jerez',
          nameEn: 'Elevator Central Puerta de Jerez',
          station: 'Puerta de Jerez',
          locationEs: 'Acceso Paseo de Cristina',
          locationEn: 'Paseo de Cristina Access',
          status: 'operational',
          stepFreeAlternativeEs: 'Rampa y ascensor sur operativos.',
          stepFreeAlternativeEn: 'South ramp and elevator operational.',
          paxImpactHourly: 0,
        },
      ];
    }
    return SAMPLE_LIFTS;
  };

  const [lifts, setLifts] = useState<LiftDevice[]>(() => getSiteLifts(activeSite.id));

  useEffect(() => {
    setLifts(getSiteLifts(activeSite.id));
  }, [activeSite.id]);
  const [missions, setMissions] = useState<AssistanceMission[]>([
    {
      id: 'MIS-PMR-01',
      paxNameEs: 'Viajero en Silla de Ruedas (Andén 4)',
      paxNameEn: 'Wheelchair Traveler (Platform 4)',
      category: 'PMR (Silla de Ruedas)',
      station: 'Atocha Cercanías',
      fromLocationEs: 'Andén 4 (Vía averiada)',
      fromLocationEn: 'Platform 4 (Faulted track)',
      toLocationEs: 'Dársena 14 (Autobús 352)',
      toLocationEn: 'Bay 14 (Bus 352)',
      assignedTeamEs: 'Equipo Atendo 02 (Elena G. + Marcos R.)',
      assignedTeamEn: 'Atendo Team 02 (Elena G. + Marcos R.)',
      status: 'in_transit',
      etaMinutes: 3,
    },
    {
      id: 'MIS-PMR-02',
      paxNameEs: 'Grupo 3 Personas Mayores con Equipaje',
      paxNameEn: 'Elderly Group of 3 with Heavy Luggage',
      category: 'Personas Mayores con Cargas',
      station: 'Atocha Cercanías',
      fromLocationEs: 'Vestíbulo Cercanías',
      fromLocationEn: 'Cercanías Concourse',
      toLocationEs: 'Metro Línea 1 (Tornos adaptados)',
      toLocationEn: 'Metro Line 1 (Wide PRM gates)',
      assignedTeamEs: 'Auxiliar CRTM 05 (David S.)',
      assignedTeamEn: 'CRTM Assistant 05 (David S.)',
      status: 'assisting',
      etaMinutes: 1,
    },
  ]);

  const [newRequestInput, setNewRequestInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'PMR (Silla de Ruedas)' | 'Movilidad Reducida' | 'Discapacidad Visual'>('PMR (Silla de Ruedas)');

  const handleDispatchTeam = () => {
    if (!newRequestInput.trim()) return;
    const newMission: AssistanceMission = {
      id: `MIS-PMR-0${missions.length + 1}`,
      paxNameEs: newRequestInput.trim(),
      paxNameEn: newRequestInput.trim(),
      category: selectedCategory,
      station: 'Atocha Cercanías',
      fromLocationEs: 'Andén 3/4',
      fromLocationEn: 'Platform 3/4',
      toLocationEs: 'Dársena Intercambiador',
      toLocationEn: 'Interchange Bus Bay',
      assignedTeamEs: `Equipo Atendo 0${(missions.length % 3) + 1}`,
      assignedTeamEn: `Atendo Team 0${(missions.length % 3) + 1}`,
      status: 'assigned',
      etaMinutes: 4,
    };
    setMissions((prev) => [newMission, ...prev]);
    setNewRequestInput('');
  };

  const handleAdvanceStatus = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const nextStatus: AssistanceMission['status'] =
            m.status === 'assigned'
              ? 'in_transit'
              : m.status === 'in_transit'
              ? 'assisting'
              : 'completed';
          return { ...m, status: nextStatus, etaMinutes: nextStatus === 'completed' ? 0 : Math.max(0, m.etaMinutes - 2) };
        }
        return m;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center">
              <Accessibility className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es'
                ? 'Enrutamiento Accesible y Asistencia PMR en Tiempo Real'
                : 'Accessible Routing & Real-Time PMR Assistance'}
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {language === 'es'
              ? 'Monitor de telemetría de ascensores, cálculo de itinerarios 100% libres de barreras arquitectónicas y despacho de equipos de asistencia Atendo.'
              : 'Lift telemetry monitor, 100% barrier-free itinerary calculation, and Atendo accessibility personnel dispatch.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-neutral-600 dark:text-neutral-400">
            {language === 'es' ? 'Ascensores Operativos:' : 'Operating Lifts:'} <strong className="text-emerald-600">3/4 (75%)</strong>
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <span className="font-semibold text-neutral-600 dark:text-neutral-400">
            {language === 'es' ? 'Misiones Activas:' : 'Active Missions:'} <strong className="text-[#0071BB]">{missions.filter((m) => m.status !== 'completed').length}</strong>
          </span>
        </div>
      </div>

      {/* Step-Free Itinerary Hero Card (Scene 6) */}
      <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
        <div className="border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8] uppercase tracking-wider">
                {language === 'es' ? 'Itinerario Libre de Barreras Calculado por CITRAM' : 'Barrier-Free Route Computed by CITRAM'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 uppercase">
                {language === 'es' ? '100% Accesible' : '100% Step-Free'}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1] mt-0.5">
              {language === 'es' ? 'Evacuación y Transbordo PMR: Andén 4 Atocha → Dársena 14 Intercambiador Bus' : 'PRM Transfer & Evacuation: Atocha Platform 4 → Interchange Bus Bay 14'}
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {language === 'es' ? 'Distancia: 340m · Tiempo estimado: 6 min' : 'Distance: 340m · Estimated time: 6 min'}
          </span>
        </div>

        {/* Step-by-Step Waypoint Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-50/20 dark:bg-red-950/15 space-y-1">
            <span className="text-[10px] font-bold text-red-600 uppercase">{language === 'es' ? 'Punto de Origen' : 'Origin Waypoint'}</span>
            <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{language === 'es' ? 'Andén 3/4 Cercanías' : 'Cercanías Platform 3/4'}</p>
            <p className="text-[11px] text-neutral-500">
              {language === 'es' ? '⚠️ Ascensor Sur fuera de servicio. Desvío señalizado hacia Rampa Norte.' : '⚠️ South Lift out of service. Signposted detour towards North Ramp.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/15 space-y-1">
            <span className="text-[10px] font-bold text-[#0071BB] dark:text-[#5AAEE8] uppercase">{language === 'es' ? 'Desvío Accesible' : 'Accessible Detour'}</span>
            <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{language === 'es' ? 'Rampa Andén 5 + Ascensor Norte 02' : 'Platform 5 Ramp + North Lift 02'}</p>
            <p className="text-[11px] text-neutral-500">
              {language === 'es' ? 'Pendiente conforme (<6%) · Ascensor con señalización braille y síntesis de voz.' : 'Compliant slope (<6%) · Lift with braille wayfinding and voice synthesis.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/15 space-y-1">
            <span className="text-[10px] font-bold text-[#0071BB] dark:text-[#5AAEE8] uppercase">{language === 'es' ? 'Paso por Tornos' : 'Fare Gates'}</span>
            <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{language === 'es' ? 'Torno Ancho PMR 01' : 'Wide Access PRM Gate 01'}</p>
            <p className="text-[11px] text-neutral-500">
              {language === 'es' ? 'Ancho de paso 90 cm · Apertura automática telecontrolada desde sala.' : '90 cm gate clearance · Automated remote gate release from control room.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/15 space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 uppercase">{language === 'es' ? 'Destino Final' : 'Final Destination'}</span>
            <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{language === 'es' ? 'Dársena 14 (Autobús 352)' : 'Bay 14 (Bus 352)'}</p>
            <p className="text-[11px] text-neutral-500">
              {language === 'es' ? 'Rampa mecánica de autobús desplegada por conductor avisado vía SAE.' : 'Bus wheelchair ramp deployed by driver notified via CAD/AVL.'}
            </p>
          </div>
        </div>
      </div>

      {/* Lifts Telemetry Grid & Atendo Assistance Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Station Elevator Health Telemetry (N12/N14) */}
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Telemetría de Ascensores e Itinerarios Mecánicos' : 'Lift & Step-Free Asset Telemetry'}
              </h3>
              <p className="text-xs text-neutral-500">
                {language === 'es' ? 'Monitoreo en tiempo real de 1.420 dispositivos de elevación en la red CRTM.' : 'Real-time monitoring of 1,420 vertical mobility devices across CRTM.'}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              IoT N12/N14
            </span>
          </div>

          <div className="space-y-3">
            {lifts.map((lift) => (
              <div
                key={lift.id}
                className="p-3 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/30 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8]">
                      {lift.id}
                    </span>
                    <h4 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? lift.nameEs : lift.nameEn}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      lift.status === 'operational'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : lift.status === 'out_of_service'
                        ? 'bg-red-500/10 text-red-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {lift.status === 'operational'
                      ? (language === 'es' ? 'operativo' : 'operational')
                      : lift.status === 'out_of_service'
                      ? (language === 'es' ? 'fuera de servicio' : 'out of service')
                      : (language === 'es' ? 'mantenimiento' : 'maintenance')}
                  </span>
                </div>

                <p className="text-xs text-neutral-500">
                  {lift.station} · {language === 'es' ? lift.locationEs : lift.locationEn}
                </p>

                <p className="text-xs text-neutral-700 dark:text-neutral-300 bg-white/60 dark:bg-black/20 p-2 rounded-lg border border-[#DCE1E7]/50 dark:border-[#2B3440]/50">
                  <strong>{language === 'es' ? 'Alternativa:' : 'Alternative:'}</strong>{' '}
                  {language === 'es' ? lift.stepFreeAlternativeEs : lift.stepFreeAlternativeEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dedicated PMR Atendo Dispatch Panel */}
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
          <div className="border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
            <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es' ? 'Despacho de Asistencia Personalizada Atendo / Auxiliares' : 'Atendo / Passenger Assistant Dispatch'}
            </h3>
            <p className="text-xs text-neutral-500">
              {language === 'es'
                ? 'Coordinación operativa con personal de terreno (R04) para acompañamiento asistido.'
                : 'Operational coordination with field ground crew (R04) for assisted accompaniment.'}
            </p>
          </div>

          {/* Quick Request Dispatcher */}
          <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/60 dark:bg-neutral-900/40 space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">
              {language === 'es' ? 'Nueva Petición de Asistencia Inmediata' : 'New Immediate Assistance Request'}
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRequestInput}
                onChange={(e) => setNewRequestInput(e.target.value)}
                placeholder={
                  language === 'es'
                    ? 'Ej: Viajero invidente con perro guía en andén 2...'
                    : 'e.g. Visually impaired traveler with guide dog on platform 2...'
                }
                className="flex-1 p-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-neutral-900 text-xs text-[#1B1F24] dark:text-[#E8ECF1] focus:outline-none focus:ring-1 focus:ring-[#0071BB]"
              />
              <button
                onClick={handleDispatchTeam}
                disabled={!newRequestInput.trim()}
                className="px-3.5 py-2 rounded-lg bg-[#0071BB] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                {language === 'es' ? 'Despachar' : 'Dispatch'}
              </button>
            </div>
          </div>

          {/* Active Missions List */}
          <div className="space-y-3">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8]">
                      {mission.id}
                    </span>
                    <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? mission.paxNameEs : mission.paxNameEn}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      mission.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : mission.status === 'assisting'
                        ? 'bg-blue-500/10 text-[#0071BB]'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {mission.status === 'completed'
                      ? (language === 'es' ? 'completado' : 'completed')
                      : mission.status === 'assisting'
                      ? (language === 'es' ? 'asistiendo' : 'assisting')
                      : (language === 'es' ? 'asignado' : 'assigned')}
                  </span>
                </div>

                <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
                  <span>
                    {language === 'es' ? mission.fromLocationEs : mission.fromLocationEn} →{' '}
                    {language === 'es' ? mission.toLocationEs : mission.toLocationEn}
                  </span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {language === 'es' ? mission.assignedTeamEs : mission.assignedTeamEn}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between text-xs">
                  <span className="text-neutral-500">
                    ETA: <strong>{mission.etaMinutes} min</strong>
                  </span>
                  {mission.status !== 'completed' && (
                    <button
                      onClick={() => handleAdvanceStatus(mission.id)}
                      className="text-xs font-bold text-[#0071BB] hover:underline cursor-pointer"
                    >
                      {language === 'es' ? 'Avanzar Estado →' : 'Advance Status →'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
