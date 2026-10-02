import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { t } from '../../services/localization';
import {
  generate312RawSignals,
  SEEDED_CLUSTERS,
  SAMPLE_UNIQUE_ALERTS,
  AlertCluster,
  RawSignal,
} from '../../data/alertFloodData';
import { AlertConvergenceAnimation } from './AlertConvergenceAnimation';
import {
  Flame,
  Activity,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
  Compass,
  Database,
  Sliders,
  ChevronDown,
  X,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface AlertFloodViewProps {
  onOpenCase: (caseId: string) => void;
  onOpenTrustDrawer: (title: string) => void;
}

export const AlertFloodView: React.FC<AlertFloodViewProps> = ({
  onOpenCase,
  onOpenTrustDrawer,
}) => {
  const { language, effectiveRole } = useAuth();

  const [clusters, setClusters] = useState<AlertCluster[]>(SEEDED_CLUSTERS);
  const [selectedCluster, setSelectedCluster] = useState<AlertCluster | null>(null);
  const [isExplainWhyOpen, setIsExplainWhyOpen] = useState(false);
  const [isNoiseDrawerOpen, setIsNoiseDrawerOpen] = useState(false);
  const [isFloodStateActive, setIsFloodStateActive] = useState(true);
  const [rateGaugeValue, setRateGaugeValue] = useState(58.4); // alerts/sec
  const [filterSource, setFilterSource] = useState<string>('all');

  const rawSignals = generate312RawSignals();

  // Noise suppression metrics (FLD-04)
  const duplicatesCount = 214;
  const flappingCount = 38;
  const plannedWorksCount = 19;
  const totalSuppressed = duplicatesCount + flappingCount + plannedWorksCount; // 271

  const handlePromoteCluster = (clusterId: string) => {
    setClusters((prev) =>
      prev.map((c) =>
        c.id === clusterId ? { ...c, promotedToCaseId: 'INC-2026-0929-ATO' } : c
      )
    );
    onOpenCase('INC-2026-0929-ATO');
  };

  const handleSplitCluster = (clusterId: string) => {
    // Demo split action
    alert(
      language === 'es'
        ? `Clúster '${clusterId}' dividido temporalmente en 2 sub-incidentes por el operador.`
        : `Cluster '${clusterId}' split into 2 sub-incidents by operator.`
    );
  };

  const handleMergeClusters = () => {
    // Demo merge action
    alert(
      language === 'es'
        ? 'Clústeres secundarios fusionados bajo el incidente principal de catenaria.'
        : 'Secondary clusters merged under the primary catenary incident.'
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* Top Banner: Ingestion Rate Gauge & Flood River State (FLD-01, FLD-02) */}
      <div className="rounded-2xl border border-red-500/30 bg-red-50/20 dark:bg-red-950/15 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Torrente de Alertas en Tiempo Real (Flood State)' : 'Real-Time Alert Flood Stream'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase animate-pulse">
                  {language === 'es' ? 'Alerta Masiva Activa' : 'Mass Alert Active'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? 'Tasa de entrada: 58.4 señales/s (3.8x sobre la línea base normal). Ingesta canalizada hacia el motor de correlación.'
                  : 'Ingestion rate: 58.4 signals/s (3.8x above baseline). Stream routed to correlation engine.'}
              </p>
            </div>
          </div>

          {/* Rate Gauge & River Counters */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                {language === 'es' ? 'Tasa de Ingesta' : 'Ingest Rate'}
              </span>
              <span className="text-xl font-bold font-mono text-red-600 dark:text-red-400 tabular-numbers">
                {rateGaugeValue} <span className="text-xs font-normal text-neutral-400">{language === 'es' ? 'señales/s' : 'signals/s'}</span>
              </span>
            </div>

            <button
              onClick={() => setIsNoiseDrawerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] hover:border-neutral-400 dark:hover:border-neutral-600 text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5 text-neutral-500" />
              <span>{language === 'es' ? 'Ruido Filtrado:' : 'Filtered Noise:'} <strong>{totalSuppressed}</strong></span>
            </button>
          </div>
        </div>

        {/* River Cascade Visual (312 -> 41 -> 3 -> 1) */}
        <div className="mt-4 pt-4 border-t border-red-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#161B22]/80 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
              {language === 'es' ? '1. Señales Ingeridas' : '1. Ingested Signals'}
            </span>
            <span className="text-xl font-bold font-mono text-[#0071BB] dark:text-[#5AAEE8] tabular-numbers">312</span>
            <span className="text-[10px] text-neutral-500 block">
              {language === 'es' ? '7 Fuentes de Red' : '7 Network Feeds'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#161B22]/80 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
              {language === 'es' ? '2. Alertas Normalizadas' : '2. Normalized Alerts'}
            </span>
            <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-numbers">41</span>
            <span className="text-[10px] text-neutral-500 block">
              {language === 'es' ? '-271 ruidos suprimidos' : '-271 noise suppressed'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#161B22]/80 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
              {language === 'es' ? '3. Clústeres Topológicos' : '3. Topological Clusters'}
            </span>
            <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-numbers">3</span>
            <span className="text-[10px] text-neutral-500 block">
              {language === 'es' ? 'Espacio-Tiempo-Red' : 'Space-Time-Network'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#161B22]/80 border border-red-500/30 bg-red-50/30">
            <span className="text-[10px] text-red-600 dark:text-red-400 uppercase font-bold block">
              {language === 'es' ? '4. Incidencia Crítica' : '4. Critical Incident'}
            </span>
            <span className="text-xl font-bold font-mono text-red-600 dark:text-red-400 tabular-numbers">1</span>
            <span className="text-[10px] text-red-700 dark:text-red-300 font-semibold block">INC-2026-0929</span>
          </div>
        </div>
      </div>

      {/* Hero Animation Interactive Box */}
      <AlertConvergenceAnimation
        onOpenCase={() => onOpenCase('INC-2026-0929-ATO')}
      />

      {/* Correlation Clusters & Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: The 3 Correlated Clusters (FLD-03) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0071BB]" />
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Clústeres Agrupados por Correlación (3)' : 'Correlated Incident Clusters (3)'}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleMergeClusters}
                className="px-2.5 py-1 rounded-md border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
              >
                {language === 'es' ? 'Fusionar' : 'Merge'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {clusters.map((cluster) => {
              const isCrit = cluster.severity === 'critical';
              return (
                <div
                  key={cluster.id}
                  className={`p-5 rounded-2xl border bg-white dark:bg-[#161B22] shadow-xs space-y-3 transition-all ${
                    isCrit
                      ? 'border-red-500/40 dark:border-red-500/40 ring-1 ring-red-500/20'
                      : 'border-[#DCE1E7] dark:border-[#2B3440]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isCrit
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                            : cluster.severity === 'high'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {cluster.severity}
                      </span>
                      <span className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                        {cluster.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {language === 'es' ? 'Confianza:' : 'Confidence:'} {cluster.confidenceScore}%
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        {cluster.rawSignalCount} {language === 'es' ? 'señales' : 'signals'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {language === 'es' ? cluster.reasoningEs : cluster.reasoningEn}
                  </p>

                  <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-neutral-500">
                      {language === 'es' ? 'Ubicación:' : 'Location:'} <strong className="text-neutral-800 dark:text-neutral-200">{cluster.primaryLocation}</strong> · {cluster.affectedCorridor}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCluster(cluster);
                        setIsExplainWhyOpen(true);
                      }}
                      className="text-xs font-semibold text-[#0071BB] dark:text-[#5AAEE8] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Ver pesos de señales (Explain-Why)' : 'View signal weights'}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <button
                      onClick={() => handleSplitCluster(cluster.id)}
                      className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer"
                    >
                      {language === 'es' ? 'Dividir clúster' : 'Split cluster'}
                    </button>

                    <button
                      onClick={() => handlePromoteCluster(cluster.id)}
                      className="px-4 py-1.5 rounded-lg bg-[#0071BB] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>{language === 'es' ? 'Promover a Caso (1-Click)' : 'Promote to Case (1-Click)'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contextual Feeds & Suppression (FLD-07) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1] flex items-center gap-2">
            <Database className="w-4 h-4 text-neutral-500" />
            <span>{language === 'es' ? 'Contexto Operativo Cruzado (FLD-07)' : 'Cross-System Operational Context (FLD-07)'}</span>
          </h3>

          <div className="p-4 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                {language === 'es' ? 'Meteorología (AEMET N15)' : 'Meteorology (AEMET N15)'}
              </span>
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                {language === 'es' ? 'Madrid Central: 28°C · Despejado' : 'Central Madrid: 28°C · Clear'}
              </div>
              <div className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Humedad 24% · Sin alertas activas de lluvia o viento.' : 'Humidity 24% · No active rain or wind alerts.'}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                {language === 'es' ? 'Calendario de Eventos (N17/DGT)' : 'Event Calendar (N17/DGT)'}
              </span>
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                {language === 'es' ? 'Santiago Bernabéu: Partido Champions (21:00)' : 'Santiago Bernabéu: Champions League Match (21:00)'}
              </div>
              <div className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Afluencia estimada: 75.000 espectadores desde 18:30.' : 'Estimated attendance: 75,000 spectators from 18:30.'}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                {language === 'es' ? 'Mantenimiento de Infraestructura' : 'Infrastructure Maintenance'}
              </span>
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                {language === 'es' ? 'Orden OT-2026-CAT-09: Catenaria Sur' : 'Work Order OT-2026-CAT-09: South Catenary'}
              </div>
              <div className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Última revisión preventiva: hace 22 días (Nominal).' : 'Last preventive inspection: 22 days ago (Nominal).'}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                {language === 'es' ? 'Caso Histórico Similar (Retrieval)' : 'Similar Historical Case (Retrieval)'}
              </span>
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                {language === 'es' ? 'INC-2025-1104 (Avería en vía 4 Atocha)' : 'INC-2025-1104 (Outage on Track 4 Atocha)'}
              </div>
              <div className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Resolución en 48 min con refuerzo EMT línea 27.' : 'Resolved in 48 min with EMT Line 27 reinforcement.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Noise Suppression Drawer Modal (FLD-04) */}
      {isNoiseDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#161B22] border-l border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl h-full flex flex-col justify-between overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-neutral-500" />
                  <div>
                    <h3 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? 'Filtro de Supresión de Ruido (FLD-04)' : 'Noise Suppression Filter (FLD-04)'}
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {language === 'es' ? '271 SEÑALES SUPRIMIDAS AUTOMÁTICAMENTE' : '271 SIGNALS AUTOMATICALLY SUPPRESSED'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsNoiseDrawerOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440]">
                  <span className="text-[10px] text-neutral-400 block">{language === 'es' ? 'Duplicados' : 'Duplicates'}</span>
                  <span className="font-mono font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1]">214</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440]">
                  <span className="text-[10px] text-neutral-400 block">{language === 'es' ? 'Oscilantes (Flapping)' : 'Flapping'}</span>
                  <span className="font-mono font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1]">38</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440]">
                  <span className="text-[10px] text-neutral-400 block">{language === 'es' ? 'Obras Previas' : 'Scheduled Works'}</span>
                  <span className="font-mono font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1]">19</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                  {language === 'es' ? 'Muestra de Señales Suprimidas:' : 'Sample of Suppressed Signals:'}
                </span>
                {rawSignals.slice(42, 50).map((sig) => (
                  <div
                    key={sig.id}
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-xs text-neutral-600 dark:text-neutral-400 space-y-0.5"
                  >
                    <div className="flex justify-between font-mono text-[10px] text-neutral-400">
                      <span>{sig.id} · {sig.sourceName}</span>
                      <span>{sig.timestamp}</span>
                    </div>
                    <div className="font-medium">{sig.rawText}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                {language === 'es' ? 'Reglas configurables en Administración' : 'Rules configurable in Admin'}
              </span>
              <button
                onClick={() => setIsNoiseDrawerOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold cursor-pointer"
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explain-Why Signal Weights Drawer (FLD-08) */}
      {isExplainWhyOpen && selectedCluster && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#161B22] border-l border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl h-full flex flex-col justify-between overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#5B4BC4] dark:text-[#A193FF]" />
                  <div>
                    <h3 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? 'Panel Explain-Why: Pesos de Señales' : 'Explain-Why Panel: Signal Weights'}
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {selectedCluster.id.toUpperCase()} · {language === 'es' ? 'CONFIANZA' : 'CONFIDENCE'} {selectedCluster.confidenceScore}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsExplainWhyOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {selectedCluster.name}
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  {language === 'es'
                    ? 'Distribución de ponderación atribuida a cada evidencia para clasificar la causa raíz:'
                    : 'Weight distribution attributed to each piece of evidence to classify root cause:'}
                </p>
              </div>

              {/* Signal Weights List */}
              <div className="space-y-3">
                {selectedCluster.signalsWeights.map((sw, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900/60 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {sw.signalName}
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {sw.weight}% {language === 'es' ? 'peso' : 'weight'}
                      </span>
                    </div>

                    {/* Progress Bar for Weight */}
                    <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <div
                        style={{ width: `${sw.weight}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-neutral-400 pt-0.5">
                      <span>{language === 'es' ? 'Fuente:' : 'Source:'} {sw.source}</span>
                      <span>{language === 'es' ? 'Hora:' : 'Time:'} {sw.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                {language === 'es' ? 'Trazabilidad de evaluación auditada' : 'Audited evaluation traceability'}
              </span>
              <button
                onClick={() => setIsExplainWhyOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold cursor-pointer"
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
