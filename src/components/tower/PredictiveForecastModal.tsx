import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import {
  X,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Users,
  Bus,
  CheckCircle2,
  Sliders,
  ArrowRight,
  BrainCircuit,
  Info,
} from 'lucide-react';

interface PredictiveForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAllClearMode?: boolean;
}

export const PredictiveForecastModal: React.FC<PredictiveForecastModalProps> = ({
  isOpen,
  onClose,
  isAllClearMode = false,
}) => {
  const { language } = useAuth();

  const [forecastHorizon, setForecastHorizon] = useState<'15m' | '30m' | '60m' | '120m'>('60m');
  const [simulationMode, setSimulationMode] = useState<'with_intervention' | 'without_action'>('with_intervention');

  if (!isOpen) return null;

  // Forecast data projection points
  const forecastTimeline = [
    {
      time: '08:45',
      offset: '+15m',
      incidentsWithAction: 2,
      incidentsNoAction: 4,
      healthWithAction: 99.88,
      healthNoAction: 99.65,
      latencyWithAction: 26,
      latencyNoAction: 42,
      passengersAffected: simulationMode === 'with_intervention' ? 3800 : 7200,
      descriptionEs: 'Paso 6 del Runbook ejecutado: Refuerzo EMT en dársenas Atocha.',
      descriptionEn: 'Runbook step 6 active: EMT bus reinforcements on Atocha bays.',
    },
    {
      time: '09:00',
      offset: '+30m',
      incidentsWithAction: 1,
      incidentsNoAction: 5,
      healthWithAction: 99.92,
      healthNoAction: 99.40,
      latencyWithAction: 23,
      latencyNoAction: 48,
      passengersAffected: simulationMode === 'with_intervention' ? 2100 : 10500,
      descriptionEs: 'Tensión restablecida en vía 4; descongestión del corredor Cercanías.',
      descriptionEn: 'Power restored on track 4; Cercanías corridor clearing.',
    },
    {
      time: '09:30',
      offset: '+60m',
      incidentsWithAction: 0,
      incidentsNoAction: 4,
      healthWithAction: 99.98,
      healthNoAction: 99.20,
      latencyWithAction: 21,
      latencyNoAction: 39,
      passengersAffected: simulationMode === 'with_intervention' ? 0 : 12800,
      descriptionEs: 'Retorno completo a régimen nominal. 100% de enlaces protegidos.',
      descriptionEn: 'Full return to nominal regime. 100% of intermodal transfers preserved.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#DCE1E7] dark:border-[#2B3440]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Previsión Predictiva de Red (+60 min)' : 'Predictive Network Forecast (+60 min)'}
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  CRTM-ML-Forecaster v3.2 · 94.2% Confianza
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? 'Simulación basada en gemelo digital de movilidad, datos históricos de hora punta y planes de mitigación'
                  : 'Digital mobility twin simulation based on morning peak history and active mitigation runbooks'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls & Scenarios Bar */}
        <div className="px-5 py-3 border-b border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/60 dark:bg-neutral-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Horizon Selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-500 text-[11px]">
              {language === 'es' ? 'Horizonte Temporal:' : 'Forecast Horizon:'}
            </span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-200/60 dark:bg-neutral-800 text-xs">
              {(['15m', '30m', '60m', '120m'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setForecastHorizon(h)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    forecastHorizon === h
                      ? 'bg-white dark:bg-[#1B222D] text-[#1B1F24] dark:text-[#E8ECF1] shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  +{h}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Comparison Toggle */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-500 text-[11px]">
              {language === 'es' ? 'Escenario de Simulación:' : 'Simulation Scenario:'}
            </span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-200/60 dark:bg-neutral-800 text-xs">
              <button
                onClick={() => setSimulationMode('with_intervention')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  simulationMode === 'with_intervention'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                ✓ {language === 'es' ? 'Con Intervención Torre' : 'With Active Runbook'}
              </button>
              <button
                onClick={() => setSimulationMode('without_action')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  simulationMode === 'without_action'
                    ? 'bg-[#B42318] text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                ⚠ {language === 'es' ? 'Sin Intervención (Inercial)' : 'Without Action (Worst Case)'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Headline Predictive KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Predicted Incidents */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-[#1B222D]/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{language === 'es' ? 'Incidencias Previstas (+60m)' : 'Predicted Incidents (+60m)'}</span>
                <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                  {simulationMode === 'with_intervention' ? 'Descenso -100%' : 'Aumento +66%'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span
                  className={`text-2xl font-bold font-mono ${
                    simulationMode === 'with_intervention'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-[#B42318] dark:text-[#FF6B6B]'
                  }`}
                >
                  {simulationMode === 'with_intervention'
                    ? (language === 'es' ? '0 Casos' : '0 Cases')
                    : (language === 'es' ? '5 Casos' : '5 Cases')}
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  {simulationMode === 'with_intervention'
                    ? (language === 'es' ? 'Resolución total' : 'Full resolution')
                    : (language === 'es' ? 'Saturación red' : 'Network saturation')}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {simulationMode === 'with_intervention'
                  ? (language === 'es'
                    ? 'Retorno esperado a régimen nominal a las 09:30'
                    : 'Expected nominal restoration at 09:30')
                  : (language === 'es'
                    ? 'Efecto dominó hacia líneas Metro L1 y Bus 352'
                    : 'Domino effect towards Metro L1 and Bus 352')}
              </p>
            </div>

            {/* Predicted Latency */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-[#1B222D]/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{language === 'es' ? 'Latencia Prevista (+60m)' : 'Predicted Latency (+60m)'}</span>
                <span className="font-mono text-[10px] text-emerald-600 font-bold">
                  {simulationMode === 'with_intervention'
                    ? (language === 'es' ? 'SLA Óptimo' : 'Optimal SLA')
                    : (language === 'es' ? 'SLA en Riesgo' : 'SLA at Risk')}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-[#1B1F24] dark:text-[#E8ECF1]">
                  {simulationMode === 'with_intervention' ? '21 ms' : '39 ms'}
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  {simulationMode === 'with_intervention'
                    ? (language === 'es' ? 'Nominal' : 'Nominal')
                    : (language === 'es' ? '+15ms degradación' : '+15ms degradation')}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {simulationMode === 'with_intervention'
                  ? (language === 'es'
                    ? 'Tráfico de telemetría estabilizado bajo 30ms'
                    : 'Telemetry traffic stabilized under 30ms')
                  : (language === 'es'
                    ? 'Cola de mensajes desbordada en concentrador SIRI'
                    : 'Message queue overflow on SIRI collector')}
              </p>
            </div>

            {/* Predicted Passengers Protected */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-[#1B222D]/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{language === 'es' ? 'Viajeros Protegidos (+60m)' : 'Passengers Protected (+60m)'}</span>
                <span className="font-mono text-[10px] text-emerald-600 font-bold">
                  +12.800 Pax
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {simulationMode === 'with_intervention'
                    ? (language === 'es' ? '4.300 pax máx' : '4,300 pax max')
                    : (language === 'es' ? '12.800 pax afect.' : '12,800 pax affected')}
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  {simulationMode === 'with_intervention'
                    ? (language === 'es' ? 'Contenido' : 'Contained')
                    : (language === 'es' ? 'Desbordado' : 'Overflowed')}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {simulationMode === 'with_intervention'
                  ? (language === 'es'
                    ? 'Refuerzo bus y retención de enlace evitaron roturas'
                    : 'Bus reinforcements and link holds prevented breaks')
                  : (language === 'es'
                    ? 'Aglomeraciones críticas en andenes de Atocha y Sol'
                    : 'Critical crowding on Atocha and Sol platforms')}
              </p>
            </div>
          </div>

          {/* Timeline Projections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {language === 'es' ? 'Evolución Proyectada Paso a Paso:' : 'Projected Step-by-Step Evolution:'}
            </h4>

            <div className="space-y-2.5">
              {forecastTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="text-[10px] text-neutral-400 font-bold">{item.offset}</span>
                      <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{item.time}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1] block">
                        {language === 'es' ? item.descriptionEs : item.descriptionEn}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-neutral-500">
                        <span>
                          {language === 'es' ? 'Incidencias activas:' : 'Active incidents:'}{' '}
                          <strong className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                            {simulationMode === 'with_intervention'
                              ? item.incidentsWithAction
                              : item.incidentsNoAction}
                          </strong>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {language === 'es' ? 'Salud proyectada:' : 'Projected health:'}{' '}
                          <strong className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {(simulationMode === 'with_intervention'
                              ? item.healthWithAction
                              : item.healthNoAction
                            ).toFixed(2)}
                            %
                          </strong>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {language === 'es' ? 'Viajeros afectados:' : 'Affected passengers:'}{' '}
                          <strong className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                            {item.passengersAffected.toLocaleString('es-ES')} pax
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        simulationMode === 'with_intervention'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {simulationMode === 'with_intervention'
                        ? (language === 'es' ? 'Control Nominal' : 'Nominal Control')
                        : (language === 'es' ? 'Riesgo Alerta' : 'Alert Risk')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Provenance & Grounding Note */}
          <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-purple-950 dark:text-purple-200">
              <span className="font-bold block">
                {language === 'es'
                  ? 'Fundamentación del Modelo Predictivo (CRTM-ML-04):'
                  : 'Predictive Model Grounding (CRTM-ML-04):'}
              </span>
              <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
                {language === 'es'
                  ? 'La curva predictiva correlaciona la serie temporal de los últimos 180 días en el Corredor Atocha-Chamartín con el tiempo medio de intervención (MTTR) de 35 minutos del Runbook 9 pasos. Las variables estocásticas incluyen la demanda de hora punta (8:00–9:30) y la capacidad de absorción de la flota EMT de refuerzo.'
                  : 'The predictive curve correlates 180 days of Atocha-Chamartín time series with the 35-min MTTR benchmark of the 9-step Runbook. Stochastic parameters factor in peak commute demand curves and EMT fleet replacement absorption capacity.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#1B222D] flex items-center justify-between">
          <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>{language === 'es' ? 'Actualización en tiempo real con telemetría viva' : 'Real-time update via live telemetry stream'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0071BB] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            {language === 'es' ? 'Cerrar Previsión' : 'Close Forecast'}
          </button>
        </div>
      </div>
    </div>
  );
};
