import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { ALL_NON_HUMAN_ACTORS } from '../../data/nonHumanActorsData';
import { NonHumanActor } from '../../types';
import {
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  X,
  Search,
  ArrowRight,
  Database,
  Shield,
  Layers,
} from 'lucide-react';

interface ActorDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectActor?: (actor: NonHumanActor) => void;
}

export const ActorDirectoryModal: React.FC<ActorDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectActor,
}) => {
  const { language } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedActor, setSelectedActor] = useState<NonHumanActor>(ALL_NON_HUMAN_ACTORS[0]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!isOpen) return null;

  const filteredActors = ALL_NON_HUMAN_ACTORS.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.organization.toLowerCase().includes(search.toLowerCase()) ||
      a.interface.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-5xl h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between bg-neutral-50 dark:bg-[#1E252E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Directorio de Actores No Humanos (N01 a N23)' : 'Directory of Non-Human Actors (N01 to N23)'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {ALL_NON_HUMAN_ACTORS.length} {language === 'es' ? 'Conexiones Registradas' : 'Registered Connections'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {language === 'es'
                  ? 'Registro y telemetría de interfaces de datos según especificación PRD Sección 3 y Reglas ACT-01 a ACT-05.'
                  : 'Registry and telemetry of data interfaces per PRD Section 3 and Rules ACT-01 through ACT-05.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Master List (Left) + Detail Card (Right) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Actor Directory List */}
          <div className="w-1/2 border-r border-[#DCE1E7] dark:border-[#2B3440] flex flex-col bg-white dark:bg-[#161B22]">
            {/* Search & Filter Bar */}
            <div className="p-3 border-b border-[#DCE1E7] dark:border-[#2B3440] space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder={language === 'es' ? 'Buscar por código (N01), protocolo o entidad...' : 'Search by code (N01), protocol, or entity...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440] rounded-lg text-[#1B1F24] dark:text-[#E8ECF1]"
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                {(['all', 'healthy', 'degraded', 'stale'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-0.5 rounded-md capitalize cursor-pointer transition-colors ${
                      filterStatus === st
                        ? 'bg-[#0071BB] text-white font-medium'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Actor List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#DCE1E7] dark:divide-[#2B3440]">
              {filteredActors.map((actor) => {
                const isSelected = selectedActor.id === actor.id;
                return (
                  <button
                    key={actor.id}
                    onClick={() => setSelectedActor(actor)}
                    className={`w-full text-left p-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/60 dark:bg-blue-950/20 border-l-3 border-[#0071BB]' : ''
                    }`}
                  >
                    <div className="space-y-0.5 truncate mr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#0071BB] dark:text-[#5AAEE8]">
                          {actor.id}
                        </span>
                        <span className="text-xs font-semibold text-[#1B1F24] dark:text-[#E8ECF1] truncate">
                          {actor.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {actor.organization} · <span className="font-mono">{actor.interface}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          actor.status === 'healthy'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : actor.status === 'degraded'
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {actor.status}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {actor.messageRatePerSec} msg/s
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Inspector Card (ACT-04) */}
          <div className="w-1/2 p-6 overflow-y-auto bg-neutral-50/50 dark:bg-[#1E252E]/30 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8] bg-blue-500/10 px-2 py-0.5 rounded">
                  {selectedActor.id} · REGISTRO AUDITADO
                </span>
                <h4 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1] mt-2">
                  {selectedActor.name}
                </h4>
                <p className="text-xs text-neutral-500">{selectedActor.organization}</p>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-neutral-400">Calidad de Fuente</div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedActor.qualityScore}%
                </div>
              </div>
            </div>

            {/* Telemetry Gauge Grid */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
                <div className="text-[10px] text-neutral-400">{language === 'es' ? 'Tasa de Mensajes' : 'Message Rate'}</div>
                <div className="font-mono font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1] mt-0.5">
                  {selectedActor.messageRatePerSec} <span className="text-[10px] font-normal">/s</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
                <div className="text-[10px] text-neutral-400">{language === 'es' ? 'Latencia de Red' : 'Network Latency'}</div>
                <div className="font-mono font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1] mt-0.5">
                  {selectedActor.latencyMs} <span className="text-[10px] font-normal">ms</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
                <div className="text-[10px] text-neutral-400">{language === 'es' ? 'Último Mensaje' : 'Last Message'}</div>
                <div className="font-mono font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1] mt-0.5">
                  {selectedActor.lastMessageTime}
                </div>
              </div>
            </div>

            {/* Protocol & Governance Attributes */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] space-y-2 text-xs">
              <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
                <span className="text-neutral-500 font-medium">{language === 'es' ? 'Protocolo / Estándar:' : 'Protocol / Standard:'}</span>
                <span className="font-mono font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{selectedActor.protocol}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
                <span className="text-neutral-500 font-medium">{language === 'es' ? 'Interfaz de Conexión:' : 'Connection Interface:'}</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">{selectedActor.interface}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
                <span className="text-neutral-500 font-medium">{language === 'es' ? 'Responsable / Titular:' : 'Responsible Owner / Entity:'}</span>
                <span className="text-neutral-800 dark:text-neutral-200">{selectedActor.owner}</span>
              </div>
              {selectedActor.backupSourceId && (
                <div className="flex justify-between pt-0.5">
                  <span className="text-neutral-500 font-medium">{language === 'es' ? 'Fuente de Contingencia (Backup):' : 'Fallback Contingency Source:'}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {selectedActor.backupSourceId} ({language === 'es' ? 'Telemetría Directa' : 'Direct Telemetry'})
                  </span>
                </div>
              )}
            </div>

            {/* Data Ingest & Broadcast Payload Descriptions */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
                <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                  {language === 'es' ? 'Datos que Remite a CITRAM (Inbound):' : 'Data Dispatched to CITRAM (Inbound):'}
                </span>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                  {selectedActor.sends}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
                <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                  {language === 'es' ? 'Datos que Recibe de CITRAM (Outbound):' : 'Instructions Received from CITRAM (Outbound):'}
                </span>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                  {selectedActor.receives}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200">
                <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400 block mb-1">
                  {language === 'es' ? 'Protocolo en caso de fallo (Fall-back Action):' : 'Behavior on Failure (Fall-back Action):'}
                </span>
                <p className="font-medium text-xs">
                  {selectedActor.failureAction}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#1E252E] flex items-center justify-between text-xs text-neutral-500">
          <span>{language === 'es' ? 'PRD Regla ACT-01: Todos los actores no humanos monitorizados continuamente' : 'PRD Rule ACT-01: All non-human actors continuously monitored'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-medium cursor-pointer"
          >
            {language === 'es' ? 'Cerrar Directorio' : 'Close Directory'}
          </button>
        </div>
      </div>
    </div>
  );
};
