import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { getSiteLines, getSiteCctvFeeds } from '../../data/multiSiteData';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Video,
  Layers,
  Clock,
  Filter,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ExploreModePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExploreModePanel: React.FC<ExploreModePanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, isWallDisplay, toggleWallDisplay } = useAuth();
  const { activeSite } = useSite();
  const [replayTime, setReplayTime] = useState<string>('08:41');
  const [isReplaying, setIsReplaying] = useState(false);
  const [selectedSubmode, setSelectedSubmode] = useState<'all' | 'video' | 'tables' | 'replay'>('all');

  if (!isOpen) return null;

  const siteLines = getSiteLines(activeSite.id);
  const cctvFeeds = getSiteCctvFeeds(activeSite.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-6xl h-[88vh] flex flex-col rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between bg-neutral-50 dark:bg-[#1E252E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Modo Exploración Integral (Explore Mode - CTW-11)' : 'Full Exploration Mode (Explore Mode - CTW-11)'}
                </h3>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {language === 'es' ? 'Todas las Capas Activas' : 'All Layers Active'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {language === 'es'
                  ? 'Replay histórico desde inicio de jornada (04:30), mosaico CCTV en directo y tablas completas de oferta.'
                  : 'Historical replay since start of service (04:30), live CCTV mosaic, and complete service tables.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleWallDisplay}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                isWallDisplay
                  ? 'bg-[#0071BB] text-white border-[#0071BB]'
                  : 'border-[#DCE1E7] dark:border-[#2B3440] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Videowall 4K
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Replay Scrubber Bar */}
        <div className="px-6 py-3 bg-neutral-100 dark:bg-neutral-900 border-b border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReplaying(!isReplaying)}
              className="p-1.5 rounded-lg bg-[#0071BB] text-white hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              {isReplaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={() => setReplayTime('04:30')}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
              title={language === 'es' ? 'Volver a 04:30 (Inicio de Jornada)' : 'Reset to 04:30 (Start of Day)'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            </button>
            <span className="font-mono text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1] ml-1">
              {language === 'es' ? 'Hora de Replay:' : 'Replay Time:'} {replayTime}
            </span>
          </div>

          <div className="flex-1 max-w-xl flex items-center gap-3">
            <span className="text-[10px] font-mono text-neutral-400">04:30</span>
            <input
              type="range"
              min="270"
              max="521"
              value={parseInt(replayTime.split(':')[0]) * 60 + parseInt(replayTime.split(':')[1])}
              onChange={(e) => {
                const totalMin = parseInt(e.target.value);
                const h = Math.floor(totalMin / 60).toString().padStart(2, '0');
                const m = (totalMin % 60).toString().padStart(2, '0');
                setReplayTime(`${h}:${m}`);
              }}
              className="w-full accent-[#0071BB] cursor-pointer"
            />
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              08:41 (LIVE)
            </span>
          </div>

          <span className="text-[11px] text-neutral-500 font-mono hidden md:inline">
            {language === 'es' ? '24 meses histórico indexado' : '24 months indexed history'}
          </span>
        </div>

        {/* Content Body: CCTV Multi-Stream Mosaic + Corridors Data */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* CCTV Mosaic (4 Cameras) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                <Video className="w-4 h-4 text-neutral-400" />
                <span>{language === 'es' ? 'Mosaico CCTV Multimodal en Tiempo Real (4 Cámaras de N10)' : 'Real-Time Multimodal CCTV Mosaic (4 Cameras from N10)'}</span>
              </h4>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                {language === 'es' ? '● 4 feeds activos a 25 FPS' : '● 4 active feeds at 25 FPS'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {cctvFeeds.map((cam) => {
                const isSurge = cam.type === 'crowd_surge';
                return (
                  <div key={cam.id} className="rounded-xl overflow-hidden border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-900 shadow-xs relative">
                    <div className="h-36 bg-neutral-950 flex flex-col items-center justify-center p-3 text-center relative">
                      <div className={`absolute top-2 left-2 text-[9px] font-mono flex items-center gap-1 font-bold ${isSurge ? 'text-red-500' : 'text-emerald-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isSurge ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                        CAM-{cam.location.slice(0, 3).toUpperCase()}-0{cam.id}
                      </div>
                      <Users className="w-8 h-8 text-neutral-600 mb-1" />
                      <span className="text-xs font-mono text-white font-semibold line-clamp-1">
                        {cam.name}
                      </span>
                      <span className={`text-[10px] font-medium ${isSurge ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isSurge
                          ? (language === 'es' ? 'Alta Afluencia / Incidencia' : 'High Influx / Disruption')
                          : (language === 'es' ? 'Operación Nominal' : 'Nominal Operation')}
                      </span>
                    </div>
                    <div className="p-2 bg-neutral-800 text-[10px] text-neutral-300 flex justify-between">
                      <span>{cam.location}</span>
                      <span className="font-mono">{cam.fps} FPS · {cam.resolution}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Line Status Ledger */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              {language === 'es'
                ? `Tabla Integral de Líneas y Frecuencias Observadas (${activeSite.shortName})`
                : `Master Ledger of Lines and Observed Frequencies (${activeSite.shortName})`}
            </h4>

            <div className="rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] overflow-hidden bg-white dark:bg-[#161B22]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-neutral-500 font-semibold">
                    <th className="py-2.5 px-4">{language === 'es' ? 'Línea' : 'Line'}</th>
                    <th className="py-2.5 px-4">{language === 'es' ? 'Modo' : 'Mode'}</th>
                    <th className="py-2.5 px-4">{language === 'es' ? 'Itinerario' : 'Route'}</th>
                    <th className="py-2.5 px-4">{language === 'es' ? 'Operador' : 'Operator'}</th>
                    <th className="py-2.5 px-4 text-center">{language === 'es' ? 'Frecuencia Teórica' : 'Scheduled Headway'}</th>
                    <th className="py-2.5 px-4 text-center">{language === 'es' ? 'Vehículos Activos' : 'Active Vehicles'}</th>
                    <th className="py-2.5 px-4 text-right">{language === 'es' ? 'Estado Operativo' : 'Operating Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE1E7] dark:divide-[#2B3440]">
                  {siteLines.map((line) => (
                    <tr key={line.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-2.5 px-4 font-mono font-bold">
                        <span
                          style={{ backgroundColor: line.color, color: line.textColor }}
                          className="px-2 py-0.5 rounded text-[11px]"
                        >
                          {line.code}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 capitalize text-neutral-600 dark:text-neutral-400 font-medium">
                        {line.mode}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-[#1B1F24] dark:text-[#E8ECF1]">
                        {language === 'es' ? line.routeEs : line.routeEn}
                      </td>
                      <td className="py-2.5 px-4 text-neutral-500">{line.operator}</td>
                      <td className="py-2.5 px-4 text-center font-mono">{line.frequencyPeakMin} min</td>
                      <td className="py-2.5 px-4 text-center font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {line.activeVehicles}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            line.status === 'nominal'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : line.status === 'disrupted'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {line.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#1E252E] flex items-center justify-between text-xs text-neutral-500">
          <span>
            {language === 'es'
              ? 'Configuración recordada para el usuario activo (CTW-11)'
              : 'Preferences remembered for active user (CTW-11)'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-medium cursor-pointer"
          >
            {language === 'es' ? 'Volver a Modo Decisión (Glance)' : 'Return to Decision Mode (Glance)'}
          </button>
        </div>
      </div>
    </div>
  );
};
