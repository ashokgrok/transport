import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import {
  Sparkles,
  X,
  Play,
  Copy,
  Check,
  Building2,
  ChevronRight,
  UserCheck,
  Tv,
  ArrowRight,
  Shield,
  Layers,
  Clock,
  FileText,
  Search,
} from 'lucide-react';

interface DemoScriptItem {
  roleId: string;
  roleNameEs: string;
  roleNameEn: string;
  personaName: string;
  targetTab: string;
  category: 'Operations' | 'Tactical' | 'Executive' | 'Concessions' | 'Public & Tech';
  keyQuestionEs: string;
  keyQuestionEn: string;
  stepsToTakeEs: string[];
  stepsToTakeEn: string[];
  scriptToSpeakEs: string;
  scriptToSpeakEn: string;
}

export const DEMO_SCRIPTS: DemoScriptItem[] = [
  {
    roleId: 'R09',
    roleNameEs: 'Director General / Alta Dirección',
    roleNameEn: 'General Manager / Executive',
    personaName: 'Ignacio Ortiz',
    targetTab: 'dashboards',
    category: 'Executive',
    keyQuestionEs: '¿Cuál es el estado global de la red regional y el cumplimiento de SLA contractual?',
    keyQuestionEn: 'What is the macro state of regional network and contract SLA compliance?',
    stepsToTakeEs: [
      '1. Seleccionar CITRAM Madrid en el selector superior de sitios.',
      '2. Mostrar el Índice de Disponibilidad de Red (99.85%) y el desglose de 42 operadores y 312 líneas.',
      '3. Cambiar de sitio a "CITRAM Barcelona (ATM)" para demostrar la arquitectura multi-sitio federada: ver cómo los KPIs, las líneas de Rodalies/TMB y los contratos se actualizan en < 300 ms.',
      '4. Cambiar a "CITRAM Sevilla" para mostrar una concesión metropolitana con Metro de Sevilla y Consorcio Metropolitano.',
    ],
    stepsToTakeEn: [
      '1. Select CITRAM Madrid in top site switcher.',
      '2. Highlight the Network Availability KPI (99.85%) and 42 operators / 312 lines overview.',
      '3. Switch site to "CITRAM Barcelona (ATM)" to prove federated multi-site tenancy: observe instant update of KPIs, Rodalies/TMB lines, and contracts in < 300ms.',
      '4. Switch to "CITRAM Sevilla" to demonstrate regional metropolitan governance with Metro de Sevilla and suburban buses.',
    ],
    scriptToSpeakEs:
      '«Buenos días a todo el equipo de CITRAM. Lo que están viendo no es un prototipo estático, sino una plataforma multimodal en tiempo real. En la vista ejecutiva, la alta dirección dispone de una visión holística de los 42 operadores de la región. Si gestionan varias áreas o una federación de consorcios, observen cómo un simple cambio a Barcelona o Sevilla reconfigura inmediatamente las 21 vistas del sistema, segregando contratos, datos telemétricos y operadores sin mezclar datos».',
    scriptToSpeakEn:
      '“Good morning to the CITRAM team. What you are seeing is a live real-time multimodal platform. In this executive cockpit, leadership has an instant pulse across all 42 regional operators. If your authority operates across multi-jurisdictions or federated consortia, notice how switching to Barcelona or Sevilla instantly reconfigures all 21 system perspectives without data leakage.”',
  },
  {
    roleId: 'R01',
    roleNameEs: 'Operador de Sala de Control',
    roleNameEn: 'Control Room Operator',
    personaName: 'Lucía Ferrer',
    targetTab: 'tower',
    category: 'Operations',
    keyQuestionEs: '¿Qué incidentes activos requieren mi atención inmediata y qué flotas están afectadas?',
    keyQuestionEn: 'What live incidents require immediate attention and which fleets are impacted?',
    stepsToTakeEs: [
      '1. Entrar en la Torre de Control (Menú "Torre de Control").',
      '2. Señalar el mapa interactivo en tiempo real con 1.200 vehículos animados por segundo y capas de calor de aglomeración.',
      '3. Hacer clic en la tarjeta de decisión roja: "Avería de Catenaria en Corredor Atocha (INC-2026-0929-ATO)".',
      '4. Mostrar el tiempo restante del SLA (3 min) y hacer clic en "Abrir Caso y Decidir" para saltar al Workspace de Incidentes.',
    ],
    stepsToTakeEn: [
      '1. Open Control Tower (Left Menu "Control Tower").',
      '2. Highlight the 60 FPS live canvas map with 1,200 simulated vehicles and crowding heatmap.',
      '3. Click on the top critical red decision card: "Catenary Fault at Atocha Corridor (INC-2026-0929-ATO)".',
      '4. Highlight the SLA countdown (3 min) and click "Open Case & Act" to drill down into the Incident Workspace.',
    ],
    scriptToSpeakEs:
      '«Para el operador de sala, CITRAM resuelve el problema de la sobrecarga de alertas. En lugar de mirar 20 pantallas descoordinadas de Renfe, Metro y EMT, el motor de correlación reduce 312 alarmas SCADA a un máximo de 5 tarjetas de decisión priorizadas por urgencia de SLA. Aquí vemos una avería de catenaria en Atocha con 4.320 viajeros en riesgo; con un clic, saltamos al protocolo de respuesta».',
    scriptToSpeakEn:
      '“For the control room operator, CITRAM solves alarm fatigue. Instead of juggling 20 isolated vendor screens, our correlation engine distills 312 raw SCADA alarms into at most 5 prioritized decision cards strictly ordered by SLA urgency. Here we see an overhead catenary outage at Atocha affecting 4,320 passengers; one click opens the coordinated action plan.”',
  },
  {
    roleId: 'R03',
    roleNameEs: 'Coordinador de Incidentes',
    roleNameEn: 'Incident Coordinator',
    personaName: 'Andrés Molina',
    targetTab: 'cases',
    category: 'Tactical',
    keyQuestionEs: '¿Cómo coordinar a Metro, Renfe y autobuses en menos de 5 minutos siguiendo el Runbook?',
    keyQuestionEn: 'How to coordinate Metro, Rail, and bus relief in under 5 minutes with Runbooks?',
    stepsToTakeEs: [
      '1. En la vista del Caso INC-2026-0929-ATO, revisar el Runbook de 9 pasos pre-aprobado.',
      '2. Ver los Pasos 1 y 2 ya completados con telemetría SCADA Adif 0V auditada.',
      '3. En el Paso 3, despachar 4 autobuses de refuerzo SE de EMT desde Entrevías.',
      '4. En el Paso 5, autorizar la Retención de Enlace Intermodal en dársena 14 (Autobús 352 retenido 4 min para 142 viajeros en transbordo).',
      '5. Mostrar la línea de tiempo inmutable con firmas y acuses de recibo en < 45 segundos.',
    ],
    stepsToTakeEn: [
      '1. In Case INC-2026-0929-ATO view, review the 9-step pre-approved Runbook.',
      '2. Show Steps 1 & 2 completed with verified Adif SCADA 0V telemetry evidence.',
      '3. At Step 3, dispatch 4 EMT Special Service relief buses from Entrevías depot.',
      '4. At Step 5, approve the Intermodal Connection Hold at bay 14 (Bus 352 held 4 min for 142 transfer passengers).',
      '5. Showcase the immutable audit timeline with cryptographic timestamps and operator receipts in < 45s.',
    ],
    scriptToSpeakEs:
      '«Como Coordinador de Incidentes, la plataforma guía la ejecución del protocolo. El Runbook garantiza que ningún paso crítico se omita: confirmación de tracción, aviso simultáneo a 4 operadores y lo más revolucionario: la protección de transbordos intermodales. Retener un autobús interurbano 4 minutos salva el viaje de 142 pasajeros de Cercanías con un coste marginal despreciable».',
    scriptToSpeakEn:
      '“As Incident Coordinator, the platform choreographs the entire multi-agency response. The Runbook guarantees zero missed steps: traction check, simultaneous 4-operator dispatch, and most crucially: intermodal connection protection. Holding an interurban bus by 4 minutes protects 142 rail transfer passengers with negligible downstream delay.”',
  },
  {
    roleId: 'R04',
    roleNameEs: 'Oficial de Información al Viajero',
    roleNameEn: 'Passenger Information Officer',
    personaName: 'Beatriz Lara',
    targetTab: 'messages',
    category: 'Operations',
    keyQuestionEs: '¿Cómo emitir avisos coordinados en PIS, megafonía, Apps y redes en segundos?',
    keyQuestionEn: 'How to broadcast synchronized alerts to PIS, PA, Mobile Apps, and Social in seconds?',
    stepsToTakeEs: [
      '1. Abrir el menú "Comunicaciones y Avisos" (Passenger Comms Studio).',
      '2. Mostrar la plantilla pre-redactada generada a partir de los datos del caso de Atocha.',
      '3. Revisar los canales activos: Pantallas PIS de andén, megafonía de intercambiadores, App Mi Transporte y redes sociales.',
      '4. Hacer clic en "Aprobar y Emitir Comunicado": ver la confirmación bilingüe (Español/Inglés) sincronizada.',
    ],
    stepsToTakeEn: [
      '1. Open "Passenger Communications & Broadcasts" menu.',
      '2. Show the pre-filled template generated directly from the incident case facts.',
      '3. Review synchronized channels: platform PIS displays, terminal PA, Mi Transporte App, and social feeds.',
      '4. Click "Approve & Broadcast": observe instant bilingual (Spanish/English) dissemination.',
    ],
    scriptToSpeakEs:
      '«Uno de los mayores reproches de los viajeros es recibir información contradictoria. En CITRAM, cuando el coordinador decide la incidencia, el gabinete de prensa y las pantallas de estación reciben exactamente el mismo mensaje bilingüe verificado, recomendando rutas alternativas oficiales como Metro L1 o autobuses de refuerzo».',
    scriptToSpeakEn:
      '“A chief passenger grievance during disruptions is contradictory information. In CITRAM, once the incident is triaged, station screens, mobile apps, and social accounts receive the exact same verified bilingual advisory, recommending pre-cleared alternatives like Metro Line 1.”',
  },
  {
    roleId: 'R07',
    roleNameEs: 'Auditor de Concesiones y Contratos',
    roleNameEn: 'Concession & Contract Auditor',
    personaName: 'Carlos Mendizábal',
    targetTab: 'compliance',
    category: 'Concessions',
    keyQuestionEs: '¿Qué penalizaciones y liquidaciones mensuales corresponden a cada operador?',
    keyQuestionEn: 'What monthly penalties, deductions, and settlements apply to each operator?',
    stepsToTakeEs: [
      '1. Abrir el "Observatorio de Cumplimiento Concesional" (Menú Cumplimiento).',
      '2. Navegar por las 4 pestañas: Resumen de Contratos, Sanciones y Deducciones, Arbitraje de Disputas, y KPIs Técnicos.',
      '3. En "Arbitraje de Disputas", examinar la reclamación de Renfe Cercanías (450 €) alegando fuerza mayor por caída de catenaria Adif.',
      '4. Demostrar cómo el auditor puede conceder ("Estimar Alegación") o desestimar la sanción con trazabilidad de auditoría.',
      '5. Hacer clic en "Descargar Acta Oficial de Liquidación" para generar el informe contractual.',
    ],
    stepsToTakeEn: [
      '1. Open "Concession Compliance & Contract Board" (Left Menu Compliance).',
      '2. Walk through the 4 sub-tabs: Contract Summary, Penalties & Deductions, Dispute Arbitration, and Technical KPIs.',
      '3. In "Dispute Arbitration", inspect Renfe Cercanías dispute claim (€450) arguing force majeure from Adif catenary outage.',
      '4. Demonstrate how the auditor can grant or reject the operator claim with full regulatory audit trail.',
      '5. Click "Export Official Settlement Docket" to generate the formal audit report.',
    ],
    scriptToSpeakEs:
      '«CITRAM no solo coordina la operación en vivo; es el árbitro del contrato-programa. Cada minuto de retraso, rampa PMR averiada o expedición suprimida se liquida mensualmente con reglas objetivas. Además, el módulo de arbitraje permite a los operadores interponer alegaciones de fuerza mayor que el Consorcio resuelve con datos de telemetría irrefutables».',
    scriptToSpeakEn:
      '“CITRAM is not just real-time operations; it is the contract settlement arbiter. Every delay minute, defective wheelchair ramp, or cancelled headway is audited against monthly service agreements. The dispute arbitration engine allows operators to lodge force majeure appeals which the Authority adjudicates using verified telemetry.”',
  },
  {
    roleId: 'R02',
    roleNameEs: 'Jefe de Equipo de Sala (Shift Lead)',
    roleNameEn: 'Shift Lead',
    personaName: 'Rubén Cano',
    targetTab: 'team_board',
    category: 'Operations',
    keyQuestionEs: '¿Va el turno en tiempo, quién está sobrecargado y qué se traspasa al siguiente turno?',
    keyQuestionEn: 'Is the shift on track, who is overloaded, and what is handed over to the next shift?',
    stepsToTakeEs: [
      '1. Abrir el "Tablero de Turno y Equipo" (Menú Equipo).',
      '2. Revisar la dotación de la sala (6 operadores en consolas activas: Metro, EMT, Cercanías).',
      '3. Consultar el diario de a bordo del turno con los eventos cronológicos registrados.',
      '4. En la pestaña "Relevo y Traspaso (Handover)", completar el checklist de 5 puntos y firmar digitalmente el traspaso del turno.',
    ],
    stepsToTakeEn: [
      '1. Open "Shift Operations & Team Board" (Left Menu Team).',
      '2. Inspect room staffing (6 active operator consoles covering Metro, EMT, Commuter Rail).',
      '3. Check the chronological shift log capturing every significant operational handover event.',
      '4. In "Shift Handover" tab, complete the 5-point verification checklist and sign off the shift rotation digitally.',
    ],
    scriptToSpeakEs:
      '«Para el Jefe de Turno, la sala funciona como un reloj suizo. La vista de turno ofrece el estado de las consolas, el cumplimiento de los tiempos de respuesta y la firma digital obligatoria del relevo entre el turno de mañana y el de tarde, garantizando continuidad absoluta del servicio público».',
    scriptToSpeakEn:
      '“For the Shift Lead, the control room runs like clockwork. The shift desk provides instant console status, operator workload metrics, and mandatory digital handover sign-offs between shift rotations, ensuring zero loss of operational context.”',
  },
];

