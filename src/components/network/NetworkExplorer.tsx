import React, { useState } from 'react';
import { MADRID_LINES, MADRID_INTERCHANGES, TransportLine, InterchangeHub } from '../../data/madridNetworkData';
import { useAuth } from '../../services/authContext';
import {
  Compass,
  Train,
  Bus,
  Search,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Activity,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface NetworkExplorerProps {
  onOpenTrustDrawer: (title: string) => void;
  onOpenActorDirectory: () => void;
}

export const NetworkExplorer: React.FC<NetworkExplorerProps> = ({
  onOpenTrustDrawer,
  onOpenActorDirectory,
}) => {
  const { language } = useAuth();
  const [activeTab, setActiveTab] = useState<'lines' | 'interchanges'>('lines');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredLines = MADRID_LINES.filter((l) => {
    const matchesMode = modeFilter === 'all' || l.mode === modeFilter;
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.routeEs.toLowerCase().includes(search.toLowerCase());
    return matchesMode && matchesSearch;
  });

  const filteredInterchanges = MADRID_INTERCHANGES.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 p-2 max-w-6xl mx-auto">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#0071BB] dark:text-[#5AAEE8]" />
            <h2 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es' ? 'Topología y Red Multimodal de Madrid' : 'Madrid Multimodal Transport Network'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {language === 'es'
              ? 'Datos maestros de Metro, Cercanías, EMT, Interurbanos e Intercambiadores regionales.'
              : 'Master reference data for Metro, Cercanías, EMT buses, Interurban concessions, and Interchanges.'}
          </p>
        </div>

        {/* Action Button: Non-Human Actors Directory */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenActorDirectory}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Ver 23 Actores y Feeds (N01-N23)' : 'View 23 Actors & Feeds (N01-N23)'}</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
          <span className="text-[10px] text-neutral-400 block uppercase">{language === 'es' ? 'Vehículos Activos en Red' : 'Active Vehicles on Network'}</span>
          <span className="text-xl font-bold font-mono text-[#1B1F24] dark:text-[#E8ECF1]">5.120</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">{language === 'es' ? 'Simulados en tiempo real (60 FPS)' : 'Real-time simulated (60 FPS)'}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
          <span className="text-[10px] text-neutral-400 block uppercase">{language === 'es' ? 'Intercambiadores Principales' : 'Main Interchanges'}</span>
          <span className="text-xl font-bold font-mono text-[#1B1F24] dark:text-[#E8ECF1]">5 + 1</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Atocha, Moncloa, P.Pío, Pza.Castilla, Av.América</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
          <span className="text-[10px] text-neutral-400 block uppercase">{language === 'es' ? 'Viajes Diarios Supervisados' : 'Supervised Daily Journeys'}</span>
          <span className="text-xl font-bold font-mono text-[#1B1F24] dark:text-[#E8ECF1]">&gt; 5.000.000</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">{language === 'es' ? 'Población regional: 6,5M personas' : 'Regional population: 6.5M people'}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
          <span className="text-[10px] text-neutral-400 block uppercase">{language === 'es' ? 'Operadores Públicos y Privados' : 'Public & Private Operators'}</span>
          <span className="text-xl font-bold font-mono text-[#1B1F24] dark:text-[#E8ECF1]">&gt; 40</span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">{language === 'es' ? '179 municipios de la Comunidad' : '179 Community municipalities'}</span>
        </div>
      </div>

      {/* Navigation Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-2">
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440]">
          <button
            onClick={() => setActiveTab('lines')}
            className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
              activeTab === 'lines'
                ? 'bg-white dark:bg-neutral-900 text-[#1B1F24] dark:text-[#E8ECF1] shadow-xs'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'es' ? `Líneas y Corredores (${MADRID_LINES.length})` : `Lines & Corridors (${MADRID_LINES.length})`}
          </button>
          <button
            onClick={() => setActiveTab('interchanges')}
            className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
              activeTab === 'interchanges'
                ? 'bg-white dark:bg-neutral-900 text-[#1B1F24] dark:text-[#E8ECF1] shadow-xs'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'es' ? `Grandes Intercambiadores (${MADRID_INTERCHANGES.length})` : `Major Interchanges (${MADRID_INTERCHANGES.length})`}
          </button>
        </div>

        {/* Search & Mode Filters */}
        <div className="flex items-center gap-2">
          {activeTab === 'lines' && (
            <div className="flex items-center gap-1 text-[11px]">
              {(['all', 'cercanias', 'metro', 'emt', 'interurban'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setModeFilter(m)}
                  className={`px-2 py-0.5 rounded-md capitalize cursor-pointer transition-colors ${
                    modeFilter === m
                      ? 'bg-[#0071BB] text-white font-medium'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] rounded-lg text-[#1B1F24] dark:text-[#E8ECF1] w-40"
            />
          </div>
        </div>
      </div>

      {/* Tab Content: Lines Grid */}
      {activeTab === 'lines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLines.map((line) => (
            <div
              key={line.id}
              className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: line.color, color: line.textColor }}
                      className="px-2 py-0.5 rounded text-xs font-bold font-mono shadow-xs"
                    >
                      {line.code}
                    </span>
                    <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {line.name}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      line.status === 'nominal'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : line.status === 'disrupted'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {line.status}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-500 line-clamp-2">
                  {line.routeEs}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">{language === 'es' ? 'Operador:' : 'Operator:'}</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{line.operator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{language === 'es' ? 'Frecuencia Hora Punta:' : 'Peak Headway:'}</span>
                  <span className="font-mono">{line.frequencyPeakMin} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{language === 'es' ? 'Vehículos en Circulación:' : 'Vehicles in Service:'}</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {line.activeVehicles} {language === 'es' ? 'unidades' : 'units'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenTrustDrawer(language === 'es' ? `Línea ${line.code} - ${line.name}` : `Line ${line.code} - ${line.name}`)}
                className="w-full py-1 text-[11px] text-center font-medium text-[#0071BB] dark:text-[#5AAEE8] hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
              >
                {language === 'es' ? 'Auditar Calidad de Datos (Trust) →' : 'Audit Data Quality (Trust) →'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Interchanges Grid */}
      {activeTab === 'interchanges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredInterchanges.map((hub) => (
            <div
              key={hub.id}
              className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8]">
                    {hub.code}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      hub.activeCrowdLevel === 'surge'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : hub.activeCrowdLevel === 'moderate'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {language === 'es' ? 'Afluencia:' : 'Crowd:'} {hub.activeCrowdLevel}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {hub.name}
                </h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {hub.modes.map((m) => (
                    <span
                      key={m}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">{language === 'es' ? 'Viajeros Diarios:' : 'Daily Travelers:'}</span>
                  <span className="font-mono font-bold">{hub.dailyPassengers.toLocaleString('es-ES')} pax</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{language === 'es' ? 'Dársenas de Autobús:' : 'Bus Bays:'}</span>
                  <span className="font-mono">{hub.docksCount} {language === 'es' ? 'dársenas' : 'bays'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{language === 'es' ? 'Líneas en Conexión:' : 'Connecting Lines:'}</span>
                  <span className="font-mono">{hub.linesCount} {language === 'es' ? 'líneas' : 'lines'}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenTrustDrawer(hub.name)}
                className="w-full py-1 text-[11px] text-center font-medium text-[#0071BB] dark:text-[#5AAEE8] hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
              >
                {language === 'es' ? 'Auditar Calidad de Datos (Trust) →' : 'Audit Data Quality (Trust) →'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
