import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { ALL_8_SCENARIOS, DisruptionScenario } from '../../data/scenariosData';
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Gauge,
  Flame,
  ShieldAlert,
  AlertTriangle,
  Layers,
  Clock,
  Compass,
  CheckCircle2,
  Sliders,
  Snowflake,
  Sun,
  Shield,
  Activity,
} from 'lucide-react';

interface ScenarioControllerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onResetSimulation: () => void;
}

export const ScenarioControllerModal: React.FC<ScenarioControllerModalProps> = ({
  isOpen,
  onClose,
  activeScenarioId,
  onSelectScenario,
  onResetSimulation,
}) => {
  const { language } = useAuth();

  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [activeChaosFlags, setActiveChaosFlags] = useState<{
    feedFlapping: boolean;
    staleData: boolean;
    liftOutage: boolean;
    signalBurst: boolean;
  }>({
    feedFlapping: false,
    staleData: false,
    liftOutage: false,
    signalBurst: false,
  });

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const toggleChaos = (flag: keyof typeof activeChaosFlags, labelEs: string, labelEn: string) => {
    setActiveChaosFlags((prev) => {
      const nextVal = !prev[flag];
      const lbl = language === 'es' ? labelEs : labelEn;
      showToast(nextVal ? (language === 'es' ? `Caos Activado: ${lbl}` : `Chaos Injected: ${lbl}`) : (language === 'es' ? `Caos Restaurado: ${lbl}` : `Chaos Restored: ${lbl}`));
      return { ...prev, [flag]: nextVal };
    });
  };

  const handleReset = () => {
    setActiveChaosFlags({
      feedFlapping: false,
      staleData: false,
      liftOutage: false,
      signalBurst: false,
    });
    setSpeedMultiplier(1);
    onResetSimulation();
    showToast(language === 'es' ? 'Simulación reiniciada a estado limpio en < 5s' : 'Simulation reset to clean seed state in < 5s');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-[#161B22] rounded-3xl border border-[#DCE1E7] dark:border-[#2B3440] p-6 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es'
                  ? 'Controlador de Simulación y Banco de 8 Escenarios (S1–S8)'
                  : 'Simulation Controller & 8-Scenario Disruption Testbed'}
              </h2>
              <p className="text-xs text-neutral-500">
                {language === 'es'
                  ? 'Inyector de caos en tiempo real, multiplicador de reloj y selector de escenarios deterministas (PRD Sección 13).'
                  : 'Real-time chaos injector, operational clock multiplier, and deterministic scenario bank (PRD Section 13).'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Notification Banner */}
        {notificationMsg && (
          <div className="p-3 rounded-xl bg-[#0071BB]/10 border border-[#0071BB]/40 text-[#0071BB] dark:text-[#5AAEE8] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Speed Multiplier & State Reset Quick Controls */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#0071BB]" />
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {language === 'es' ? 'Velocidad del Reloj Operativo:' : 'Operational Clock Speed:'}
            </span>
            <div className="flex items-center gap-1 bg-white dark:bg-[#161B22] p-1 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440]">
              {[1, 2, 5, 10].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSpeedMultiplier(speed)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    speedMultiplier === speed
                      ? 'bg-[#0071BB] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Reiniciar Estado Limpio (< 5s)' : 'Reset to Clean Seed (< 5s)'}</span>
          </button>
        </div>

        {/* Chaos Injection Toolset */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1] uppercase tracking-wider">
              {language === 'es' ? 'Inyector de Caos en Vivo (Chaos Testing)' : 'Live Chaos Injector (Chaos Testing)'}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => toggleChaos('feedFlapping', 'Parpadeo Conector N01/N03', 'Feed Flapping N01/N03')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                activeChaosFlags.feedFlapping
                  ? 'border-red-500 bg-red-50/20 dark:bg-red-950/20 text-red-700 dark:text-red-300 ring-2 ring-red-500/20'
                  : 'border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono font-bold">CHAOS-01</span>
                <span className={`w-2 h-2 rounded-full ${activeChaosFlags.feedFlapping ? 'bg-red-500 animate-ping' : 'bg-neutral-300'}`} />
              </div>
              <p className="text-xs font-bold">{language === 'es' ? 'Parpadeo de Conector' : 'Connector Flapping'}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                {language === 'es' ? 'Simula caída y recuperación intermitente de N01/N03' : 'Simulates intermittent drop & recovery of N01/N03'}
              </p>
            </button>

            <button
              onClick={() => toggleChaos('staleData', 'Telemetría Desactualizada', 'Stale Telemetry')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                activeChaosFlags.staleData
                  ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                  : 'border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono font-bold">CHAOS-02</span>
                <span className={`w-2 h-2 rounded-full ${activeChaosFlags.staleData ? 'bg-amber-500 animate-ping' : 'bg-neutral-300'}`} />
              </div>
              <p className="text-xs font-bold">{language === 'es' ? 'Telemetría Obsoleta' : 'Stale Telemetry'}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                {language === 'es' ? 'Envejece la marca temporal > 90s para probar badge Stale' : 'Ages timestamp > 90s to trigger Stale badge'}
              </p>
            </button>

            <button
              onClick={() => toggleChaos('liftOutage', 'Avería Masiva Ascensores', 'Massive Lift Outage')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                activeChaosFlags.liftOutage
                  ? 'border-red-500 bg-red-50/20 dark:bg-red-950/20 text-red-700 dark:text-red-300 ring-2 ring-red-500/20'
                  : 'border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono font-bold">CHAOS-03</span>
                <span className={`w-2 h-2 rounded-full ${activeChaosFlags.liftOutage ? 'bg-red-500 animate-ping' : 'bg-neutral-300'}`} />
              </div>
              <p className="text-xs font-bold">{language === 'es' ? 'Caída de Ascensores' : 'Elevator Outage'}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                {language === 'es' ? 'Inhabilita 4 ascensores para forzar rampa PMR alternativa' : 'Disables 4 lifts to force step-free ramp rerouting'}
              </p>
            </button>

            <button
              onClick={() => toggleChaos('signalBurst', 'Ráfaga de 50 Señales', 'Burst of 50 Signals')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                activeChaosFlags.signalBurst
                  ? 'border-purple-500 bg-purple-50/20 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20'
                  : 'border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono font-bold">CHAOS-04</span>
                <span className={`w-2 h-2 rounded-full ${activeChaosFlags.signalBurst ? 'bg-purple-500 animate-ping' : 'bg-neutral-300'}`} />
              </div>
              <p className="text-xs font-bold">{language === 'es' ? 'Ráfaga de Señales' : 'Signal Burst'}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                {language === 'es' ? 'Inyecta 50 alertas simultáneas para medir deduplicación' : 'Injects 50 simultaneous alerts to test deduplication'}
              </p>
            </button>
          </div>
        </div>

        {/* 8 Disruption Scenarios Grid (S1 to S8) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1] uppercase tracking-wider">
              {language === 'es' ? 'Catálogo de Escenarios de Demostración (S1–S8)' : 'Disruption Scenario Catalog (S1–S8)'}
            </h3>
            <span className="text-[10px] text-neutral-400">
              {language === 'es' ? '8 escenarios listos para show-and-tell' : '8 scenarios ready for show-and-tell'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ALL_8_SCENARIOS.map((sc) => {
              const isActive = sc.id === activeScenarioId;

              return (
                <div
                  key={sc.id}
                  onClick={() => onSelectScenario(sc.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isActive
                      ? 'border-[#0071BB] bg-blue-50/15 dark:bg-blue-950/15 shadow-md ring-2 ring-[#0071BB]/20'
                      : 'border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-[#0071BB] dark:text-[#5AAEE8]">
                        {sc.id}
                      </span>
                      <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                        {language === 'es' ? sc.titleEs : sc.titleEn}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        sc.severity === 'critical'
                          ? 'bg-red-500/10 text-red-600'
                          : sc.severity === 'high'
                          ? 'bg-amber-500/10 text-amber-600'
                          : sc.severity === 'medium'
                          ? 'bg-blue-500/10 text-[#0071BB]'
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}
                    >
                      {sc.severity}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {language === 'es' ? sc.descriptionEs : sc.descriptionEn}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-500 pt-3 mt-2 border-t border-[#DCE1E7]/60 dark:border-[#2B3440]/60">
                    <span>
                      {sc.impactedPax > 0
                        ? `${sc.impactedPax.toLocaleString(language === 'es' ? 'es-ES' : 'en-US')} ${language === 'es' ? 'pax afectados' : 'pax impacted'}`
                        : (language === 'es' ? 'Operación Nominal' : 'Nominal Operation')}
                    </span>
                    <span className="font-mono">
                      {sc.activeSignalsCount} {language === 'es' ? 'señales' : 'signals'} · {sc.incidentCasesCount} {language === 'es' ? 'caso' : 'case'}{sc.incidentCasesCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
