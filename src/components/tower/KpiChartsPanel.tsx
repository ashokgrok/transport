import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Clock,
  Layers,
  Info,
  Maximize2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface KpiChartsPanelProps {
  selectedRange: '5m' | '1h' | '8h';
  currentLatency: number;
  latencyHistory: number[];
  isAllClearMode?: boolean;
  onOpenForecastModal?: () => void;
}

export const KpiChartsPanel: React.FC<KpiChartsPanelProps> = ({
  selectedRange,
  currentLatency,
  latencyHistory,
  isAllClearMode = false,
  onOpenForecastModal,
}) => {
  const { language } = useAuth();
  const [activeChartTab, setActiveChartTab] = useState<'all' | 'incidents' | 'latency' | 'health' | 'forecast'>('all');

  // Simulated historical data based on selectedRange
  const incidentTimelineData = [
    { time: '07:00', critical: 0, moderate: 1, low: 2, resolved: 3 },
    { time: '07:30', critical: 0, moderate: 2, low: 1, resolved: 5 },
    { time: '08:00', critical: 1, moderate: 3, low: 2, resolved: 6 },
    { time: '08:30', critical: isAllClearMode ? 0 : 1, moderate: isAllClearMode ? 0 : 2, low: 1, resolved: 9 },
    { time: '09:00', critical: isAllClearMode ? 0 : 1, moderate: isAllClearMode ? 0 : 1, low: 1, resolved: 12 },
  ];

  // Modalities data
  const modalities = [
    { name: language === 'es' ? 'Metro de Madrid' : 'Madrid Metro', health: 99.9, vehicles: 312, status: 'nominal', delta: '+0.1%' },
    { name: language === 'es' ? 'EMT Madrid (Bus Urbano)' : 'EMT Madrid (Urban Bus)', health: 99.8, vehicles: 1840, status: 'nominal', delta: '+0.0%' },
    {
      name: language === 'es' ? 'Cercanías Madrid' : 'Cercanías Suburban Rail',
      health: isAllClearMode ? 99.8 : 98.4,
      vehicles: 218,
      status: isAllClearMode ? 'nominal' : 'warning',
      delta: isAllClearMode ? '+0.0%' : '-1.4%',
      note: isAllClearMode ? (language === 'es' ? 'Nominal' : 'Nominal') : (language === 'es' ? 'Avería Catenaria Atocha Vías 3-4' : 'Catenary Fault Atocha Tracks 3-4'),
    },
    { name: language === 'es' ? 'Autobuses Interurbanos' : 'Interurban Buses', health: 99.7, vehicles: 2150, status: 'nominal', delta: '+0.05%' },
    { name: language === 'es' ? 'Metro Ligero / Tranvía' : 'Light Rail / Tram', health: 100.0, vehicles: 35, status: 'nominal', delta: '0.0%' },
  ];

  // SVG dimensions for Latency Chart
  const svgWidth = 460;
  const svgHeight = 120;
  const minLat = 10;
  const maxLat = 60; // Show up to 60 to clearly display the 50ms SLA boundary line

  const latencyPoints = latencyHistory
    .map((val, idx) => {
      const x = (idx / (latencyHistory.length - 1)) * svgWidth;
      const normalizedY = (val - minLat) / (maxLat - minLat);
      const y = svgHeight - normalizedY * svgHeight;
      return `${x},${y}`;
    })
    .join(' ');

  // Red SLA Limit 50ms line Y position
  const slaLimitY = svgHeight - ((50 - minLat) / (maxLat - minLat)) * svgHeight;
  // Warning 35ms line Y position
  const warningLimitY = svgHeight - ((35 - minLat) / (maxLat - minLat)) * svgHeight;

  return (
    <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in duration-200">
      {/* Panel Sub-Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#0071BB] dark:text-[#5AAEE8]" />
          <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
            {language === 'es' ? 'Análisis Gráfico de Tendencias Operativas' : 'Operational KPI Trends & Analytics'}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">
            ({selectedRange === '5m' ? (language === 'es' ? 'Últimos 5 min' : 'Last 5 min') : selectedRange === '1h' ? (language === 'es' ? 'Última hora' : 'Last hour') : (language === 'es' ? 'Turno completo 8h' : 'Full 8h shift')})
          </span>
        </div>

        {/* Chart View Filter */}
        <div className="flex items-center gap-1 text-[11px]">
          {(['all', 'incidents', 'latency', 'health', 'forecast'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveChartTab(tab)}
              className={`px-2 py-0.5 rounded-md font-semibold capitalize cursor-pointer transition-colors ${
                activeChartTab === tab
                  ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              {tab === 'all'
                ? language === 'es'
                  ? 'Todos'
                  : 'All'
                : tab === 'incidents'
                ? language === 'es'
                  ? 'Incidencias'
                  : 'Incidents'
                : tab === 'latency'
                ? language === 'es'
                  ? 'Latencia SLA'
                  : 'Latency SLA'
                : tab === 'health'
                ? language === 'es'
                  ? 'Salud Modos'
                  : 'Modality Health'
                : language === 'es'
                ? 'Previsión (+60m)'
                : 'Forecast (+60m)'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 3 Charts */}
      <div
        className={`grid gap-4 ${
          activeChartTab === 'all' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'
        }`}
      >
        {/* Chart 1: Incidents Evolution */}
        {(activeChartTab === 'all' || activeChartTab === 'incidents') && (
          <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Volumen y Evolución de Casos' : 'Incidents Volume & Trend'}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {language === 'es' ? 'Resolución 67%' : '67% Resolution'}
              </span>
            </div>

            {/* Stacked Visual Bar Representation */}
            <div className="h-32 flex items-end justify-between gap-2 pt-2 px-1 border-b border-neutral-200 dark:border-neutral-800 pb-1">
              {incidentTimelineData.map((d, i) => {
                const totalActive = d.critical + d.moderate + d.low;
                const critH = totalActive > 0 ? (d.critical / 5) * 80 : 0;
                const modH = totalActive > 0 ? (d.moderate / 5) * 80 : 0;
                const lowH = totalActive > 0 ? (d.low / 5) * 80 : 0;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="w-full max-w-[28px] flex flex-col justify-end rounded-t overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      {critH > 0 && (
                        <div
                          style={{ height: `${critH}px` }}
                          className="w-full bg-[#B42318] dark:bg-[#FF6B6B]"
                          title={`${language === 'es' ? 'Críticos' : 'Critical'}: ${d.critical}`}
                        />
                      )}
                      {modH > 0 && (
                        <div
                          style={{ height: `${modH}px` }}
                          className="w-full bg-amber-500"
                          title={`${language === 'es' ? 'Moderados' : 'Moderate'}: ${d.moderate}`}
                        />
                      )}
                      {lowH > 0 && (
                        <div
                          style={{ height: `${lowH}px` }}
                          className="w-full bg-blue-500"
                          title={`${language === 'es' ? 'Bajos' : 'Low'}: ${d.low}`}
                        />
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-neutral-400">{d.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#B42318]" />
                <span>{language === 'es' ? 'Crítico' : 'Critical'}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-amber-500" />
                <span>{language === 'es' ? 'Moderado' : 'Moderate'}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-blue-500" />
                <span>{language === 'es' ? 'Menor' : 'Low'}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-emerald-500" />
                <span>{language === 'es' ? 'Resuelto' : 'Resolved'}</span>
              </span>
            </div>
          </div>
        )}

        {/* Chart 2: Telemetry Latency vs SLA */}
        {(activeChartTab === 'all' || activeChartTab === 'latency') && (
          <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#0071BB] dark:text-[#5AAEE8]" />
                <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Latencia de Ingesta vs SLA (50ms)' : 'Ingest Latency vs SLA (50ms)'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                Live: {currentLatency} ms
              </span>
            </div>

            {/* SVG Plot */}
            <div className="relative h-32 w-full pt-1">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                {/* 50ms Critical SLA Line */}
                <line
                  x1="0"
                  y1={slaLimitY}
                  x2={svgWidth}
                  y2={slaLimitY}
                  stroke="#B42318"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text x="4" y={slaLimitY - 3} fill="#B42318" fontSize="8" fontFamily="monospace">
                  {language === 'es' ? 'Límite SLA 50ms' : 'SLA Limit 50ms'}
                </text>

                {/* 35ms Warning Line */}
                <line
                  x1="0"
                  y1={warningLimitY}
                  x2={svgWidth}
                  y2={warningLimitY}
                  stroke="#F59E0B"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text x="4" y={warningLimitY - 3} fill="#F59E0B" fontSize="8" fontFamily="monospace">
                  {language === 'es' ? 'Aviso 35ms' : 'Warning 35ms'}
                </text>

                {/* Actual Latency Curve */}
                <polyline
                  fill="none"
                  stroke="#0071BB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={latencyPoints}
                />

                {/* Last point circle */}
                {latencyPoints.split(' ').slice(-1).map((pt, i) => {
                  const [cx, cy] = pt.split(',');
                  return (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="4" fill="#0071BB" />
                      <circle cx={cx} cy={cy} r="8" fill="#0071BB" opacity="0.3" className="animate-ping" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Latency Stats */}
            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono mt-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
              <span>p50: 23ms</span>
              <span>p95: 30ms</span>
              <span>Jitter: ±2.1ms</span>
              <span className="text-emerald-600 font-bold">100% SLA OK</span>
            </div>
          </div>
        )}

        {/* Chart 3: Modality Health */}
        {(activeChartTab === 'all' || activeChartTab === 'health') && (
          <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Disponibilidad por Modo de Red' : 'Health by Transport Modality'}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {language === 'es' ? '5.120 Convoys' : '5,120 Convoys'}
              </span>
            </div>

            {/* Modality Horizontal Bars */}
            <div className="h-32 flex flex-col justify-between py-1">
              {modalities.slice(0, 4).map((m, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-[140px]">
                      {m.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400 font-mono">{m.vehicles} veh</span>
                      <span
                        className={`font-mono font-bold ${
                          m.health < 99.0
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {m.health.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        m.health < 99.0 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(m.health - 90) * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Modality Footer */}
            <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span>{language === 'es' ? '+0.05% vs objetivo' : '+0.05% vs target'}</span>
              </span>
              <span className="text-emerald-600 font-bold">{language === 'es' ? 'Régimen Nominal' : 'Nominal Regime'}</span>
            </div>
          </div>
        )}

        {/* Chart 4: Predictive Forecast (+60 min projection) */}
        {activeChartTab === 'forecast' && (
          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-50/15 dark:bg-purple-950/20 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Previsión Predictiva (+60 min) · Modelo IA CRTM-ML' : 'Predictive Forecast (+60 min) · CRTM-ML AI Model'}
                </h4>
              </div>
              {onOpenForecastModal && (
                <button
                  onClick={onOpenForecastModal}
                  className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  <span>{language === 'es' ? 'Ver detalle completo' : 'Full forecast view'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-purple-200/60 dark:border-purple-800/40">
                <span className="text-[10px] text-neutral-400 font-mono block">
                  {language === 'es' ? 'INCIDENCIAS A LAS 09:30' : 'INCIDENTS AT 09:30'}
                </span>
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {language === 'es' ? '0 Activas' : '0 Active'}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  {language === 'es' ? 'Descenso -100% (Resolución Paso 8)' : '-100% drop (Step 8 resolution)'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-purple-200/60 dark:border-purple-800/40">
                <span className="text-[10px] text-neutral-400 font-mono block">
                  {language === 'es' ? 'LATENCIA PROYECTADA' : 'PROJECTED LATENCY'}
                </span>
                <span className="text-xl font-bold font-mono text-[#1B1F24] dark:text-[#E8ECF1]">
                  21 ms
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">
                  {language === 'es' ? 'Estabilidad nominal < 30ms' : 'Nominal stability < 30ms'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-purple-200/60 dark:border-purple-800/40">
                <span className="text-[10px] text-neutral-400 font-mono block">
                  {language === 'es' ? 'PAX PROTEGIDOS' : 'PAX PROTECTED'}
                </span>
                <span className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
                  +12.800
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  {language === 'es' ? 'Por retención de enlaces EMT' : 'Via EMT connection protection'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic">
              {language === 'es'
                ? '* Proyección generada a partir de 180 días de telemetría de hora punta en el Corredor Atocha. 94.2% confianza estadística.'
                : '* Projection generated from 180 days of peak-hour telemetry in Atocha Corridor. 94.2% statistical confidence.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
