import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import {
  AlertTriangle,
  Zap,
  ShieldCheck,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Activity,
  ArrowRight,
  ExternalLink,
  BarChart3,
  Sliders,
  Bell,
  CheckCircle2,
  Play,
  Pause,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { KpiChartsPanel } from './KpiChartsPanel';
import {
  ThresholdAlertsModal,
  KpiThresholds,
  DEFAULT_KPI_THRESHOLDS,
  ThresholdAlertEvent,
} from './ThresholdAlertsModal';
import { PredictiveForecastModal } from './PredictiveForecastModal';
import { KpiDrilldownModal, KpiDrilldownTab } from './KpiDrilldownModal';

export interface KpiSummaryProps {
  isAllClearMode?: boolean;
  onOpenCase?: (caseId: string) => void;
  onOpenTrustDrawer?: (metricTitle: string) => void;
  className?: string;
}

export type RefreshCadence = 0 | 2 | 5 | 10 | 30; // 0 is Off

export const KpiSummary: React.FC<KpiSummaryProps> = ({
  isAllClearMode = false,
  onOpenCase,
  onOpenTrustDrawer,
  className = '',
}) => {
  const { language } = useAuth();
  const { activeSite } = useSite();

  // Drilldown modal state
  const [drilldownTab, setDrilldownTab] = useState<KpiDrilldownTab | null>(null);

  // Autorefresh controls
  const [refreshCadence, setRefreshCadence] = useState<RefreshCadence>(5); // default 5s
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState<boolean>(true);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Charts view toggle
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'5m' | '1h' | '8h'>('5m');

  // Real-time jitter for latency sparkline (simulates live telemetry ingest)
  const [latencyHistory, setLatencyHistory] = useState<number[]>([23, 26, 21, 28, 24, 22, 25, 24]);
  const [currentLatency, setCurrentLatency] = useState<number>(24);

  // Threshold alerts management
  const [thresholds, setThresholds] = useState<KpiThresholds>(DEFAULT_KPI_THRESHOLDS);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [isForecastModalOpen, setIsForecastModalOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<ThresholdAlertEvent[]>([
    {
      id: 'ALT-INIT-01',
      metric: 'latency',
      severity: 'warning',
      title: language === 'es' ? 'Aviso Preventivo de Latencia' : 'Preventive Latency Warning',
      message:
        language === 'es'
          ? 'Pico transitorio de 38ms en concentrador SIRI Chamartín a las 08:35 (umbral 35ms).'
          : 'Transient 38ms spike on Chamartín SIRI hub at 08:35 (threshold 35ms).',
      timestamp: '08:35:10',
      acknowledged: true,
    },
  ]);

  // Initialize timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastSyncTime(
        now.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
  }, [language]);

  // Autorefresh countdown & tick loop
  useEffect(() => {
    if (!isAutoRefreshActive || refreshCadence === 0) return;

    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          // Trigger data refresh tick
          const delta = (Math.random() - 0.5) * 4;
          const nextLatency = Math.min(33, Math.max(20, Math.round(24 + delta)));
          setCurrentLatency(nextLatency);
          setLatencyHistory((hist) => [...hist.slice(1), nextLatency]);

          const now = new Date();
          setLastSyncTime(
            now.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          );

          // Check thresholds dynamically
          if (nextLatency >= thresholds.maxLatencyCritical) {
            triggerThresholdAlert({
              metric: 'latency',
              severity: 'critical',
              title: language === 'es' ? 'Incumplimiento Crítico de SLA Latencia' : 'Critical Latency SLA Breach',
              message:
                language === 'es'
                  ? `Latencia media alcanzó ${nextLatency}ms, superando el límite SLA de ${thresholds.maxLatencyCritical}ms.`
                  : `Average latency reached ${nextLatency}ms, exceeding SLA limit of ${thresholds.maxLatencyCritical}ms.`,
            });
          } else if (nextLatency >= thresholds.maxLatencyWarning) {
            triggerThresholdAlert({
              metric: 'latency',
              severity: 'warning',
              title: language === 'es' ? 'Advertencia de Latencia de Ingesta' : 'Ingest Latency Warning',
              message:
                language === 'es'
                  ? `Latencia de telemetría a ${nextLatency}ms superó el umbral preventivo de ${thresholds.maxLatencyWarning}ms.`
                  : `Telemetry latency at ${nextLatency}ms exceeded preventive threshold of ${thresholds.maxLatencyWarning}ms.`,
            });
          }

          return refreshCadence;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoRefreshActive, refreshCadence, thresholds, language]);

  const triggerThresholdAlert = (data: {
    metric: 'latency' | 'incidents' | 'health';
    severity: 'warning' | 'critical';
    title: string;
    message: string;
  }) => {
    const now = new Date().toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newAlert: ThresholdAlertEvent = {
      id: `ALT-${Date.now()}`,
      metric: data.metric,
      severity: data.severity,
      title: data.title,
      message: data.message,
      timestamp: now,
      acknowledged: false,
    };

    setActiveAlerts((prev) => [newAlert, ...prev.slice(0, 15)]);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const freshLatency = Math.floor(21 + Math.random() * 5);
      setCurrentLatency(freshLatency);
      setLatencyHistory((prev) => [...prev.slice(1), freshLatency]);
      const now = new Date();
      setLastSyncTime(
        now.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCountdownSeconds(refreshCadence || 5);
      setIsRefreshing(false);
    }, 350);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setActiveAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const handleSimulateThresholdAlert = () => {
    triggerThresholdAlert({
      metric: 'latency',
      severity: 'warning',
      title: language === 'es' ? 'Simulación: Umbral de Latencia Excedido' : 'Simulated: Latency Threshold Exceeded',
      message:
        language === 'es'
          ? 'Prueba de disparo operativo: El concentrador de feeds N05 registró 42ms de demora transitoria.'
          : 'Operational drill test: N05 feed hub recorded 42ms transient delay.',
    });
  };

  // Sparkline coordinates
  const minLatency = 15;
  const maxLatency = 35;
  const svgWidth = 90;
  const svgHeight = 24;
  const points = latencyHistory
    .map((val, idx) => {
      const x = (idx / (latencyHistory.length - 1)) * svgWidth;
      const normalizedY = (val - minLatency) / (maxLatency - minLatency);
      const y = svgHeight - normalizedY * (svgHeight - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  // Metrics calculation
  const activeIncidentsCount = isAllClearMode ? 0 : activeSite.id === 'site-b' ? 2 : activeSite.id === 'site-c' ? 2 : 3;
  const systemHealthScore = isAllClearMode ? '100.0%' : activeSite.id === 'site-b' ? '99.72%' : activeSite.id === 'site-c' ? '97.40%' : '99.85%';

  // Unacknowledged alerts count
  const unacknowledgedAlerts = activeAlerts.filter((a) => !a.acknowledged);
  const hasThresholdWarning = unacknowledgedAlerts.some((a) => a.severity === 'warning');
  const hasThresholdCritical = unacknowledgedAlerts.some((a) => a.severity === 'critical');

  return (
    <div
      className={`rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] p-4 shadow-xs transition-colors ${className}`}
      data-testid="kpi-summary"
    >
      {/* KPI Top Command Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Resumen de KPIs Operativos' : 'KPI Summary'}
              </h2>
              {/* Unboxed Status & Timestamp */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAutoRefreshActive && refreshCadence > 0
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-neutral-400'
                    }`}
                  />
                  <span className="font-medium text-[11px]">
                    {isAutoRefreshActive && refreshCadence > 0
                      ? language === 'es'
                        ? `Auto-refresco ${refreshCadence}s (${countdownSeconds}s)`
                        : `Auto-refresh ${refreshCadence}s (${countdownSeconds}s)`
                      : language === 'es'
                      ? 'Refresco pausado'
                      : 'Auto-refresh off'}
                  </span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[11px] tabular-nums">
                  {language === 'es' ? 'Sincronizado' : 'Synced'} {lastSyncTime}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {language === 'es'
                ? 'Monitoreo en tiempo real de disrupciones, latencia de telemetría y salud global de red'
                : 'Real-time telemetry monitoring for disruptions, ingest latency, and network health score'}
            </p>
          </div>
        </div>

        {/* Interactive Controls: Autorefresh Toggle, Cadence Selector, Threshold Alerts, KPI Charts */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Autorefresh Toggle & Cadence Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 text-xs">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsAutoRefreshActive(!isAutoRefreshActive)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isAutoRefreshActive && refreshCadence > 0
                  ? 'text-emerald-600 dark:text-emerald-400 hover:bg-white dark:hover:bg-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
              title={
                isAutoRefreshActive
                  ? language === 'es'
                    ? 'Pausar auto-refresco'
                    : 'Pause auto-refresh'
                  : language === 'es'
                  ? 'Activar auto-refresco'
                  : 'Resume auto-refresh'
              }
            >
              {isAutoRefreshActive && refreshCadence > 0 ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Cadence options */}
            {([2, 5, 10, 30] as const).map((cadence) => (
              <button
                key={cadence}
                onClick={() => {
                  setRefreshCadence(cadence);
                  setIsAutoRefreshActive(true);
                  setCountdownSeconds(cadence);
                }}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  refreshCadence === cadence && isAutoRefreshActive
                    ? 'bg-white dark:bg-[#1B222D] text-[#1B1F24] dark:text-[#E8ECF1] shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
                title={`${language === 'es' ? 'Cadencia' : 'Cadence'}: ${cadence}s`}
              >
                {cadence}s
              </button>
            ))}
          </div>

          {/* Manual Force Refresh Action */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer disabled:opacity-50"
            title={language === 'es' ? 'Actualizar telemetría ahora' : 'Refresh telemetry now'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0071BB]' : ''}`} />
            <span className="hidden lg:inline font-mono tabular-nums text-[11px]">
              {isAutoRefreshActive ? `${countdownSeconds}s` : 'Manual'}
            </span>
          </button>

          {/* Threshold Alerts Trigger Button */}
          <button
            onClick={() => setIsThresholdModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              hasThresholdCritical
                ? 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400 animate-pulse'
                : hasThresholdWarning
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                : 'border-[#DCE1E7] dark:border-[#2B3440] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
            title={language === 'es' ? 'Configurar umbrales y alertas' : 'Configure thresholds and alerts'}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasThresholdCritical
                ? language === 'es'
                  ? 'Alerta Crítica'
                  : 'Critical Alert'
                : hasThresholdWarning
                ? language === 'es'
                  ? 'Aviso Umbral'
                  : 'Threshold Warning'
                : language === 'es'
                ? 'Umbrales OK'
                : 'Thresholds OK'}
            </span>
            {unacknowledgedAlerts.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unacknowledgedAlerts.length}
              </span>
            )}
          </button>

          {/* KPI Charts Toggle Button */}
          <button
            onClick={() => setIsChartsOpen(!isChartsOpen)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              isChartsOpen
                ? 'border-[#0071BB] bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8]'
                : 'border-[#DCE1E7] dark:border-[#2B3440] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Gráficos KPI' : 'KPI Charts'}</span>
          </button>

          {/* Predictive Forecast Modal Trigger Button */}
          <button
            onClick={() => setIsForecastModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20 transition-colors cursor-pointer"
            title={language === 'es' ? 'Previsión predictiva con modelo IA' : 'Predictive forecast with AI model'}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Previsión (+60m)' : 'Forecast (+60m)'}</span>
          </button>
        </div>
      </div>

      {/* Active Threshold Alert Notice Banner (if any unacknowledged alerts) */}
      {unacknowledgedAlerts.length > 0 && (
        <div
          className={`mt-3 p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200 ${
            hasThresholdCritical
              ? 'border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-200'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle
              className={`w-4 h-4 shrink-0 ${
                hasThresholdCritical ? 'text-red-600' : 'text-amber-600'
              }`}
            />
            <div>
              <span className="font-bold text-xs block">
                {unacknowledgedAlerts[0].title} ({unacknowledgedAlerts[0].timestamp})
              </span>
              <p className="text-[11px] opacity-90 leading-tight">
                {unacknowledgedAlerts[0].message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handleAcknowledgeAlert(unacknowledgedAlerts[0].id)}
              className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors shadow-2xs"
            >
              {language === 'es' ? 'Reconocer' : 'Acknowledge'}
            </button>
            <button
              onClick={() => setIsThresholdModalOpen(true)}
              className="px-2.5 py-1 text-[11px] font-semibold rounded bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-opacity"
            >
              {language === 'es' ? 'Ver Alertas' : 'View Alerts'}
            </button>
          </div>
        </div>
      )}

      {/* 3 Core KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
        {/* KPI 1: Incidents Active */}
        <div
          onClick={() => setDrilldownTab('incidents')}
          className="group relative flex flex-col justify-between p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-[#1B222D]/60 hover:bg-white dark:hover:bg-[#1B222D] hover:border-[#0071BB] dark:hover:border-[#5AAEE8] hover:shadow-md transition-all cursor-pointer ring-0 hover:ring-1 hover:ring-[#0071BB]/30"
          data-testid="kpi-incidents-active"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">
              <span className="font-semibold text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                {language === 'es' ? 'Incidencias Activas' : 'Incidents Active'}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isAllClearMode
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'
                    : 'text-[#B42318] dark:text-[#FF6B6B] bg-[#B42318]/10'
                }`}
              >
                {isAllClearMode
                  ? language === 'es'
                    ? 'Todo Despejado'
                    : 'All Clear'
                  : language === 'es'
                  ? 'Requiere Atención'
                  : 'Action Needed'}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-extrabold font-mono tracking-tight tabular-nums ${
                    isAllClearMode
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-[#B42318] dark:text-[#FF6B6B]'
                  }`}
                >
                  {activeIncidentsCount}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  {language === 'es' ? 'en la red' : 'on network'}
                </span>
              </div>

              {!isAllClearMode && (
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[#B42318] dark:text-[#FF6B6B] block">
                    1 {language === 'es' ? 'Crítico (Atocha)' : 'Critical (Atocha)'}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    2 {language === 'es' ? 'Moderados' : 'Moderate'}
                  </span>
                </div>
              )}
            </div>

            {/* Dedicated Trend Indicator Row */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1 font-semibold">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'es' ? 'Tendencia: -33% vs 1h' : 'Trend: -33% vs 1h'}</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                {language === 'es' ? '+1.8 resueltos/h' : '+1.8 resolved/h'}
              </span>
            </div>

            {/* Unboxed Contextual Breakdown */}
            <div className="mt-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <span>{isAllClearMode ? (language === 'es' ? '0 bloqueos activos' : '0 active blockades') : (language === 'es' ? 'SLA cuenta atrás 02:45 min' : 'SLA countdown 02:45 min')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                <span>-2 {language === 'es' ? 'en última hora' : 'in last hour'}</span>
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#0071BB] dark:text-[#5AAEE8] font-bold group-hover:translate-x-0.5 transition-transform">
            <span className="flex items-center gap-1">
              <span>{language === 'es' ? 'Desglose analítico de casos' : 'Drill down to active cases'}</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 2: Average Latency */}
        <div
          onClick={() => setDrilldownTab('latency')}
          className="group relative flex flex-col justify-between p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-[#1B222D]/60 hover:bg-white dark:hover:bg-[#1B222D] hover:border-[#0071BB] dark:hover:border-[#5AAEE8] hover:shadow-md transition-all cursor-pointer ring-0 hover:ring-1 hover:ring-[#0071BB]/30"
          data-testid="kpi-average-latency"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">
              <span className="font-semibold text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                {language === 'es' ? 'Latencia Media' : 'Average Latency'}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  currentLatency >= thresholds.maxLatencyCritical
                    ? 'text-red-700 dark:text-red-400 bg-red-500/10'
                    : currentLatency >= thresholds.maxLatencyWarning
                    ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10'
                    : 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'
                }`}
              >
                {currentLatency >= thresholds.maxLatencyCritical
                  ? 'SLA Breach'
                  : currentLatency >= thresholds.maxLatencyWarning
                  ? 'Warning'
                  : language === 'es'
                  ? 'Óptima · < 50ms SLA'
                  : 'Optimal · < 50ms SLA'}
              </span>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-[#1B1F24] dark:text-[#E8ECF1] tabular-nums">
                  {currentLatency}
                </span>
                <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 font-mono">
                  ms
                </span>
              </div>

              {/* Sparkline visualization of telemetry ingest */}
              <div className="flex flex-col items-end">
                <svg
                  width={svgWidth}
                  height={svgHeight}
                  className="overflow-visible"
                  aria-label="Sparkline latency trend"
                >
                  <polyline
                    fill="none"
                    stroke="#0071BB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                  {points.split(' ').slice(-1).map((pt, i) => {
                    const [cx, cy] = pt.split(',');
                    return (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r="3"
                        fill="#0071BB"
                        className="animate-pulse"
                      />
                    );
                  })}
                </svg>
                <span className="text-[9px] font-mono text-neutral-400 mt-0.5">
                  {language === 'es' ? 'mín 21ms · máx 28ms' : 'min 21ms · max 28ms'}
                </span>
              </div>
            </div>

            {/* Dedicated Trend Indicator Row */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 text-blue-800 dark:text-blue-300">
              <span className="flex items-center gap-1 font-semibold">
                <Activity className="w-3.5 h-3.5 text-[#0071BB] dark:text-[#5AAEE8]" />
                <span>{language === 'es' ? 'Tendencia: Estable ±1.5ms' : 'Trend: Stable ±1.5ms'}</span>
              </span>
              <span className="font-mono text-[10px] text-[#0071BB] dark:text-[#5AAEE8] font-bold">
                Jitter 2.1ms
              </span>
            </div>

            {/* Unboxed Metadata Breakdown */}
            <div className="mt-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <span>SAE GPS: 18ms</span>
              <span aria-hidden="true">·</span>
              <span>Hubs: 24ms</span>
              <span aria-hidden="true">·</span>
              <span>Kafka Stream: 12ms</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#0071BB] dark:text-[#5AAEE8] font-bold group-hover:translate-x-0.5 transition-transform">
            <span>
              {language === 'es' ? 'Desglose telemetría N01-N23' : 'Drill down to telemetry feeds'}
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 3: System Health Score */}
        <div
          onClick={() => setDrilldownTab('health')}
          className="group relative flex flex-col justify-between p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-[#1B222D]/60 hover:bg-white dark:hover:bg-[#1B222D] hover:border-[#0071BB] dark:hover:border-[#5AAEE8] hover:shadow-md transition-all cursor-pointer ring-0 hover:ring-1 hover:ring-[#0071BB]/30"
          data-testid="kpi-system-health"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">
              <span className="font-semibold text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                {language === 'es' ? 'Puntuación de Salud del Sistema' : 'System Health Score'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-400 bg-emerald-500/10">
                {language === 'es' ? 'Medido · En Directo' : 'Measured · Live'}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-[#1B1F24] dark:text-[#E8ECF1] tabular-nums">
                  {systemHealthScore}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>+0.05%</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block">
                  {language === 'es' ? 'Régimen Nominal' : 'Nominal Regime'}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono block">
                  Obj. 99.80%
                </span>
              </div>
            </div>

            {/* Health Meter Bar */}
            <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: isAllClearMode ? '100%' : '99.85%' }}
              />
            </div>

            {/* Dedicated Trend Indicator Row */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'es' ? 'Tendencia: +0.05% vs obj.' : 'Trend: +0.05% vs obj.'}</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                {language === 'es' ? '100% en +35m' : '100% in +35m'}
              </span>
            </div>

            {/* Unboxed Subsystem Availability */}
            <div className="mt-2 pt-1.5 border-t border-neutral-200/60 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <span>Metro 99.9%</span>
              <span aria-hidden="true">·</span>
              <span>EMT 99.8%</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'es' ? 'Cercanías 98.4%' : 'Rail 98.4%'}</span>
              <span aria-hidden="true">·</span>
              <span>5.120 AVL</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#0071BB] dark:text-[#5AAEE8] font-bold group-hover:translate-x-0.5 transition-transform">
            <span>
              {language === 'es' ? 'Desglose puntualidad por modo' : 'Drill down to mode punctuality'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* KPI Charts Collapsible Panel */}
      {isChartsOpen && (
        <KpiChartsPanel
          selectedRange={selectedRange}
          currentLatency={currentLatency}
          latencyHistory={latencyHistory}
          isAllClearMode={isAllClearMode}
          onOpenForecastModal={() => setIsForecastModalOpen(true)}
        />
      )}

      {/* Threshold Alerts Configuration Modal */}
      <ThresholdAlertsModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        thresholds={thresholds}
        onSaveThresholds={(newT) => setThresholds(newT)}
        activeAlerts={activeAlerts}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onSimulateAlert={handleSimulateThresholdAlert}
      />

      {/* Predictive Forecast Modal */}
      <PredictiveForecastModal
        isOpen={isForecastModalOpen}
        onClose={() => setIsForecastModalOpen(false)}
        isAllClearMode={isAllClearMode}
      />

      {/* KPI Deep Drilldown Modal */}
      <KpiDrilldownModal
        isOpen={drilldownTab !== null}
        onClose={() => setDrilldownTab(null)}
        initialTab={drilldownTab || 'incidents'}
        onOpenCase={onOpenCase}
        onOpenTrustDrawer={onOpenTrustDrawer}
        isAllClearMode={isAllClearMode}
      />
    </div>
  );
};
