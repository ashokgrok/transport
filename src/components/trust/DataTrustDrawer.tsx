import React from 'react';
import { useAuth } from '../../services/authContext';
import { t } from '../../services/localization';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Clock, Database, Radio, ArrowRight } from 'lucide-react';

interface DataTrustDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  factTitle: string;
}

export const DataTrustDrawer: React.FC<DataTrustDrawerProps> = ({
  isOpen,
  onClose,
  factTitle,
}) => {
  const { language } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#161B22] border-l border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl h-full flex flex-col justify-between overflow-y-auto p-6">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? '¿Por qué confío en este dato?' : 'Why I trust this fact'}
                </h3>
                <p className="text-[11px] text-neutral-500 font-mono">
                  PROVENANCE & ARBITRATION ENGINE
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Target Fact Under Review */}
          <div className="mt-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440]">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
              {t('trust.selected_fact', language)}
            </span>
            <div className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1] mt-0.5">
              {factTitle || (language === 'es' ? 'Posición y Llegada Prevista: Bus Interurbano 352 (Atocha)' : 'Position & ETA: Interurban Bus 352 (Atocha)')}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {t('trust.type_measured', language)}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8]">
                {t('trust.freshness_live', language)}
              </span>
            </div>
          </div>

          {/* Active Arbitration Rule */}
          <div className="mt-4 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40">
            <div className="text-[10px] font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('trust.rule_applied', language)}</span>
            </div>
            <p className="text-xs text-indigo-950 dark:text-indigo-100 font-medium">
              {language === 'es'
                ? '"Preferir la fuente de telemetría directa cuando la discrepancia de antigüedad supere los 30 segundos sobre el sistema central del operador."'
                : '"Prefer direct vehicle telemetry whenever the age discrepancy exceeds 30 seconds compared to operator central back office."'}
            </p>
          </div>

          {/* Candidate Sources Comparison (Scene 3 specification) */}
          <div className="mt-5 space-y-3">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {t('trust.candidate_sources', language)}
            </h4>

            {/* Candidate 1: Direct Vehicle Telemetry (Winner) */}
            <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                    {t('trust.selected_source', language)}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                  {t('trust.winner', language)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2 text-neutral-700 dark:text-neutral-300">
                <div>
                  <span className="text-[10px] text-neutral-500 block">{t('trust.position', language)}</span>
                  <span className="font-semibold">{t('trust.position_val', language)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">{t('trust.age', language)}</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {language === 'es' ? '2 segundos (Live)' : '2 seconds (Live)'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">{t('trust.protocol', language)}</span>
                  <span className="font-mono">JSON Event Stream (N06)</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">{t('trust.quality_score', language)}</span>
                  <span className="font-mono font-bold">98 / 100</span>
                </div>
              </div>
            </div>

            {/* Candidate 2: Operator Back Office (Discarded) */}
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 opacity-70">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {t('trust.discarded_source', language)}
                  </span>
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {t('trust.discarded', language)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2 text-neutral-600 dark:text-neutral-400">
                <div>
                  <span className="text-[10px] text-neutral-500 block">{t('trust.reported_pos', language)}</span>
                  <span>{t('trust.reported_pos_val', language)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">{t('trust.age', language)}</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    {language === 'es' ? '58 segundos (Stale)' : '58 seconds (Stale)'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">{t('trust.protocol', language)}</span>
                  <span className="font-mono">SIRI-VM / AF-191</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">{t('trust.quality_score', language)}</span>
                  <span className="font-mono">72 / 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-[#DCE1E7] dark:border-[#2B3440] text-[11px] text-neutral-400 flex items-center justify-between">
          <span>{t('trust.audit_footer', language)}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold cursor-pointer"
          >
            {t('trust.understood', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
