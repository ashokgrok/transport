import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Sparkles,
  Tv,
  ArrowRight,
  Info,
} from 'lucide-react';

interface SceneStep {
  number: number;
  titleEs: string;
  titleEn: string;
  targetTab: string;
  estimatedMinutes: number;
  talkingPointsEs: string[];
  talkingPointsEn: string[];
}

const THE_7_SCENES: SceneStep[] = [
  {
    number: 1,
    titleEs: 'Escena 1: Madrid en Calma (Torre Serena)',
    titleEn: 'Scene 1: Madrid at Rest (Calm Control Tower)',
    targetTab: 'tower',
    estimatedMinutes: 2.5,
    talkingPointsEs: [
      'Presentar la filosofía de Torre de Control Serena: decisiones antes que datos.',
      'Superar la prueba de los 5 segundos: un observador identifica el caso principal de inmediato.',
      'Mostrar el mapa vectorial a 60 FPS con 5.120 vehículos en movimiento suave.',
      'Demostrar el presupuesto de atención estricto (≤ 7 elementos primarios).',
    ],
    talkingPointsEn: [
      'Demonstrate Calm Control Tower philosophy: decisions over raw data.',
      'Pass the 5-second decision test: clear action, impact, and SLA clock.',
      'Show 60 FPS vector map with 5,120 smooth moving fleet vehicles.',
      'Highlight strict attention budget (≤ 7 primary elements).',
    ],
  },
  {
    number: 2,
    titleEs: 'Escena 2: El Torrente de Alertas (Alert Flood)',
    titleEn: 'Scene 2: The Alert Flood & Correlation',
    targetTab: 'alerts',
    estimatedMinutes: 3.0,
    talkingPointsEs: [
      'Ingesta masiva de 312 señales en tiempo real por fallo de catenaria.',
      'Supresión de ruido: 271 alertas descartadas (duplicadas, flapping, obras).',
      'Convergencia espacial: 312 señales → 41 únicas → 3 clústeres → 1 caso.',
      'Explicar el razonamiento algorítmico del clúster con "Explicar Por Qué".',
    ],
    talkingPointsEn: [
      'Torrential ingestion of 312 raw telemetry signals.',
      'Noise suppression: 271 suppressed (duplicates, flapping, planned works).',
      'Spatial convergence: 312 signals → 41 unique → 3 clusters → 1 case.',
      'Clarify root cause rationale using "Explain Why" drawer.',
    ],
  },
  {
    number: 3,
    titleEs: 'Escena 3: Datos de Confianza y Arbitraje',
    titleEn: 'Scene 3: The Data You Can\'t Trust',
    targetTab: 'tower',
    estimatedMinutes: 2.5,
    talkingPointsEs: [
      'Abrir el cajón lateral de Confianza de Datos (Data Trust Drawer).',
      'Mostrar las 6 categorías de hechos (Medido, Reportado, Confirmado, etc.).',
      'Inspeccionar el conflicto entre telemetría SCADA (99%) vs reporte de operador (72%).',
      'Explicar la regla de arbitraje institucional aplicada por el Consorcio.',
    ],
    talkingPointsEn: [
      'Open the Data Trust inspection drawer on any metric.',
      'Display 6 fact categories (Measured, Reported, Confirmed, etc.).',
      'Inspect conflicting feeds between SCADA telemetry (99%) and operator log (72%).',
      'Explain transparent institutional arbitration rules.',
    ],
  },
  {
    number: 4,
    titleEs: 'Escena 4: El Runbook y Cierre de 9 Pasos',
    titleEn: 'Scene 4: The Runbook & 9-Step Closure Gate',
    targetTab: 'cases',
    estimatedMinutes: 3.5,
    talkingPointsEs: [
      'Espacio de trabajo del caso INC-2026-0929-ATO con estado en 5 dimensiones.',
      'Reclamar titularidad del incidente: Lucía (R01) transfiere a Andrés (R03).',
      'Demostrar la compuerta de seguridad: intento de cierre temprano BLOQUEADO.',
      'Ejecutar pasos del Runbook y certificar el expediente legal con firma.',
    ],
    talkingPointsEn: [
      'Case workspace INC-2026-0929-ATO tracking 5-dimensional state.',
      'Claim ownership: Lucía (R01) hands off to Room Coordinator Andrés (R03).',
      'Demonstrate safety gate: early closure attempt is strictly BLOCKED.',
      'Fulfill all 9 Runbook steps and certify legal expediente.',
    ],
  },
  {
    number: 5,
    titleEs: 'Escena 5: Protección de la Conexión Intermodal',
    titleEn: 'Scene 5: Protecting the Intermodal Connection',
    targetTab: 'connections',
    estimatedMinutes: 2.5,
    talkingPointsEs: [
      'Arbitraje de retención del autobús interurbano 352 en dársena 14 de Atocha.',
      'Mover el control deslizante (slider) de 1 a 10 min: recálculo dinámico en 18ms.',
      'Balance: 142 viajeros que salvan 30m vs 38s de demora aguas abajo.',
      'Autorizar orden de retención telemática y emitir al SAE embarcado.',
    ],
    talkingPointsEn: [
      'Arbitrate departure hold for interurban bus 352 at Atocha Bay 14.',
      'Adjust interactive hold slider (1 to 10 min): recalculated in 18ms.',
      'Net balance: 142 pax saving 30m vs 38s downstream knock-on delay.',
      'Authorize telematic hold order sent directly to onboard unit.',
    ],
  },
  {
    number: 6,
    titleEs: 'Escena 6: El Pasajero Olvidado (Accesibilidad PMR)',
    titleEn: 'Scene 6: The Forgotten Passenger (PMR Routing)',
    targetTab: 'accessibility',
    estimatedMinutes: 2.5,
    talkingPointsEs: [
      'Detección de ascensor averiado en andén 4 de Atocha Cercanías.',
      'Cálculo de itinerario 100% libre de barreras arquitectónicas vía Rampa Norte.',
      'Despacho de personal auxiliar Atendo para asistencia personalizada a viajeros PMR.',
      'Seguimiento en tiempo real de la misión de acompañamiento.',
    ],
    talkingPointsEn: [
      'Detect out-of-service elevator on Atocha Platform 4.',
      'Calculate 100% barrier-free alternate itinerary via North Concourse Ramp.',
      'Dispatch Atendo accessibility assistance team for wheelchair travelers.',
      'Track real-time itinerary assistance mission to completion.',
    ],
  },
  {
    number: 7,
    titleEs: 'Escena 7: Una Plataforma, 21 Vistas y Show & Tell',
    titleEn: 'Scene 7: One Platform, 21 Views & Presenter Tools',
    targetTab: 'tower',
    estimatedMinutes: 3.0,
    talkingPointsEs: [
      'Conmutación instantánea entre roles: R15 Móvil Ciudadano, R14 Dársenas, R19 API.',
      'Activar el Puntero Láser virtual y el Foco de Atención (Spotlight).',
      'Activar el modo Muro 4K de alta densidad para salas de mando.',
      'Completar el ensayo continuo en menos de 20 minutos con 0 errores.',
    ],
    talkingPointsEn: [
      'Instant role switching: R15 Mobile Passenger, R14 Intercambiador, R19 API.',
      'Activate presenter laser pointer and spotlight focus tools.',
      'Toggle 4K wall mode for high-contrast control room wall displays.',
      'Complete continuous walkthrough in under 20 minutes with 0 errors.',
    ],
  },
];

interface ShowAndTellRehearsalRunnerProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenSimulatorModal: () => void;
}

export const ShowAndTellRehearsalRunner: React.FC<ShowAndTellRehearsalRunnerProps> = ({
  currentTab,
  onSelectTab,
  onOpenSimulatorModal,
}) => {
  const { language } = useAuth();

  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Stopwatch timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const currentScene = THE_7_SCENES[currentSceneIdx];

  const handleNextScene = () => {
    if (currentSceneIdx < THE_7_SCENES.length - 1) {
      const nextIdx = currentSceneIdx + 1;
      setCurrentSceneIdx(nextIdx);
      onSelectTab(THE_7_SCENES[nextIdx].targetTab);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) {
      const prevIdx = currentSceneIdx - 1;
      setCurrentSceneIdx(prevIdx);
      onSelectTab(THE_7_SCENES[prevIdx].targetTab);
    }
  };

  const handleResetRehearsal = () => {
    setCurrentSceneIdx(0);
    setStopwatchSeconds(0);
    onSelectTab('tower');
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isUnder20Min = stopwatchSeconds <= 1200; // 20 minutes = 1200 seconds

  return (
    <div className="bg-white dark:bg-[#161B22] rounded-2xl border-2 border-[#0071BB]/40 shadow-md p-4 space-y-3">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#0071BB] animate-ping" />
          <div>
            <h3 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1] uppercase tracking-wider flex items-center gap-1.5">
              <span>{language === 'es' ? 'Guión de Ensayo Show & Tell (7 Escenas Continuas)' : 'Show & Tell Rehearsal Script (7 Continuous Scenes)'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-[#0071BB] font-mono">
                {language === 'es' ? `Escena ${currentScene.number} de 7` : `Scene ${currentScene.number} of 7`}
              </span>
            </h3>
            <p className="text-[11px] text-neutral-500">
              {language === 'es'
                ? 'Objetivo: Completar las 7 escenas del guión institucional en < 20 minutos sin interrupciones.'
                : 'Goal: Complete all 7 institutional walkthrough scenes in < 20 minutes without interruption.'}
            </p>
          </div>
        </div>

        {/* Stopwatch & Navigation Controls */}
        <div className="flex items-center gap-2">
          {/* Stopwatch Pill */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
            isUnder20Min
              ? 'border-emerald-500/30 bg-emerald-50/20 text-emerald-700 dark:text-emerald-300'
              : 'border-red-500/30 bg-red-50/20 text-red-700 dark:text-red-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(stopwatchSeconds)}</span>
            <span className="text-[10px] font-sans font-normal opacity-75">/ 20:00</span>
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            title={
              language === 'es'
                ? (isTimerRunning ? 'Pausar cronómetro' : 'Reanudar cronómetro')
                : (isTimerRunning ? 'Pause timer' : 'Resume timer')
            }
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleResetRehearsal}
            className="p-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            title={language === 'es' ? 'Reiniciar ensayo a la Escena 1' : 'Restart rehearsal to Scene 1'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenSimulatorModal}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            {language === 'es' ? 'Simulador S1–S8' : 'Simulator S1–S8'}
          </button>
        </div>
      </div>

      {/* Active Scene Talking Points Card */}
      <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/50 border border-[#DCE1E7] dark:border-[#2B3440] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es' ? currentScene.titleEs : currentScene.titleEn}
            </h4>
            <span className="text-[10px] text-neutral-400 font-mono">
              ({currentScene.estimatedMinutes} {language === 'es' ? 'min sugeridos' : 'min suggested'})
            </span>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-neutral-600 dark:text-neutral-400 pt-1">
            {(language === 'es' ? currentScene.talkingPointsEs : currentScene.talkingPointsEn).map(
              (pt, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#0071BB] font-bold">›</span>
                  <span>{pt}</span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Scene Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={handlePrevScene}
            disabled={currentSceneIdx === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] disabled:opacity-40 text-xs font-medium cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Anterior' : 'Previous'}</span>
          </button>

          <button
            onClick={handleNextScene}
            disabled={currentSceneIdx === THE_7_SCENES.length - 1}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0071BB] hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <span>{language === 'es' ? 'Siguiente Escena' : 'Next Scene'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