interface DemoScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoleAndTab: (roleId: string, tab: string) => void;
}

export const DemoScriptModal: React.FC<DemoScriptModalProps> = ({
  isOpen,
  onClose,
  onSelectRoleAndTab,
}) => {
  const { language } = useAuth();
  const { activeSite, sites, setActiveSiteId } = useSite();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('R09');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const activeItem = DEMO_SCRIPTS.find((s) => s.roleId === selectedRoleId) || DEMO_SCRIPTS[0];

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const filteredScripts = DEMO_SCRIPTS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.roleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roleNameEs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roleNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.personaName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-[#161B22] rounded-2xl shadow-2xl border border-[#DCE1E7] dark:border-[#2B3440] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/80 dark:bg-[#0E1217]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0071BB]/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Guion de Demostración para CITRAM' : 'CITRAM Live Demo Master Script'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  {language === 'es' ? 'Listo para Presentación' : 'Demo Ready'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {language === 'es'
                  ? 'Estructura por Roles: Pasos a ejecutar en pantalla y qué hablar en cada momento.'
                  : 'Role-by-role structure: Exact on-screen actions and pitch talking points.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Site Switcher inside Demo */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E252E] border border-[#DCE1E7] dark:border-[#2B3440] text-xs">
              <Building2 className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-500">{language === 'es' ? 'Sitio:' : 'Site:'}</span>
              <select
                value={activeSite.id}
                onChange={(e) => setActiveSiteId(e.target.value)}
                className="bg-transparent font-semibold text-[#0071BB] dark:text-[#5AAEE8] focus:outline-hidden cursor-pointer"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id} className="text-neutral-900 dark:text-white dark:bg-[#161B22]">
                    {s.shortName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Role List */}
          <div className="md:col-span-4 border-r border-[#DCE1E7] dark:border-[#2B3440] p-3 flex flex-col bg-neutral-50/40 dark:bg-[#0E1217]/40 overflow-y-auto">
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={language === 'es' ? 'Buscar rol o persona...' : 'Search role or persona...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] focus:outline-hidden focus:border-[#0071BB]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 mb-2.5">
              {['all', 'Executive', 'Operations', 'Tactical', 'Concessions'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#0071BB] text-white font-semibold'
                      : 'bg-white dark:bg-[#1E252E] text-neutral-600 dark:text-neutral-300 border border-[#DCE1E7] dark:border-[#2B3440]'
                  }`}
                >
                  {cat === 'all' ? (language === 'es' ? 'Todos' : 'All') : cat}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
              {filteredScripts.map((item) => {
                const isSelected = item.roleId === activeItem.roleId;
                return (
                  <button
                    key={item.roleId}
                    onClick={() => setSelectedRoleId(item.roleId)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-500/10 border-[#0071BB] dark:border-[#5AAEE8] shadow-xs'
                        : 'bg-white dark:bg-[#161B22] border-[#DCE1E7] dark:border-[#2B3440] hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                        isSelected
                          ? 'bg-[#0071BB] text-white'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {item.roleId}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1] truncate">
                          {language === 'es' ? item.roleNameEs : item.roleNameEn}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 block truncate">
                        {item.personaName} · {item.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Script & Direct Action */}
          <div className="md:col-span-8 p-5 overflow-y-auto space-y-4">
            {/* Top Bar for Selected Role */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold px-2 py-1 rounded bg-[#0071BB] text-white">
                  {activeItem.roleId}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                    {language === 'es' ? activeItem.roleNameEs : activeItem.roleNameEn}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {language === 'es' ? 'Persona Demo:' : 'Demo Persona:'}{' '}
                    <strong className="text-neutral-700 dark:text-neutral-300">{activeItem.personaName}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectRoleAndTab(activeItem.roleId, activeItem.targetTab);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-lg bg-[#0071BB] hover:bg-[#005a96] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {language === 'es' ? 'Simular este Rol en Pantalla' : 'Test Role in Live UI'}
              </button>
            </div>

            {/* Key Focus Question */}
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#0E1217] border border-[#DCE1E7] dark:border-[#2B3440]">
              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                {language === 'es' ? 'Pregunta Clave del Rol' : 'Role Operational Focus'}
              </div>
              <p className="text-xs font-medium text-[#1B1F24] dark:text-[#E8ECF1] italic">
                "{language === 'es' ? activeItem.keyQuestionEs : activeItem.keyQuestionEn}"
              </p>
            </div>

            {/* Table / Step Walkthrough */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0071BB]" />
                {language === 'es' ? 'Pasos a ejecutar durante la demo' : 'On-Screen Steps to Take'}
              </div>
              <div className="space-y-1.5">
                {(language === 'es' ? activeItem.stepsToTakeEs : activeItem.stepsToTakeEn).map((step, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] text-xs text-[#1B1F24] dark:text-[#E8ECF1] flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Script / Pitch: What to Speak */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {language === 'es' ? 'Qué Hablar / Pitch para CITRAM' : 'What to Speak / Pitch Script'}
                </div>
                <button
                  onClick={() =>
                    handleCopyScript(language === 'es' ? activeItem.scriptToSpeakEs : activeItem.scriptToSpeakEn)
                  }
                  className="text-[11px] text-[#0071BB] dark:text-[#5AAEE8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedScript ? (language === 'es' ? 'Copiado' : 'Copied') : (language === 'es' ? 'Copiar guion' : 'Copy script')}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans relative">
                {language === 'es' ? activeItem.scriptToSpeakEs : activeItem.scriptToSpeakEn}
              </div>
            </div>

            {/* Active Site Notice */}
            <div className="p-3 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/40 border border-dashed border-neutral-300 dark:border-neutral-700 text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
              <div>
                <strong>{language === 'es' ? 'Sitio Activo Actual:' : 'Active Demo Site:'}</strong>{' '}
                {activeSite.shortName} ({activeSite.region})
              </div>
              <span className="text-[10px] text-neutral-500">
                {language === 'es'
                  ? 'Cambie de sitio para demostrar que la plataforma es 100% multi-inquilino'
                  : 'Switch sites anytime to prove the platform is truly multi-tenant'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
