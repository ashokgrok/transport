import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../services/authContext';
import { Play, RotateCcw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AlertConvergenceAnimationProps {
  onAnimationComplete?: () => void;
  onOpenCase?: () => void;
}

export const AlertConvergenceAnimation: React.FC<AlertConvergenceAnimationProps> = ({
  onAnimationComplete,
  onOpenCase,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, language } = useAuth();

  const [stage, setStage] = useState<'flood_312' | 'unique_41' | 'clusters_3' | 'case_1'>('flood_312');
  const [counter, setCounter] = useState<number>(312);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const startHeroAnimation = () => {
    setIsPlaying(true);
    setIsCompleted(false);
    setStage('flood_312');
    setCounter(312);

    // Timeline of the 600ms hero collapse stages (PRD FLD-06 & Scene 3)
    setTimeout(() => {
      setStage('unique_41');
      setCounter(41);
    }, 450);

    setTimeout(() => {
      setStage('clusters_3');
      setCounter(3);
    }, 900);

    setTimeout(() => {
      setStage('case_1');
      setCounter(1);
      setIsCompleted(true);
      setIsPlaying(false);
      onAnimationComplete?.();
    }, 1400);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // Generate 312 particles
    const particles = Array.from({ length: 312 }, (_, i) => ({
      id: i,
      x: Math.random() * 600 + 50,
      y: Math.random() * 200 + 40,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      color:
        i % 5 === 0
          ? '#B42318' // critical
          : i % 3 === 0
          ? '#B54708' // high
          : '#0071BB',
      clusterTarget: i % 7 === 0 ? 1 : i % 13 === 0 ? 2 : 0,
    }));

    const render = () => {
      t += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = theme === 'dark';
      const w = canvas.width;
      const h = canvas.height;

      // Cluster target positions
      const targets = [
        { x: w * 0.5, y: h * 0.45 }, // Main catenary
        { x: w * 0.28, y: h * 0.5 },  // Crowd
        { x: w * 0.72, y: h * 0.5 },  // Connection
      ];

      const singleTarget = { x: w * 0.5, y: h * 0.5 };

      particles.forEach((p) => {
        if (stage === 'flood_312') {
          // Free swirling alert particles
          p.x += Math.sin(t + p.id) * 0.8 + p.vx;
          p.y += Math.cos(t + p.id) * 0.8 + p.vy;

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (stage === 'unique_41') {
          // 41 particles remain visible, others fade into them
          if (p.id < 41) {
            const tgt = targets[p.clusterTarget];
            p.x += (tgt.x - p.x) * 0.08;
            p.y += (tgt.y - p.y) * 0.08;

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (stage === 'clusters_3') {
          // Particles condense into 3 distinct cluster nodes
          if (p.id < 30) {
            const tgt = targets[p.clusterTarget];
            p.x += (tgt.x - p.x) * 0.12;
            p.y += (tgt.y - p.y) * 0.12;

            ctx.fillStyle = p.clusterTarget === 0 ? '#B42318' : '#B54708';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (stage === 'case_1') {
          // All condense into the single central core
          p.x += (singleTarget.x - p.x) * 0.16;
          p.y += (singleTarget.y - p.y) * 0.16;

          if (p.id < 12) {
            ctx.fillStyle = '#B42318';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Draw cluster badges / labels in stage clusters_3
      if (stage === 'clusters_3') {
        ctx.fillStyle = isDark ? '#E8ECF1' : '#1B1F24';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(language === 'es' ? 'Clúster 1: Catenaria (96%)' : 'Cluster 1: Catenary (96%)', targets[0].x - 65, targets[0].y + 35);
        ctx.fillText(language === 'es' ? 'Clúster 2: Aforo (88%)' : 'Cluster 2: Crowding (88%)', targets[1].x - 55, targets[1].y + 35);
        ctx.fillText(language === 'es' ? 'Clúster 3: Enlace (92%)' : 'Cluster 3: Connection (92%)', targets[2].x - 55, targets[2].y + 35);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [stage, theme, language]);

  return (
    <div className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] p-6 shadow-xs space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#5B4BC4] dark:text-[#A193FF]" />
            <h3 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es' ? 'Animación Hero: 312 Señales → 41 Alertas → 3 Clústeres → 1 Caso Crítico' : 'Hero Animation: 312 Signals → 41 Alerts → 3 Clusters → 1 Critical Case'}
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {language === 'es'
              ? 'Demostración visual de la supresión de ruido y correlación topológica en menos de 600 ms (PRD FLD-06).'
              : 'Visual demonstration of noise suppression and topological correlation in 600 ms (PRD FLD-06).'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startHeroAnimation}
            disabled={isPlaying}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#5B4BC4] hover:bg-[#4C3EB0] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPlaying ? (language === 'es' ? 'Colapsando...' : 'Collapsing...') : (language === 'es' ? 'Iniciar Colapso Hero' : 'Start Hero Collapse')}</span>
          </button>
          <button
            onClick={() => {
              setStage('flood_312');
              setCounter(312);
              setIsCompleted(false);
            }}
            className="p-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
            title={language === 'es' ? 'Reiniciar a 312' : 'Reset to 312'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Ribbon Flow Counter */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div
          className={`p-3 rounded-xl border transition-all ${
            stage === 'flood_312'
              ? 'border-[#0071BB] bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-[#0071BB]'
              : 'border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/40 opacity-70'
          }`}
        >
          <div className="text-[10px] font-semibold uppercase text-neutral-400">{language === 'es' ? '1. Señales Recibidas' : '1. Received Signals'}</div>
          <div className="text-2xl font-bold font-mono text-[#0071BB] dark:text-[#5AAEE8] mt-0.5 tabular-numbers">
            312
          </div>
          <div className="text-[10px] text-neutral-500">{language === 'es' ? 'Torrente en 90 segundos' : 'Stream in 90 seconds'}</div>
        </div>

        <div
          className={`p-3 rounded-xl border transition-all ${
            stage === 'unique_41'
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 ring-1 ring-indigo-500'
              : 'border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/40 opacity-70'
          }`}
        >
          <div className="text-[10px] font-semibold uppercase text-neutral-400">{language === 'es' ? '2. Alertas Únicas' : '2. Unique Alerts'}</div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5 tabular-numbers">
            41
          </div>
          <div className="text-[10px] text-neutral-500">{language === 'es' ? '271 ruidos suprimidos' : '271 noises suppressed'}</div>
        </div>

        <div
          className={`p-3 rounded-xl border transition-all ${
            stage === 'clusters_3'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500'
              : 'border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/40 opacity-70'
          }`}
        >
          <div className="text-[10px] font-semibold uppercase text-neutral-400">{language === 'es' ? '3. Clústeres Formados' : '3. Formed Clusters'}</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5 tabular-numbers">
            3
          </div>
          <div className="text-[10px] text-neutral-500">{language === 'es' ? 'Catenaria + Aforo + Enlace' : 'Catenary + Crowd + Transfer'}</div>
        </div>

        <div
          className={`p-3 rounded-xl border transition-all ${
            stage === 'case_1'
              ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 ring-1 ring-red-500'
              : 'border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/40 opacity-70'
          }`}
        >
          <div className="text-[10px] font-semibold uppercase text-neutral-400">{language === 'es' ? '4. Caso Promovido' : '4. Promoted Case'}</div>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mt-0.5 tabular-numbers">
            1
          </div>
          <div className="text-[10px] text-neutral-500 font-semibold text-red-600">{language === 'es' ? 'INC-2026-0929 (Crítico)' : 'INC-2026-0929 (Critical)'}</div>
        </div>
      </div>

      {/* Animation Canvas */}
      <div className="h-56 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-[#F5F6F8]/60 dark:bg-[#0B0F14] relative overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} width={700} height={220} className="w-full h-full" />

        {/* Central Card when settled into 1 case */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
            <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-red-500/50 shadow-2xl max-w-md w-full space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center mx-auto font-bold text-lg">
                !
              </div>
              <h4 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Caso INC-2026-0929 Promovido con Éxito' : 'Case INC-2026-0929 Successfully Promoted'}
              </h4>
              <p className="text-xs text-neutral-500 leading-tight">
                {language === 'es' ? '312 señales consolidadas en una única verdad operativa con 96% de confianza.' : '312 signals consolidated into a single operational truth with 96% confidence.'}
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={onOpenCase}
                  className="px-4 py-1.5 bg-[#0071BB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Abrir Caso INC-2026-0929</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
