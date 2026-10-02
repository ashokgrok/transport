import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { getSiteOperators } from '../../data/multiSiteData';
import {
  ShieldAlert,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Download,
  Filter,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Scale,
  Building2,
  Clock,
  Layers,
  ArrowRight,
  Check,
  X,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ConcessionComplianceBoardProps {
  initialSubTab?: 'compliance' | 'penalties' | 'disputes' | 'kpis';
  onOpenCase?: (caseId: string) => void;
  onOpenTrustDrawer?: (title: string) => void;
}

export const ConcessionComplianceBoard: React.FC<ConcessionComplianceBoardProps> = ({
  initialSubTab = 'compliance',
  onOpenCase,
  onOpenTrustDrawer,
}) => {
  const { language } = useAuth();
  const { activeSite } = useSite();

  const [activeTab, setActiveTab] = useState<'compliance' | 'penalties' | 'disputes' | 'kpis'>(initialSubTab);
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'urban' | 'rail' | 'interurban'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Dispute arbitration state
  const [disputeStatus, setDisputeStatus] = useState<'in_review' | 'granted' | 'rejected'>('in_review');
  const [disputeNotes, setDisputeNotes] = useState('');

  // Sync activeTab whenever initialSubTab prop changes (e.g. from left nav menu)
  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  const showToast = (msg: string) => {
    setDownloadToast(msg);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const operators = getSiteOperators(activeSite.id);

  const filteredOperators = operators.filter((op) => {
    const matchesMode = selectedMode === 'all' || op.mode === selectedMode;
    const matchesQuery =
      !searchQuery ||
      op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.contractCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMode && matchesQuery;
  });

  const selectedOpForKpis = operators.find((op) => op.id === selectedOperator) || operators[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#161B22] text-white border border-emerald-500/50 shadow-xl px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es'
                  ? 'Supervisión de Cumplimiento Concesional y Liquidación SLA'
                  : 'Concession Contract Compliance & SLA Settlement Ledger'}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? `Auditoría mensual de contratos programa, sanciones y arbitraje (${activeSite.shortName}).`
                  : `Monthly contract audit, penalty deductions, and operator arbitration (${activeSite.shortName}).`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenTrustDrawer?.('Concession Settlement Ledger')}
            className="px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            {language === 'es' ? 'Certificación de Datos' : 'Data Certification'}
          </button>
          <button
            onClick={() =>
              showToast(
                language === 'es'
                  ? 'Descargando Libro Oficial de Liquidación Concesional (PDF)...'
                  : 'Downloading Official Concession Settlement Ledger (PDF)...'
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0071BB] text-white hover:bg-blue-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Descargar Liquidación (PDF)' : 'Download Settlement'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-2">
        {[
          {
            id: 'compliance' as const,
            labelEs: 'Registro de Concesiones (42)',
            labelEn: 'Concession Registry (42)',
            icon: <Building2 className="w-4 h-4" />,
          },
          {
            id: 'penalties' as const,
            labelEs: 'Liquidación y Penalizaciones',
            labelEn: 'Penalties & Settlements',
            icon: <DollarSign className="w-4 h-4" />,
          },
          {
            id: 'disputes' as const,
            labelEs: 'Arbitraje de Disputas (1 en trámite)',
            labelEn: 'Dispute Arbitration (1 active)',
            icon: <Scale className="w-4 h-4" />,
          },
          {
            id: 'kpis' as const,
            labelEs: 'Indicadores Técnicos por Operador',
            labelEn: 'Technical KPIs by Operator',
            icon: <BarChart3 className="w-4 h-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0071BB] text-white shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {tab.icon}
            <span>{language === 'es' ? tab.labelEs : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: CONCESSION REGISTRY (compliance) */}
      {/* ========================================================================= */}
      {activeTab === 'compliance' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Conformidad Media Red' : 'Average Network Compliance'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  99.82%
                </span>
                <span className="text-xs text-emerald-600 font-bold">Obj. 98.0%</span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                {language === 'es' ? '41 operadores en verde · 1 bajo revisión' : '41 compliant · 1 under review'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Flota Total Concesionada' : 'Total Concession Fleet'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-[#1B1F24] dark:text-[#E8ECF1]">
                  2.777
                </span>
                <span className="text-xs text-neutral-400">vehículos</span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                {language === 'es' ? 'Supervisados por telemetría GTFS-RT/SIRI' : 'Monitored via GTFS-RT/SIRI'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Expediciones Mensuales' : 'Monthly Trips Delivered'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-[#0071BB] dark:text-[#5AAEE8]">
                  268.700
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                {language === 'es' ? '99.8% de fiabilidad de servicio' : '99.8% trip execution rate'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Bonificaciones Intermodales' : 'Intermodal Relief Credits'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
                  +1.240 €
                </span>
                <span className="text-xs text-blue-600 font-semibold">4 empresas</span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                {language === 'es' ? 'Abonos por retención de enlaces y SE Atocha' : 'Credits for transfer hold and SE relief'}
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(['all', 'urban', 'rail', 'interurban'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedMode === m
                      ? 'bg-[#0071BB] text-white shadow-2xs'
                      : 'border border-[#DCE1E7] dark:border-[#2B3440] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {m === 'all'
                    ? (language === 'es' ? 'Todos los Modos' : 'All Modes')
                    : m === 'urban'
                    ? (language === 'es' ? 'Urbano (EMT)' : 'Urban (EMT)')
                    : m === 'rail'
                    ? (language === 'es' ? 'Ferrocarril (Renfe)' : 'Rail (Renfe)')
                    : (language === 'es' ? 'Interurbanos' : 'Interurban')}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'es' ? 'Buscar operador o contrato...' : 'Search operator or contract...'}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs bg-white dark:bg-[#161B22] text-[#1B1F24] dark:text-[#E8ECF1] focus:outline-none focus:ring-2 focus:ring-[#0071BB]"
              />
            </div>
          </div>

          {/* Master Ledger Table */}
          <div className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between font-bold text-xs text-[#1B1F24] dark:text-[#E8ECF1]">
              <span>
                {language === 'es' ? 'Libro Mayor de Cumplimiento Concesional por Empresa' : 'Concession Compliance Master Ledger'}
              </span>
              <span className="text-neutral-400 font-normal">
                {filteredOperators.length} {language === 'es' ? 'operadores registrados' : 'registered operators'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-[#0E1217] border-b border-[#DCE1E7] dark:border-[#2B3440] text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{language === 'es' ? 'Empresa Concesionaria' : 'Operator Entity'}</th>
                    <th className="py-3 px-4">{language === 'es' ? 'Código Contrato' : 'Contract Code'}</th>
                    <th className="py-3 px-4 text-center">{language === 'es' ? 'Flota' : 'Fleet'}</th>
                    <th className="py-3 px-4 text-center">{language === 'es' ? 'Cumplimiento' : 'Compliance'}</th>
                    <th className="py-3 px-4 text-center">{language === 'es' ? 'Penalización MTD' : 'Penalty MTD'}</th>
                    <th className="py-3 px-4">{language === 'es' ? 'Estado y Observaciones de Auditoría' : 'Audit Notes & Status'}</th>
                    <th className="py-3 px-4 text-right">{language === 'es' ? 'Acción' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredOperators.map((op) => (
                    <tr key={op.id} className="hover:bg-neutral-50/50 dark:hover:bg-[#1B222D]/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-neutral-800 dark:text-neutral-200">
                        <div>
                          <span>{op.name}</span>
                          <span className="text-[10px] text-neutral-400 block font-normal">
                            {language === 'es' ? op.modeLabelEs : op.modeLabelEn}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                        {op.contractCode}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-700 dark:text-neutral-300">
                        {op.fleetAssigned}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-sm">
                        <span className={op.complianceRate >= 99.0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}>
                          {op.complianceRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        {op.penaltiesInDisputeEuros > 0 ? (
                          <span className="text-amber-600 font-bold">
                            {op.penaltiesInDisputeEuros} € (disputa)
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold">0,00 €</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block ${
                              op.status === 'compliant'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-amber-500/10 text-amber-600 animate-pulse'
                            }`}
                          >
                            {op.status === 'compliant'
                              ? language === 'es'
                                ? 'Conforme'
                                : 'Compliant'
                              : language === 'es'
                              ? 'Disputa en Trámite'
                              : 'In Arbitration'}
                          </span>
                          <p className="text-[11px] text-neutral-500 max-w-sm">
                            {language === 'es' ? op.auditNotesEs : op.auditNotesEn}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {op.id === 'renfe' ? (
                          <button
                            onClick={() => setActiveTab('disputes')}
                            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                          >
                            {language === 'es' ? 'Ver Expediente' : 'Review Docket'}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              showToast(
                                language === 'es'
                                  ? `Generando extracto concesional certificado para ${op.name}...`
                                  : `Generating certified concession statement for ${op.name}...`
                              )
                            }
                            className="px-2.5 py-1 rounded border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                          >
                            {language === 'es' ? 'Extracto' : 'Statement'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: PENALTIES & SETTLEMENTS (penalties) */}
      {/* ========================================================================= */}
      {activeTab === 'penalties' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Monthly Settlement Balance Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Penalizaciones Confirmadas' : 'Finalized Penalties (MTD)'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  0,00 €
                </span>
                <span className="text-xs text-neutral-400">Objetivo 0 €</span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                {language === 'es' ? '0 sanciones firmes aplicadas este mes' : '0 finalized penalties deducted'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Importe en Arbitraje / Disputa' : 'Penalties in Arbitration'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
                  450,00 €
                </span>
                <span className="text-xs text-amber-600 font-bold">1 expediente</span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                {language === 'es' ? 'Alegación Renfe Fuerza Mayor Atocha' : 'Renfe Force Majeure claim Atocha'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Créditos de Cooperación' : 'Intermodal Relief Credits'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
                  +1.240,00 €
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                {language === 'es' ? 'Bonificación por retención y refuerzos' : 'Bonus for transfer hold & relief'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Liquidación Neta Mes' : 'Net Settlement Due'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-[#0071BB] dark:text-[#5AAEE8]">
                  26.271.240 €
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                {language === 'es' ? 'Subvención contrato programa neta' : 'Net contract program disbursement'}
              </p>
            </div>
          </div>

          {/* Contractual Penalty Clauses Rules Matrix */}
          <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#0071BB]" />
                <h3 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Baremo de Penalizaciones Contractuales Vigente (Pliego CITRAM)' : 'Contractual Penalty Clauses & Thresholds'}
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {language === 'es' ? 'Pliego Tipo BOAM / BOCM' : 'Standard Regulatory Schedule'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/30 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#0071BB]">Cláusula 14.2</span>
                  <span className="font-bold text-red-600">150 € / exp.</span>
                </div>
                <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {language === 'es' ? 'Supresión No Justificada' : 'Unjustified Trip Cancellation'}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {language === 'es' ? 'Falta de salida o pérdida de expedición sin causa eximente.' : 'Missing service or lost departure without prior approval.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/30 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#0071BB]">Cláusula 19.1</span>
                  <span className="font-bold text-red-600">75 € / día</span>
                </div>
                <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {language === 'es' ? 'Avería Rampa PMR / Clima' : 'PMR Ramp / HVAC Fault'}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {language === 'es' ? 'Salida de vehículo con rampa inoperativa o temperatura fuera de 21-24°C.' : 'Vehicle in service with broken ramp or cabin temp outside 21-24°C.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/30 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#0071BB]">Cláusula 22.4</span>
                  <span className="font-bold text-red-600">300 € / evento</span>
                </div>
                <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {language === 'es' ? 'Demora Comunicación > 3m' : 'Telemetry Reporting Delay > 3m'}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {language === 'es' ? 'Retardo injustificado en remitir incidencia o corte de vía a CITRAM.' : 'Unjustified lag transmitting incident or line block to control centre.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/30 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#0071BB]">Cláusula 31.8</span>
                  <span className="font-bold text-emerald-600">+50 € / hold</span>
                </div>
                <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {language === 'es' ? 'Crédito Retención Enlace' : 'Intermodal Hold Bonus'}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {language === 'es' ? 'Bonificación acreditada por retener vehículo para transbordo garantizado.' : 'Accredited credit for holding vehicle to protect passenger transfer.'}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Settlement Disbursement Table */}
          <div className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between font-bold text-xs text-[#1B1F24] dark:text-[#E8ECF1]">
              <span>{language === 'es' ? 'Liquidación Económica por Contrato (Septiembre 2026)' : 'Economic Settlement by Contract (September 2026)'}</span>
              <button
                onClick={() => showToast(language === 'es' ? 'Certificación contable de liquidación mensual aprobada.' : 'Monthly settlement ledger certified and approved.')}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs cursor-pointer transition-colors"
              >
                {language === 'es' ? 'Aprobar Liquidación Mensual' : 'Approve Monthly Settlement'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-[#0E1217] border-b border-[#DCE1E7] dark:border-[#2B3440] text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{language === 'es' ? 'Empresa Concesionaria' : 'Operator'}</th>
                    <th className="py-3 px-4 text-right">{language === 'es' ? 'Retribución Base Mes' : 'Base Contract Fee'}</th>
                    <th className="py-3 px-4 text-right">{language === 'es' ? 'Penalizaciones Firmes' : 'Deductions (Firm)'}</th>
                    <th className="py-3 px-4 text-right">{language === 'es' ? 'En Disputa' : 'In Dispute'}</th>
                    <th className="py-3 px-4 text-right">{language === 'es' ? 'Bonificaciones (+)' : 'Credits (+)'}</th>
                    <th className="py-3 px-4 text-right">{language === 'es' ? 'Liquidación Neta' : 'Net Disbursement'}</th>
                    <th className="py-3 px-4 text-center">{language === 'es' ? 'Estado Contable' : 'Accounting Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {operators.map((op) => {
                    const net = op.baseMonthlyFeeEuros - op.penaltiesAccruedEuros + op.bonusesEarnedEuros;
                    return (
                      <tr key={op.id} className="hover:bg-neutral-50/50 dark:hover:bg-[#1B222D]/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-neutral-800 dark:text-neutral-200">
                          {op.name}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-neutral-700 dark:text-neutral-300">
                          {op.baseMonthlyFeeEuros.toLocaleString('es-ES')} €
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-emerald-600 font-bold">
                          - {op.penaltiesAccruedEuros.toLocaleString('es-ES')} €
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-amber-600 font-semibold">
                          {op.penaltiesInDisputeEuros > 0 ? `${op.penaltiesInDisputeEuros} €` : '0 €'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-blue-600 font-semibold">
                          + {op.bonusesEarnedEuros.toLocaleString('es-ES')} €
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                          {net.toLocaleString('es-ES')} €
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              op.penaltiesInDisputeEuros > 0
                                ? 'bg-amber-500/10 text-amber-600'
                                : 'bg-emerald-500/10 text-emerald-600'
                            }`}
                          >
                            {op.penaltiesInDisputeEuros > 0
                              ? (language === 'es' ? 'Pendiente Disputa' : 'Pending Dispute')
                              : (language === 'es' ? 'Listo Liquidación' : 'Certified Ready')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: DISPUTE ARBITRATION (disputes) */}
      {/* ========================================================================= */}
      {activeTab === 'disputes' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Active Docket Header Card */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                  EXPEDIENTE ARB-2026/0929-CERC
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    disputeStatus === 'granted'
                      ? 'bg-emerald-500 text-white'
                      : disputeStatus === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {disputeStatus === 'granted'
                    ? (language === 'es' ? 'Alegación Estimada' : 'Claim Granted')
                    : disputeStatus === 'rejected'
                    ? (language === 'es' ? 'Alegación Desestimada' : 'Claim Rejected')
                    : (language === 'es' ? 'En Arbitraje Activo' : 'Active Arbitration')}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                {language === 'es' ? 'Cuantía Disputada:' : 'Contested Penalty:'} <strong>450,00 €</strong>
              </span>
            </div>

            <h3 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es'
                ? 'Alegación de Renfe Cercanías Madrid por Fuerza Mayor en Caso INC-2026-0929-ATO'
                : 'Renfe Cercanías Madrid Force Majeure Defense in Case INC-2026-0929-ATO'}
            </h3>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {language === 'es'
                ? 'El operador alega que la interrupción del servicio y las 3 expediciones no realizadas en el corredor C-3/C-4 se debieron exclusivamente a la caída de tensión en catenaria en vía 3 de Atocha, originada en la subestación externa titularidad de Adif (Red Ferroviaria de Interés General), fuera del alcance de mantenimiento de la empresa operadora.'
                : 'The operator contends that the service disruption and 3 unfulfilled trips on corridor C-3/C-4 were caused solely by overhead catenary failure on track 3 at Atocha, originating in an external Adif substation outside operator maintenance jurisdiction.'}
            </p>
          </div>

          {/* Evidence Dossier and Legal Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical Evidence */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-[#1B1F24] dark:text-[#E8ECF1] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'es' ? 'Evidencias Técnicas Aportadas' : 'Technical Evidentiary Pack'}</span>
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>
                    <strong>13:41:04</strong> · Registro SCADA Adif 0V transmitido automáticamente a CITRAM (Conector N23).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>
                    <strong>13:42:15</strong> · Despacho y puesta a disposición de 4 autobuses SE desde cocheras de Entrevías en menos de 15 minutos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>
                    <strong>13:43:30</strong> · Habilitación de paso libre con billete único en Metro Línea 1 acordada con CRTM.
                  </span>
                </li>
              </ul>
            </div>

            {/* Legal Assessment & Decision */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-[#1B1F24] dark:text-[#E8ECF1] uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#0071BB]" />
                <span>{language === 'es' ? 'Dictamen de la Asesoría Jurídica CITRAM' : 'Legal Counsel Recommendation'}</span>
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic bg-neutral-50 dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                "{language === 'es'
                  ? 'Conforme a la Cláusula 52.3 del Pliego de Explotación, la concurrencia de avería de infraestructura en Red General externa acredita eximente de fuerza mayor. Procede estimar la alegación de Renfe, eximir la deducción de 450 € y trasladar expediente de recobro a Adif.'
                  : 'Pursuant to Clause 52.3 of the Concession Manual, external electrical grid failure confirms force majeure. Recommendation: grant exemption from the 450 € penalty and initiate inter-agency recovery against Adif.'}"
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setDisputeStatus('granted');
                    showToast(
                      language === 'es'
                        ? 'Alegación ESTIMADA: Sanción de 450 € eximida por causa de fuerza mayor.'
                        : 'Claim GRANTED: 450 € penalty waived due to force majeure.'
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  {language === 'es' ? 'Estimar Alegación (Eximir 450 €)' : 'Grant Claim (Waive 450 €)'}
                </button>
                <button
                  onClick={() => {
                    setDisputeStatus('rejected');
                    showToast(
                      language === 'es'
                        ? 'Alegación DESESTIMADA: Se confirma deducción de 450 € en liquidación.'
                        : 'Claim REJECTED: 450 € penalty confirmed for deduction.'
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg border border-red-500/50 hover:bg-red-500/10 text-red-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  {language === 'es' ? 'Desestimar (Cobrar 450 €)' : 'Reject Claim (Deduct 450 €)'}
                </button>
                <button
                  onClick={() => onOpenCase?.('INC-2026-0929-ATO')}
                  className="px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                >
                  {language === 'es' ? 'Ver Incidencia Matriz' : 'View Incident Case'}
                </button>
              </div>
            </div>
          </div>

          {/* Historical Closed Disputes Ledger */}
          <div className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-[#DCE1E7] dark:border-[#2B3440] font-bold text-xs text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es' ? 'Historial de Expedientes de Arbitraje Resueltos' : 'Arbitration Docket Archive'}
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {[
                {
                  id: 'ARB-2026/0812-EMT',
                  operator: 'EMT Madrid',
                  issue: 'Corte Gran Vía manifestación no comunicada (Líneas 1, 2, 46)',
                  resolution: 'Estimada (Fuerza Mayor)',
                  amount: '600 € eximidos',
                  date: '12 Ago 2026',
                },
                {
                  id: 'ARB-2026/0704-ALSA',
                  operator: 'ALSA Corredor 2',
                  issue: 'Avería tacógrafo digital y vehículo parado en Torrejón',
                  resolution: 'Desestimada (Fallo Mantenimiento)',
                  amount: '300 € confirmados',
                  date: '04 Jul 2026',
                },
              ].map((h) => (
                <div key={h.id} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-[#0071BB]">{h.id}</span>
                    <p className="font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">{h.operator}</p>
                    <p className="text-[11px] text-neutral-500">{h.issue}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {h.resolution}
                    </span>
                    <p className="font-mono text-xs font-bold mt-1">{h.amount}</p>
                    <p className="text-[10px] text-neutral-400">{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: TECHNICAL KPIS BY OPERATOR (kpis) */}
      {/* ========================================================================= */}
      {activeTab === 'kpis' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Operator Selector Header */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0071BB]" />
              <div>
                <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Ficha de Calidad Técnica por Concesión' : 'Technical KPI Scorecard by Concession'}
                </h3>
                <p className="text-xs text-neutral-500">
                  {language === 'es' ? 'Seleccione empresa para examinar cumplimiento contractual de parámetros de calidad.' : 'Select an operator to audit technical SLA indicators.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-semibold bg-neutral-50 dark:bg-neutral-900 text-[#1B1F24] dark:text-[#E8ECF1] focus:outline-none focus:ring-2 focus:ring-[#0071BB] cursor-pointer"
              >
                {operators.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Selected Operator KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* KPI 1: Headway Punctuality */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {language === 'es' ? 'Puntualidad en Paso (Headway)' : 'Headway Regularity'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  Obj. ≥ 96.0%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-[#0071BB]">
                  {selectedOpForKpis.kpis.punctuality}%
                </span>
                <span className="text-xs text-emerald-600 font-bold">
                  {selectedOpForKpis.kpis.punctuality >= 96.0 ? '+1.4% sobre SLA' : 'Bajo objetivo'}
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-[#0071BB] h-2 rounded-full"
                  style={{ width: `${selectedOpForKpis.kpis.punctuality}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Tolerancia máxima de desvío: 3 minutos' : 'Maximum headway tolerance: 3 minutes'}
              </p>
            </div>

            {/* KPI 2: Trip Delivery Rate */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {language === 'es' ? 'Expediciones Realizadas' : 'Trip Delivery Rate'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  Obj. ≥ 99.0%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedOpForKpis.kpis.tripDelivery}%
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${selectedOpForKpis.kpis.tripDelivery}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                {selectedOpForKpis.monthlyTrips.toLocaleString('es-ES')} {language === 'es' ? 'expediciones programadas/mes' : 'trips scheduled/month'}
              </p>
            </div>

            {/* KPI 3: Climate Comfort */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {language === 'es' ? 'Climatización Confort (21-24°C)' : 'HVAC Comfort (21-24°C)'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
                  Obj. 100%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-[#1B1F24] dark:text-[#E8ECF1]">
                  {selectedOpForKpis.kpis.climateComfort}%
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${selectedOpForKpis.kpis.climateComfort}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Supervisado por sensores IoT en cabina' : 'Audited via onboard IoT sensors'}
              </p>
            </div>

            {/* KPI 4: PMR Accessibility */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {language === 'es' ? 'Disponibilidad Rampa PMR' : 'PMR Ramp Availability'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  Obj. ≥ 99.5%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-emerald-600">
                  {selectedOpForKpis.kpis.pmrRamps}%
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${selectedOpForKpis.kpis.pmrRamps}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Cero incidencias de viajeros PMR sin asistencia' : 'Zero unassisted PMR passenger delays'}
              </p>
            </div>

            {/* KPI 5: Depot & Mystery Shopper Cleanliness */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {language === 'es' ? 'Índice de Higiene y Limpieza' : 'Fleet Cleanliness Score'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600">
                  Obj. ≥ 8.5
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-purple-600">
                  {selectedOpForKpis.kpis.cleanlinessScore}
                </span>
                <span className="text-xs text-neutral-400">/ 10</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Auditorías aleatorias de cocheras y andenes' : 'Depot and station mystery audits'}
              </p>
            </div>

            {/* KPI 6: Citizen Complaints Ratio */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {language === 'es' ? 'Reclamaciones / 10.000 Viajeros' : 'Complaints / 10k Pax'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  Obj. ≤ 1.00
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-emerald-600">
                  {selectedOpForKpis.kpis.complaintsRate}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Dentro del umbral de excelencia contractual' : 'Within contractual excellence boundary'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
