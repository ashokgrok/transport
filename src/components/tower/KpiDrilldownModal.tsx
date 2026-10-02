import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import {
  AlertTriangle,
  Activity,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  X,
  Users,
  Building2,
  ChevronRight,
  Zap,
  Sliders,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';

export type KpiDrilldownTab = 'incidents' | 'latency' | 'health' | 'slas';

interface KpiDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: KpiDrilldownTab;
  onOpenCase?: (caseId: string) => void;
  onOpenTrustDrawer?: (metricTitle: string) => void;
  isAllClearMode?: boolean;
}

export const KpiDrilldownModal: React.FC<KpiDrilldownModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'incidents',
  onOpenCase,
  onOpenTrustDrawer,
  isAllClearMode = false,
}) => {
  const { language } = useAuth();
  const [activeTab, setActiveTab] = useState<KpiDrilldownTab>(initialTab);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'moderate' | 'minor'>('all');

  // Synchronize initialTab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Real-time Active Incidents Data
  const incidents = [
    {
      id: 'INC-2026-0929-ATO',
      titleEs: 'Avería de Catenaria en Corredor Ferroviario de Atocha',
      titleEn: 'Overhead Catenary Fault at Atocha Rail Corridor',
      corridor: 'Corredor Sur / Atocha - Méndez Álvaro',
      severity: 'critical' as const,
      affectedLines: ['Cercanías C-3', 'Cercanías C-4', 'Cercanías C-5', 'Interurbano 352'],
      affectedPax: 4320,
      detectedAt: '13:41:04',
      slaCountdownMinutes: 12,
      slaTargetMinutes: 20,
      statusEs: 'Mitigación en curso: Servicio Especial 4 autobuses EMT desplegados',
      statusEn: 'Mitigation in progress: Special Bus Service 4 EMT units dispatched',
      assignedTo: 'Andrés Molina (R03 - Coordinador de Sala)',
      intermodalAction: 'Retención de 4 min en dársena 14 bus 352 autorizada',
    },
    {
      id: 'INC-2026-0929-CHA',
      titleEs: 'Fallo de Señalización en Agujas de Chamartín Vía 7',
      titleEn: 'Signalling & Switch Failure at Chamartín Track 7',
      corridor: 'Corredor Norte / Chamartín Clara Campoamor',
      severity: 'moderate' as const,
      affectedLines: ['Cercanías C-1', 'Cercanías C-2', 'Cercanías C-7'],
      affectedPax: 850,
      detectedAt: '13:18:22',
      slaCountdownMinutes: 28,
      slaTargetMinutes: 45,
      statusEs: 'Desvío de circulación a vía 8. Demoras controladas de 6 a 8 minutos',
      statusEn: 'Traffic diverted to track 8. Controlled delays of 6 to 8 minutes',
      assignedTo: 'Lucía Ferrer (R01 - Operadora de Tráfico)',
      intermodalAction: 'Avisos en andén PIS y megafonía emitidos',
    },
    {
      id: 'INC-2026-0929-MON',
      titleEs: 'Parada Técnica de Ascensor y Salvaescaleras Moncloa',
      titleEn: 'Unscheduled Lift Outage & PMR Barrier at Moncloa',
      corridor: 'Intercambiador de Moncloa (Isla 1 - Andén L6)',
      severity: 'minor' as const,
      affectedLines: ['Metro Línea 6', 'Interurbanos A-6'],
      affectedPax: 340,
      detectedAt: '13:25:00',
      slaCountdownMinutes: 35,
      slaTargetMinutes: 60,
      statusEs: 'Itinerario alternativo por ascensor 2 hacia dársenas señalizado',
      statusEn: 'Alternative step-free path via Lift 2 to bus bays signposted',
      assignedTo: 'Atendo Renfe / Mantenimiento Otis',
      intermodalAction: 'Asistente de movilidad presencial desplegado',
    },
  ];

  const filteredIncidents = incidents.filter((inc) => {
    if (isAllClearMode) return false;
    if (severityFilter === 'all') return true;
    return inc.severity === severityFilter;
  });

  // Feeds and Telemetry Ingestion Data
  const telemetryFeeds = [
    {
      id: 'N01',
      name: 'EMT Madrid SAE (GPS / AVL)',
      type: 'GTFS-RT & SIRI',
      latency: 18,
      status: 'optimal',
      rate: '1,840 reg/s',
      packetLoss: '0.00%',
      lastPing: 'Hace 1s',
      description: 'Posición de 2.050 autobuses urbanos en tiempo real',
    },
    {
      id: 'N02',
      name: 'Metro de Madrid CTC (SCADA Tráfico)',
      type: 'SCADA / Protobuf',
      latency: 22,
      status: 'optimal',
      rate: '420 reg/s',
      packetLoss: '0.01%',
      lastPing: 'Hace 2s',
      description: 'Bloqueo y señalización de 12 líneas subterráneas',
    },
    {
      id: 'N03',
      name: 'Adif Catenaria & Tracción Ferroviaria',
      type: 'OPC-UA / SCADA',
      latency: 34,
      status: 'warning',
      rate: '180 reg/s',
      packetLoss: '0.04%',
      lastPing: 'Hace 3s',
      description: 'Telemetría de subestaciones y tensión de catenaria (Disparo en Atocha)',
    },
    {
      id: 'N05',
      name: 'Intercambiadores de Madrid SIRI Hub',
      type: 'SIRI 2.1 (CEN 15531)',
      latency: 28,
      status: 'optimal',
      rate: '210 reg/s',
      packetLoss: '0.00%',
      lastPing: 'Hace 1s',
      description: 'Avenida de América, Plaza de Castilla, Príncipe Pío, Moncloa, Plaza Elíptica',
    },
    {
      id: 'N14',
      name: 'Tornos y Billetería Calypso NFC',
      type: 'WebSocket Event Stream',
      latency: 65,
      status: 'optimal',
      rate: '3,200 reg/s',
      packetLoss: '0.00%',
      lastPing: 'Hace 1s',
      description: 'Validaciones de tornos para estimación instantánea de aforos',
    },
    {
      id: 'N16',
      name: 'Pasarela CCTV Cámaras de Seguridad',
      type: 'WebRTC / RTSP',
      latency: 240,
      status: 'optimal',
      rate: '85 fps',
      packetLoss: '0.12%',
      lastPing: 'Hace 5s',
      description: 'Flujo visual de andenes y vestíbulos con analítica de aglomeración',
    },
    {
      id: 'N23',
      name: 'Motor de Correlación CITRAM',
      type: 'Kafka Stream Processing',
      latency: 12,
      status: 'optimal',
      rate: '5,100 evt/s',
      packetLoss: '0.00%',
      lastPing: 'Hace 1s',
      description: 'Deduplicación 312 señales → 3 clústeres → 1 caso operativo',
    },
  ];

  // Multimodal System Health & Punctuality
  const modesHealth = [
    {
      mode: 'Metro de Madrid',
      health: '99.9%',
      punctuality: '98.7%',
      target: '≥ 98.0%',
      status: 'nominal',
      activeTrains: 312,
      lines: '12 líneas + Ramal',
      incidentNote: 'Circulación normal en toda la red',
    },
    {
      mode: 'EMT Autobuses Urbanos',
      health: '99.8%',
      punctuality: '96.4%',
      target: '≥ 95.0%',
      status: 'nominal',
      activeTrains: 2048,
      lines: '214 líneas',
      incidentNote: '4 autobuses asignados al Servicio Especial Atocha',
    },
    {
      mode: 'Renfe Cercanías Madrid',
      health: '98.4%',
      punctuality: '94.2%',
      target: '≥ 96.0%',
      status: 'degraded',
      activeTrains: 118,
      lines: '9 líneas',
      incidentNote: 'Afectación severa en C-3, C-4 y C-5 por catenaria Atocha',
    },
    {
      mode: 'Metro Ligero / Tranvía',
      health: '99.7%',
      punctuality: '99.2%',
      target: '≥ 98.0%',
      status: 'nominal',
      activeTrains: 28,
      lines: 'ML1, ML2, ML3',
      incidentNote: 'Operación nominal en Boadilla y Pozuelo',
    },
    {
      mode: 'Autobuses Interurbanos CRTM',
      health: '99.1%',
      punctuality: '97.2%',
      target: '≥ 96.0%',
      status: 'nominal',
      activeTrains: 1840,
      lines: '39 concesiones',
      incidentNote: 'Retenciones puntuales en A-42 y A-3',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between bg-neutral-50/50 dark:bg-[#0E1217]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0071BB]/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es'
                    ? 'Desglose Analítico de KPIs Operativos'
                    : 'Operational KPI Deep Drilldown & Diagnostics'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold uppercase">
                  CITRAM Live Ingest
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? 'Transición directa desde indicadores de alto nivel hacia casos, telemetría y cumplimiento SLA.'
                  : 'Direct navigation from headline metrics into active cases, sensor feeds, and SLA tracking.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close drilldown modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="px-6 pt-3 border-b border-[#DCE1E7] dark:border-[#2B3440] flex items-center gap-2 bg-white dark:bg-[#161B22]">
          {[
            {
              id: 'incidents' as const,
              labelEs: isAllClearMode ? 'Incidencias (0 Activas)' : 'Incidencias Activas (3)',
              labelEn: isAllClearMode ? 'Incidents (0 Active)' : 'Active Incidents (3)',
              badge: isAllClearMode ? '0' : '3',
              badgeColor: isAllClearMode ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600',
              icon: <AlertTriangle className="w-4 h-4" />,
            },
            {
              id: 'latency' as const,
              labelEs: 'Telemetría de Feeds (24ms)',
              labelEn: 'Telemetry Feeds (24ms)',
              badge: '7 feeds',
              badgeColor: 'bg-blue-500/10 text-[#0071BB]',
              icon: <Activity className="w-4 h-4" />,
            },
            {
              id: 'health' as const,
              labelEs: 'Salud de Red (99.85%)',
              labelEn: 'Network Health (99.85%)',
              badge: '5 modos',
              badgeColor: 'bg-emerald-500/10 text-emerald-600',
              icon: <ShieldCheck className="w-4 h-4" />,
            },
            {
              id: 'slas' as const,
              labelEs: 'Relojes SLA y Contratos',
              labelEn: 'SLAs & Contract Clocks',
              badge: '1 en riesgo',
              badgeColor: 'bg-amber-500/10 text-amber-600',
              icon: <Clock className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#0071BB] text-[#0071BB] dark:text-[#5AAEE8]'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{language === 'es' ? tab.labelEs : tab.labelEn}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab.badgeColor}`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#F9FAFB] dark:bg-[#0E1217]">
          {/* TAB 1: INCIDENTS DRILLDOWN */}
          {activeTab === 'incidents' && (
            <div className="space-y-4">
              {/* Summary Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {language === 'es' ? 'Total Casos Activos' : 'Total Active Cases'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-[#1B1F24] dark:text-[#E8ECF1]">
                      {isAllClearMode ? 0 : 3}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {isAllClearMode ? (language === 'es' ? 'Sin incidencias' : 'Clear') : '1 crítico · 2 moderados'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {language === 'es' ? 'Pasajeros Afectados' : 'Impacted Passengers'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-red-600 dark:text-red-400">
                      {isAllClearMode ? 0 : '5,510'}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {language === 'es' ? 'en 4 corredores' : 'across 4 corridors'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {language === 'es' ? 'Refuerzos en Ruta' : 'Reinforcements Active'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {isAllClearMode ? 0 : '4 SE'}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {language === 'es' ? 'Cochera Entrevías' : 'Entrevías Depot'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {language === 'es' ? 'Reloj SLA Más Próximo' : 'Tightest SLA Clock'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
                      {isAllClearMode ? '--' : '12 min'}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      INC-2026-0929-ATO
                    </span>
                  </div>
                </div>
              </div>

              {/* Severity Filter Controls */}
              {!isAllClearMode && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Filter className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-neutral-500 font-medium">
                      {language === 'es' ? 'Filtrar por severidad:' : 'Filter by severity:'}
                    </span>
                    {(['all', 'critical', 'moderate', 'minor'] as const).map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setSeverityFilter(sev)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer capitalize ${
                          severityFilter === sev
                            ? 'bg-[#0071BB] text-white'
                            : 'bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {sev === 'all'
                          ? language === 'es'
                            ? 'Todos (3)'
                            : 'All (3)'
                          : sev === 'critical'
                          ? language === 'es'
                            ? 'Crítico (1)'
                            : 'Critical (1)'
                          : sev === 'moderate'
                          ? language === 'es'
                            ? 'Moderado (1)'
                            : 'Moderate (1)'
                          : language === 'es'
                          ? 'Menor (1)'
                          : 'Minor (1)'}
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] text-neutral-400 font-medium">
                    {language === 'es' ? 'Haz clic en cualquier caso para abrir su espacio interactivo' : 'Click any case to open its dedicated workspace'}
                  </span>
                </div>
              )}

              {/* Incidents List Cards */}
              <div className="space-y-3">
                {isAllClearMode ? (
                  <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? 'Red en Estado Nominal: Todo Despejado' : 'Network Nominal: All Clear'}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                      {language === 'es'
                        ? 'No se registran averías de infraestructura ni desvíos operativos activos en la red metropolitana.'
                        : 'No active infrastructure outages or operational detours reported on the metropolitan network.'}
                    </p>
                  </div>
                ) : (
                  filteredIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] hover:border-[#0071BB] dark:hover:border-[#5AAEE8] transition-all shadow-xs space-y-3 group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider ${
                              inc.severity === 'critical'
                                ? 'bg-red-500/10 text-red-600 border border-red-500/20 animate-pulse'
                                : inc.severity === 'moderate'
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                            }`}
                          >
                            {inc.severity}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8]">
                            {inc.id}
                          </span>
                          <span className="text-neutral-400 text-xs">•</span>
                          <h4 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1] group-hover:text-[#0071BB] dark:group-hover:text-[#5AAEE8] transition-colors">
                            {language === 'es' ? inc.titleEs : inc.titleEn}
                          </h4>
                        </div>

                        {/* SLA Countdown pill */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>SLA: {inc.slaCountdownMinutes} min restantes</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {language === 'es' ? inc.statusEs : inc.statusEn}
                      </p>

                      {/* Corridor, lines & assignment metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-neutral-400 font-medium">
                            {language === 'es' ? 'Líneas:' : 'Lines:'}
                          </span>
                          {inc.affectedLines.map((line) => (
                            <span
                              key={line}
                              className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-semibold text-[11px] text-neutral-700 dark:text-neutral-300"
                            >
                              {line}
                            </span>
                          ))}
                          <span className="text-neutral-400 text-xs ml-2">
                            ({inc.affectedPax.toLocaleString()} {language === 'es' ? 'viajeros' : 'pax'})
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-neutral-500 italic hidden sm:inline">
                            {inc.assignedTo}
                          </span>

                          <button
                            onClick={() => {
                              onClose();
                              onOpenCase?.(inc.id);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071BB] text-white hover:bg-blue-700 text-xs font-bold cursor-pointer shadow-xs transition-colors"
                          >
                            <span>{language === 'es' ? 'Abrir Espacio de Trabajo' : 'Open Case Workspace'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LATENCY & SENSOR FEEDS DRILLDOWN */}
          {activeTab === 'latency' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/20 dark:bg-blue-950/20 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#0071BB] dark:text-[#5AAEE8]" />
                    <span className="font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? 'Rendimiento Global de Ingesta' : 'Global Ingestion Performance'}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    {language === 'es'
                      ? '7 concentradores de datos en tiempo real procesando 11.200 mensajes/seg con latencia media de 24ms (SLA < 50ms).'
                      : '7 live data concentrators ingesting 11,200 msg/sec at 24ms avg latency (SLA target < 50ms).'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenTrustDrawer?.('Pipeline Telemetry Latency');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0071BB] text-[#0071BB] dark:text-[#5AAEE8] hover:bg-[#0071BB]/10 font-semibold cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Ver Trazabilidad de Datos' : 'Data Trust Audit'}</span>
                </button>
              </div>

              {/* Feeds Table */}
              <div className="rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] overflow-hidden shadow-xs">
                <div className="px-4 py-3 border-b border-[#DCE1E7] dark:border-[#2B3440] font-bold text-xs text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Desglose de Conectores de Telemetría N01-N23' : 'N01-N23 Telemetry Connectors Status'}
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  {telemetryFeeds.map((feed) => (
                    <div
                      key={feed.id}
                      className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-[#1B222D]/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-500 text-[11px]">
                            {feed.id}
                          </span>
                          <span className="font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                            {feed.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {feed.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">{feed.description}</p>
                      </div>

                      <div className="flex items-center gap-5 shrink-0 text-right">
                        <div>
                          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Caudal</div>
                          <div className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">{feed.rate}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Pérdida</div>
                          <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{feed.packetLoss}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Latencia</div>
                          <div className={`font-mono font-bold text-sm ${
                            feed.latency > 50 ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {feed.latency} ms
                          </div>
                        </div>
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            feed.status === 'optimal'
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM HEALTH & MODE PUNCTUALITY */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/20 dark:bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? 'Disponibilidad Multimodal de la Red' : 'Multimodal Network Availability'}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    {language === 'es'
                      ? 'Índice ponderado regional calculado sobre 42 operadores: 99.85% (Superior al objetivo contractual del 99.80%).'
                      : 'Weighted regional index computed across 42 operators: 99.85% (Exceeds contract SLA target of 99.80%).'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {isAllClearMode ? '100.0%' : '99.85%'}
                  </span>
                  <span className="block text-[10px] text-neutral-400 font-mono">Obj. 99.80%</span>
                </div>
              </div>

              {/* Mode breakdown cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                {modesHealth.map((item) => (
                  <div
                    key={item.mode}
                    className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                        {item.mode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          item.status === 'nominal'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-neutral-100 dark:border-neutral-800">
                      <div>
                        <span className="text-neutral-400 text-[10px] uppercase">Disponibilidad</span>
                        <div className="font-mono font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1]">
                          {isAllClearMode ? '100%' : item.health}
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[10px] uppercase">Puntualidad / SLA</span>
                        <div className="font-mono font-bold text-base text-neutral-700 dark:text-neutral-300">
                          {isAllClearMode ? '99.5%' : item.punctuality}{' '}
                          <span className="text-[10px] text-neutral-400 font-normal">({item.target})</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-500 italic">
                      {isAllClearMode ? (language === 'es' ? 'Operación 100% nominal' : '100% nominal operation') : item.incidentNote}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SLAS & CONTRACT CLOCKS */}
          {activeTab === 'slas' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? 'Supervisión Contractual y Penalizaciones' : 'Contractual SLA Tracking & Penalty Exposure'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Penalizaciones Acumuladas: 0 €
                  </span>
                </div>

                <div className="space-y-2 text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  <p>
                    {language === 'es'
                      ? 'De acuerdo con el pliego regulador del CRTM, toda incidencia mayor que supere los 20 minutos de bloqueo sin medidas de contingencia activadas devenga penalización económica.'
                      : 'Under CRTM concession contracts, major disruptions exceeding 20 minutes without activated contingencies incur financial penalties.'}
                  </p>
                  <div className="p-3 rounded-lg bg-neutral-50 dark:bg-[#0E1217] border border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between font-mono">
                    <span>INC-2026-0929-ATO: Retención 4 min + 4 buses SE</span>
                    <span className="text-emerald-600 font-bold">✓ Bonificación por mitigación rápida</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Direct Actions */}
        <div className="px-6 py-3.5 border-t border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between bg-white dark:bg-[#161B22] text-xs">
          <span className="text-neutral-500">
            {language === 'es'
              ? 'Todos los datos se refrescan automáticamente en tiempo real (cada 5s)'
              : 'All telemetry metrics refresh automatically in real-time (every 5s)'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenCase?.('INC-2026-0929-ATO');
              }}
              className="px-4 py-2 rounded-lg bg-[#0071BB] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{language === 'es' ? 'Ir al Caso Crítico (Atocha)' : 'Go to Critical Case (Atocha)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
