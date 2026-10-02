import React, { useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { InterchangeHub } from '../../data/madridNetworkData';
import {
  X,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  GitBranch,
  Video,
  Users,
} from 'lucide-react';

interface FocusModePanelProps {
  focusedEntity: {
    type: 'incident' | 'hub' | 'line';
    id: string;
    title: string;
    hubData?: InterchangeHub;
  } | null;
  onClose: () => void;
  onOpenCase: (caseId: string) => void;
  onOpenConnectionHold?: () => void;
}

export const FocusModePanel: React.FC<FocusModePanelProps> = ({
  focusedEntity,
  onClose,
  onOpenCase,
  onOpenConnectionHold,
}) => {
  const { language } = useAuth();

  // Esc key returns as per PRD CTW-10
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!focusedEntity) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#161B22] border-l border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {language === 'es' ? 'MODO ENFOQUE (FOCUS)' : 'FOCUS MODE'}
            </span>
            <span className="text-xs text-neutral-400">
              {language === 'es' ? 'Presiona Esc para volver' : 'Press Esc to return'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focused Item Title & Meta */}
        <div>
          <h3 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
            {focusedEntity.title}
          </h3>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            ID: {focusedEntity.id} · {language === 'es' ? 'Sector Atocha Sur' : 'Sector Atocha South'}
          </p>
        </div>

        {/* Live Incident Status if Incident */}
        {focusedEntity.type === 'incident' && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-950 dark:text-red-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>{language === 'es' ? 'Avería Eléctrica en Catenaria' : 'Electrical Catenary Failure'}</span>
              </span>
              <span className="font-mono text-red-600 dark:text-red-400">02:45 min SLA</span>
            </div>
            <p className="text-xs leading-relaxed">
              {language === 'es'
                ? 'Caída brusca de tensión detectada a las 08:38:12 en cantón Atocha-Villaverde. Tensión cayó de 3.000V a 420V en vías 3 y 4.'
                : 'Sudden voltage drop detected at 08:38:12 in block Atocha-Villaverde. Voltage dropped from 3,000V to 420V on tracks 3 and 4.'}
            </p>
          </div>
        )}

        {/* Localized Departures & Impact */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440] space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <span>{language === 'es' ? 'Próximas Salidas desde este Nodo' : 'Upcoming Departures from Node'}</span>
            <span className="text-[10px] text-neutral-400">{language === 'es' ? 'Hora: 08:41:03' : 'Time: 08:41:03'}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-white dark:bg-[#161B22] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#8A1538]">Cercanías C-3</span>
                <span className="text-neutral-500 text-[11px] block">{language === 'es' ? 'Destino Aranjuez' : 'Destination Aranjuez'}</span>
              </div>
              <div className="text-right">
                <span className="text-red-600 dark:text-red-400 font-bold block">
                  {language === 'es' ? '+18 min retardo' : '+18 min delay'}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {language === 'es' ? 'Andén 3 (Detenido)' : 'Platform 3 (Stopped)'}
                </span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white dark:bg-[#161B22] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#00853F]">Interurbano 352</span>
                <span className="text-neutral-500 text-[11px] block">
                  {language === 'es' ? 'Dársena 14 (Conde Casal)' : 'Bay 14 (Conde Casal)'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-amber-600 dark:text-amber-400 font-bold block">
                  {language === 'es' ? 'Enlace en Riesgo (-3m)' : 'Connection at Risk (-3m)'}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {language === 'es' ? 'Salida 08:42' : 'Departure 08:42'}
                </span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white dark:bg-[#161B22] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0047BA]">EMT Línea 27</span>
                <span className="text-neutral-500 text-[11px] block">Plaza Castilla</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
                  {language === 'es' ? 'En hora (08:43)' : 'On time (08:43)'}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {language === 'es' ? 'Dársena 2' : 'Bay 2'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live CCTV Thumbnail */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-neutral-400" />
              <span>{language === 'es' ? 'Cámara CCTV CAM-ATO-04 (Andén 3/4)' : 'CCTV Camera CAM-ATO-04 (Platform 3/4)'}</span>
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">LIVE · 25 FPS</span>
          </div>

          <div className="h-32 rounded-lg bg-neutral-900 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="text-center z-10">
              <Users className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
              <div className="text-[11px] font-mono text-white">
                {language === 'es' ? 'ATOCHA VÍAS 3-4 SUBTERRÁNEO' : 'ATOCHA TRACKS 3-4 UNDERGROUND'}
              </div>
              <div className="text-[9px] text-neutral-400">
                {language === 'es' ? 'Afluencia moderada en andén · Convoy 465 detenido' : 'Moderate platform crowd · Convoy 465 stopped'}
              </div>
            </div>
            <div className="absolute top-2 left-2 text-[9px] font-mono text-red-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> REC
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#DCE1E7] dark:border-[#2B3440] space-y-2">
        <button
          onClick={() => onOpenCase('INC-2026-0929-ATO')}
          className="w-full py-2 bg-[#0071BB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>{language === 'es' ? 'Abrir Espacio de Trabajo del Caso' : 'Open Case Workspace'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClose}
          className="w-full py-1.5 border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
        >
          {language === 'es' ? 'Cerrar Modo Enfoque' : 'Close Focus Mode'}
        </button>
      </div>
    </div>
  );
};
