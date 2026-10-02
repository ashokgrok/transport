import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { getSitePunctualityMetrics } from '../../data/multiSiteData';
import {
  Timer,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
  Layers,
  Search,
} from 'lucide-react';

interface PunctualityBoardProps {
  onOpenCase?: (caseId: string) => void;
  onOpenTrustDrawer?: (title: string) => void;
}

export const PunctualityBoard: React.FC<PunctualityBoardProps> = ({
  onOpenCase,
  onOpenTrustDrawer,
}) => {
  const { language } = useAuth();
  const { activeSite } = useSite();

  const [selectedMode, setSelectedMode] = useState<'all' | 'metro' | 'emt' | 'cercanias' | 'interurbanos' | 'ml'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadToast, setDownloadToast] = useState(false);

  const lineMetrics = getSitePunctualityMetrics(activeSite.id);

  const filteredLines = lineMetrics.filter((item) => {
    if (selectedMode !== 'all' && item.mode !== selectedMode) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.modeName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
      {/* Download confirmation toast */}
      {downloadToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#161B22] text-white border border-emerald-500/50 shadow-xl px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            {language === 'es'
              ? 'Certificado oficial de puntualidad y regularidad descargado (CSV)'
              : 'Official punctuality and regularity ledger exported (CSV)'}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0071BB]/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es'
                  ? 'Panel de Control de Puntualidad y Regularidad Multimodal'
                  : 'Multimodal Punctuality & Headway Regularity Board'}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? `Supervisión en tiempo real de horarios, intervalos y cumplimiento de SLA concesional (${activeSite.shortName}).`
                  : `Real-time monitoring of schedules, headway regularities, and contractual SLA compliance (${activeSite.shortName}).`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenTrustDrawer?.('Punctuality Data Certification')}
            className="px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            {language === 'es' ? 'Trazabilidad de Datos' : 'Data Trust Audit'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0071BB] text-white hover:bg-blue-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Exportar Informe Oficial (CSV)' : 'Export Official Ledger'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {language === 'es' ? 'Puntualidad Global Red' : 'Global Network Punctuality'}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-mono">
              Obj. ≥ 96.0%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              98.4%
            </span>
            <span className="text-xs text-emerald-600 flex items-center gap-0.5 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+0.2% vs ayer</span>
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 pt-1">
            {language === 'es' ? 'Sobre 5.120 expediciones monitorizadas hoy' : 'Over 5,120 trips monitored today'}
          </p>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {language === 'es' ? 'Regularidad de Intervalo' : 'Headway Regularity'}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-[#0071BB] font-mono">
              Jitter ±45s
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black font-mono text-[#0071BB] dark:text-[#5AAEE8]">
              96.8%
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              Metro & EMT
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 pt-1">
            {language === 'es' ? 'Conformidad con frecuencias de hora punta' : 'Peak frequency compliance'}
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {language === 'es' ? 'Punta de la Mañana' : 'Morning Peak Period'}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
              07:00 - 09:30
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black font-mono text-neutral-800 dark:text-neutral-200">
              97.6%
            </span>
            <span className="text-xs text-neutral-500">
              820.000 pax
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 pt-1">
            {language === 'es' ? 'Valle: 99.1% · Cierre nocturno estimado: 98.5%' : 'Off-peak: 99.1% · Est. close: 98.5%'}
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {language === 'es' ? 'Penalización Contractual' : 'Contract Penalty Accrual'}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-mono">
              0,00 €
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              0 €
            </span>
            <span className="text-xs text-amber-600 font-semibold font-mono">
              450 € en revisión
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 pt-1">
            {language === 'es' ? 'Cercanías bajo fuerza mayor (Adif infraestructura)' : 'Cercanías under force majeure (Adif infrastructure)'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-neutral-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Modo:' : 'Mode:'}</span>
          </span>
          {[
            { id: 'all', label: language === 'es' ? 'Todos' : 'All' },
            { id: 'metro', label: 'Metro' },
            { id: 'emt', label: 'EMT Madrid' },
            { id: 'cercanias', label: 'Renfe Cercanías' },
            { id: 'interurbanos', label: 'Interurbanos' },
            { id: 'ml', label: 'Metro Ligero' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMode(m.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedMode === m.id
                  ? 'bg-[#0071BB] text-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            placeholder={language === 'es' ? 'Buscar línea o corredor...' : 'Search line or corridor...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Main Punctuality Table */}
      <div className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-[#0E1217] border-b border-[#DCE1E7] dark:border-[#2B3440] text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{language === 'es' ? 'Línea / Servicio' : 'Line / Service'}</th>
                <th className="py-3 px-4">{language === 'es' ? 'Modo de Transporte' : 'Mode'}</th>
                <th className="py-3 px-4 text-center">{language === 'es' ? 'Viajes Realizados' : 'Trips Executed'}</th>
                <th className="py-3 px-4 text-center">{language === 'es' ? 'Tasa Puntualidad' : 'Punctuality Rate'}</th>
                <th className="py-3 px-4 text-center">{language === 'es' ? 'Demora Media' : 'Avg Delay'}</th>
                <th className="py-3 px-4">{language === 'es' ? 'Diagnóstico Operativo' : 'Operational Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'es' ? 'Acción' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredLines.map((row) => (
                <tr key={row.code} className="hover:bg-neutral-50/50 dark:hover:bg-[#1B222D]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="px-2 py-0.5 rounded font-black font-mono text-white text-[11px]"
                        style={{ backgroundColor: row.color }}
                      >
                        {row.code}
                      </span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500 font-medium">
                    {row.modeName}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">{row.executedTrips}</span>
                    <span className="text-neutral-400 text-[10px]"> / {row.scheduledTrips}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-sm">
                    <span className={row.onTimeRate >= row.targetSla ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                      {row.onTimeRate}%
                    </span>
                    <span className="text-[10px] text-neutral-400 block font-normal">
                      Obj. ≥ {row.targetSla}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={row.avgDelaySeconds > 120 ? 'text-amber-600 font-bold' : 'text-neutral-600 dark:text-neutral-400'}>
                      {row.avgDelaySeconds > 60
                        ? `${Math.round(row.avgDelaySeconds / 60)} min`
                        : `${row.avgDelaySeconds} s`}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block ${
                          row.status === 'compliant'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-red-500/10 text-red-600 animate-pulse'
                        }`}
                      >
                        {row.status === 'compliant'
                          ? language === 'es'
                            ? 'Conforme SLA'
                            : 'SLA Compliant'
                          : language === 'es'
                          ? 'En Riesgo de SLA'
                          : 'SLA At Risk'}
                      </span>
                      <p className="text-[11px] text-neutral-500 max-w-sm truncate">
                        {language === 'es' ? row.rootCauseEs : row.rootCauseEn}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {row.caseId ? (
                      <button
                        onClick={() => onOpenCase?.(row.caseId!)}
                        className="px-2.5 py-1 rounded bg-[#0071BB] text-white hover:bg-blue-700 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        {language === 'es' ? 'Abrir Caso' : 'Open Case'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-neutral-400 font-mono">Nominal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
